<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户角色按钮 -->
    <el-row>
      <el-col>
        <el-button @click="rolesDialogVisible = true" type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="#">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','v-center']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row,item1.id)" closable> {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="['bdbottom',i2 !==0 ?'bdtop':'','v-center']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 通过for循环渲染三级权限 -->
                      <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre> {{scope.row}} </pre> -->
            </template>  
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope}} -->
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRolesDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色按钮 -->
            <el-button  @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
     <!-- 添加角色弹出框 -->
        <el-dialog
          title="添加角色列表"
          :visible.sync="rolesDialogVisible"
          width="30%"
           @close="rolesDialogClosed"
        >
        <el-form :model="rolesForm" :rules="rolesFormRules" ref="rolesFormRef" label-width="100px">
             <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
         </el-form-item>
           <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
         </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="rolesDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="addRolesForm"
              >确 定</el-button >
          </span>
        </el-dialog>
        <!-- 编辑角色弹出框 -->
           <el-dialog
          title="编辑角色列表"
          :visible.sync="editRolesDialogVisible"
          width="30%"
        >
        <el-form :model="editRolesForm" :rules="rolesFormRules" ref="editRolesFormRef" label-width="100px">
             <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName" disabled></el-input>
         </el-form-item>
           <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
         </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editRolesDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="editRolesInfo"
              >确 定</el-button >
          </span>
        </el-dialog>
        <!-- 分配权限弹出框 -->
         <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="50%"
          @close='setRightDialogClosed'
        >
        <!--树形组件 -->
        <el-tree :default-checked-keys='defaultKeys'
         default-expand-all node-key='id' 
          show-checkbox :data="rightsList" 
          :props="treeProps"
          ref="treeRef"
          ></el-tree>

          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible=false">取 消</el-button>
            <el-button type="primary" 
            @click="allotRights"
              >确 定</el-button >
          </span>
        </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      rolesList: [],
      // 控制添加角色列表显示与隐藏
      rolesDialogVisible: false,
      // 添加角色列表数据
      rolesForm:{
          roleName:'',
          roleDesc:''
      },
      rolesFormRules:{
          roleName:[
             {required: true,message:'请输入角色名称',trigger:'blur'},
             {min:2,max:10,message:'角色名称长度在3到10个字符',trigger:'blur'}
          ],
          roleDesc:[
            {required: true,message:'请输入角色描述',trigger:'blur'},
            {min:2,max:10,message:'长度在3到10个字符',trigger:'blur'}
          ]
      },
      // 编辑角色弹出框显示与隐藏
      editRolesDialogVisible:false,
      // 编辑角色弹出框数据
      editRolesForm:{
          roleId:'',
          roleName:'',
          roleDesc:''
      },
      // 分配权限弹出框显示与隐藏
      setRightDialogVisible:false,
      rightsList:{},
      // 树形控件绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      //树形控件默认选中数据
      defaultKeys:[],
      // 当前即将分配权限的ID
      roleId:'',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败！')
      }
      this.$message.success('请求角色列表成功！')
      this.rolesList = res.data;
    },
    rolesDialogClosed(){
        this.$refs.rolesFormRef.resetFields();
        // console.log(213);
    },
    async addRolesForm(){
      const {data:res} = await this.$http.post('roles',this.rolesForm);
      if(res.meta.status !== 201){
        return this.$message.error('添加角色列表失败！');
      }
      // 控制添加角色用户列表隐藏
      console.log(res.data);
      this.rolesDialogVisible = false;
      // 更新角色列表
      this.getRolesList();
    },
    // 编辑用户
    async editRolesDialog(id){
      this.editRolesDialogVisible=true;
      const { data: res } = await this.$http.get('roles/'+id)
      if (res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败！')
      }
      // this.$message.success('请求角色列表成功！')
      // console.log('角色数据为')
      // console.log(res)
      this.editRolesForm = res.data;
    },
    // 编辑角色提交
    editRolesInfo(){
        this.$refs.editRolesFormRef.validate(async valid=>{
          const{data:res} = await this.$http.put('roles/'+this.editRolesForm.roleId,this.editRolesForm)
              if(res.meta.status ==200&& valid == true){
                this.editRolesDialogVisible = false;
                this.getRolesList();
                return this.$message.success('编辑橘色提交成功')
              }
              this.$message.error('编辑角色列表失败！')
        })
    },
    // 删除角色数据
    async removeRoleById(id){
       const confirmResult = await this.$confirm('此操作将永久删除该角色数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
          if(confirmResult !=='confirm'){
          return this.$message.info('已经取消删除！')
          }
          const {data:res} = await this.$http.delete('roles/'+id)
          if(res.meta.status !==200){
            this.$message.error('删除角色信息失败！')
    }
        this.$message.success('成功删除角色信息!')
        this.getRolesList();
        },
        // 根据ID删除对应权限
        async removeRightById(role,rightId){
          // 弹窗提醒用户是否删除
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm'){
        return this.$message.info('取消了删除！')
        }
        const {data:res} = await this.$http.delete('roles/'+role.id+'/rights/'+rightId);
        // console.log('确认了删除');
        if(res.meta.status!==200){
          return this.$message.error('删除权限失败!')
        }
        // this.getRolesList();
        role.children =res.data;

        },
        // 展示分配权限对话框
        async showSetRightDialog(role){
          this.roleId = role.id
          // 获取所有权限数据
         const {data:res} = await this.$http.get('rights/tree');
         if(res.meta.status !==200){
           return this.$message.error('请求权限列表失败！');
         }
        //  获取到的权限数据保存到data中
         this.rightsList = res.data;
        //  递归获取三级节点的ID
         this.getLeafKeys(role,this.defaultKeys)
          this.setRightDialogVisible=true;
        },
        // 通过递归的形式获取三级权限的id，并保存到dafalutKyeys数组中
        getLeafKeys(node,arr){
          if(!node.children){
            return arr.push(node.id) 
          }
          node.children.forEach(item=>
            this.getLeafKeys(item,arr))
        },
        //监听分配权限对话框的关闭事件 
        setRightDialogClosed(){
          this.defaultKeys=[]
        },
        async allotRights(){
          const keys = [
            // 展开运算符
         ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          // console.log(keys)
         const idStr = keys.join(',')
         const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
         if(res.meta.status !==200){
           return this.$message.error('分配权限失败!')
         }
         this.$message.success('分配权限成功!')
         this.getRolesList()
         this.setRightDialogVisible=false
        }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.v-center{
  display: flex;
    align-items: center;
}
</style>>

 
