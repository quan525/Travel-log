import { auth } from '~/lib/auth';

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;

  if (!pathname.startsWith('/api/locations'))
    return;

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const userId = Number(session.user.id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid authenticated user',
    });
  }

  event.context.userId = userId;
});
