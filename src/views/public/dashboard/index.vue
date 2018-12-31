<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{ name }}</div> -->
    <!-- <div class="userinfoo">info: {{ user }}</div> -->
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card style="max-width: 600px ">
          <div class="dashboard-text">ID: {{ user.uid }}</div>
          <div class="dashboard-text">姓名： {{ user.username }}</div>
          <div v-if="user.sex === 1" class="dashboard-text">性别： 男</div>
          <div v-else class="dashboard-text">性别： 女</div>
          <div class="dashboard-text">电话： {{ user.phone }}</div>
          <div class="dashboard-text">邮箱： {{ user.email }}</div>
          <div class="dashboard-text">注册日期： {{ user.registerDate }}</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" style="max-width: 600px;">
        <el-row :gutter="20" class="panel-group">
          <el-col :xs="12" :sm="12" :md="24" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="point" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">服务点数</div>
                <div class="card-panel-num">123</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="24" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="demand" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">需求数量</div>
                <div class="card-panel-num">123</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name', 'roles', 'user'])
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
    margin-left: 40px;
  }
}
// .card-panel-col {

// }
.card-panel {
  height: 108px;
  margin-top: 40px;
  cursor: pointer;
  font-size: 12px;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  &:hover {
    .card-panel-icon-wrapper {
      color: #fff;
    }
    .icon-people {
      background: #40c9c6;
    }
    .icon-message {
      background: #36a3f7;
    }
    .icon-money {
      background: #f4516c;
    }
    .icon-shopping {
      background: #34bfa3;
    }
  }
  .icon-people {
    color: #40c9c6;
  }
  .icon-message {
    color: #36a3f7;
  }
  .icon-money {
    color: #f4516c;
  }
  .icon-shopping {
    color: #34bfa3;
  }
  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 48px;
  }
  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    .card-panel-num {
      font-size: 20px;
    }
  }
}
</style>
