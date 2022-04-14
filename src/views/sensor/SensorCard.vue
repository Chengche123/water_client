<template>
  <div
    class="card opacity-75 text-start pb-3"
    :class="{ btn: isRunning }"
    @click="handleClick"
  >
    <!-- 卡片内容 -->
    <div class="card-body p-0">
      <span class="opacity-100 card-title bg-danger text-white">{{
        sensorJson.sensortypename
      }}</span>
      <div class="ps-5">
        <!-- 地址 -->
        <p class="mb-0">{{ sensorJson.address }}</p>
        <!-- 状态 -->
        <div v-if="isRunning">
          <i class="bi bi-dot text-success"></i><span>传感器正常</span>
          <span class="ms-1 spinner-grow spinner-grow-sm text-success"></span>
        </div>
        <div v-else>
          <i class="bi bi-dot text-danger"></i><span>传感器异常</span>
          <span class="ms-1 spinner-grow spinner-grow-sm text-danger"></span>
        </div>
        <!-- 数据 -->
        <div class="row">
          <div class="col-8 mt-2">
            <transition-group
              enter-active-class="animate__animated animate__slideInRight items-active"
              leave-active-class="animate__animated animate__slideOutRight position-absolute items-active"
              enter-from-class="opacity-0"
              leave-to-class="opacity-0"
              move-class="items-move"
            >
              <div v-for="item in items" :key="`${item.udatetime}`">
                <span class="bg-info px-1 opacity-75 mb-2">
                  {{ item.value }} {{ sensorJson.measurename }}
                </span>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SensorCardView",
  props: {
    sensorJson: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    const dataPath = this.$store.state.hx2022Path;
    const response = await axios.get(dataPath, {
      params: {
        code: this.sensorJson.code,
        limit: 3,
      },
    });

    let items = response?.data?.results;
    if (!items) {
      return;
    }
    items.reverse();
    this.items = items;
  },
  data() {
    return {
      isRunning: false,
      items: [],
    };
  },
  watch: {
    // 接收 ws 消息
    "$store.state.hx2022MsgData": function (val) {
      if (!val || val.code != this.sensorJson.code) {
        return;
      }

      if (!this.isRunning) {
        this.isRunning = true;
      }

      this.items = this.items.slice(1).concat(val);
    },
  },
  methods: {
    handleClick() {
      if (!this.isRunning) {
        return;
      }
      this.$router.push({
        name: "sensor-detail",
        params: { sensorCode: this.sensorJson.code },
      });
    },
  },
};
</script>

<style scoped>
.card:hover {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}

.items-move {
  transition: all 1s ease;
}

.items-active {
  transition: all 1s ease;
}
</style>