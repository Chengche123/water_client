<template>
  <div class="card opacity-75 text-start">
    <div class="card-body p-0">
      <span class="opacity-100 card-title bg-danger text-white">{{
        sensorJson.sensortypename
      }}</span>
      <div class="ps-5">
        <p class="mb-0">{{ sensorJson.address }}</p>
        <div v-if="isRunning">
          <i class="bi bi-dot text-success"></i><span>传感器正常</span>
          <span class="ms-1 spinner-grow spinner-grow-sm text-success"></span>
        </div>
        <div v-else>
          <i class="bi bi-dot text-danger"></i><span>传感器异常</span>
          <span class="ms-1 spinner-grow spinner-grow-sm text-danger"></span>
        </div>
        <div class="row row-cols-3 mb-3 me-3 mt-1">
          <template v-for="(value, inx) in dataValues" :key="value">
            <span class="col-3 btn btn-info opacity-75 p-0">
              {{ value }}
            </span>
            <span v-if="inx != dataValues.length - 1" class="col-1"></span>
          </template>
        </div>
        <button @click="handleClick">测试</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SensorCardView",
  props: {
    sensorJson: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isRunning: false,
      dataValues: [12.34, 12.34, 12.34],
    };
  },
  watch: {
    "$store.state.hx2022MsgData": function (val) {
      if (!val?.value) {
        return;
      }
      if (val.code == this.sensorJson.code) {
        this.isRunning = true;
      }
    },
  },
  methods: {
    handleClick() {
      this.dataValues = this.dataValues.slice(1).concat(34.56);
    },
  },
};
</script>

<style scoped>
.card:hover {
  transform: scale(1.05);
}
</style>