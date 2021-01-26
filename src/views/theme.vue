<template>
  <div id="theme">
    <div class="clearfix">
      <div class="fl">
        <search :searchDatas="searchDatas" :searchCode="searchCode" @search="searchChange"></search>
      </div>
      <div class="fr">
        <el-button type="primary" @click="addNewCarousel()">添加</el-button>
      </div>
    </div>
    <div class="clearfix mt20px">
      <tableList :titles="titles" :showPagination="true" :currentPage="curentPage" @pageChange="pageChange" :pageSize="pageSize" :total="total" :tableData="tableData" :btns="btns" @handleClick="handleClick" operateWidth="250px"></tableList>
    </div>
    <!-- 新增/编辑（主题、服务单） -->
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="600px">
      <el-form v-if="dialogVisible" ref="form" :model="themeInfo" label-width="80px">
        <el-form-item label="*图片">
          <el-upload class="upload-demo" action="" :on-change="selectFile" :file-list="fileList" :limit="1"
            :auto-upload="false" :on-remove="handleRemove" list-type="picture">
            <el-button size="small" type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="*标题">
          <el-input v-model="themeInfo.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="*副标题">
          <el-input v-model="themeInfo.description" placeholder="请输入副标题"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格">
              <el-input-number class="w100" v-model="themeInfo.price" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="*名额">
              <el-input-number class="w100" v-model="themeInfo.total" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="*系列">
              <el-select v-model="themeInfo.series" placeholder="请选择">
                <el-option v-for="item in seriesList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="*类型">
              <el-select v-model="themeInfo.type" placeholder="请选择">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详情">
          <el-input type="textarea" placeholder="服务单详情" :autosize="{minRows: 3}" v-model="themeInfo.detail"></el-input>
        </el-form-item>
        <el-form-item label="*联系电话">
          <el-input v-model="themeInfo.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false" placeholder="请输入联系电话">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm()">{{dialogTitle === '添加服务单' ? '确 定' : '保 存'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableList from '../components/tableList.vue'
