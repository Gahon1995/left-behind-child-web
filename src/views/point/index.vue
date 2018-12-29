<template>
  <div class="app-container" align="center">
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort = "{prop: 'id', order: 'enscending'}"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="50" sortable prop="id">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column label="服务点名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.province }}
        </template>
      </el-table-column>
      <el-table-column label="市" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.province }}
        </template>
      </el-table-column>
      <el-table-column label="区" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column label="详细地址" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="经度" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.lat }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.lng }}
        </template>
      </el-table-column>
      <el-table-column label="服务点描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.describe }}
        </template>
      </el-table-column>
      <el-table-column
        :filters="[{ text: '通过', value: 1 }, { text: '正在审核', value: 0 }, { text: '失败', value: -1 }]"
        :filter-method="filterTag"
        prop="state"
        class-name="status-col"
        label="审核状态"
        width="110"
        align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusColorFilter">{{ scope.row.state | statusNameFilter }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核说明" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.detail }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-pagination
    layout="prev, pager, next"
    :total="total"
    :size="listQuery.size">
    </el-pagination> -->
    <pagination v-show="total / listQuery.size > 1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getPoints } from '@/api/point'
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
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        importance: undefined,
        title: undefined,
        type: undefined
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
    }
  }
}
</script>
