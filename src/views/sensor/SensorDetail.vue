<template>
  <div class="container my-5">
    <div class="row g-5">
      <div class="col-4">
        <LineChartView
          v-if="sensorCode"
          :sensorCode="sensorCode"
          :dataPath="$store.state.hx2022Path"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LineChartView from "../chart/LineChartView.vue";

export default {
  name: "SensorDetailView",
  components: { LineChartView },
  data() {
    return {
      sensorCode: null,
    };
  },
  mounted() {
    this.sensorCode = this.$route.params.sensorCode;
  },
};
</script>