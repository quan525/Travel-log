<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

await authStore.init()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
