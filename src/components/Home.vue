<template>
  <div class="page">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/logo.jpg" alt="头像" />
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="loginout" type="info">退出</el-button>
      </el-header>
      <!--页面主体区域  -->
      <el-container>
        <!--  侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏导航区 -->
          <el-menu
            :router="true"
            :collapse-transition="false"
            :collapse="isCollapse"
            :unique-opened="true"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :default-active="activePath"
              
              :index="item.id+''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsobj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                @click="saveNavStaer('/' + subItem.path)"
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
              <!-- </el-submenu> -->
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  created() {
    this.getMenulist(),
      (this.activePath = window.sessionStorage.getItem('activePath'))
  },
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsobj: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-tijikongjian-xianxing',
        101: 'iconfont icon-shangpin-xianxing',
        102: 'iconfont icon-danju-xianxing',
        145: 'iconfont icon-wxbbaobiao',
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
    }
  },
  methods: {
    loginout() {
      // window.sessionStorage.clear();
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenulist() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavStaer(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    },
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.home-container {
  // height:100%;
  height: 795px;
}
.el-header {
  margin: 0;
  padding: 0;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  // align-items: center ;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-menu {
  border-right: none;
}
.el-header img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
// 缩放按钮
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
