<script lang="ts" setup>
import { useLocationStore } from "~/store/locations";
import { useMapStore } from "~/store/map";

const mapStore = useMapStore();
const locationsStore = useLocationStore();
const { locations, locationsStatus: status } = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refreshLocations();
});
</script>

<template>
  <div class="page-content-top">
    <h2 class="text-2xl">Locations</h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div
      v-else-if="locations && locations.length > 0"
      class="mt-4 flex flex-nowrap gap-2 overflow-auto"
    >
      <div
        v-for="location in locations"
        :key="location.id"
        class="card card-compact bg-base-300 h-40 border-2 w-72 mb-2 shrink-0 hover:cursor-pointer overflow-auto"
        @mouseenter="mapStore.selectedPoint = location"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h3>{{ location.name }}</h3>
          <p>{{ location.description }}</p>
        </div>
      </div>
      <!-- <LocationCard
        v-for="location in locations"
        :key="location.id"
        :map-point="createMapPointFromLocation(location)"
      /> -->
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
