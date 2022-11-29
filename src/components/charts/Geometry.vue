<script setup>
import useGeometry from '@/composables/charts/useGeometry';
import * as L from 'leaflet';
import LeafletWrapper from '@/components/leaflet/core/LeafletWrapper.vue';
import { heatmap } from '@/composables/leaflet/charts/heatmap';
import { polygon } from '@/composables/leaflet/charts/polygon';
import { getHaikouAll } from '@/composables/utils/useHaikou';
import useChartState from '@/composables/charts/useChartState';
import { tileOpenStreetNormal } from '@/composables/leaflet/tiles/provider';

const { geometry, chartConfig } = useGeometry();
const { appendHighlights, loading } = useChartState();

const initFn = (node, { geometry, chartConfig }) => {
  const baseLayer = L.tileLayer(...tileOpenStreetNormal);

  // console.log(geometry);
  // console.log(geometry.data.filter((item) => item.count > geometry.max));

  const heatmapLayer = heatmap({
    data: geometry,
    useLocalExtrema: chartConfig.adoptive,
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
        :width="chartConfig.width"
        :height="chartConfig.height"
        :args="{ geometry, chartConfig }"
      />
    </div>
    <div style="margin-top: -100px" class="d-flex justify-space-between">
      <div class="d-flex flex-column justify-end">
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
            v-model="chartConfig.adoptive"
            label="Adoptive Sample"
            class="font-weight-bold"
          ></v-checkbox>
        </v-chip>
      </div>
      <div class="d-flex flex-column">
        <v-chip
          label
          variant="elevated"
          color="warning"
          style="z-index: 10000"
          class="mr-3 mb-3 pl-1"
        >
          <v-checkbox
            hide-details
            v-model="chartConfig.layers"
            label="Departures Layer"
            value="departures"
            class="font-weight-bold"
          ></v-checkbox>
        </v-chip>
        <v-chip
          label
          variant="elevated"
          color="info"
          style="z-index: 10000"
          class="mr-3 mb-3 pl-1"
        >
          <v-checkbox
            hide-details
            v-model="chartConfig.layers"
            label="Arrivals Layer"
            value="arrivals"
            class="font-weight-bold"
          ></v-checkbox>
        </v-chip>
      </div>
    </div>
  </v-card>
</template>
