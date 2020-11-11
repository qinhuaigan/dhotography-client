<template>
  <div id="carouselHome">
    <div class="carouselBox">
      <ul class="imgList clearfix" :style="{width: `${(carousels.length + 2) * 100}%`}">
        <li class="imgItem" v-for="item in carousels" :key="item.id" :style="{ width: `${(1 / (carousels.length + 2)) * 100}%`, 'background-image': `url('${baseURL}/${item.path}')` }"></li>
      </ul>
      <div class="prevBtn" @click="prev()" @mouseenter="stopSccoll()" @mouseleave="sccoll()">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="nextBtn" @click="next()" @mouseenter="stopSccoll()" @mouseleave="sccoll()">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'carouselHome',
  components: {},
  data: function () {
    return {
      carousels: [],
      current: 0,
      timer: null
    }
  },
  methods: {
    sccoll: function () {
      this.timer = setInterval(() => {
        this.next()
      }, 3000)
    },
    stopSccoll: function () {
      clearInterval(this.timer)
    },
    init: function () { // 初始化图片的位置，位切换做准备
      this.$nextTick(() => {
        const first = $('.imgList .imgItem').first().clone() // 克隆第一张图片
        const last = $('.imgList .imgItem').last().clone() // 克隆最后张图片
        $('.imgList').append(first)
        $('.imgList').prepend(last)
        $('.imgList').css({
          'margin-left': '-100%'
        })
      })
    },
    next: function () {
      if (this.current < this.carousels.length - 1) {
        this.current += 1
        $('.imgList').stop().animate({
          'margin-left': `-${(this.current + 1) * 100}%`
        }, 500)
      } else {
        this.current = 0
        $('.imgList').stop().animate({
          'margin-left': `-${(this.carousels.length + 1) * 100}%`
        }, 500, () => {
          $('.imgList').css({
            'margin-left': '-100%'
          })
        })
      }
    },
    prev: function () {
      if (this.current > 0) {
        this.current -= 1
        $('.imgList').stop().animate({
          'margin-left': `-${(this.current + 1) * 100}%`
        }, 500)
      } else {
        this.current = this.carousels.length - 1
        $('.imgList').stop().animate({
          'margin-left': `0px`
        }, 500, () => {
          $('.imgList').css({
            'margin-left': `-${(this.current + 1) * 100}%`
          })
        })
      }
    },
    getCarousels: function () {
      this.showLoading()
      this.$axios({
        method: 'post',
        url: `/Carousels/getCarousel`,
        data: {
          type: '1'
        }
      }).then(response => {
        if (response.data.code === 0) {
          this.carousels = response.data.data
          this.init()
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
        this.hideLoading()
      }).catch(() => {
        this.hideLoading()
      })
    }
  },
  created: function () {
    this.getCarousels()
    this.sccoll()
  },
  mounted: function () {},
  destroyed: function () {}
}
</script>

<style scoped="scoped">
  .carouselBox {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .imgItem {
    height: 600px;
    background-size: cover;
    background-position: center;
    float: left;
  }

  .prevBtn,
  .nextBtn {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
    text-align: center;
    line-height: 40px;
    position: absolute;
    font-size: 20px;
    transition: all 0.5s;
    top: 50%;
    transform: translateY(-50%);
  }

  .prevBtn {
    left: 40px;

  }

  .nextBtn {
    right: 40px
  }

  .prevBtn:hover,
  .nextBtn:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.8);
  }
</style>
