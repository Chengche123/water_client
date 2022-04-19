<template>
  <tr style="cursor: pointer">
    <th scope="row">{{ index + 1 }}</th>
    <td>{{ sensorJson.code }}</td>

    <td class="text-center">
      <transition-group
        enter-active-class="animate__animated animate__slideInLeft"
        leave-active-class="animate__animated animate__fadeOut position-absolute"
        move-class="items-move"
      >
        <span
          v-for="data in datas"
          class="d-inline-block"
          :key="data.udatetime"
        >
          {{ parseUdatetime(data.udatetime) }}</span
        >
      </transition-group>
    </td>

    <td class="text-center">
      <transition-group
        enter-active-class="animate__animated animate__slideInLeft"
        leave-active-class="animate__animated animate__fadeOut position-absolute"
        move-class="items-move"
      >
        <span
          v-for="data in datas"
          class="d-inline-block"
          :key="data.udatetime"
        >
          {{ data.value }} {{ sensorJson.measurename }}</span
        >
      </transition-group>
    </td>

    <td>{{ sensorJson.address }}</td>
    <td>{{ sensorJson.sensortypename }}</td>
    <td v-if="STATUS == STATUS_RUNING">
      正常 <span class="spinner-grow spinner-grow-sm text-success"></span>
    </td>
    <td v-else-if="STATUS == STATUS_ABNORMAL">
      异常 <span class="spinner-grow spinner-grow-sm text-danger"></span>
    </td>
    <td v-else>
      断线 <span class="spinner-border spinner-border-sm text-secondary"></span>
    </td>
  </tr>
</template>

<script>
import axios from "axios";

export default {
  name: "SensorTableRowView",
  async mounted() {
    const dataPath = this.$store.state.hx2022Path;
    const response = await axios.get(dataPath, {
      params: {
        code: this.sensorJson.code,
        limit: 1,
      },
    });

    let item = response?.data?.results?.[0];
    if (!item) {
      return;
    }
    this.datas.push(item);
  },
  props: {
    sensorJson: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      datas: [],
      dateTime: "",
      STATUS_RUNING: 0,
      STATUS_ABNORMAL: 1,
      STATUS_DISCONNECTED: 2,
      STATUS: 2,
    };
  },
  watch: {
    // 接收 ws 消息
    "$store.state.hx2022MsgData": function (val) {
      if (!val || val.code != this.sensorJson.code) {
        return;
      }

      if (this.STATUS != this.STATUS_RUNING) {
        this.$emit("changeStatusToRuning", this.index);
      }

      this.STATUS = this.STATUS_RUNING;
      this.datas = [val];
    },
  },
  methods: {
    parseUdatetime(udatetime) {
      const date = new Date(udatetime);
      return date.toLocaleString();
    },
  },
};
</script>

<style scoped>
tr:active {
  opacity: 0.75;
}
</style>