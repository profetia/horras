<script setup>
import RectLegend from '@/components/legends/RectLegend.vue';
import BrushScatter from './components/charts/BrushScatter.vue';
import { provide, ref } from 'vue';
import * as d3 from 'd3';
import { discreteScheme } from '@/composables/d3/color/scheme';
import Heatmap from './components/charts/Heatmap.vue';

const cityScheme = discreteScheme(
  42,
  42,
  d3.interpolate('rgb(135, 135, 135)', 'rgb(135, 135, 135)'),
).reverse();

const data = ref([]);
const selected = ref([]);

provide('selected', selected);
</script>
<template>
  <div class="v-main">
    <div class="d-flex justify-center pb-16">
      <Heatmap> </Heatmap>
    </div>
  </div>
</template>
