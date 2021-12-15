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
      <tableList :titles="titles" :showAll="true" :showPagination="true" :currentPage="curentPage" operateBtnAlign="center" @pageChange="pageChange" :pageSize="pageSize" :total="total" :tableData="tableData" :btns="btns" @handleClick="handleClick" operateWidth="450px"></tableList>
    </div>
    <!-- 新增/编辑（主题、服务单） -->
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="800px">
      <el-form v-if="dialogVisible" ref="form" :model="themeInfo" label-width="80px">
        <el-form-item label="*图片">
          <el-upload class="upload-demo" action="" :on-change="selectFile" :file-list="fileList" :auto-upload="false" :on-remove="handleRemove" list-type="picture">
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
              <el-select class="w100" v-model="themeInfo.series" placeholder="请选择系列">
                <el-option v-for="item in seriesList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="*类型">
              <el-select class="w100" v-model="themeInfo.type" placeholder="请选择类型">
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
        <el-form-item label="拍摄地点">
          <el-row class="margin0px" :gutter="10">
            <el-col :span="24">
              <el-input v-model="keyword" @focus="showSearch = true" @blur="showSearch = false" placeholder="请输入关键字检索"></el-input>
            </el-col>
            <el-col :span="24">
              <baidu-map class="mapView mt20px" scroll-wheel-zoom :center="center" :zoom="15" @click="submitPosition">
                <bm-local-search :autoViewport="true" v-if="showSearch && keyword" class="localSearchView" :keyword="keyword" :pageCapacity="5" :forceLocal="true" :auto-viewport="false" :location="center"></bm-local-search>
                <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
                <bm-marker v-if="themeInfo && themeInfo.longitude" :position="{lng: themeInfo.longitude, lat: themeInfo.latitude}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
              </baidu-map>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false" placeholder="请输入联系电话">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm()">{{dialogTitle === '添加服务单' ? '确 定' : '保 存'}}</el-button>
      </span>
    </el-dialog>
    <!-- 消息推送历史 -->
    <el-dialog title="推送历史" :close-on-click-modal="false" :visible.sync="historyDialogVisible" width="600px">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in messageList" :key="index" :timestamp="formatDate(activity.createTime)">
          <div class="fz12px" style="color: #888;">{{activity.chineseName}}</div>
          <div class="mt5px">{{activity.content}}</div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 用户评价 -->
    <el-dialog title="用户评价" :close-on-click-modal="false" :visible.sync="evaluateDialogVisible" width="700px">
      <div v-if="evaluateDialogVisible" class="evalueteBox">
        <el-empty description="暂无用户评价" v-if="!isLoading && evalueteList.length === 0"></el-empty>
        <div class="mb20px" v-if="evaluayeStatisticsInfo && evalueteList.length > 0">
          <el-tag type="success">好评（{{evaluayeStatisticsInfo.good}}）</el-tag>
          <el-tag type="warning">中评（{{evaluayeStatisticsInfo.middle}}）</el-tag>
          <el-tag type="danger">差评（{{evaluayeStatisticsInfo.bad}}）</el-tag>
        </div>
        <el-tabs v-if="evalueteList.length > 0" v-model="activeName" type="card">
          <el-tab-pane label="全部评价" name="first">
            <ul class="evaluateList">
              <li class="evalueteItem" v-for="(item, index) in evalueteList" :key="item.id">
                <el-row>
                  <el-col :span="4">
                    <el-avatar :size="70" :src="item.avatar ? `${baseURL}${item.avatar}` : defaultAvatar"></el-avatar>
                  </el-col>
                  <el-col :span="20">
                    <div class="userName clearfix">
                      <strong>{{item.chineseName}}</strong>
                      <span :class="[evalueteTypeColorMap[item.evalueteType]]" class="fz14px fr mr20px">{{evalueteTypeMap[item.evalueteType]}}</span>
                    </div>
                    <div class="invalidColor fz14px mt5px">{{formatDate(item.createTime)}}{{item.type == 2 ? '追评' : '评价'}}</div>
                    <div class="mt5px">
                      <div class="clearfix">
                        <div class="fl fz14px">描述相符：</div>
                        <div class="fl">
                          <el-rate disabled v-model="item.accordLevel"></el-rate>
                        </div>
                      </div>
                      <div class="clearfix">
                        <div class="fl fz14px">拍摄质量：</div>
                        <div class="fl">
                          <el-rate disabled v-model="item.qualityLevel"></el-rate>
                        </div>
                      </div>
                      <div class="clearfix">
                        <div class="fl fz14px">服务态度：</div>
                        <div class="fl">
                          <el-rate disabled v-model="item.attitudeLevel"></el-rate>
                        </div>
                      </div>
                    </div>
                    <div class="mt5px" v-if="item.imgs.length > 0">
                      <el-image class="mr10px" v-loading="!img.loadComplete" :preview-src-list="getSrcList(item.imgs)" @error="loadFail(img)" @load="loadSuccess(img)" v-for="(img, j) in item.imgs" :key="j" style="width: 100px; height: 100px" :src="`${baseURL}${img.path}`" fit="cover"></el-image>
                    </div>
                    <div :class="[!item.remark ? 'invalidColor' : '', 'mt10px']">{{item.remark || '这家伙很懒，什么也没有留下！'}}</div>
                  </el-col>
                </el-row>
                <div class="dividerLine" v-if="index < evalueteList.length - 1"></div>
              </li>
            </ul>
            <p class="loadMore" v-if="!isLoading && evaluateCurrentPage < evaluateTotalPage" @click="loadNextPage()">加载更多</p>
            <p v-if="isLoading" class="mt20px text-center">加载中...</p>
            <el-divider v-if="!isLoading && evaluateCurrentPage === evaluateTotalPage">
              <span class="invalidColor">到底了</span>
            </el-divider>
          </el-tab-pane>
        </el-tabs>
      </div>
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
  data: function() {
    return {
      activeName: 'first',
      evalueteTypeMap: {
        1: '好评',
        2: '中评',
        3: '差评'
      },
      evalueteTypeColorMap: {
        1: 'successColor',
        2: 'warnColor',
        3: 'failColor'
      },
      evaluayeStatisticsInfo: null,
      showSearch: false,
      historyDialogVisible: false,
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
          label: '街拍',
          value: '1'
        }, {
          label: '写真',
          value: '2'
        }, {
          label: '棚拍',
          value: '3'
        }, {
          label: '婚庆',
          value: '4'
        }]
      }, {
        type: 'select', // 'input' 输入框，'select' 下拉框，
        placeholder: '请选择',
        options: [{
          label: '全部',
          value: null
        }, {
          label: '校园主题',
          value: '1'
        }, {
          label: '海景主题',
          value: '2'
        }, {
          label: '纪念主题',
          value: '3'
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
        label: '街拍',
        value: '1'
      }, {
        label: '写真',
        value: '2'
      }, {
        label: '棚拍',
        value: '3'
      }, {
        label: '婚庆',
        value: '4'
      }],
      typeList: [{
        label: '校园主题',
        value: '1'
      }, {
        label: '海景主题',
        value: '2'
      }, {
        label: '纪念主题',
        value: '3'
      }],
      fileList: [],
      themeInfo: null,
      dialogTitle: null,
      dialogVisible: false,
      seriesMap: { // 系列匹配
        '1': '街拍',
        '2': '写真',
        '3': '棚拍',
        '4': '婚庆'
      },
      typeMap: { // 系列匹配
        '1': '校园主题',
        '2': '海景主题',
        '3': '纪念主题'
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
        width: '200px',
        align: 'left'
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
        text: '推荐',
        type: 'primary',
        fun: 'setRecommend'
      }, {
        text: '消息推送',
        type: 'primary',
        fun: 'sendMsg'
      }, {
        text: '编辑',
        type: 'primary',
        fun: 'edit'
      }, {
        text: '删除',
        type: 'danger',
        fun: 'remove'
      }, {
        text: '撤回',
        fun: 'cancelRecommend'
      }, {
        text: '记录',
        fun: 'getSendHistory'
      }, {
        text: '评价',
        fun: 'openEvaluateDialog'
      }],
      messageList: [], // 消息推送历史
      center: {
        lng: 109.394097,
        lat: 24.314923
      },
      keyword: null,
      evalueteList: [], // 用户评价列表
      evaluateTotalPage: 0, // 评价总页数
      evaluateCurrentPage: 1, // 用户评价当前页
      currentThemeId: null,
      evaluateDialogVisible: false,
      isLoading: false,
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  methods: {
    async getEvaluayeStatistics() { // 获取评价统计
      const result = await this.$postData('/Evaluates/getEvaluateStatisticsByThemeId', {
        themeId: this.currentThemeId
      })
      if (result) {
        this.evaluayeStatisticsInfo = result.data
      } else {
        this.evaluayeStatisticsInfo = null
      }
    },
    getSrcList(imgs) { // 获取大图列表
      if (!imgs) {
        return
      }
      return imgs.reduce((total, item) => {
        total.push(`${this.baseURL}${item.path}`)
        return total
      }, [])
    },
    loadFail(img) {
      img.loadComplete = true
      this.$forceUpdate()
    },
    loadSuccess(img) {
      img.loadComplete = true
      this.$forceUpdate()
    },
    openEvaluateDialog(index, row) {
      this.currentThemeId = row.id
      this.evaluateCurrentPage = 1
      this.evalueteList = []
      this.evaluateDialogVisible = true
      this.getEvaluayeStatistics()
      this.getEvaluateData()
    },
    loadNextPage() { // 加载下一页 "用户评价"
      if (this.isLoading || this.evaluateCurrentPage >= this.evaluateTotalPage) {
        return
      }
      this.evaluateCurrentPage += 1
      this.getEvaluateData()
    },
    async getEvaluateData() { // 获取 "用户评价列表"
      this.isLoading = true
      const result = await this.$postData('/Evaluates/getEvaluateByThemeId', {
        currentPage: this.evaluateCurrentPage,
        pageSize: 5,
        themeId: this.currentThemeId
      }, false, true)
      if (result) {
        this.evaluateTotalPage = result.totalPage
        this.evalueteList = [...this.evalueteList, ...result.data]
      }
      this.isLoading = false
    },
    submitPosition(e) { // 提交位置
      this.themeInfo.longitude = e.point.lng
      this.themeInfo.latitude = e.point.lat
      this.$forceUpdate()
    },
    async getSendHistory(index, row) { // 获取消息推送记录
      const result = await this.$postData('/Messages/getMessageByTheme', {
        themeId: row.id
      })
      if (result) {
        this.messageList = result.data
        if (!this.messageList || this.messageList.length === 0) {
          this.$message({
            type: 'warning',
            message: '暂无推送历史'
          })
          return
        }
        this.historyDialogVisible = true
      }
    },
    sendMsg(index, row) { // 消息推送
      this.$prompt('请输入消息内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({
          value
        }) => {
          const data = {
            themeId: row.id,
            remarks: value
          }
          this.$postData('/Messages/sendMessage', data)
            .then((result) => {
              if (result) {
                this.$message({
                  type: 'success',
                  message: '消息已推送'
                })
              }
            })
        })
        .catch(() => {})
    },
    setRecommend(index, row) { // 设为 "今日推荐"
      this.updateRecommend(row.id, true)
    },
    cancelRecommend(index, row) { // 取消 "今日推荐"
      this.updateRecommend(row.id, false)
    },
    updateRecommend(id, status) { // 更新 "今日推荐" 状态
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `/Themes/updateRecommend?access_token=${this.globalData.token}`,
        data: {
          id,
          isRecommend: status
        }
      })
        .then((response) => {
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
        })
        .catch(() => {
          this.hideLoading()
        })
    },
    pageChange(currentPage, pageSize) {
      this.curentPage = currentPage
      this.pageSize = pageSize
      this.getTableData()
    },
    searchChange(models) {
      this.searchCode = models
      this.curentPage = 1
      this.getTableData()
    },
    handleClick(fun, index, data) {
      this[fun](index, data)
    },
    remove(index, data) {
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
    handleRemove(file) {
      if (!file.raw) {
        // "已上传" 的文件，需要调用借口删除
        this.$axios({
          method: 'delete',
          url: `/Containers/${this.themeInfo.id}/files/${file.name}`
        })
      }
    },
    selectFile(file, fileList) {
      this.fileList = fileList
    },
    edit(index, data) {
      this.center = data.longitude ? {
        lng: data.longitude,
        lat: data.latitude
      } : {
        lng: 109.394097,
        lat: 24.314923
      }
      this.dialogTitle = '编辑主题/服务单'
      this.dialogVisible = true
      this.themeInfo = JSON.parse(JSON.stringify(data))
      this.fileList = data.files.reduce((total, item) => {
        total.push({
          name: item.filename,
          url: `${this.baseURL}${item.path}`
        })
        return total
      }, [])
    },
    addNewCarousel() {
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
    async confirm() { // 添加/修改服务单
      const url = this.dialogTitle === '添加服务单' ? '/Themes/addTheme' : '/Themes/updateTheme'
      let msg = null
      if (!this.fileList || this.fileList.length === 0) {
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
      const result = await this.$postData(url, this.themeInfo)
      if (result) {
        this.$message({
          type: 'success',
          message: this.dialogTitle === '添加服务单' ? '添加成功' : '保存成功'
        })
        this.dialogVisible = false
      }
      // 成功后，单独上传文件
      await this.uploadFile(result.data.id, this.fileList.reduce((total, item) => {
        if (item.raw) {
          total.push(item.raw)
        }
        return total
      }, []))
      this.getTableData()
    },
    getTableData() {
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
      })
        .then((response) => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.total = response.data.count || 0
            this.tableData.forEach((item) => {
              item.seriesName = this.seriesMap[item.series]
              item.typeName = this.typeMap[item.type]
              item.showPrice = `￥${item.price.toFixed(2)}`
              item.createTime = this.formatDate(item.createTime, 'yyyy-MM-dd')
              item.hiddenBtns = item.isRecommend ? ['推荐'] : ['撤回']
              item.path = item.files[0] ? item.files[0].path : null
            })
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
          this.hideLoading()
        })
        .catch((error) => {
          this.hideLoading()
          this.$message({
            type: 'error',
            message: `${error.response.data.error.message || '添加失败'}`
          })
        })
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style scoped>
  .mapView {
    width: 100%;
    height: 400px;
  }

  .evalueteBox {
    height: 400px;
    overflow: auto;
  }

  .dividerLine {
    border-bottom: 1px dashed #ccc;
    margin: 10px 0;
  }

  .userName {
    font-size: 16px;
    line-height: 25px;
  }

  .loadMore {
    margin: 20px 0;
    text-align: center;
    color: #008BFF;
    font-size: 14px;
    cursor: pointer;
  }
</style>

<style>
  #theme .el-avatar {
    display: block;
  }
</style>
