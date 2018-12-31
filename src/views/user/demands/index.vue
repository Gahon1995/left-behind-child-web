<template>
  <div style="position: relative; margin: 20px 40px; word-break: break-all;">
    <el-row style="margin-bottom: 20px">
      <el-button type="primary" @click="isEdit=true,editVisible = true">添加新需求</el-button>
    </el-row>
    <el-row :gutter="40">
      <!--就改这里一行-->
      <el-col
        v-for="(demand,index) in list"
        :xs="24"
        :sm="24"
        :md="12"
        :key="index"
        style="margin-bottom:20px;"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;font-size: 24px;color: #f44336">{{ demand.pointName }}</span>
            <el-tooltip :content="demand.reviewApplyDetail" effect="dark" placement="bottom">
              <el-tag
                :type="demand.status | statusColorFilter"
                style="float: right;"
              >{{ demand.status | statusNameFilter }}</el-tag>
            </el-tooltip>
          </div>
          <el-form label-width="90px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="发起人:">
                  <div>{{ demand.ownerName }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话:">
                  <div>{{ demand.ownerPhone }}</div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="需求详情:">
              <div>{{ demand.detail }}</div>
            </el-form-item>
            <el-form-item label="申请时间:">
              <div>{{ demand.createTime }}</div>
            </el-form-item>
            <div v-if="demand.helperName !== ''">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="帮扶人:">
                    <div>{{ demand.helperName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式:">
                    <div>{{ demand.helperPhone }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <el-form-item label="帮扶人:">暂无人申请</el-form-item>
            </div>
          </el-form>
          <el-row align="center">
            <el-button
              type="primary"
              style="float: right; margin: 20px 10px 0px"
              @click="handleEdit(demand)"
            >编辑</el-button>

            <el-button
              type="danger"
              style="float: right; margin: 20px 10px 0px"
              @click="handleDelete(demand.did)"
            >删除</el-button>
          </el-row>
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
      :visible.sync="editVisible"
      title="需求编辑"
      style="margin: auto; width: 100%; max-width: 1000px"
    >
      <el-form ref="dataForm" :model="temp" align="left" label-width="100px">
        <el-form-item label="服务点选择:">
          <el-select v-model="temp.pid" placeholder="请选择">
            <el-option
              v-for="point in pointlist"
              :key="point.pid"
              :label="point.pointName"
              :value="point.pid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="需求描述:">
          <el-input
            v-model="temp.detail"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button @click="editVisible = false, isEdit = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDemands, deleteDemand, updateDemand } from '@/api/user/demand.js'
import { getPointList } from '@/api/user/point.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'primary',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        '1': '通过',
        '0': '待审核',
        '-1': '不通过',
        '-2': '无申请'
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
        status: -2
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
      getPointList().then(response => {
        this.pointlist = response.data.list
      })
    },
    handleEdit(demand) {
      const tmpDemand = Object.assign({}, demand)
      this.temp = tmpDemand
      this.isEdit = true
      this.editVisible = true
    },
    handleDelete(did) {
      this.$confirm('确定删除该需求?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          deleteDemand(did)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 1000
              })
              for (const v of this.list) {
                if (v.did === did) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1)
                  break
                }
              }
            })
            .catch(() => {
              // this.formVisible = false
              // this.$notify({
              //   title: '失败',
              //   message: '删除数据失败，请检查后台状态',
              //   type: 'error',
              //   duration: 2000
              // })
            })
        })
        .catch(() => {})
    },
    updateData() {
      const tempData = Object.assign({}, this.temp)
      // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      updateDemand(tempData)
        .then(() => {
          if (this.isEdit) {
            for (const v of this.list) {
              if (v.did === this.temp.did) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.fetchDemads()
            this.isEdit = false
            this.editVisible = false
            this.temp.pid = null
            this.temp.did = null
            this.temp.detail = null
          }
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
        })
        .catch(() => {
          this.isEdit = false
          this.editVisible = false
          // this.$notify({
          //   title: '失败',
          //   message: '更新数据失败，请检查后端状态',
          //   type: 'error',
          //   duration: 2000
          // })
        })
    }
  }
}
</script>

<style>
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 18px;
}
.item-name {
  font-weight: bold;
}
/* .el-form-item {
  margin-bottom: 0px;
} */
.el-form-item label {
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}
.el-form-item__content {
  font-size: 16px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

/* .box-card {
  height: 300px;
} */
</style>
