import { Message } from 'element-ui';
import axios from "axios";
import router from "@/router";

//这个封装一下响应。当响应码是200，进入第一个回调函数，如果是400，401,404,500... 的进入下面那个回调函数
//但是，响应码是200不一定是业务成功了，要看服务端怎么返回。就比如说登陆的 ：
//当登陆失败（用户名密码输入错误等。。。），响应码是200，但是服务端返回的json数据里面的status是500。这样的话，还是会走到上面那个回调函数里面去的。如果走到下面那个回调
//函数里面的话，就一定是错误了。
axios.interceptors.response.use(success=>{
    if (success.status && success.status == 200 && success.data.status == 500){
        Message.error({message:success.data.msg});
        //这里直接返回空就行了，到时候在调用的地方直接去判断一下返回的有没有数据就行。而不用去管错误信息的展示，因为已经在这里展示了。
        return ;
    }
    if (success.data.msg){
        Message.success({message:success.data.msg});
    }
    return success.data;
},error => {
    //到这里的话，一定是HttpServletResponse的状态码不为200.
    if (error.response.status == 504 || error.response.status == 404){
        Message.error({message:"服务器被吃了o(╯□╰)o"});
    }else if (error.response.status == 403){
        Message.error({message:"权限不足，请联系管理员!"});
    }else if (error.response.status == 401){
        Message.error({message:"还未登陆，请先登陆！"});
        // 如果session失效，后端会返回401，在这里进行跳转到首页。
        router.replace('/');
    }else {
        if (error.response.data.msg){
            Message.error({message:error.response.msg});
        }else {
            Message.error({message:"未知错误！"});
        }
    }
    return;
})

let base = '';

export const postKeyValueRequest=(url,params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params,
        transformRequest:[function (data) {
            let ret ='';

            for (let i in data){
                console.log(i);
                ret += encodeURIComponent(i)+"="+encodeURIComponent(data[i]) + '&'
            }

            return ret;
        }],
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url,params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params
    })
}

export const getRequest = (url,params)=>{
    return axios({
        method:'get',
        url:`${base}${url}`,
        data:params
    })
}

export const putRequest = (url,params)=>{
    return axios({
        method:'put',
        url:`${base}${url}`,
        data:params
    })
}

export const deleteRequest = (url,params)=>{
    return axios({
        method:'delete',
        url:`${base}${url}`,
        data:params
    })
}