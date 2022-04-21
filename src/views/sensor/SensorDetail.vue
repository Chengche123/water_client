<template>
  <div class="container-fluid mt-2">
    <div class="row align-items-center">
      <!-- 数据实时更新 -->
      <div class="col-4">
        <RTLineChartView
          v-if="sensorCode"
          :sensorCode="sensorCode"
          :dataPath="API.hx2022"
        />
      </div>
      <!-- 历史数据 -->
      <div class="col-8">
        <HistoryLineChartView
          v-if="sensorCode"
          :sensorCode="sensorCode"
          :dataPath="API.hx2022"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RTLineChartView from "../chart/RTLineChartView.vue";
import HistoryLineChartView from "../chart/HistoryLineChartView";
import { API } from "../../App";

export default {
  name: "SensorDetailView",
  components: { RTLineChartView, HistoryLineChartView },
  data() {
    return {
      sensorCode: "",
      API,
    };
  },
  mounted() {
    this.sensorCode = this.$route.params.sensorCode;
  },
};
</script>