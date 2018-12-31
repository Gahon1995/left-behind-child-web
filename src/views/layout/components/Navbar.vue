<template>
  <el-menu class="navbar" mode="horizontal">
    <template v-if="login === true">
      <hamburger
        :toggle-click="toggleSideBar"
        :is-active="sidebar.opened"
        class="hamburger-container"
      />
      <breadcrumb/>
    </template>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <router-link :to="'/'">
          <div class="theme-switch right-menu-item">主页</div>
        </router-link>
        <template v-if="login === false">
          <router-link :to="'/login'">
            <div class="theme-switch right-menu-item">登录/注册</div>
          </router-link>
        </template>
        <template v-else>
          <router-link class="theme-switch right-menu-item" to="/dashboard">
            <div>个人中心</div>
          </router-link>

          <a class="theme-switch right-menu-item" style="margin-right: 40px" @click="logout">退出</a>
        </template>
      </template>

      <template v-else>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link :to="'/'">
              <el-dropdown-item>
                <div class="theme-switch right-menu-item">主页</div>
              </el-dropdown-item>
            </router-link>
            <template v-if="login === false">
              <el-dropdown-item>
                <router-link :to="'/login'">
                  <div class="theme-switch right-menu-item">登录/注册</div>
                </router-link>
              </el-dropdown-item>
            </template>
            <template v-else>
              <el-dropdown-item divided>
                <router-link class="theme-switch right-menu-item" to="/dashboard">
                  <div>个人中心</div>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span
                  class="theme-switch right-menu-item"
                  style="margin-right: 40px"
                  @click="logout"
                >退出</span>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'login', 'device'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 10px;
    }
    .theme-switch {
      vertical-align: 10px;
      font-size: 18px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
