<template>
  <div>
    <table
      class="
        table table-hover table-borderless table-sm
        caption-top
        table-bordered
        border-primary
      "
    >
      <caption>
        <i class="iconfont icon ms-1 me-2">&#xe9d8;</i
        >用户授权
      </caption>
      <thead>
        <tr>
          <th scope="col">uid</th>
          <th scope="col">用户名</th>
          <th scope="col">访问站点权限</th>
        </tr>
      </thead>
      <tbody v-if="userJsons">
        <template v-for="userJson in userJsons" :key="userJson.id">
          <PermissionTableRowView
            v-if="!userJson.is_superuser"
            :userJson="userJson"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { API } from "@/App";
import PermissionTableRowView from "./PermissionTableRow";

export default {
  name: "PermissionTableView",
  async mounted() {
    try {
      const response = await axios.get(API.users);
      this.userJsons = response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  },
  components: { PermissionTableRowView },
  data() {
    return {
      userJsons: null,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/utils.scss";
</style>