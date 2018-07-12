import Vue from 'vue'
import Router from 'vue-router'
import wRouter from './wRouter.js'   //多人开发路由
import bRouter from './bRouter.js'
import cRouter from './cRouter.js'
Vue.use(Router)
//合并多个路由
let routes = new Set([...wRouter,...bRouter,...cRouter]);
export default new Router({
  routes
})
