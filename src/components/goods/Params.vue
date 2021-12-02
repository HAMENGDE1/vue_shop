<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 头部的警告区-->
      <el-alert
        :closable="false"
        :show-icon="true"
        title="注意只允许为第三级分类设置相关参数"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--标签页  -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            type="primary"
            >添加参数</el-button
          >
          <!-- 动态参数渲染 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close='handleClose(index,scope.row)'
                >
                  {{ item }}
                </el-tag>
                <!-- 添加tag按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row) "
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态树形参数面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            type="primary"
            >添加属性</el-button
          >
          <!-- 静态属性渲染 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
             <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close='handleClose(index,scope.row)'
                >
                  {{ item }}
                </el-tag>
                <!-- 添加tag按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row) "
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框-->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框-->
    <el-dialog
      @close="editDialogClosed"
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 商品分裂级联选择器配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //级联选择框双向绑定数组
      selectedCateKeys: [],
      // 被激活的页签名字
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 控制添加参数的弹出框显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: '',
      },
      //添加参数表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      // 控制编辑弹出框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单数据
      editForm: {
        attr_name: '',
      },
      // 编辑对话框的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入修改参数名称', trigger: 'blur' },
        ],
      },
     
    }
  },
  computed: {
    // 判断按钮是否禁用
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3 ? true : false
    },
    // 当前选中分类ID
    cateId() {
      return this.selectedCateKeys.length === 3
        ? this.selectedCateKeys[2]
        : null
    },
    //动态计算标题的文本
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
  },
  components: {},
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败！')
      // console.log(res)
      this.cateList = res.data
    },
    // 监听级联选择框数据变化
    handleChange() {
      this.getParentData()
    },
    // 监听页签点击事件
    handleTabClick() {
      this.getParentData()
      // console.log(this.activeName)
    },
    // 获取参数列表数据
    async getParentData() {
      // console.log(this.selectedCateKeys)
      // console.log(this.cateId)
      // 根据所选分裂Id,和当前对应面板,获取对应参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200)
        return this.$message.error('获取动态参数失败!')
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible=false
        // 文本框中输入的值
        item.inputValue=''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表单验证失败！')
        // console.log(valid)
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        console.log(res.data)
        if (res.meta.status !== 201)
          return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParentData()
      })
    },
    // 点击按钮修改对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error('获取分类对象失败！')
      this.$message.success('获取分类对象成功！')
      // console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听编辑对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮提交修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('编辑信息表单验证失败!')
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('提交表单失败！')
        this.getParentData()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    // async removeParams(attr_id){
    //     const{data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
    //     if(res.meta.status !== 200) return this.$message.error('删除参数失败！')
    //     this.$message.success('删除参数成功！')
    //     this.getParentData()
    // }
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(confirmResult)
      // 注意confirm是字符串,加引号
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParentData()
    },
    //添加tag标签内容，或回车都会触发
    async handleInputConfirm(row){
      // console.log(23)
      if(row.inputValue.trim().length ===0){
        row.inputValue = ''
        row.inputVisible=false
        return
      }
      // 如果没有return
      else{
         row.attr_vals.push(row.inputValue.trim())
         row.inputValue = ''
         row.inputVisiblefalse
        //  发送请求保存修改数据
        //  const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        //    attr_name:row.attr_name,
        //    attr_sel:this.activeName,
        //   //  attr_vals:row.inputValue
        //   attr_vals:row.attr_vals.join(' ')
        //    })
        //    if(res.meta.status !== 200) return this.$message.error('修改参数失败！')
        //   this.$message.success('修改参数成功!')
        this.saveAttrVals(row);
      }

    },
    //发送保存vals请求 
    async saveAttrVals(row){
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
           attr_name:row.attr_name,
           attr_sel:this.activeName,
          //  attr_vals:row.inputValue
          attr_vals:row.attr_vals.join(' ')
           })
           if(res.meta.status !== 200) return this.$message.error('修改参数失败！')
           this.$message.success('修改参数成功!')

    },
    // 点击按钮，展示文本输入框
    showInput(row){
    row.inputVisible = true
    // 让文本框自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //监听tag标签是否被删除 
    handleClose(index,row){
      row.attr_vals.splice(index,1)
      this.saveAttrVals(row)
    }
  },
  mounted() {},
}
</script>

<style  scoped>
.cat_opt {
  margin: 15px px;
}
.cascader {
  margin-left: 15px;
}
.el-tag {
  margin-left: 15px;
}
.input-new-tag{
    width: 150px;
}
</style>