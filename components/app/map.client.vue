<script setup>
import { CENTER_USA } from "~/lib/constants";
import { useMapStore } from "~/store/map";

const colorMode = useColorMode();
const mapStore = useMapStore();
// const style = 'https://tiles.openfreemap.org/styles/liberty';

const style = computed(() =>
  colorMode.value === "light"
    ? "https://tiles.openfreemap.org/styles/liberty"
    : "/styles/dark.json",
);

const center = CENTER_USA;
const zoom = 8;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap :map-style="style" :center="center" :zoom="zoom">
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top hover:cursor-pointer"
          :data-tip="point.name"
          :class="{
            'tooltip-open': isPointSelected(point, mapStore.selectedPoint),
          }"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="30"
            :class="isPointSelected(point, mapStore.selectedPoint) ? 'text-accent' : 'text-secondary'"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
        <div class="flex justify-end mt-4">
          <NuxtLink
            v-if="point.to"
            :to="point.to"
            class="btn btn-sm btn-outline"
          >
            {{ point.toLabel }}
          </NuxtLink>
        </div>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
