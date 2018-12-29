<template>
  <div class="app-container" align="center">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      style="width: 870px"
      highlight-current-row>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">
          <p v-if = "scope.row.sex" > 男 </p>
          <p v-else > 女 </p>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="邮件" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="200" label="注册时间">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.registerDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total / listQuery.size > 1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchUsers" />

  </div>
</template>

<script>
import { getUsers } from '@/api/user.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
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
        size: 10
      }
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
