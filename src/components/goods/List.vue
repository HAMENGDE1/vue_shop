<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部搜索框和按钮区域-->
    <el-row>
      <!-- 搜索框 -->
      <el-col :span="8">
        <el-input
         @clear='getGoodsListData'
            clearable
          v-model="queryInfo.query"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-button
         
            @click="getGoodsListData"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-col>
      <!-- 添加商品按钮 -->
      <el-col :span="4">
        <el-button @click="goAddPage" type="primary" class="addBtn">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table
        :data="goodsListForm"
        stripe
        style="width: 100%"
        border
        :highlight-current-row="true"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700px">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <!-- 操作列编辑删除按钮 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="deleteGoods(scope.row.goods_id)" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页区域-->
    <el-pagination
      :background="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      // get请求查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      goodsListForm: [],
      //   商品数据总条数
      total: 0,
    }
  },
  //   computed(){
  //     //
  //     //  createdTime(){
  //     //      return  nwe Date(this.goodsListForm.add_time)
  //     //  }
  //   },
  created() {
    this.getGoodsListData()
  },
  components: {},
  methods: {
    //   获取商品列表数据
    async getGoodsListData() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表数据失败!')
      // console.log(res.data)
      this.goodsListForm = res.data.goods
      this.total = res.data.total
      this.$message.success('获取商品列表数据成功!')
    },
    //pageSize改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsListData()
    },
    //当前页面改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsListData()
    },
    // 删除商品按钮
    async deleteGoods(id){
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
      if(confirmResult !== 'confirm'){
        return this.$message.info('一取消删除！')
      }
      const {data:res} =await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200) return this.$message.error('删除商品数据失败！')
      this.$message.success('删除商品成功！')
      this.getGoodsListData()

    },
    //填加商品页面
    goAddPage(){
      this.$router.push('/goods/add')
    }
  },
  mounted() {},
}
</script>

<style  scoped>
.input-with-select {
  width: 500px;
  margin-bottom: 10px;
}
/* .addBtn {
  margin-left: 15px;
} */
.el-table {
  min-width: 1500px;
}
</style>