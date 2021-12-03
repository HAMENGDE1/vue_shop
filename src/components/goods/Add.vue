<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡牌视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页内容-->
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-tabs
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          tab-position="left"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 商品分类的级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateListForm"
                :props="catProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 渲染商品参数的tag标签 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 渲染attr_vals的复选框 -->
              <el-checkbox-group border v-model="item.attr_vals">
                <el-checkbox
                  :label="a"
                  v-for="(a, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 修改商品属性 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              {{ item.attr_name }}
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 图片上传功能  action表示要上传的后台API地址-->
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :on-success="handleSuccess"
              :headers="headersObj"
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 商品内容添加商品按钮 -->
            <el-button @click="add" type="primary" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的显示与隐藏-->
    <el-dialog title="预览图片" :visible.sync="previewDialogVisible">
      <img :src="previewPath" alt="预览图片" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条的索引值
      activeIndex: '0',
      // 商品分类表单数据表单
      cateListForm: [],
      // 级联选择器配置对象
      catProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 添加商品数据对象
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
        // 商品所属的分类数组
        goods_cat: [],
        // 商品介绍
        goods_introduce:''
      },
      //添加商品基本信息表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      // 动态数据参数表单
      manyTableData: [],
      // 静态数据参数表单
      onlyTableData: [],
      // 图片上传路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //控制预览图片弹出窗口的显示与隐藏
      previewDialogVisible: false,
      // 预览图片路径
      previewPath: '',
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
  created() {
    this.getCateList()
  },
  components: {},
  methods: {
    // 获取商品分类数据表单
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类数据失败！')
      this.$message.success('获取商品分类数据成功！')
      // console.log(res.data)
      this.cateListForm = res.data
    },
    // 监听级联选择器变化
    handleChange() {
      // console.log(this.addForm.goods_cat)
    },
    // 监听是否完善表单信息
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：'+oldActiveName)
      // console.log('即将进入的标签页名字是：'+activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请完善表单信息！')
        return false
      }
    },
    //监听tab表格切换请求事件
    async tabClicked() {
      // 请求动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态数据参数失败！')
        }
        // console.log(res.data)
        this.$message.success('获取动态数据参数成功！')
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        // this.manyTableData = JSON.parse(JSON.stringify(res.data))
      } else {
        // 请求静态参数
        if (this.activeIndex === '2') {
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            { params: { sel: 'only' } }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态数据参数失败！')
          }
          this.$message.success('获取静态数据参数成功！')
          // res.data.forEach((item) => {
          //   item.attr_vals =
          //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          // })
          console.log(res.data)
          this.onlyTableData = res.data
        }
      }
    },
    // 监听图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewDialogVisible = true
      this.previewPath = file.response.data.url
    },
    //监听图片文件删除
    handleRemove(file) {
      console.log('files', file)
      // 1、获取将要删除的临时路径
      const filePath = file.response.data.tmp_path
      console.log(filePath)
      // 2、在pics中查到临时路径的索引值
      const tmpIndex = this.addForm.pics.findIndex((x) => x.pic === filePath)
      console.log(tmpIndex)
      // 3、利用splic移除pics中的临时路径
      this.addForm.pics.splice(tmpIndex, 1)
      console.log('移除图片后', this.addForm)
    },
    // 监听文件上传成功事件
    handleSuccess(response) {
      // console.log(response)
      // 1、拼接图片上传成功对象
      const picInfo = { pic: response.data.tmp_path }
      // 2、将图片信息对象push到pic数组中
      this.addForm.pics.push(picInfo)
      console.log('上传图片后', this.addForm)
    },
    //监听添加商品按钮
    add(){
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) {return this.$message.error('请完善表单信息！')}
      // 执行添加的业务逻辑
      // lodash  cloneDeep(obj)深拷贝
      // 处理goods_cat
      const cloneAddform = this.jsonClone(this.addForm)
        cloneAddform.goods_cat = cloneAddform.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item=>{
          const newInfo ={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')}
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item=>{
          const newInfo ={
            att_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        cloneAddform.attrs = this.addForm.attrs
            console.log(cloneAddform)
            // 发起请求添加商品
            // 商品名称必须是唯一的
        const {data:res} = await this.$http.post(`goods`,cloneAddform)
        if(res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    },
    // 深拷贝方法
    jsonClone(obj){
      return JSON.parse(JSON.stringify(obj))
    }
  },
  mounted() {},
}
</script>

<style  scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
img {
  width: 100%;
}
.addBtn{
  margin-top: 15px;
}
</style>