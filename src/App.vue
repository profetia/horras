<script setup>
import Heatmap from '@/components/charts/Heatmap.vue';
import Geometry from '@/components/charts/Geometry.vue';
import useSnackbar from '@/composables/global/useSnackbar';

const { snackbar } = useSnackbar();
</script>
<template>
  <v-app>
    <v-main>
      <div>
        <div class="d-flex justify-center pb-16">
          <Geometry />
        </div>
        <div class="d-flex justify-center">
          <Heatmap />
        </div>
      </div>
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>
