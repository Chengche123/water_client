<template>
  <div class="container my-5">
    <div class="row row-cols-4 g-4">
      <template v-for="sensor in sensorJsons" :key="sensor.autoid">
        <div class="col">
          <SensorCardView :sensorJson="sensor" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SensorCardView from "./SensorCard.vue";
import axios from "axios";

export default {
  name: "SensorListView",
  components: { SensorCardView },
  mounted() {
    axios
      .get(this.$store.state.sensorPath, {
        params: {
          limit: 100,
        },
      })
      .then((response) => {
        const results = response.data.results;
        this.sensorJsons = results;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data() {
    return {
      sensorJsons: [],
    };
  },
};
</script>
