<template>
  <div
    class="
      container-fluid
      position-absolute
      top-50
      start-50
      translate-middle
      opacity-75
    "
  >
    <ToastView
      class="position-absolute top-50 start-50 translate-middle"
      v-if="showToast"
      :="toastParams"
      style="z-index: 1"
    />
    <div class="mx-auto col-4">
      <form
        class="p-4 border rounded-3 bg-light was-validated"
        @submit.prevent
        ref="myForm"
        novalidate
      >
        <div class="form-floating mb-1">
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="floatingUsername"
            autocomplete="off"
            pattern="^[a-zA-Z0-9_-]{4,16}$"
            required
          />
          <label class="text-info" for="floatingUsername">账号</label>
          <div class="invalid-feedback">
            4到16位（字母，数字，下划线，减号）
          </div>
        </div>
        <div class="form-floating mb-1">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="floatingPassword"
            autocomplete="off"
            required
          />
          <label class="text-info" for="floatingPassword">密码</label>
          <div class="invalid-feedback">密码不能为空</div>
        </div>
        <div class="form-floating mb-1">
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            id="floatingConfirmPassword"
            autocomplete="off"
            ref="confirmPasswordInput"
            required
          />
          <label class="text-info" for="floatingConfirmPassword"
            >确认密码</label
          >
          <div class="invalid-feedback">
            {{ $refs.confirmPasswordInput?.validationMessage }}
          </div>
        </div>
        <div class="form-floating mb-1">
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="floatingEmail"
            autocomplete="off"
            required
          />
          <label class="text-info" for="floatingEmail">邮箱</label>
          <div class="invalid-feedback">邮箱格式不正确</div>
        </div>
        <button @click="handleRegister" class="mt-1 w-100 btn-lg btn-primary">
          注册
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import ToastView from "../../components/Toast.vue";

export default {
  name: "LoginView",
  components: { ToastView },
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      showToast: false,
      toastParams: {
        body: "",
      },
    };
  },
  mounted() {},
  computed: {
    passwords() {
      const { password, confirmPassword } = this;
      return {
        password,
        confirmPassword,
      };
    },
  },
  watch: {
    passwords(newVal) {
      const { password, confirmPassword } = newVal;
      if (password != confirmPassword) {
        this.$refs.confirmPasswordInput.setCustomValidity("两次密码不一致");
        return;
      }
      this.$refs.confirmPasswordInput.setCustomValidity("");
    },
  },
  methods: {
    async handleRegister() {
      if (!this.$refs.myForm.checkValidity()) {
        return;
      }

      console.log("register");
    },
  },
};
</script>
