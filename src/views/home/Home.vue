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
          <UserView />
          <li class="nav-item mt-3">
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
      <!-- 不显示左侧导航栏时，撑开宽度 -->
      <div class="px-4" :class="{ 'ms-auto': showNav, 'col-10': showNav }">
        <!-- 在切换导航栏后不重新刷新页面 -->
        <router-view v-slot="{ Component }">
          <!-- 只缓存一部分页面 -->
          <keep-alive :include="['SensorHomeView']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import UserView from "./User";

export default {
  name: "HomeView",
  components: { UserView },
  data() {
    return {
      showNav: true,
    };
  },
  watch: {
    $route: function (val) {
      if (val.name == "login" || val.name == "register") {
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