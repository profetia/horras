<script setup>
import D3Wrapper from '@/components/d3/D3Wrapper.vue';
import { computed } from 'vue';
import { ref } from 'vue';
import * as d3 from 'd3';

let data1 = ref('Hello World');

const chart1 = computed(() => {
  let svg = d3.create('div');
  svg.append('text').text(data1.value);
  console.log(data1.value);
  return svg.node();
});

const data2 = ref('Fuck you');
const chart2 = computed(() => {
  let svg = d3.create('div');
  svg.append('text').text(data2.value);
  console.log(data2.value);
  return svg.node();
});

setTimeout(() => {
  data1.value = 'Hello World 2';
  data2.value = 'NMSL';
}, 2000);
</script>
<template>
  <div class="v-main">
    <D3Wrapper :chart="chart1" />
    <D3Wrapper :chart="chart2" />
  </div>
</template>
