import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/dashboard")) {
    const session = await auth.api.getSession({
      headerrs: event.headers,
    })
    if (!session) {
      await sendRedirect(event, "/", 302)
    }
   
  }
})
