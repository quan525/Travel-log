<script lang="ts" setup>
import { Field } from 'vee-validate';

const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea" | "number";
  disabled?: boolean;
}>();

const model = defineModel<string | number | undefined>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      v-model="model"
      :as="props.type === 'textarea' ? 'textarea' : 'input'"
      :name="props.name"
      :type="props.type === 'textarea' ? undefined : props.type ?? 'text'"
      :disabled="props.disabled"
      class="w-full"
      :class="{
        'input-error': props.error && props.type !== 'textarea',
        'textarea-error': props.error && props.type === 'textarea',
        'input': props.type !== 'textarea',
        'textarea': props.type === 'textarea',
      }"
    />
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
