import { findLocationByName, findUniqueSlug, insertLocation } from '~/lib/db/queries/location';
import { InsertLocation } from '~/lib/db/schema';
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

export default defineAuthenticatedEventHandler(async (event) => {
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

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  const slug = await findUniqueSlug(result.data.name);

  try {
    const createdLocation = await insertLocation(result.data, slug, event.context.user.id);

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
