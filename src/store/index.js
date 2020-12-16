import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// Vuex是Vue为了各个组件之间的共享数据，状态管理而出现的一个东西。
export default new Vuex.Store({
    //这个state就是vuex里面存的数据。就是要共享的数据。
    state:{
        routes:[]
    },
    //mutations类似于methods方法。可以用来改变state中的数据。当然，vuex还有一个Getters，这个可以理解成computed属性。
    //调用的时候，只需要传入一个参数就行，那个initRouters方法的第一个参数是不用自己传入的，是上面那个state。
    mutations:{
        initRoutes(state,data){
            state.routes = data;
        }
    },
    //action其实也是去调用mutations来进行处理的。不过action中可以使用异步方法。而mutations不行。
    actions:{

    }

})