<script setup>
import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();
// const style = 'https://tiles.openfreemap.org/styles/liberty';

const style = computed(() =>
  colorMode.value === 'light'
    ? 'https://tiles.openfreemap.org/styles/liberty'
    : '/styles/dark.json',
);
const center = CENTER_USA;
const zoom = 8;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
