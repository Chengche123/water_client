<template>
  <div class="container-fluid opacity-75 mt-3">
    <ToastView
      class="position-absolute top-50 start-50 translate-middle"
      v-if="showToast"
      :="toastParams"
      style="z-index: 1"
    />
    <div class="mx-auto col-5">
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
            {{
              $refs.confirmPasswordInput?.validationMessage || "两次密码不一致"
            }}
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
        <div class="form-floating mb-1">
          <input
            v-model="telephone"
            type="text"
            class="form-control"
            id="floatingTelephone"
            autocomplete="off"
            required
            pattern="^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$"
          />
          <label class="text-info" for="floatingTelephone">手机号</label>
          <div class="invalid-feedback">请输入正确的手机号</div>
        </div>
        <button @click="handleRegister" class="mt-1 w-100 btn-lg btn-primary">
          注册
        </button>
        <button
          @click="$router.push({ name: 'login' })"
          class="mt-2 w-100 btn-lg btn-secondary"
        >
          已有账号，去登陆
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
      telephone: "",
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
