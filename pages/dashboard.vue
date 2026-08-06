<script lang="ts" setup>
import {
  CURRENT_LOCATION_LOG_PAGES,
  CURRENT_LOCATION_PAGES,
  EDIT_PAGES,
  LOCATION_PAGES,
} from "~/lib/constants";
import { useLocationStore } from "~/store/locations";
import { useMapStore } from "~/store/map";
import { useSidebarStore } from "~/store/sidebar";

const isSidebarOpen = ref(true);

const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

const {
  currentLocation,
  currentLocationStatus,
} = storeToRefs(locationsStore);

onMounted(() => {
  const savedValue = localStorage.getItem("isSidebarOpen");

  if (savedValue !== null) {
    isSidebarOpen.value = savedValue === "true";
  }
});

/*
 * Prevent an older request from replacing the sidebar
 * after the user has navigated to another route.
 */
let routeRequestId = 0;

watch(
  [
    () => route.name,
    () => route.params.slug,
    () => route.params.id,
  ],
  async ([name, rawSlug, rawId]) => {
    const requestId = ++routeRequestId;

    // These values belong to this specific watcher execution.
    const routeName = name?.toString() ?? "";
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    // Clear the previous route's items while loading.
    sidebarStore.sidebarTopItems = [];

    try {
      /*
       * Check the most specific page type first.
       * Use else-if so only one branch runs.
       */
      if (CURRENT_LOCATION_LOG_PAGES.has(routeName)) {
        await locationsStore.refreshCurrentLocation();
        await locationsStore.refreshCurrentLocationLog();
      }
      else if (CURRENT_LOCATION_PAGES.has(routeName)) {
        await locationsStore.refreshCurrentLocation();
      }
      else if (LOCATION_PAGES.has(routeName)) {
        await locationsStore.refreshLocations();
      }
    }
    catch (error) {
      console.error("Failed to load route data:", error);

      // Do not let an old request affect the active route.
      if (requestId !== routeRequestId) {
        return;
      }
    }

    /*
     * The route changed while an earlier request was loading.
     * Ignore the result from that earlier request.
     */
    if (requestId !== routeRequestId) {
      return;
    }

    if (LOCATION_PAGES.has(routeName)) {
      sidebarStore.sidebarTopItems = [
        {
          id: "link-dashboard",
          label: "Locations",
          href: "/dashboard",
          icon: "tabler:map",
        },
        {
          id: "link-location-add",
          label: "Add Location",
          href: "/dashboard/add",
          icon: "tabler:circle-plus-filled",
        },
      ];

      return;
    }

    if (CURRENT_LOCATION_LOG_PAGES.has(routeName)) {
      if (
        !currentLocation.value
        || currentLocationStatus.value === "pending"
      ) {
        return;
      }

      sidebarStore.sidebarTopItems = [
        {
          id: "link-location",
          label: `Back to "${currentLocation.value.name}"`,
          to: {
            name: "dashboard-location-slug",
            params: { slug },
          },
          icon: "tabler:arrow-left",
        },
        {
          id: "link-view-location-log",
          label: "View Log",
          to: {
            name: "dashboard-location-slug-id",
            params: { slug, id },
          },
          icon: "tabler:map-pin",
        },
        {
          id: "link-edit-location-log",
          label: "Edit Log",
          to: {
            name: "dashboard-location-slug-id-edit",
            params: { slug, id },
          },
          icon: "tabler:map-pin-cog",
        },
      ];

      return;
    }

    if (CURRENT_LOCATION_PAGES.has(routeName)) {
      const items = [
        {
          id: "link-dashboard",
          label: "Back to Locations",
          href: "/dashboard",
          icon: "tabler:arrow-left",
        },
      ];

      if (
        currentLocation.value
        && currentLocationStatus.value !== "pending"
      ) {
        items.push(
          {
            id: "link-location",
            label: currentLocation.value.name,
            to: {
              name: "dashboard-location-slug",
              params: { slug },
            },
            icon: "tabler:map",
          },
          {
            id: "link-location-edit",
            label: "Edit Location",
            to: {
              name: "dashboard-location-slug-edit",
              params: { slug },
            },
            icon: "tabler:map-pin-cog",
          },
          {
            id: "link-location-log-add",
            label: "Add Location Log",
            to: {
              name: "dashboard-location-slug-add",
              params: { slug },
            },
            icon: "tabler:circle-plus-filled",
          },
        );
      }

      sidebarStore.sidebarTopItems = items;
    }
  },
  {
    immediate: true,
  },
);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;

  localStorage.setItem(
    "isSidebarOpen",
    isSidebarOpen.value.toString(),
  );
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div
        class="flex hover:cursor-pointer hover:bg-base-200 p-2"
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :to="item.to"
        />
        <div v-if="route.path.startsWith('/dashboard/location') && currentLocationStatus === 'pending'" class="flex items-center justify-center">
          <div class="loading" />
        </div>
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>
        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{
          'flex-col': !EDIT_PAGES.has(route.name?.toString() || ''),
        }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
