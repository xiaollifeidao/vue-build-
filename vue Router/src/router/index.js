import Vue from 'vue'
import Router from 'vue-router'
import wRouter from './wRouter.js'
import bRouter from './bRouter.js'
Vue.use(Router)
//合并两个路由
let routes = new Set([...wRouter,...bRouter]);
export default new Router({
  routes
})
