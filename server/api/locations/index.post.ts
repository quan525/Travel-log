import { and, eq } from 'drizzle-orm';

import db from '~/lib/db';
import { InsertLocation, location } from '~/lib/db/schema';
import defineAuthenticatedEventHandler from '~/utils/define-authenticated-event-handler';

function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'location';
}

export default defineAuthenticatedEventHandler(async (event) => {
  const { userId } = event.context;
  const body = await readBody(event);
  const result = InsertLocation.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: result.error.issues[0]?.message ?? 'Invalid location details.',
      data: {
        issues: result.error.issues,
      },
    });
  }

  const duplicate = await db
    .select({ id: location.id })
    .from(location)
    .where(and(
      eq(location.userId, userId),
      eq(location.name, result.data.name),
    ))
    .limit(1);

  if (duplicate.length) {
    throw createError({
      statusCode: 409,
      statusMessage: 'You already have a location with this name.',
    });
  }

  const baseSlug = createSlug(result.data.name);
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingSlug = await db
      .select({ id: location.id })
      .from(location)
      .where(eq(location.slug, slug))
      .limit(1);

    if (!existingSlug.length)
      break;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const [createdLocation] = await db
    .insert(location)
    .values({
      ...result.data,
      slug,
      userId,
    })
    .returning();

  setResponseStatus(event, 201);
  return createdLocation;
});
