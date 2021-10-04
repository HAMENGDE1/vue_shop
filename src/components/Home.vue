<template>
  <div class="page">
      home组件
      <el-button @click="loginout" type="info">退出</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {

      }
    },
    methods:{
      loginout(){
        // window.sessionStorage.clear();
        window.sessionStorage.removeItem('token');
        this.$router.push('/login');
      }
    },
    components: {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

 
</style>
