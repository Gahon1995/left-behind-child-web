<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="发起人" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.owner }}</template>
      </el-table-column>
      <el-table-column label="服务点" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.pointName }}</template>
      </el-table-column>
      <el-table-column label="需求详情">
        <template slot-scope="scope">{{ scope.row.detail }}</template>
      </el-table-column>
      <el-table-column label="需求审核" width="110" align="center">
        <template slot-scope="scope">
          <!-- v-if="scope.row.status === 0" -->
          <!-- <el-button
            :type="scope.row.status | statusColorFilter"
            size="small"
          @click="handleEdit(scope.row)">{{ scope.row.status | statusNameFilter }}</el-button>-->
          <el-tag
            :type="scope.row.status | statusColorFilter"
            size="small"
          >{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="需求审核说明" width="110" align="left">
        <template slot-scope="scope">{{ scope.row.reviewApplyDetail }}</template>
      </el-table-column>
      <el-table-column label="帮扶人" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.helper }}</template>
      </el-table-column>
      <el-table-column label="申请详情">
        <template slot-scope="scope">{{ scope.row.helpDetail }}</template>
      </el-table-column>
      <el-table-column label="帮扶审核" width="110" align="center">
        <template slot-scope="scope">
          <!-- v-if="scope.row.helpState === 0" -->
          <!-- <el-button
            :type="scope.row.helpState | statusColorFilter"
            size="small"
          @click="handleEdit(scope.row)">{{ scope.row.helpState | statusNameFilter }}</el-button>-->
          <el-tag
            :type="scope.row.helpState | statusColorFilter"
            size="small"
          >{{ scope.row.helpState | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="帮扶审核说明" width="110" align="left">
        <template slot-scope="scope">{{ scope.row.reviewHelpDetail }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">审核</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total / listQuery.size > 1"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchDemads"
    />

    <el-dialog :visible.sync="formVisible" title="审核">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-width="90px">
        <el-form-item label="发起人:">
          <template>{{ temp.owner }}</template>
        </el-form-item>
        <el-form-item label="服务点:">
          <template>{{ temp.pointName }}</template>
        </el-form-item>
        <el-form-item label="需求:">
          <template>{{ temp.detail }}</template>
        </el-form-item>
        <template v-if="temp.status !== -90">
          <el-form-item v-model="temp.status" label="需求审核:" prop="status">
            <el-radio-group v-model="temp.status" size="small">
              <el-radio :label="1" border>通过</el-radio>
              <el-radio :label="-1" border>不通过</el-radio>
              <el-radio :label="0" border>审核中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核说明:" align="left">
            <el-input
              v-model="temp.reviewApplyDetail"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </template>
        <template v-if="temp.helpState !== -2">
          <el-form-item v-model="temp.helpState" label="帮扶审核:" align="left" prop="helpState">
            <el-radio-group v-model="temp.helpState" size="small">
              <el-radio :label="1" border>通过</el-radio>
              <el-radio :label="-1" border>不通过</el-radio>
              <el-radio :label="0" border>审核中</el-radio>
              <el-radio :label="-2" border>清楚申请</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核说明:" align="left">
            <el-input
              v-model="temp.reviewHelpDetail"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </template>
      </el-form>
      <div align="center">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDemands, updateDemands, deleteDemand } from '@/api/demand.js'
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
      formVisible: false,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      temp: {
        createTime: null,
        detail: null,
        did: null,
        helper: null,
        hid: null,
        owner: null,
        pid: null,
        helpState: null,
        pointName: null,
        status: null
      },
      rules: {
        helpState: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
        status: [{ required: true, message: '请选择审核结果', trigger: 'change' }]
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
    },
    handleEdit(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.formVisible = true
      // console.log(this.temp)
    },
    handleDelete(row) {
      this.$confirm('确定删除该需求?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteDemand(row.did).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(() => {
          this.formVisible = false
          // this.$notify({
          //   title: '失败',
          //   message: '删除数据失败，请检查后台状态',
          //   type: 'error',
          //   duration: 2000
          // })
        })
      }).catch(() => { })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDemands(tempData).then(() => {
            for (const v of this.list) {
              if (v.did === this.temp.did) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.formVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 1000
            })
          }).catch(() => {
            this.formVisible = false
            // this.$notify({
            //   title: '失败',
            //   message: '更新数据失败，请检查后端状态',
            //   type: 'error',
            //   duration: 2000
            // })
          })
        }
      })
    }
  }
}
</script>
