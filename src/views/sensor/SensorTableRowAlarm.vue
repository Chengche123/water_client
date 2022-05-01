<template>
  <td @click.stop>
    <div class="row g-0 justify-content-around">
      <div class="col-auto was-validated">
        <form ref="thresholdInput" class="input-group">
          <!-- 阈值下限 -->
          <span
            class="input-group-text iconfont icon bg-transparent px-2"
            style="font-size: 0.6rem"
            >&#xe60a;</span
          >
          <input
            class="form-control form-control-sm bg-transparent me-2"
            style="max-width: 4rem"
            type="text"
            v-model="thresholdValueMin"
            :disabled="!enableThresholdInput"
            placeholder="未设置"
            required
            pattern="(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)"
          />
          <!-- 阈值上限 -->
          <span
            class="input-group-text iconfont icon bg-transparent px-2"
            style="font-size: 0.6rem"
            >&#xe60c;</span
          >
          <input
            class="form-control form-control-sm bg-transparent"
            style="max-width: 4rem"
            type="text"
            v-model="thresholdValueMax"
            :disabled="!enableThresholdInput"
            placeholder="未设置"
            required
            pattern="(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)"
          />
        </form>
      </div>
      <div class="col-auto">
        <button
          @click="handleInputButtonClick"
          type="button"
          class="btn btn-light btn-sm"
          :class="{ 'bg-transparent': !enableThresholdInput }"
        >
          {{ inputLable }}
        </button>
      </div>
    </div>
  </td>
  <td @click.stop>
    <!-- 在没有设置告警阈值时不能设置告警方式 -->
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableTelephoneMethod"
        @change="onMethodChange"
        :disabled="!thresholdValueMax || !thresholdValueMin"
      />
      <label class="form-check-label">电话</label>
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableMessageMethod"
        @change="onMethodChange"
        :disabled="!thresholdValueMax || !thresholdValueMin"
      />
      <label class="form-check-label">短信</label>
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input
        class="form-check-input bg-transparent"
        type="checkbox"
        v-model="enableEmailMethod"
        @change="onMethodChange"
        :disabled="!thresholdValueMax || !thresholdValueMin"
      />
      <label class="form-check-label">邮箱</label>
    </div>
  </td>
</template>

<script>
export default {
  name: "SensorTableRowAlarmView",
  data() {
    return {
      thresholdValueMax: null,
      thresholdValueMin: null,
      // 阈值修改输入框使能
      enableThresholdInput: false,
      inputLable: "修改",
      // 告警方法 model
      enableTelephoneMethod: false,
      enableMessageMethod: false,
      enableEmailMethod: false,
    };
  },
  props: {
    alarmThresholdJson: {
      type: Object,
    },
  },
  computed: {
    // 通过 method 比特位计算最终值
    method() {
      let res = 0;
      res |= this.enableTelephoneMethod ? 0x01 : 0;
      res |= this.enableMessageMethod ? 0x02 : 0;
      res |= this.enableEmailMethod ? 0x04 : 0;
      return res;
    },
  },
  mounted() {
    // 有些传感器并没有设置告警信息
    if (!this.alarmThresholdJson) {
      return;
    }
    this.thresholdValueMin = this.alarmThresholdJson.threshold_value_min;
    this.thresholdValueMax = this.alarmThresholdJson.threshold_value_max;
    // 从 method 中根据比特位取出信息
    const method = this.alarmThresholdJson.method;
    this.enableTelephoneMethod = (method & 0x01) == 0x01;
    this.enableMessageMethod = (method & 0x02) == 0x02;
    this.enableEmailMethod = (method & 0x04) == 0x04;
  },
  methods: {
    handleInputButtonClick() {
      // 数据是否已经经过验证
      if (this.$refs.thresholdInput.checkValidity()) {
        this.enableThresholdInput = !this.enableThresholdInput;
      }
    },
    onMethodChange() {
      console.log(this.method);
    },
  },
  watch: {
    // 聚焦阈值输入框
    enableThresholdInput: async function (val) {
      if (val == true) {
        // 使能之后 lable 变为 '确认'
        this.inputLable = "确认";
        // 等待 DOM 被渲染完成，即输入框被使能
        await this.$nextTick();
        this.$refs.thresholdInput.focus();
      } else {
        // 除能之后 lable 变为 '修改'
        this.inputLable = "修改";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/utils.scss";
</style>