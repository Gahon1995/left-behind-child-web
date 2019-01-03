<template>
  <div style="position: relative; margin: 20px 10px;word-break: break-all;">
    <div class="filter-container" style="margin-bottom: 20px;text-align: center">
      <span>筛选：</span>
      <el-cascader :options="options" v-model="selectedOptions" @change="handleChange"/>
    </div>
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

            <el-tag
              v-if="demand.helpState === 1 || demand.helpState === 0"
              type="success"
              style="float: right;"
            >{{ demand.helpState | statusNameFilter }}</el-tag>
            <el-button
              v-else
              type="primary"
              style="float: right;"
              round
              size="small"
              @click="ApplyDemand(demand)"
            >申请帮扶</el-button>
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

    <el-dialog
      :visible.sync="isApply"
      title="需求申请"
      style="margin: auto; width: 100%; max-width: 1000px"
    >
      <el-form>
        <el-form-item label="申请说明:" label-width="100px">
          <el-input
            v-model="helpDetail"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button @click="isApply = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDemands } from '@/api/public.js'
import { mapGetters } from 'vuex'
import { applyDemand } from '@/api/user/demand.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { provinceAndCityDataPlus, CodeToText } from 'element-china-area-data'

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
      isApply: false,
      applyUid: null,
      editVisible: false,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        province: '',
        city: ''
      },
      pointlist: null,
      helpDetail: '',
      temp: {},
      options: provinceAndCityDataPlus,
      selectedOptions: []
    }
  },
  computed: {
    ...mapGetters(['login', 'user'])
  },
  created() {
    this.fetchDemads()
  },
  methods: {
    fetchDemads() {
      this.listLoading = true
      getDemands(this.listQuery).then(response => {
        console.log(response.data.list.length)
        if (response.data.list.length === 0) {
          this.$message.success('该地区暂无需求')
        }
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
      // getPointList().then(response => {
      //   this.pointlist = response.data.list
      // })
    },
    ApplyDemand(demand) {
      if (this.$store.getters.login) {
        console.log('login')
        this.applyUid = this.$store.getters.user.uid
        this.temp = demand
        this.isApply = true
        // if (this.demand.uid === this.applyUid) {
        //   this.$message.error('禁止申请自己发起的需求')
        //   return null
        // }
      } else {
        this.$message.error('请先登录！')
        this.isApply = false
        this.$router.push({ path: '/login' })
      }
    },
    updateData() {
      if (this.helpDetail === '') {
        this.$message.error('请输入帮扶说明')
      } else {
        this.temp.helpDetail = this.helpDetail
        const tempData = Object.assign({}, this.temp)
        tempData.helpState = 0
        tempData.hid = this.applyUid
        applyDemand(tempData)
          .then(() => {
            this.isApply = false
            this.$notify({
              title: '成功',
              message: '申请成功，请等待审核',
              type: 'success',
              duration: 1000
            })
          })
          .catch(() => {
            this.isApply = false
            this.$notify({
              title: '失败',
              message: '申请失败，请稍后再试',
              type: 'error',
              duration: 2000
            })
          })
      }
    },
    handleChange(value) {
      // postForm.province = value
      // console.log(value)
      this.listQuery.province = CodeToText[value[0]]
      this.listQuery.city = CodeToText[value[1]]
      // console.log(this.listQuery)
      this.fetchDemads()
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
