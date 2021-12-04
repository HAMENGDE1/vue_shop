<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 渲染订单列表数据 -->
      <el-table :data="orderList" style="100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="order_number" label="订单编号" ></el-table-column>
          <el-table-column prop="order_price" label="订单价格" ></el-table-column>
          <el-table-column prop="pay_status" label="是否付款" >
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.pay_status === '1'" type="primary">已付款</el-tag>
                  <el-tag v-else type="danger">未付款</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" ></el-table-column>
          <el-table-column prop="create_time" label="下单时间" >
              <template slot-scope="scope">
                  {{scope.row.create_time | dataFormat}}
              </template>
          </el-table-column>
          <el-table-column label="操作" >
              <template >
                  <el-button @click="showBox" type="primary" icon="el-icon-edit"></el-button>
                  <el-button @click="showProgressBox" type="success" icon="el-icon-location"></el-button>
              </template>
          </el-table-column>        
      </el-table>
    </el-card>
    <!-- 订单列表底部分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑修改地址对话框 -->
    <el-dialog
    @close='addressDialogClosed'
  title="修改地址"
  :visible.sync="addressDialogVisible"
  width="50%">
  <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address1">
    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>  
    <!-- 展示物流进度对话框 -->
    <el-dialog
  title="物流进度"
  :visible.sync="progressDialogVisible"
  width="50%">
      <!--时间线  -->
    <el-timeline >
    <el-timeline-item
      v-for="(item, index) in progressInfo"
      :key="index"
      :timestamp="item.time">
      {{item.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
import progressInfo from './progressInfo.js'
export default {
  name: 'Order',
  data() {
    return {
        // 请求参数
        queryInfo:{
            pagenum:1,
            pagesize:10
        },
        // 总数据条数
        total:0,
        // 订单列表数据
        orderList:[],
        // 控制修改地址对话框的显示与隐藏
        addressDialogVisible:false,
        // 地址信息表单
        addressForm:{
          address1:[],
          address2:''
        },
        // 地址表单验证规则
        addressFormRules:{
            address2:[
                  { required: true, message: '请输入详细地址', trigger: 'blur' },
            ]
        },
        //导入地区信息
        cityData,
        // 控制物流进度对话框的显示与隐藏
        progressDialogVisible:false,
        // 物流进度表单信息
        progressInfo
    }
  },
  created(){
      this.getOrderList()
  },
  methods: {
    //  订单数据列表
      async getOrderList(){
          const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
          if(res.meta.status !== 200) return this.$message.error('请求订单数据失败！')
          this.$message.success('请求订单数据成功！')
        //   console.log(res.data)
          this.orderList = res.data.goods
          this.total = res.data.total
      },
    //   监听每页条数的改变
      handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getOrderList()
      },
    //  监听当前页数的改变
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getOrderList()
    },
    // 展示修改地址对话框
    showBox(){
        this.addressDialogVisible= true
    },
    //监听编辑地方对话框关闭事件 
    addressDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    // 物流进度按钮
    async showProgressBox(){
      // const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      // if(res.meta.status !== 200) return this.$message.error('获取物流进度失败！')
      // this.$message.success('获取物流进度成功！')
      // console.log(res.data)
      this.progressDialogVisible=true
      // console.log(this.progressInfo)
    }
  },
  mounted() {},
}
</script>

<style  scoped>
.el-cascader{
  width: 100%; 
}
</style>