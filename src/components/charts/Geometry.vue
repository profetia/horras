<script setup>
import useGeometry from '@/composables/charts/useGeometry';
import * as L from 'leaflet';
import LeafletWrapper from '@/components/leaflet/core/LeafletWrapper.vue';
import { heatmap } from '@/composables/leaflet/charts/heatmap';
import { polygon } from '@/composables/leaflet/charts/polygon';
import { getHaikouAll } from '@/composables/utils/useHaikou';
import useChartState from '@/composables/charts/useChartState';
import { tileOpenStreetNormal } from '@/composables/leaflet/tiles/provider';

const { geometry } = useGeometry();
const { appendHighlights } = useChartState();

// console.log(geometry.value);

const initFn = (node, { geometry }) => {
  const baseLayer = L.tileLayer(...tileOpenStreetNormal);

  // console.log(geometry);
  // console.log(geometry.data.filter((item) => item.count > geometry.max));

  const heatmapLayer = heatmap({
    data: geometry,
    useLocalExtrema: true,
  });

  const haikouMap = L.map(node, {
    zoomControl: false,
    attributionControl: false,
    center: [20.004658, 110.355043],
    zoom: 12,
    minZoom: 9,
    maxZoom: 14,
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
  <LeafletWrapper
    :callback="initFn"
    width="1200"
    height="900"
    :args="{ geometry }"
  />
</template>
