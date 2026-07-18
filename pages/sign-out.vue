<script lang="ts" setup>
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div class="card bg-base-300 container mt-4 min-h-72 text-center mx-auto flex flex-col ">
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
  </div>
</template>
