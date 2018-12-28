<template>
  <div class="app-container" align="center">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="发起人" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.owner }}
        </template>
      </el-table-column>
      <el-table-column label="服务点" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pointName }}
        </template>
      </el-table-column>
      <el-table-column label="需求详情">
        <template slot-scope="scope">
          {{ scope.row.detail }}
        </template>
      </el-table-column>
      <el-table-column label="需求审核" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0"
            :type="scope.row.status | statusColorFilter"
            size="small"
            @click="handleStateEdit(scope.row)">{{ scope.row.status | statusNameFilter }}</el-button>
          <el-tag
            v-else
            :type="scope.row.status | statusColorFilter"
            size="small">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="需求审核说明" width="110" align="left">
        <template slot-scope="scope">
          {{ scope.row.reviewApplyDetail }}
        </template>
      </el-table-column>
      <el-table-column label="帮扶人" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.helper }}
        </template>
      </el-table-column>
      <el-table-column label="申请详情">
        <template slot-scope="scope">
          {{ scope.row.helpDetail }}
        </template>
      </el-table-column>
      <el-table-column label="帮扶审核" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.helpState === 0"
            :type="scope.row.helpState | statusColorFilter"
            size="small"
            @click="handleHelpStateEdit(scope.row)">{{ scope.row.helpState | statusNameFilter }}</el-button>
          <el-tag
            v-else
            :type="scope.row.helpState | statusColorFilter"
            size="small">{{ scope.row.helpState | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="帮扶审核说明" width="110" align="left">
        <template slot-scope="scope">
          {{ scope.row.reviewHelpDetail }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchDemads"/>
    <el-dialog :visible.sync="dialogApplyFormVisible" title="需求审核" width="500px">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left:20px;">
        <el-form-item v-model="temp.status" label="审核操作：" align="left">
          <el-radio-group v-model="temp.status" size="small">
            <el-radio :label="1" border> 通过 </el-radio>
            <el-radio :label="-1" border> 不通过 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明" align="left">
          <el-input v-model="temp.reviewApplyDetail"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogApplyFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogHelperFormVisible" title="需求审核" width="500px">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left:20px;">
        <el-form-item v-model="temp.helpState" label="审核操作：" align="left">
          <el-radio-group v-model="temp.helpState" size="small">
            <el-radio :label="1" border> 通过 </el-radio>
            <el-radio :label="-1" border> 不通过 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明" align="left">
          <el-input v-model="temp.reviewHelpDetail"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHelperFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDemands } from '@/api/demand.js'
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
      dialogHelperFormVisible: false,
      dialogApplyFormVisible: false,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      temp: {
        createTime: null,
        detail: null,
        did: null,
        helper: null,
        hid: null,
        owner: null,
        pid: null,
        pointName: null,
        status: null
      },
      rules: {
        type: [{ required: true, message: "请选择审核结果' is required", trigger: 'change' }]
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
    handleStateEdit(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogApplyFormVisible = true
      // console.log(this.temp)
    },
    handleHelpStateEdit(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogHelperFormVisible = true
      // console.log(this.temp)
    },
    handleDelete(row) {
      console.log('删除')
    }
  }
}
</script>
