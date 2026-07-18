<script lang="ts" setup>
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light';
  },
});
</script>

<template>
  <label
    class="btn btn-circle swap swap-rotate border transition-colors"
    :class="isDark
      ? 'border-slate-500 bg-slate-900 text-slate-100 hover:bg-slate-800'
      : 'border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'"
    aria-label="Toggle theme"
  >
    <input v-model="isDark" type="checkbox">
    <Icon
      class="swap-on"
      name="tabler:moon"
      size="24"
    />
    <Icon
      class="swap-off"
      name="tabler:sun"
      size="24"
    />
  </label>
</template>
