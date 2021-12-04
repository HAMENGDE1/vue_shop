<template>
  <div>
         <!-- 面包屑视图 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 2、为Echarts准备一个具备宽高的DOM容器 -->
            <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
 </div>
</template>

<script>
// 1、导入echarts
import * as echarts from 'echarts'

export default {
  name: 'Report',
  data() { 
    return {
        // 需要合并的数据
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  components:{
    //   此时页面上的元素，已经渲染完毕
  },
  methods:{
  },
  async mounted() {
    // 3、基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

    //   调用数据请求
        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200) return this.$message.error('获取折线图数据失败！')
    // 4、指定图表的配置项和数据
        // jQuery合并对象 
        // const result = $.extend(this.options,res.data)
        // es6语法
        const result = {...this.options,...res.data}

    // 5、使用刚指定的配置项和数据显示图表。
        myChart.setOption(result)

  }
 }
</script>

<style  scoped>
</style>