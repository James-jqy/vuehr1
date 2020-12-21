<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名..." v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" placeholder="请输入角色中文名..." v-model="role.nameZh" @keydown.enter.native="doAddRole"></el-input>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse v-model="activeName" @change="change" accordion>

        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles"  :key="index">

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: orangered" icon="el-icon-delete" type="text" @click="deleteRole(r)"></el-button>
            </div>
            <div>
              <!--  :props="defaultProps" 可以指定树形结构中的label和children都叫什么。
               在这里需要修改一下，label叫做name，因为后端返回的数据中就叫name。
               -->
              <!--这里其实只是维护了一份数据。当每一次点击展开的时候，触发change函数。然后，change函数会去调用
              initAllMenus方法来得到数据，然后再去渲染成树。
              -->
              <el-tree
                  show-checkbox
                  node-key="id"
                  ref="tree"
                  :key="index"
                  :default-checked-keys="selectedMenus"
                  :data="allmenus" :props="defaultProps"></el-tree>
              <div style="display: flex;justify-content: flex-end">
                <el-button @click="cancelUpdate">取消修改</el-button>
                <el-button type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>

        </el-collapse-item>

      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data(){
    return {
      activeName:-1,
      role:{
        name:'',
        nameZh:''
      },
      allmenus:[],
      roles:[],
      selectedMenus:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initRoles();
  },
  methods:{
    deleteRole(role){
      this.$confirm('此操作将永久删除 '+role.nameZh+' 角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(role.id)
        this.deleteRequest("/system/basic/permiss//role/"+role.id).then(resp=>{
          if (resp){
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddRole(){
      if (this.role.name && this.role.nameZh){
        this.postRequest("/system/basic/permiss/", this.role).then(resp=>{
          if (resp){
            this.initRoles();
            this.role.name='';
            this.role.nameZh='';
          }
        })
      }else {
        this.$message.warning('数据不能为空！');
      }
    },
    cancelUpdate(){
      this.activeName = -1;
    },
    doUpdate(rid,index){
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);

      let url = '/system/basic/permiss/?rid='+rid;

      if (selectedKeys.length == 0){
       // 当用户将这个角色所拥有的权限全部取消的时候，selectedKeys的长度会为0.此时传入-1，代表删除这个角色所有的权限。
       url += '&mids=-1';
      }else{
        selectedKeys.forEach(item=>{
          url += '&mids=' + item;
        })
      }

      this.putRequest(url).then(resp=>{
        if (resp){
          this.activeName = -1;
        }
      })

    },
    change(rid){
      if (rid){
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    initSelectedMenus(rid){
      this.getRequest("/system/basic/permiss/mids/" + rid).then(resp=>{
        if (resp){
          this.selectedMenus = resp;
        }
      })
    },
    initAllMenus(){
      this.getRequest("/system/basic/permiss/menus").then(resp=>{
        if (resp){}
        this.allmenus = resp;
      })
    },
    initRoles(){
      this.getRequest("/system/basic/permiss/").then(resp=>{
        if (resp){
          this.roles = resp;
        }
      })
    }
  }
}
</script>

<style>
  .permissManaMain{
    margin-top: 10px;
    width: 700px
  }
  .permissManaTool{
    display: flex;
    justify-content: flex-start;
  }
  .permissManaTool .el-input{
    width: 300px;
    margin-right: 6px;
  }
</style>