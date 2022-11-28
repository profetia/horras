<script setup>
import Heatmap from '@/components/charts/Heatmap.vue';
import Geometry from '@/components/charts/Geometry.vue';
import TopoGraph from '@/components/charts/TopoGraph.vue';
import useSnackbar from '@/composables/global/useSnackbar';

const { snackbar } = useSnackbar();
</script>
<template>
  <v-app>
    <v-main>
      <v-toolbar
        title="Horras: Haikou Online Ride-hailing Records Analysis System"
        elevation="3"
      ></v-toolbar>
      <div class="pt-16">
        <div class="mx-4">
          <div class="d-flex justify-space-between pb-16">
            <v-card>
              <div>
                <Geometry />
              </div>
              <v-card-actions>
                <v-btn>hi</v-btn>
              </v-card-actions>
            </v-card>
            <div>
              <TopoGraph />
            </div>
          </div>
          <div class="d-flex justify-center">
            <Heatmap />
          </div>
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
