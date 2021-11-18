<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区  -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" width="180" label="ID"></el-table-column>
        <el-table-column
          label="姓名"
          width="180"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          width="180"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="电话"
          width="180"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          label="角色"
          width="180"
          prop="role_name"
        ></el-table-column>
        <el-table-column label="状态" width="180" prop="mg_state">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- {{scope}} -->
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                @click="setRole(scope.row)"
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
    <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <!-- 密码 -->
   <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
      </el-form-item>
    <!-- 邮箱 -->
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
      </el-form-item>
    <!-- 手机 -->
    <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
   
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
              <!-- 修改用户对相框 -->
      <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false" >取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
    </el-dialog>
   <!-- 分配角色对话框 -->
     <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close='setRoleDialogClosed'>
          <div>
              <p>当前的用户：{{userInfo.username}}</p>
              <p>当前的角色：{{userInfo.role_name}}</p>
              <p>分配新角色
                <el-select v-model="selectRoleId" placeholder="请选择">
                  <el-option
                  v-for="role in rolesList"
                  :key="role.id"
                  :label="role.roleName"
                  :value="role.id">
                  </el-option>
                </el-select>

              </p>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    var checkEmail = (rule,value,cb)=>{
      // 验证邮箱
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return cb();
      }
      cb(new Error('请输入合法的邮箱！'));
    }
    //验证手机号
    var checkMobile = (rule,value,cb)=>{
      const regMobile= /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regMobile.test(value)){
        return cb();
      } 
      cb(new Error('请输入合法的手机号'));
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页数据条数
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible:false,
      // 添加用户表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      addFormRules:{
        username:[
         {required: true,message:'请输入用户名',trigger:'blur'},
         {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
        ],
        password:[
           {required: true,message:'请输入密码',trigger:'blur'},
         {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
        ],
        email:[
            {required: true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger:'blur'}
        //  {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
        ],
        mobile:[
            {required: true,message:'请输入手机',trigger:'blur'},
           {validator:checkMobile,trigger:'blur'}

        //  {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      //根据id查询到的用户信息
      editForm:{
        id:'',
        mobile:'',
        email:''
      },
      editFormRules:{
        email:[
           {required: true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[  
           {required: true,message:'请输入手机',trigger:'blur'},
           {validator:checkMobile,trigger:'blur'}]
      },
       // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible:false,
      userInfo:'',
      rolesList:'',
      // 已选中的分配角色下拉菜单值
      selectRoleId:'',
      setRoleDialogVisible:false

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.eror('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        // console.log(valid)
        if(!valid) return
        // 可以发起添加用户网络请求
        const {data:res} = await this.$http.post('users',this.addForm)
        if(res.meta.status !==201){
          this.$message.error('添加用户啊失败！')
        }
        this.$message.success('添加用户成功!')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户列表数据
        this.getUserList();
        
      })
    },
    // 展示编辑用户对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+id);
      if(res.meta.status !== 200){
        return this.$message.error('查询用户信息失败！');
      }
      this.editForm =res.data;
      // console.log(res.data);
      this.editDialogVisible = true;
      // console.log(id);
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        // console.log(valid)
        const {data:res} = await this.$http.put('users/'+this.editForm.id,this.editForm)
        if(res.meta.status ==200&& valid == true){
  //  console.log(res.data);
        // 关闭对话框
        this.editDialogVisible =false;
        //刷新用户列表
        this.getUserList();
        // 提示更新成功
        return this.$message.success('更新用户信息成功!')
        }
          this.$message.error('更新用户信息失败！')

      })
    },
   async removeUserById(id){
      //  console.log(id);
       const confirmResult = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
          // 确认删除,则返回字符串委confirm
          // 取消删除，则返回字符串cancel
          // console.log(confirmResult);
          if(confirmResult !=='confirm'){
            return this.$message.info('已经取消删除');
          }
          const {data:res} =await this.$http.delete('users/'+id);
          if (res.meta.status !== 200){
           this.$message.error('删除用户信息失败！');
           this.getUserList();
          // console.log('确认了删除')
    }
          this.getUserList();
    this.$message.success('删除用户信息成功！')
   
  },
  // 展示分配角色对话框
          async setRole(userInfo){
            this.userInfo=userInfo;
            // 在展示对话框前展示所有角色列表
            const{data:res} = await this.$http.get('roles')
            if(res.meta.status !== 200){
              return this.$message.error('获取角色列表失败!')
            }
            console.log(res)
            this.$message.success('获取角色列表成功！')
            this.rolesList = res.data

            this.setRoleDialogVisible=true;
          },
             // 保存分配角色
        async saveRoleInfo(){
          if(!this.selectRoleId){
            return this.$message.error('请选择角色！')
          }
            const {data:res} = await this.$http.put(
            `users/${this.userInfo.id}/role`,
            {rid:this.selectRoleId})
          if(res.meta.status !==200){
            return this.$message.error('更新角色失败！')
          }
          this.$message.success('更新角色成功！')
          this.getUserList()
          this.setRoleDialogVisible=false

    },
    // 监听角色分配对话框的关闭事件
    setRoleDialogClosed(){
      this.selectRoleId=''
      this.userInfo={}
    }
    }
    }
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  // font-size: 12px;
}
</style>
