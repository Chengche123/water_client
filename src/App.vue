<template>
  <div class="container-fluid">
    <div class="row">
      <nav
        v-if="showNav"
        class="
          col-2
          navbar
          fixed-top
          bottom-0
          navbar-dark
          bg-dark
          align-content-start
        "
      >
        <div class="navbar-brand text-info mb-4">矿井井下水文监测系统</div>
        <ul class="navbar-nav flex-column">
          <li class="nav-item">
            <router-link
              :to="{ name: 'sensor-home' }"
              class="nav-link"
              active-class="active"
            >
              <i class="iconfont icon">&#xe88e;</i>
              实时监测
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'test' }"
              class="nav-link"
              active-class="active"
            >
              <i class="iconfont icon">&#xe606;</i>
              调试
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="col-10 ms-auto px-4">
        <!-- 在切换导航栏后不重新刷新页面 -->
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// axios.defaults.baseURL =
//   "https://www.fastmock.site/mock/820cb4d076cec84c7d445bb352e6c519/test";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000";

const ws = new WebSocket("ws://localhost:8000/ws/hx2022-consumer/");

export default {
  name: "App",
  data() {
    return {
      showNav: true,
    };
  },
  mounted() {
    console.log("app mounted");
    ws.onopen = function () {
      ws.send(
        JSON.stringify({
          action: "subscribe_to_hx2022_activity",
          request_id: new Date().getTime(),
        })
      );
    };

    ws.onmessage = (e) => {
      const msgData = JSON.parse(e.data);
      this.$store.commit("changeHx2022MsgData", msgData);
    };
  },
  unmounted() {
    ws.close();
    console.log("app unmounted");
  },
  watch: {
    $route: function (val) {
      if (val.name == "login") {
        this.showNav = false;
        return;
      }

      this.showNav = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/utils.scss";

.navbar .nav-link.active {
  color: $primary;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.navbar .nav-link .icon {
  margin-right: 4px;
  color: $secondary;
}

.navbar .nav-link:hover .icon,
.navbar .nav-link.active .icon {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
}
</style>