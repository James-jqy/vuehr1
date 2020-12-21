<template>
  <div style="width: 500px;">
    <el-input
        prefix-icon="el-icon-search"
        placeholder="输入部门名称进行搜索"
        v-model="filterText">
    </el-input>

    <el-tree
        :data="deps"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree">

       <span style="display: flex;justify-content: space-between;width: 100%" class="custom-tree-node" slot-scope="{ node, data }">
        <span style="font-size: 16px">{{ data.name }}</span>
        <span>
          <el-button
              type="primary"
              size="mini"
              class="depBtn"
              @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
              type="danger"
              size="mini"
              class="depBtn"
              @click="() => deleteDep(node, data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>

  </div>
</template>

<script>
export default {
  name: "DepMana",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data(){
    return{
      filterText:'',
      deps:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initDeps();
  },
  methods:{
    deleteDep(data){
      console.log(data)
    },
    showAddDepView(data){

    },
    initDeps() {
      this.getRequest("/system/basic/department/").then(resp=>{
        if (resp){
          this.deps = resp;
        }
      })
    },
    //这个方法是当搜索框中的值发生变化的时候回调用的方法。
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
}
</script>

<style>
  .depBtn{
    padding: 2px ;
  }
</style>