<template>
  <div id="users">
    <div class="clearfix">
     <search :searchDatas="searchDatas" @search="searchChange"></search>
    </div>
    <div class="clearfix mt20px">
      <tableList :titles="titles" :showPagination="true" :currentPage="curentPage" @pageChange="pageChange" :pageSize="pageSize" :total="total" :btns="btns" :tableData="tableData" @handleClick="handleClick" operateWidth="200px"></tableList>
    </div>
  </div>
</template>

<script>
import tableList from '../components/tableList.vue'
import search from '../components/search.vue'
export default {
  name: 'users',
  components: {
    tableList,
    search
  },
  data: function () {
    return {
      searchCode: [],
      curentPage: 1,
      pageSize: 10,
      total: 0,
      searchDatas: [{
        type: 'input', // 'input' 输入框，'select' 下拉框，
        placeholder: '请输入手机号/姓名',
        width: '400px'
      }],
      titles: [{
        label: '姓名',
        prop: 'chineseName',
        width: '150px'
      }, {
        label: '手机号',
        prop: 'username',
        width: '150px'
      }, {
        label: '性別',
        prop: 'genderName',
        width: '100px'
      }, {
        label: '身份',
        prop: 'identityName',
        width: '100px'
      }, {
        label: '邮箱',
        prop: 'email',
        width: '200px'
      }, {
        label: '住址',
        prop: 'address'
      }, {
        label: '注册时间',
        prop: 'createTime',
        width: '120px'
      }],
      tableData: [],
      btns: [],
      genderMap: {
        0: '保密',
        1: '男',
        2: '女'
      },
      identityMap: {
        1: '管理员',
        2: '普通用户'
      }
    }
  },
  methods: {
    pageChange (currentPage, pageSize) {
      this.curentPage = currentPage
      this.pageSize = pageSize
      this.getTableData()
    },
    searchChange (models) {
      this.searchCode = models
      this.curentPage = 1
      this.getTableData()
    },
    handleClick (fun, index, data) {
      this[fun](index, data)
    },
    getTableData () {
      const data = {
        query: this.searchCode[0],
        status: this.searchCode[1],
        currentPage: this.curentPage,
        pageSize: this.pageSize
      }
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `/UserInformations/getUsers?access_token=${this.globalData.token}`,
        data
      }).then((response) => {
        if (response.data.code === 0) {
          this.tableData = response.data.result
          this.total = response.data.count || 0
          this.tableData.forEach((item) => {
            item.genderName = this.genderMap[item.gender]
            item.identityName = this.identityMap[item.identity]
            item.createTime = this.formatDate(item.createTime, 'yyyy-MM-dd')
          })
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
        this.hideLoading()
      }).catch((error) => {
        this.hideLoading()
        this.$message({
          type: 'error',
          message: `${error.response.data.error.message || '添加失败'}`
        })
      })
    }
  },
  created () {
    this.getTableData()
  }
}
</script>

<style>
</style>
