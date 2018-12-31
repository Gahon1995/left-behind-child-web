<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      label-width="120px"
      style="width: 600px"
    >
      <div class="createPost-main-container">
        <el-form-item label="服务点名称: " style="width: 400px" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="城市选择: " prop="city">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            size="large"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="详细地址: " prop="address">
          <el-input v-model="postForm.address" maxlength="18" placeholder="请输入地址"/>
        </el-form-item>
        <el-form-item label="服务点描述: " prop="describe">
          <el-input
            v-model="postForm.describe"
            :autosize="{ minRows: 3, maxRows: 5}"
            type="textarea"
            placeholder="请输入地址"
          />
        </el-form-item>
        <div align="center" style="margin-top: 20px">
          <router-link :to="'/user/points'">
            <el-button type="primary" style="margin-right: 20px">取消</el-button>
          </router-link>
          <el-button v-loading="loading" type="success" @click="submitForm">申请</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { getOnePoint, updatePoint } from '@/api/user/point'
import store from '@/store'
const defaultForm = {
  pid: null,
  uid: null,
  title: '',
  province: '',
  city: '',
  district: '',
  address: '',
  lat: -1,
  lng: -1,
  describe: '',
  state: 0,
  detail: '',
  createTime: null
}
export default {
  name: 'PointDetail',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: regionData,
      selectedOptions: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      tempRoute: {},
      user: {},
      rules: {
        title: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        describe: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const pid = this.$route.params && this.$route.params.id
      this.fetchData(pid)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.uid = store.getters.user.uid
      console.log(store.getters.user)
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(pid) {
      getOnePoint(pid)
        .then(response => {
          this.postForm = response.data
          const code1 = TextToCode[this.postForm.province + ''].code
          const code2 =
            TextToCode[this.postForm.province + ''][this.postForm.city + '']
              .code
          const code3 =
            TextToCode[this.postForm.province + ''][this.postForm.city + ''][
              this.postForm.district + ''
            ].code
          console.log(this.postForm.city)
          console.log(code2)
          this.selectedOptions = [code1, code2, code3]
          console.log(this.selectedOptions)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange(value) {
      // postForm.province = value
      console.log(value)
      this.postForm.province = CodeToText[value[0]]
      this.postForm.city = CodeToText[value[1]]
      this.postForm.district = CodeToText[value[2]]
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.postForm)
          this.loading = true
          updatePoint(tempData)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '成功发起申请',
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/user/points' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              // this.$notify({
              //   title: '失败',
              //   message: '更新数据失败，请检查后端状态',
              //   type: 'error',
              //   duration: 2000
              // })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.state === -1) {
        return 'warning-row'
      } else if (row.state === 1) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.el-form-item {
  margin-bottom: 20px;
}
</style>
