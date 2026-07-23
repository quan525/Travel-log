import { desc, eq } from 'drizzle-orm';

import db from '~/lib/db';
import { location } from '~/lib/db/schema';
import defineAuthenticatedEventHandler from '~/utils/define-authenticated-event-handler';

export default defineAuthenticatedEventHandler(async (event) => {
  return db
    .select()
    .from(location)
    .where(eq(location.userId, event.context.userId))
    .orderBy(desc(location.createdAt));
});
