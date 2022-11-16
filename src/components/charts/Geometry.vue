<script setup>
import { reactive } from 'vue';
import * as L from 'leaflet';
import LeafletWrapper from '@/components/leaflet/core/LeafletWrapper.vue';

const initFn = (node) => {
  const haikouMap = L.map(node, {
    center: [20.004658, 110.355043],
    zoom: 11,
    renderer: L.svg(),
  });

  const baseLayer = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: 'Haut-Gis-Org © OpenStreetMap',
    },
  );

  baseLayer.addTo(haikouMap);
};
</script>
<template>
  <LeafletWrapper :callback="initFn" />
</template>
