<template>
  <div style="position: relative;top: 100px;left:130px;">
    <el-row>
      <!--就改这里一行-->
      <el-col
        v-for="(project,index) in allprojects"
        :span="12"
        :key="index"
        style="margin-bottom:40px"
      >
        <el-card
          :body-style="{ padding: '0px', height:'360px'}"
          shadow="hover"
          style="width: 260px;height: 320px;"
        >
          <div style="padding: 6px;height: 310px;">
            <div>
              <div>
                <font size="5">{{ project.pcname }}</font>
              </div>
              <div style="position: relative;top: 15px;text-align: center;">{{ project.pname }}</div>
            </div>
            <div style="position: relative;top: 30px;">
              <!-- <img src="../images/project/prohead.jpg" class="image"> -->
              <div style="position: relative;top: 10px;left: 66px;">
                <i class="el-icon-time"/>
                {{ project.pdatesave }}
              </div>
            </div>
            <div style="position: relative;top: 45px;">
              &nbsp;&nbsp;
              <i class="el-icon-view"/>
              <span>{{ project.ppageview }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button type="text">
                <font size="4">查看</font>
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      allprojects: [
        {
          pid: '123',
          pname: 'pname',
          pcname: 'pcname',
          pdatesave: '2018-4-9 11:11:11',
          ppageview: 10
        },
        {
          pid: '123',
          pname: 'pname',
          pcname: 'pcname',
          pdatesave: '2018-4-9 11:11:11',
          ppageview: 10
        },
        {
          pid: '123',
          pname: 'pname',
          pcname: 'pcname',
          pdatesave: '2018-4-9 11:11:11',
          ppageview: 10
        },
        {
          pid: '123',
          pname: 'pname',
          pcname: 'pcname',
          pdatesave: '2018-4-9 11:11:11',
          ppageview: 10
        },
        {
          pid: '123',
          pname: 'pname',
          pcname: 'pcname',
          pdatesave: '2018-4-9 11:11:11',
          ppageview: 10
        },
        {
          pid: '123',
          pname: 'pname',
          pcname: 'pcname',
          pdatesave: '2018-4-9 11:11:11',
          ppageview: 10
        }
      ]
    }
  }
}
</script>
