<template>
  <div class="container-fluid mt-2">
    <!-- 数据实时更新 -->
    <RTLineChartView
      v-if="sensorCode"
      :sensorCode="sensorCode"
      :dataPath="API.hx2022"
      :width="800"
      :height="200"
    />
  </div>
  <hr />
  <div class="container-fluid mt-2">
    <!-- 历史数据 -->
    <HistoryLineChartView
      v-if="sensorCode"
      :sensorCode="sensorCode"
      :dataPath="API.hx2022"
    />
  </div>
  <div class="container-fluid">
    <SensorDetailAlarmTable v-if="sensorJson" :sensorJson="sensorJson" />
  </div>
</template>

<script>
import RTLineChartView from "../chart/RTLineChartView.vue";
import HistoryLineChartView from "../chart/HistoryLineChartView";
import SensorDetailAlarmTable from "./SensorDetailAlarmTable";
import { API } from "../../App";
import axios from "axios";

export default {
  name: "SensorDetailView",
  components: { RTLineChartView, HistoryLineChartView, SensorDetailAlarmTable },
  data() {
    return {
      sensorCode: "",
      sensorJson: null,
      API,
    };
  },
  async mounted() {
    this.sensorCode = this.$route.params.sensorCode;

    // 获取该传感器的其他信息
    try {
      const response = await axios.get(API.sensors, {
        params: {
          code: this.sensorCode,
        },
      });
      this.sensorJson = response.data.results[0];
    } catch (error) {
      console.log(error.response.data);
    }
  },
};
</script>