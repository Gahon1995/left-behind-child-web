<template>
  <div style="position: relative; margin: 20px 10px;word-break: break-all;">
    <div style="text-align: center;margin-top: 40px;margin-bottom: 40px;">搜索：</div>
    <el-row :gutter="40" style="max-width: 1000px; margin: auto;">
      <!--就改这里一行-->
      <el-col
        v-for="(demand,index) in list"
        :xs="24"
        :sm="12"
        :md="12"
        :key="index"
        style="margin-bottom:20px;"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;font-size: 24px;color: #f44336">{{ demand.pointName }}</span>
            <el-tooltip :content="demand.reviewApplyDetail" effect="dark" placement="bottom">
              <el-tag
                :type="demand.helpState | statusColorFilter"
                style="float: right;"
              >{{ demand.helpState | statusNameFilter }}</el-tag>
            </el-tooltip>
          </div>
          <div>
            <el-form label-width="90px" style="height: 0px;line-height: 0px;">
              <el-form-item label="发起人:" class="index-item">
                <div>{{ demand.ownerName }}</div>
              </el-form-item>

              <el-form-item label="联系电话:" class="index-item">
                <div>{{ demand.ownerPhone }}</div>
              </el-form-item>

              <el-form-item label="地址:" class="index-item">
                <div>{{ demand.province }}&nbsp;{{ demand.city }}&nbsp;{{ demand.district }}&nbsp;{{ demand.address }}</div>
              </el-form-item>

              <el-form-item label="需求详情:" class="index-item">
                <div>{{ demand.detail }}</div>
              </el-form-item>
              <el-form-item label="发布时间:" class="index-item">
                <div>{{ demand.createTime }}</div>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total / listQuery.size > 1"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchDemads"
    />
  </div>
</template>

<script>
import { getDemands } from '@/api/public.js'
// import { getPointList } from '@/api/user/point.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'success',
        '-1': 'primary',
        '-2': 'primary'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        '1': '已有帮扶',
        '0': '已有申请',
        '-1': '无人申请',
        '-2': '无人申请'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      isEdit: false,
      editVisible: false,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      pointlist: null,
      temp: {
        detail: null,
        did: null,
        pid: null,
        status: -2,
        helpState: 0,
        province: null,
        city: null,
        district: null,
        address: null,
        lat: 0,
        lng: 0
      }
    }
  },
  created() {
    this.fetchDemads()
  },
  methods: {
    fetchDemads() {
      this.listLoading = true
      getDemands(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
      // getPointList().then(response => {
      //   this.pointlist = response.data.list
      // })
    }
  }
}
</script>

<style>
/* .text {
  /* font-size: 16px; */
/* } */

.index-item {
  margin-bottom: 0px;
}
.item-name {
  font-weight: bold;
}
/* .el-form-item {
  margin-bottom: 0px;
} */
.el-form-item label {
  /* font-size: 16px; */
  color: #303133;
  font-weight: bold;
}
/* .el-form-item__content {
  line-height: 30px;
} */
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  height: 300px;
  overflow: auto;
}
</style>
