<template>
  <li class="nav-item">
    <div class="text-primary">
      {{ userJson?.username }} {{ userJson?.is_superuser ? "(管理员)" : "" }}
      <a
        class="text-secondary text-decoration-underline ms-1"
        role="button"
        @click="handleLogout"
        >登出</a
      >
      <a
        class="text-secondary text-decoration-underline ms-2"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#profileModel"
        >修改信息</a
      >
      <!-- 修改信息对话框 -->
      <UserUpdateProfileView v-if="$store.state.user" />
    </div>
  </li>
</template>

<script>
import axios from "axios";
import { API } from "../../App";
import UserUpdateProfileView from "./UserUpdateProfile";

export default {
  name: "UserView",
  computed: {
    userJson() {
      return this.$store.state.user;
    },
  },
  components: { UserUpdateProfileView },
  methods: {
    async handleLogout() {
      // 先调用接口，然后直接跳转到登录页面
      try {
        await axios.get(API.logout);

        // 销毁用户对象
        this.$store.commit("changeUser", null);

        this.$router.push({ name: "login" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>