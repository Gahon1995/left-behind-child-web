<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{ name }}</div> -->
    <div class="dashboard-text">
      roles:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>
    <!-- <div class="userinfoo">info: {{ user }}</div> -->
    <div class="dashboard-text">ID: {{ user.uid }}</div>
    <div class="dashboard-text">姓名： {{ user.username }}</div>
    <div v-if="user.sex === 1" class="dashboard-text">性别： 男</div>
    <div v-else class="dashboard-text">性别： 女</div>
    <div class="dashboard-text">电话： {{ user.phone }}</div>
    <div class="dashboard-text">邮箱： {{ user.email }}</div>
    <div class="dashboard-text">注册日期： {{ user.registerDate }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'user'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 24px;
    line-height: 46px;
  }
}
</style>
