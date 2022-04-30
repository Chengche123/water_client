<template>
  <tr>
    <th scope="row">{{ userJson.id }}</th>
    <td>{{ userJson.username }}</td>
    <!-- 访问站点权限 -->
    <td>
      <div class="form-check form-switch">
        <input
          class="form-check-input bg-transparent"
          type="checkbox"
          v-model="isAccess"
          @change="handleIsAccessChange"
        />
      </div>
    </td>
  </tr>
</template>

<script>
import axios from "axios";
import { urljoins } from "urljoins";
import { API } from "@/App.vue";

export default {
  name: "PermissionTableRowView",
  data() {
    return {
      isAccess: false,
    };
  },
  props: {
    userJson: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // 取出用户信息
    this.isAccess = this.userJson?.extend?.is_access;
  },
  methods: {
    async handleIsAccessChange(ev) {
      // 发送 PATCH 请求，改变用户权限
      const isAccess = ev.target.checked;
      try {
        await axios.patch(urljoins(API.users, `${this.userJson.id}/`), {
          extend: {
            is_access: isAccess,
          },
        });
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
};
</script>