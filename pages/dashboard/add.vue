<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import { InsertLocation } from '~/lib/db/schema';

const router = useRouter();
const { $csrfFetch } = useNuxtApp();
const loading = ref(false);
const submitted = ref("");
const submitError = ref('');

const {
  errors,
  handleSubmit,
  isSubmitting,
  meta,
} = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: '',
    description: '',
    lat: undefined,
    long: undefined,
  },
});

const onSubmit = handleSubmit(
  async (values) => {
    submitError.value = '';

    try {
      loading.value = true;
      await $csrfFetch('/api/locations', {
        method: 'POST',
        body: values,
      });
      submitted.value = true;
      await navigateTo('/dashboard');
    }
    catch (error) {
      const fetchError = error as {
        data?: {
          message?: string;
          statusMessage?: string;
        };
        message?: string;
        statusMessage?: string;
      };

      submitError.value = fetchError.data?.statusMessage
        ?? fetchError.data?.message
        ?? fetchError.statusMessage
        ?? fetchError.message
        ?? 'An unknown error occurred.';
    }
    loading.value = false;
  },
  ({ errors: validationErrors }) => {
    submitError.value = Object.values(validationErrors)
      .filter((message): message is string => Boolean(message))
      .join(' ');
  },
);

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm('Are you sure you want to leave? All unsaved changes will be lost.');
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <div
      v-if="submitError"
      class="alert alert-error mb-3"
      role="alert"
      aria-live="assertive"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form
      class="flex flex-col gap-2"
      novalidate
      @submit.prevent="onSubmit"
    >
      <AppFormField
        name="name"
        label="name"
        :error="errors.name"
        type="text"
      />
      <AppFormField
        name="description"
        label="description"
        :error="errors.description"
        type="textarea"
      />
      <AppFormField
        name="lat"
        label="Latitude"
        :error="errors.lat"
        :disabled="loading"
        type="text"
      />
      <AppFormField
        name="long"
        label="Longitude"
        :error="errors.long"
        :disabled="loading"
        type="text"
      />

      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-outline" @click="router.back()">
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="loading loading-spinner loading-sm" />
          <template v-else>
            Add
            <span v-if="loading" class="loading loading-spinner loading-md" />
            <Icon name="tabler:circle-plus-filled" size="24" />
          </template>
        </button>
      </div>
    </form>
  </div>
</template>
