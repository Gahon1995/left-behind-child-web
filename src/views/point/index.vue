<template>
  <div class="app-container" align="center">
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'id', order: 'enscending'}"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50" sortable prop="id">
        <template slot-scope="scope">{{ scope.row.pid }}</template>
      </el-table-column>
      <el-table-column label="服务点名称" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="负责人" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.province }}</template>
      </el-table-column>
      <el-table-column label="市" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.province }}</template>
      </el-table-column>
      <el-table-column label="区" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.district }}</template>
      </el-table-column>
      <el-table-column label="详细地址" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column label="经度" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.lat }}</template>
      </el-table-column>
      <el-table-column label="纬度" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.lng }}</template>
      </el-table-column>
      <el-table-column label="服务点描述" align="center">
        <template slot-scope="scope">{{ scope.row.describe }}</template>
      </el-table-column>
      <el-table-column
        :filters="[{ text: '通过', value: 1 }, { text: '正在审核', value: 0 }, { text: '不通过', value: -1 }]"
        :filter-method="filterTag"
        prop="state"
        class-name="status-col"
        label="审核状态"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state | statusColorFilter"
          >{{ scope.row.state | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核说明" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.detail }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
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
      @pagination="fetchData"
    />

    <el-dialog :visible.sync="formVisible" title="审核" width="600px">
      <el-form ref="dataForm" :model="temp" align="left" label-width="90px">
        <el-form-item v-model="temp.state" label="结果:" prop="state">
          <el-radio-group v-model="temp.state" size="small">
            <el-radio :label="1" border>通过</el-radio>
            <el-radio :label="-1" border>不通过</el-radio>
            <el-radio :label="0" border>审核中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明:">
          <el-input
            v-model="temp.detail"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPoints, updatePoint, deletePoint } from '@/api/point'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'gray',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        '1': '通过',
        '0': '正在审核',
        '-1': '失败'
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
        pid: null,
        uid: null,
        title: null,
        province: null,
        city: null,
        district: null,
        address: null,
        lat: null,
        lng: null,
        describe: null,
        state: null,
        detail: null,
        createTime: null,
        username: null
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPoints(this.listQuery).then(response => {
        console.log('getpoints')
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    filterTag(value, row) {
      return row.state === value
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
        deletePoint(row.pid).then(() => {
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
          updatePoint(tempData).then(() => {
            for (const v of this.list) {
              if (v.pid === this.temp.pid) {
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
