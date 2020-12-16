import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//将各种请求都封装起来，放到vue的prototype中去
import {postKeyValueRequest} from "@/utils/api";
import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.use(ElementUI);

Vue.config.productionTip = false

//全局前置导航守卫
router.beforeEach((to, from, next)=>{
  //在这里可以进行判断，如果符合要放行的条件，再去执行next方法。
  if (to.path == "/"){
    next();
  }else{
    initMenu(router,store);
    next();
  }
})

new Vue({

  //路由
  router,
  //store,组件中共享数据使用
  store,
  //组件
  render: h => h(App)
}).$mount('#app')

