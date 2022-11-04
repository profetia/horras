<script setup>
import RectLegend from '@/components/d3/legends/RectLegend.vue';
import Scatter from '@/components/d3/charts/Scatter.vue';
import { ref } from 'vue';
import * as d3 from 'd3';
import { discreteScheme } from '@/composables/color/scheme';

const cityScheme = discreteScheme(42, 42).reverse();

const data = ref([]);

const getData = async () => {
  const detailedData = await d3.csv('./static/house_pricing.csv');
  const coordinalData = await d3.csv('./static/house_pricing_normalized.csv');

  data.value = detailedData.map((d, i) => ({
    ...d,
    ...coordinalData[i],
  }));
};

getData();
</script>
<template>
  <div class="v-main">
    <div class="d-flex justify-center pb-16">
      <div class="pt-8">
        <Scatter
          :data="
            data.map((d) => ({
              x: d[`tsne-2d-x`],
              y: d[`tsne-2d-y`],
              category: d['city'],
              ...d,
            }))
          "
          width="600"
          height="600"
          :scheme="cityScheme"
        />
        <div class="text-center text-h5">T-SNE</div>
      </div>
      <div class="pt-8">
        <Scatter
          :data="
            data.map((d) => ({
              x: d[`pca-2d-x`],
              y: d[`pca-2d-y`],
              category: d['city'],
              ...d,
            }))
          "
          width="600"
          height="600"
          :scheme="cityScheme"
        />
        <div class="text-center text-h5">PCA</div>
      </div>
      <div class="pt-8">
        <Scatter
          :data="
            data.map((d) => ({
              x: d[`mds-2d-x`],
              y: d[`mds-2d-y`],
              category: d['city'],
              ...d,
            }))
          "
          width="600"
          height="600"
          :scheme="cityScheme"
        />
        <div class="text-center text-h5">MDS</div>
      </div>
    </div>
    <div class="d-flex justify-center">
      <RectLegend
        :data="
          data.map((d) => ({
            category: d['city'],
          }))
        "
        :scheme="cityScheme"
        :rows="6"
        :rectMargin="5"
        :textWidth="150"
      />
    </div>
  </div>
</template>
