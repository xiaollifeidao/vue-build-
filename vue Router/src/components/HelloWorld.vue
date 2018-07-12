<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 class="iconfont icon-gouwuche"></h2>
    <v-header :message = "parentMsg"></v-header>
    <router-link to="/Path">我是a路由引进来的</router-link >
    <img src="./../assets/images/timg.jpg" alt="">
  </div>

</template>

<script>
import child from "./public.vue"; //引入child组件
export default {
  name: "HelloWorld",
  components: {
    "v-header": child
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      parentMsg: "我是a路由引进来的666666666" //在data中定义需要传入的值
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
      <style scoped lang="scss">
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
  font-size: 30px;
}
</style>
