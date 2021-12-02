<template>
  <div>
      <!-- 面包屑视图 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 添加分类按钮 -->
    <el-row>
        <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
    </el-row>
    <!-- 添加表格 -->
    <tree-table class="treeTable" index-text='#' 
    border
    :show-index="true" 
    :expand-type='false' 
    :selection-type='false' 
    :data='cateList' 
    :columns='columns'>
    <!--是否有效模板 -->
  <template slot="isok" slot-scope='scope'>
    <i class="el-icon-success"
     v-if='scope.row.cat_deleted === false'
     style="color:green"></i>
    <i class="el-icon-error"
    v-else
    style="color:red"></i>
  </template>
  <!-- 排序模板 -->
  <template slot="order" slot-scope='scope'>
  <el-tag v-if="scope.row.cat_level ===0" size="mini">一级</el-tag>
  <el-tag v-else-if="scope.row.cat_level ===1" type="success" size="mini">二级</el-tag>
  <el-tag v-else type="warning" size="mini">三级</el-tag>
  </template>
  <!-- 操作模板 -->
  <template slot="opt" slot-scope="scope">
    <el-button @click="editCate(scope.row.cat_id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
    <el-button @click='deleteCate' type="danger" icon="el-icon-delete" size="mini">删除</el-button>
  </template>
    </tree-table>
    <!-- 分页区域 -->
        <el-pagination 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!--添加分类的对话框 -->
    <el-dialog
    @close='addCateDialogClosed'
  title="提示"
  :visible.sync="addCateDialogVisible"
  width="50%">
  <el-form 
  :model="addCateForm" 
  :rules="addCateFormRules" 
  ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
  <el-cascader
    :clearable="true"
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChange"></el-cascader>
  </el-form-item>
  </el-form>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
    <!--编辑分类弹出框  -->
    <el-dialog
  title="编辑分类"
  :visible.sync="editCateDialogVisible"
  width="50%">
    <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
         <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
         </el-form-item>
    </el-form>
  <span slot="footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitEditCate()">确 定</el-button>
  </span>
</el-dialog>
    <!-- 删除分类弹出框 -->
    <el-dialog
  title="删除分类"
  :visible.sync="deleteCateDialogVisible"
  width="50%">
 
  <span slot="footer">
    <el-button @click="deleteCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteCateDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>

<script>
export default {
  name: 'Cate',
  data() { 
    return {
        // 总数据条数
        total:0,
        // 查询参数
        queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        //商品分类数据列表，默认为空 
        cateList:[],
        // 为table指定列的定义
        columns:[
            {
                label:'分类名称',
                prop:'cat_name'
            },
            { 
            label:'是否有效',  
            // 表示将当前列定义为模板列
            type:'template',
            // 表示当前这一列的模板名称
            template:'isok'

            },
            { 
            label:'排序',  
            // 表示将当前列定义为模板列
            type:'template',
            // 表示当前这一列的模板名称
            template:'order'
            },
            { 
            label:'操作',  
            // 表示将当前列定义为模板列
            type:'template',
            // 表示当前这一列的模板名称
            template:'opt'
            }
        ],
        // 控制显示分类对话框
        addCateDialogVisible:false,
        // 添加分类表单数据对象
        addCateForm:{
          // 将要添加分类名称
          cat_name:'',
          cat_pid:0,
          cat_level:0
        },
        // 添加分类表单验证规则
        addCateFormRules:{
          cat_name:[
              { required: true, message: '请输入分类名称', trigger: 'blur' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        // 编辑分类表单验证规则
        editCateFormRules:{
          cat_name:[
              { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        // 父级分类列表
        parentCateList:[],
        // 指定级联选择器的配置对象
        cascaderProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',
          // 控制可以选择父级分类
          checkStrictly:true
        },
        //选中的父级分类的ID数组 
        selectedKeys:[],
        // 控制编辑弹出框的显示与隐藏
        editCateDialogVisible:false,
        // 控制删除弹出框的显示与隐藏
        deleteCateDialogVisible:false,
        // 编辑分类数据对象
        editCateForm:{
          cat_id:'',
          cat_name:''
        }
    }
  },
  components:{
  },
  created(){
      this.getCateList()
  },
  methods:{
       async getCateList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
          if(res.meta.status !==200) return this.$message.error('获取商品分类失败！')
          // console.log(res,'sd')
        //  为商品分类数据赋值
          this.cateList =res.data.result
        //   为总数居条数赋值
          this.total = res.data.total
      },
      // 监听pagesize的改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getCateList()
      },
      // 监听pagepagenum改变
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getCateList()
      },
      // 控制分类弹出框的显示与隐藏
      showAddCateDialog(){
        this.getParentCatteLiast()
        this.addCateDialogVisible = true
      },
        // 获取父级分类的数据列表
        async getParentCatteLiast(){
          const {data:res} = await this.$http.get('categories',{params:{type:2}})
          if(res.meta.status !==200) return this.$message.error('获取父级分类数据列表失败!')
          // console.log(res)
          this.parentCateList = res.data;
        },
        // 选择项发生变化触发这个函数
        parentCateChange(){
          console.log(this.selectedKeys)
          // 如果selectedKeys数组中的length大于0，证明选中父级分类
          // 反之，就说明没有选中任何父级分类
          if(this.selectedKeys.length>0){
            //父级分类的ID
           this.addCateForm.cat_pid =  this.selectedKeys[this.selectedKeys.length-1]
            // 为当前分类等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length          
          return
          }else{
          this.addCateForm.cat_pid =  0 
          this.addCateForm.cat_level = 0
          }
        },
        // 点击按钮，添加新的分类
        addCate(){
          // console.log(this.addCateForm)
          this.$refs.addCateFormRef.validate(async valid=>{
            if(!valid) return
            const {data:res} = await this.$http.post('categories',this.addCateForm)
            if(res.meta.status !==201) {return this.$message.error('提交分类表单失败！')}
            this.$message.success('添加分类成功！')
            this.getCateList()
            this.addCateDialogVisible=false;

          })
        },
        // 监听对话框关闭事件重置表单数据
        addCateDialogClosed(){
          this.$refs.addCateFormRef.resetFields()
          this.selectedKeys = []
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        },
        // 分类编辑按钮
        async editCate(id){
          this.editCateDialogVisible= true
          // console.log('id==',id);
          const{data:res} = await this.$http.get('categories/'+id)
          if(res.meta.status !== 200) return this.$message.error('获取分类失败！')
           this.$message.success('获取分类成功！')
          //  console.log("res的data===",res.data)
           this.editCateForm = res.data;
        },
        //提交编辑按钮 
        submitEditCate(){
          this.$refs.editCateFormRef.validate(async valid=>{
            if(!valid) return this.$message.error('验证表单失败！')
            const {data:res} = await this.$http.put( `categories/${this.editCateForm.cat_id}`,{cat_name:this.editCateForm.cat_name})
            if(res.meta.status !== 200) return this.$message.error('编辑分类信息失败！')
            // console.log(this.editCateForm.cat_id)
            this.$message.success('编辑分类信息成功！')
            this.getCateList()
            this.editCateDialogVisible= false
          })
        },
        // 分类删除按钮
        deleteCate(){
          this.deleteCateDialogVisible = true
        }
  },
  mounted() {

  },
 }
</script>

<style  scoped>
.treeTable {
  margin: 15px 0px;
}
.el-cascader{
  width: 100%;
}
</style>