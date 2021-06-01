<template>
  <div id="order">
    <div class="clearfix">
      <div class="fl">
        <search :searchDatas="searchDatas" @search="searchChange"></search>
      </div>
    </div>
    <div class="clearfix mt20px">
      <tableList :titles="titles" :showPagination="true" :currentPage="curentPage" @pageChange="pageChange" :pageSize="pageSize" :total="total" :tableData="tableData" :btns="btns" @handleClick="handleClick" operateWidth="300px"></tableList>
    </div>
  </div>
</template>

<script>
import tableList from '../components/tableList.vue'
import search from '../components/search.vue'
export default {
  name: 'order',
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
        placeholder: '请输入服务单号/客户'
      }, {
        type: 'select', // 'input' 输入框，'select' 下拉框，
        placeholder: '状态',
        options: [{
          label: '全部',
          type: null
        }, {
          label: '已取消',
          value: -1
        }, {
          label: '申请中',
          value: 0
        }, {
          label: '已预约',
          value: 1
        }, {
          label: '已完成',
          value: 2
        }]
      }, {
        type: 'date', // 'input' 输入框，'select' 下拉框，
        placeholder: '预约时间'
      }],
      titles: [{
        label: '订单号',
        prop: 'orderNo',
        width: '180px'
      }, {
        label: '服务单号',
        prop: 'themeNo',
        width: '180px'
      }, {
        label: '服务单标题',
        prop: 'themeTitle',
        width: '200px'
      }, {
        label: '客户姓名',
        prop: 'customerName'
      }, {
        label: '手机号',
        prop: 'phone',
        width: '120px'
      }, {
        label: '客户备注',
        prop: 'customerRemarks',
        width: '200px'
      }, {
        label: '状态',
        prop: 'statusName'
      }, {
        label: '预约时间',
        prop: 'appointmentTime',
        width: '150px'
      }],
      tableData: [{}],
      btns: [{
        text: '拒绝预约',
        fun: 'refuse'
      }, {
        text: '订单取消',
        fun: 'refuse'
      }, {
        text: '接受预约',
        type: 'primary',
        fun: 'accept'
      }, {
        text: '订单完成',
        type: 'success',
        fun: 'setComplete'
      }],
      statusMap: {
        '-2': '已取消',
        '-1': '已取消',
        '0': '申请中',
        '1': '进行中',
        '2': '已完成'
      },
      colorMap: {
        '-2': 'cancel',
        '-1': 'cancel',
        '0': 'warning',
        '1': 'warning',
        '2': 'green'
      }
    }
  },
  methods: {
    refuse (index, row) { // 拒绝预约
      this.$prompt('是否取消该订单，可输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.updateStatus(row.id, -1, value)
      }).catch(() => {
      })
    },
    accept (index, row) { // 接受预约
      this.updateStatus(row.id, 1)
    },
    setComplete (index, row) { // 标记预约为 "已完成"
      this.updateStatus(row.id, 2)
    },
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
    remove (index, data) {
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$postData('/Carousels/removeCarousel', {
          token: this.globalData.token,
          id: data.id
        }).then((result) => {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
    },
    async updateStatus (id, status, remarks) { // 更新订单状态
      const result = await this.$postData('/Orders/updateOrder', {
        id,
        status,
        businessRemarks: remarks
      })
      if (result) {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.getTableData()
      }
    },
    async getTableData () {
      const data = {
        query: this.searchCode[0],
        status: this.searchCode[1],
        appointmentTime: this.searchCode[2],
        currentPage: this.curentPage,
        pageSize: this.pageSize
      }
      const result = await this.$postData('/Orders/getOrders', data)
      if (result) {
        this.tableData = result.result
        this.total = result.count || 0
        this.tableData.forEach((item) => {
          item.appointmentTime = this.formatDate(item.appointmentTime, 'yyyy-MM-dd HH:mm')
          item.statusName = this.statusMap[item.status]
          item.style = {
            statusName: this.colorMap[item.status]
          }
          if (item.status === -1 || item.status === -2 || item.status === 2) {
            item.hiddenBtns = ['拒绝预约', '接受预约', '订单完成', '订单取消']
          } else if (item.status === 0) {
            item.hiddenBtns = ['订单完成', '订单取消']
          } else if (item.status === 1) {
            item.hiddenBtns = ['拒绝预约', '接受预约']
          }
        })
      }
    }
  },
  created () {
    this.getTableData()
  }
}
</script>

<style>
</style>
