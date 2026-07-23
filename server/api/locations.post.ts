import { and, eq } from 'drizzle-orm';
import { customAlphabet } from "nanoid";
import slugify from "slug";
import db from '~/lib/db';
import { InsertLocation, location } from '~/lib/db/schema';
import defineAuthenticatedEventHandler from '~/utils/define-authenticated-event-handler';

function errorChainIncludes(error: unknown, text: string, depth = 0): boolean {
  if (!error || typeof error !== 'object' || depth > 5)
    return false;

  const errorRecord = error as {
    cause?: unknown;
    message?: unknown;
  };

  return (typeof errorRecord.message === 'string' && errorRecord.message.includes(text))
    || errorChainIncludes(errorRecord.cause, text, depth + 1);
}

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineAuthenticatedEventHandler(async (event) => {
  if (!event.context.userId) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>(
      (fieldErrors, issue) => {
        fieldErrors[issue.path.join('.')] = issue.message;
        return fieldErrors;
      },
      {},
    );

    const statusMessage = result.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw createError({
      statusCode: 422,
      statusMessage: `Invalid body. ${statusMessage}`,
      data: { errors },
    });
  }

  const existingLocation = !!(await db.query.location.findFirst({
    where:
      and(
        eq (location.slug, result.data.name),
        eq (location.userId, event.context.userId),
      ),
  }));

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where:
      and(
        eq (location.slug, slug),
      ),
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug} - ${id}`;
    existing = !!(await db.query.location.findFirst({
      where: eq (location.slug, idSlug),
    }))
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [createdLocation] = await db
      .insert(location)
      .values({
        ...result.data,
        slug,
        userId: event.context.userId,
      })
      .returning();

    setResponseStatus(event, 201);
    return createdLocation;
  }
  catch (error) {
    if (errorChainIncludes(error, 'UNIQUE constraint failed: locations.slug')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Slug must be unique (the location name is used to generate the slug).',
      });
    }

    if (errorChainIncludes(error, 'UNIQUE constraint failed: locations.name, locations.user_id')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'You already have a location with this name.',
      });
    }

    throw error;
  }
});
