<script setup>
import { provide, ref } from 'vue';
import * as d3 from 'd3';
import Heatmap from '@/components/charts/Heatmap.vue';
import Geometry from '@/components/charts/Geometry.vue';

const selected = ref([]);

provide('selected', selected);
</script>
<template>
  <div class="v-main">
    <div class="d-flex justify-center pb-16">
      <Heatmap />
    </div>
    <div class="d-flex justify-center">
      <Geometry />
    </div>
  </div>
</template>
