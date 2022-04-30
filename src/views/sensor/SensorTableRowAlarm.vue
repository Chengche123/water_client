<template>
  <td @click.stop>
    <div class="row">
      <div class="col-auto">
        <input
          class="form-control form-control-sm bg-transparent"
          style="max-width: 5rem"
          type="text"
          v-model="thresholdValue"
          :disabled="!enableThresholdInput"
          ref="thresholdInput"
        />
      </div>
      <div class="col-auto">
        <button
          @click="enableThresholdInput = !enableThresholdInput"
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
    <div class="form-check form-switch">
      <input class="form-check-input bg-transparent" type="checkbox" />
      <label class="form-check-label">电话</label>
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input class="form-check-input bg-transparent" type="checkbox" />
      <label class="form-check-label">短信</label>
    </div>
  </td>
  <td @click.stop>
    <div class="form-check form-switch">
      <input class="form-check-input bg-transparent" type="checkbox" />
      <label class="form-check-label">邮箱</label>
    </div>
  </td>
</template>

<script>
export default {
  name: "SensorTableRowAlarmView",
  data() {
    return {
      thresholdValue: null,
      // 阈值修改输入框使能
      enableThresholdInput: false,
      inputLable: "修改",
    };
  },
  props: {
    alarmThresholdJson: {
      type: Object,
    },
  },
  mounted() {
    if (this.alarmThresholdJson) {
      this.thresholdValue = this.alarmThresholdJson.threshold_value;
    }
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