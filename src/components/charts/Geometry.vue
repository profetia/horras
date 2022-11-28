<script setup>
import useGeometry from '@/composables/charts/useGeometry';
import * as L from 'leaflet';
import LeafletWrapper from '@/components/leaflet/core/LeafletWrapper.vue';
import { heatmap } from '@/composables/leaflet/charts/heatmap';
import { polygon } from '@/composables/leaflet/charts/polygon';
import { getHaikouAll } from '@/composables/utils/useHaikou';
import useChartState from '@/composables/charts/useChartState';
import { tileOpenStreetNormal } from '@/composables/leaflet/tiles/provider';
import { ref } from 'vue';

const { geometry } = useGeometry();
const { appendHighlights } = useChartState();

const isAdoptive = ref(false);
// console.log(geometry.value);

const initFn = (node, { geometry, isAdoptive }) => {
  const baseLayer = L.tileLayer(...tileOpenStreetNormal);

  // console.log(geometry);
  // console.log(geometry.data.filter((item) => item.count > geometry.max));

  const sampledData = {
    data: geometry.data.map((item) => ({
      ...item,
      count: Math.log(item.count),
    })),
    max: Math.log(geometry.max),
    min: Math.log(geometry.min),
  };

  const heatmapLayer = heatmap({
    data: isAdoptive ? geometry : sampledData,
    useLocalExtrema: isAdoptive,
  });

  const haikouMap = L.map(node, {
    zoomControl: false,
    attributionControl: false,
    center: [20.004658, 110.355043],
    zoom: 12,
    minZoom: 9,
    maxZoom: 15,
    maxBounds: [
      [19.2, 109.0],
      [20.8, 111.35],
    ],
    renderer: L.svg(),
    layers: [baseLayer, heatmapLayer],
  });

  const countyLayer = polygon({
    data: getHaikouAll(),
    map: haikouMap,
    color: 'grey',
    eventHandlers: {
      click: (e) => {
        // haikouMap.fitBounds(e.target.getBounds());
        const adcode = e.target.feature.properties.adcode;
        appendHighlights(adcode);
      },
    },
  });

  countyLayer.addTo(haikouMap);
};
</script>
<template>
  <v-card>
    <div>
      <LeafletWrapper
        :callback="initFn"
        width="800"
        height="600"
        :args="{ geometry, isAdoptive }"
      />
    </div>
    <div style="margin-top: -100px">
      <v-chip
        label
        variant="elevated"
        color="teal"
        text-color="white"
        style="z-index: 10000"
        class="ml-3 mb-3 pl-1"
      >
        <v-checkbox
          hide-details
          v-model="isAdoptive"
          label="Adoptive Sample"
          class="font-weight-bold"
        ></v-checkbox>
      </v-chip>
    </div>
  </v-card>
</template>
