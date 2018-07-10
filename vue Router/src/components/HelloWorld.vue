<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>HelloWorld</h2>
    <router-link to="/Path">我是a路由引进来的</router-link >
    <img src="./../assets/images/timg.jpg" alt="">
  </div>

</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1, h2 {
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
}
</style>
