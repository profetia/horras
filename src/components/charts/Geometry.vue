<script setup>
import useGeometry from '@/composables/charts/useGeometry';
import * as L from 'leaflet';
import LeafletWrapper from '@/components/leaflet/core/LeafletWrapper.vue';
import { heatmap } from '@/composables/leaflet/charts/heatmap';
import { polygon } from '@/composables/leaflet/charts/polygon';
import { getHaikouAll } from '@/composables/utils/useHaikou';

const { hotspots } = useGeometry();

const initFn = (node, { hotspots }) => {
  const baseLayer = L.tileLayer(
    // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=MOEv0c7HeIGtkp6COaRzlt1QhSeaYLo1QzHCHu8RUY4oMeY72DfQoyw9KxQmIIVL',
    // 'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=63bc80aa57164b0c94d24cba52c45bb4',
    {
      attribution: 'Haut-Gis-Org © OpenStreetMap',
    },
  );

  const heatmapLayer = heatmap({
    data: hotspots,
  });

  const haikouMap = L.map(node, {
    attributionControl: false,
    center: [20.004658, 110.355043],
    zoom: 11,
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
  });

  countyLayer.addTo(haikouMap);
};
</script>
<template>
  <LeafletWrapper :callback="initFn" width="1024" height="1024" :args="{ hotspots }" />
</template>