import search from '../components/search.vue'
export default {
  name: 'theme',
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
        placeholder: '请输入标题'
      }, {
        type: 'select', // 'input' 输入框，'select' 下拉框，
        placeholder: '请选择',
        options: [{
          label: '全部',
          value: null
        }, {
          label: '礼服',
          value: 1
        }, {
          label: '妆容',
          value: 2
        }, {
          label: '摄影',
          value: 3
        }]
      }, {
        type: 'select', // 'input' 输入框，'select' 下拉框，
        placeholder: '请选择',
        options: [{
          label: '全部',
          value: null
        }, {
          label: '主题拍摄',
          value: 1
        }, {
          label: '婚纱定制',
          value: 2
        }, {
          label: '婚礼定制',
          value: 3
        }]
      }, {
        type: 'select', // 'input' 输入框，'select' 下拉框，
        placeholder: '请选择',
        options: [{
          label: '全部',
          value: null
        }, {
          label: '今日推荐',
          value: true
        }]
      }],
      seriesList: [{
        label: '礼服',
        value: '1'
      }, {
        label: '妆容',
        value: '2'
      }, {
        label: '摄影',
        value: '3'
      }],
      typeList: [{
        label: '主题拍摄',
        value: '1'
      }, {
        label: '婚纱定制',
        value: '2'
      }, {
        label: '婚礼定制',
        value: '3'
      }],
      fileList: [],
      themeInfo: null,
      dialogTitle: null,
      dialogVisible: false,
      seriesMap: { // 系列匹配
        '1': '礼服',
        '2': '妆容',
        '3': '摄影'
      },
      typeMap: { // 系列匹配
        '1': '主题拍摄',
        '2': '婚纱定制',
        '3': '婚礼定制'
      },
      titles: [{
        label: '图片',
        type: 'image',
        prop: 'path',
        width: '100px'
      }, {
        label: '单号',
        prop: 'themeNo',
        width: '180px'
      }, {
        label: '标题',
        prop: 'title',
        width: '200px'
      }, {
        label: '价格',
        prop: 'showPrice',
        width: '100px'
      }, {
        label: '已预订',
        prop: 'num',
        width: '80px'
      }, {
        label: '名额',
        prop: 'total'
      }, {
        label: '系列',
        prop: 'seriesName'
      }, {
        label: '类型',
        prop: 'typeName'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: '110px'
      }],
      tableData: [],
      btns: [{
        text: '今日推荐',
        type: 'primary',
        fun: 'setRecommend'
      }, {
        text: '取消推荐',
        fun: 'cancelRecommend'
      }, {
        text: '编辑',
        type: 'primary',
        fun: 'edit'
      }, {
        text: '删除',
        type: 'danger',
        fun: 'remove'
      }]
    }
  },
  methods: {
    setRecommend (index, row) { // 设为 "今日推荐"
      this.updateRecommend(row.id, true)
    },
    cancelRecommend (index, row) { // 取消 "今日推荐"
      this.updateRecommend(row.id, false)
    },
    updateRecommend (id, status) { // 更新 "今日推荐" 状态
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `/Themes/updateRecommend?access_token=${this.globalData.token}`,
        data: {
          id,
          isRecommend: status
        }
      }).then((response) => {
        if (response.data.code === 0) {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.getTableData()
        } else {
          this.$message({
            type: 'error',
            message: response.data.sg
          })
        }
        this.hideLoading()
      }).catch(() => {
        this.hideLoading()
      })
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
        this.$axios({
          method: 'post',
          url: `/Themes/removeTheme?access_token=${this.globalData.token}`,
          data: {
            token: this.globalData.token,
            id: data.id
          }
        }).then((response) => {
          if (response.data.code === 0) {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        }).catch(() => {
          this.hideLoading()
        })
      })
    },
    handleRemove () {
      this.themeInfo.file = null
    },
    selectFile (file, fileList) {
      this.themeInfo.file = file.raw
    },
    edit (index, data) {
      this.dialogTitle = '编辑主题/服务单'
      this.dialogVisible = true
      this.themeInfo = JSON.parse(JSON.stringify(data))
      this.fileList = [{
        name: data.filename,
        url: `${this.baseURL}${data.path}`
      }]
    },
    addNewCarousel () {
      this.fileList = []
      this.themeInfo = {
        series: null, // 系列：1（礼服）；2（妆容）；3（摄影）
        type: null, // 类型：1（主题拍摄）；2（婚纱定制）；3（婚礼定制）
        title: null, // 标题
        phone: null, // 手机号
        description: null, // 副标题
        detail: null, // 详情
        file: null, // 图片
        price: null, // 价格
        total: null // 名额
      }
      this.dialogTitle = '添加服务单'
      this.dialogVisible = true
    },
    confirm () { // 添加/修改服务单
      const url = this.dialogTitle === '添加服务单' ? '/Themes/addTheme' : '/Themes/updateTheme'
      let msg = null
      if (this.dialogTitle === '添加服务单' && !this.themeInfo.file) {
        msg = '请选择图片'
      } else if (!this.themeInfo.title) {
        msg = '请输入标题'
      } else if (!this.themeInfo.description) {
        msg = '请输入副标题'
      } else if (!this.themeInfo.total) {
        msg = '请输入名额'
      } else if (!this.themeInfo.series) {
        msg = '请选择系列'
      } else if (!this.themeInfo.type) {
        msg = '请选择类型'
      } else if (!this.themeInfo.phone) {
        msg = '请输入联系电话'
      }
      if (msg) {
        this.$message({
          type: 'warning',
          message: msg
        })
        return
      }
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `${url}?access_token=${this.globalData.token}`,
        data: this.formatFormData(this.themeInfo)
      }).then((response) => {
        if (response.data.code === 0) {
          this.$message({
            type: 'success',
            message: this.dialogTitle === '添加服务单' ? '添加成功' : '保存成功'
          })
          this.getTableData()
          this.dialogVisible = false
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
    },
    getTableData () {
      const data = {
        query: this.searchCode[0],
        series: this.searchCode[1],
        type: this.searchCode[2],
        isRecommend: this.searchCode[3],
        currentPage: this.curentPage,
        pageSize: this.pageSize
      }
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `/Themes/getThemes?access_token=${this.globalData.token}`,
        data
      }).then((response) => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          this.total = response.data.count || 0
          this.tableData.forEach((item) => {
            item.seriesName = this.seriesMap[item.series]
            item.typeName = this.typeMap[item.type]
            item.showPrice = `￥${item.price.toFixed(2)}`
            item.createTime = this.formatDate(item.createTime, 'yyyy-MM-dd')
            item.hiddenBtns = item.isRecommend ? ['今日推荐'] : ['取消推荐']
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
