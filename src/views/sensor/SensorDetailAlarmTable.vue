<template>
  <div>
    <table
      class="
        table table-hover table-borderless table-sm
        caption-top
        table-bordered
        border-primary
        mt-3
      "
    >
      <caption class="ms-1">
        告警阈值
      </caption>
      <thead>
        <tr>
          <th rowspan="2" class="text-center align-middle">uid</th>
          <th rowspan="2" class="text-center align-middle">用户名</th>
          <th colspan="2" class="text-center">告警阈值</th>
        </tr>
        <tr>
          <th class="text-center">下限</th>
          <th class="text-center">上限</th>
        </tr>
      </thead>
      <tbody v-if="sensorAlarmThresholds">
        <tr
          v-for="sensorAlarmThreshold in sensorAlarmThresholds"
          :key="sensorAlarmThreshold.id"
        >
          <td class="text-center">{{ sensorAlarmThreshold.user }}</td>
          <td class="text-center">{{ sensorAlarmThreshold.username }}</td>
          <td class="text-center">
            {{ sensorAlarmThreshold.threshold_value_min }}
            {{ sensorJson.measurename }}
          </td>
          <td class="text-center">
            {{ sensorAlarmThreshold.threshold_value_max }}
            {{ sensorJson.measurename }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { API } from "@/App";

export default {
  name: "SensorDetailAlarmTableView",
  data() {
    return {
      sensorAlarmThresholds: null,
    };
  },
  props: {
    sensorJson: {
      type: Object,
    },
  },
  async mounted() {
    // 获取所有用户针对该传感器的告警信息
    try {
      const response = await axios.get(API.alarmThreshold, {
        params: {
          sensor: this.sensorJson.autoid,
        },
      });
      this.sensorAlarmThresholds = response.data.results;
    } catch (error) {
      console.log(error.response.data);
    }
  },
};
</script>