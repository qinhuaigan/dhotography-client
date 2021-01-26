<template>
  <div id="carousel">
    <el-tabs v-model="carouselType" type="card" @tab-click="getTableData()">
      <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabs" :key="item.value"></el-tab-pane>
    </el-tabs>
    <div class="clearfix">
      <div class="fl"><el-button type="primary" @click="addNewCarousel()">添加</el-button></div>
    </div>
    <div class="clearfix mt20px"><tableList :titles="titles" :tableData="tableData" :btns="btns" @handleClick="handleClick" operateWidth="150px"></tableList></div>
    <!-- 新增/编辑（轮播图） -->
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="600px">
      <el-form v-if="dialogVisible" ref="form" :model="carouselInfo" label-width="80px">
        <el-form-item label="图片">
          <el-upload class="upload-demo" action="" :on-change="selectFile" :file-list="fileList" :limit="1" :auto-upload="false" :on-remove="handleRemove" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题"><el-input v-model="carouselInfo.title"></el-input></el-form-item>
        <el-form-item label="描述"><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="carouselInfo.description"></el-input></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="carouselInfo.sort" :min="0"></el-input-number></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm()">{{ dialogTitle === ' 添加轮播图' ? '确 定' : '保 存' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableList from '../components/tableList.vue'
export default {
  name: 'carousel',
  components: {
    tableList
  },
  data: function () {
    return {
      carouselType: '1',
      tabs: [
        {
          label: '轮播图',
          value: '1'
        },
        {
          label: '环境展示',
          value: '2'
        }
      ],
      fileList: [],
      carouselInfo: null,
      dialogTitle: null,
      dialogVisible: false,
      titles: [
        {
          label: '图片',
          type: 'image',
          prop: 'path'
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '排序',
          prop: 'sort'
        }
      ],
      tableData: [],
      btns: [
        {
          text: '编辑',
          type: 'primary',
          fun: 'edit'
        },
        {
          text: '删除',
          type: 'danger',
          fun: 'remove'
        }
      ]
    }
  },
  methods: {
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
          url: `/Carousels/removeCarousel?access_token=${this.globalData.token}`,
          data: {
            token: this.globalData.token,
            id: data.id
          }
        })
          .then(response => {
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
          })
          .catch(() => {
            this.hideLoading()
          })
      })
    },
    handleRemove () {
      this.carouselInfo.file = null
    },
    selectFile (file, fileList) {
      this.carouselInfo.file = file.raw
    },
    edit (index, data) {
      this.dialogTitle = '编辑轮播图'
      this.dialogVisible = true
      this.carouselInfo = JSON.parse(JSON.stringify(data))
      this.fileList = [
        {
          name: data.filename,
          url: `${this.baseURL}${data.path}`
        }
      ]
    },
    addNewCarousel () {
      this.fileList = []
      this.carouselInfo = {
        title: null,
        description: null,
        sort: 0,
        file: null
      }
      this.dialogTitle = '添加轮播图'
      this.dialogVisible = true
    },
    confirm () {
      // 添加/修改轮播图
      const url = this.dialogTitle === '添加轮播图' ? '/Carousels/addCarousel' : '/Carousels/updateCarousel'
      if (this.dialogTitle === '添加轮播图' && !this.carouselInfo.file) {
        this.$message({
          type: 'warning',
          message: '请先选择文件'
        })
        return
      }
      this.showLoading()
      const data = Object.assign(
        {
          type: this.carouselType
        },
        this.carouselInfo
      )
      this.$axios({
        method: 'post',
        url: `${url}?access_token=${this.globalData.token}`,
        data: this.formatFormData(data),
        maxContentLength: Infinity
      }).then(response => {
        if (response.data.code === 0) {
          this.$message({
            type: 'success',
            message: this.dialogTitle === '添加轮播图' ? '添加成功' : '保存成功'
          })
          if (this.dialogTitle === '添加轮播图') {
            this.tableData.push(response.data.data)
            this.tableData = this.tableData.sort((a, b) => {
              return a.sort - b.sort
            })
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id === this.carouselInfo.id) {
                this.tableData.splice(i, 1, response.data.data)
                break
              }
            }
            this.tableData = this.tableData
          }
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
        this.hideLoading()
      }).catch(error => {
        this.hideLoading()
        this.$message({
          type: 'error',
          message: `${error.response.data.error.message || '添加失败'}`
        })
      })
    },
    getTableData () {
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `/Carousels/getCarousel?access_token=${this.globalData.token}`,
        data: {
          type: this.carouselType
        }
      }).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
        this.hideLoading()
      }).catch(error => {
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

<style></style>
