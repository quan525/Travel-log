import { createAuthClient } from "better-auth/vue"

const authClient = createAuthClient()

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = authClient.useSession()

  async function init() {
    await session.value.refetch()
  }

  const user = computed(() => session.value.data?.user ?? null)
  const loading = computed(() => session.value.isPending)

  async function signIn() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    })
  }

  async function signOut() {
    await authClient.signOut()
    await navigateTo("/")
  }

  return {
    init,
    loading,
    signIn,
    signOut,
    user,
  }
})
