<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <v-header :message = "parentMsg" v-on:childByValue="childByValue"></v-header>
    父组件:
    <span>{{name}}</span>
    <!-- 引入子组件 定义一个on的方法监听子组件的状态-->
    <h2 class="image">我是b路由引进来的</h2>
  </div>
</template>

<script>
import child from './public'  //引入child组件
export default {
  name: 'HelloWorld',
  components:{
    'v-header':child
  },
  data () {
    return {
      name: '',
      msg: '风吹十里稻花香',
      parentMsg: '我是b路由引进来的666666'  //在data中定义需要传入的值
    }
  },
  methods:{
    childByValue(childValue){
      this.name = childValue
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
