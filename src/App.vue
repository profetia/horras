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
        title="Haikou Online Ride-hailing Records Analysis System"
        elevation="3"
      ></v-toolbar>
      <div class="pt-16">
        <div class="mx-4">
          <div class="d-flex justify-center">
            <div>
              <div class="pb-16">
                <div
                  class="d-flex justify-space-between"
                  style="margin-left: 50px; margin-right: 20px"
                >
                  <div>
                    <Geometry />
                  </div>
                  <div>
                    <TopoGraph />
                  </div>
                </div>
              </div>
              <div>
                <Heatmap />
              </div>
            </div>
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
