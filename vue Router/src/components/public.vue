<template>
  <div class="hello">
    {{message}}(子组件)
    <span>{{childValue}}</span>
    <!-- 定义一个子组件传值的方法 -->
    <input type="button" value="点击触发" @click="childClick">
  </div>

</template>

<script>
export default {
  props: {
    message: String  //定义传值的类型<br>   
  },
  data(){
    return{
      childValue: '我是子组件的数据'
    }
  },
  methods:{
    childClick () {
        // childByValue是在父组件on监听的方法
        // 第二个参数this.childValue是需要传的值
        this.$emit('childByValue', this.childValue)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello{
  height: 100px;
  color: red;
  background: white;
}
</style>
