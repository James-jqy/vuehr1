<template>
  <div>

    <div>
      <el-input
          size="small"
          class="addPosInput"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          @keydown.enter.native="initPositions"
          v-model="pos.name">
      </el-input>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
    </div>

    <div class="posManaMain">
      <el-table
          :data="positions"
          border
          size="small"
          @selection-change="handleSelectionChange"
          style="width: 70%">

        <el-table-column
            type="selection"
            width="55">
        </el-table-column>

        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="150"
        >
        </el-table-column>
        <el-table-column
            label="是否启用"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" @click="deleteMany" size="small" style="margin-top: 8px" :disabled="multipleSelection==0" >批量删除</el-button>
    </div>
    <!-- 修改按钮的对话框 -->
    <el-dialog
        title="修改职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <div style="margin-bottom: 15px">
          <el-tag style="margin-right: 5px">职位名称</el-tag>
          <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
        </div>
        <div>
          <el-tag>是否启用</el-tag>
          <el-switch
              v-model="updatePos.enabled"
              active-text="启用"
              inactive-text="禁用">
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data(){
    return {
      pos:{
        name:''
      },
      updatePos:{
        name:'',
        enabled:false
      },
      dialogVisible:false,
      positions: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.initPositions();
  },
  methods:{
    deleteMany(){
      this.$confirm('此操作将永久删除 '+this.multipleSelection.length+' 项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids='+item.id+'&';
        })
        this.deleteRequest("/system/basic/pos/" + ids).then(resp=>{
          if (resp){
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 批量删除的回调函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    doUpdate(){
      this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
        if (resp){
          //vue采用双向数据绑定。当数据更新的时候，只需要更新数据就行了。页面上面的展示自然会改变。
          this.initPositions();
          this.dialogVisible = false;
          this.updatePos.name = '';
        }
      })
    },
    addPosition(){
      if (this.pos.name){
          this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
            if (resp) {
              // 添加成功的话，刷新数据。
              this.initPositions();
              this.pos.name='';
            }
          })
      }else{
          this.$message.error("职位名称不可以为空！");
      }
    },
    showEditView(index,data){
        this.dialogVisible = true;
        //这里是将确定更新的对话框显示。只需要将dialogVisible设置为true即可。并且，将data（data是触发这个编辑事件的那个
      //行的对象）赋值为updatePos。这个赋值跟后端的指针赋值一样。当对于updatePos中属性做修改，data中的属性（就是原来的数据）
      //也会被修改。
      //   this.updatePos = data;

        //用Object的assign方法可以做值赋值。相当于创建了一个新的对象，将data中的数据赋值到这个新的对象，在把这个新的对象赋值
        //给this.updatePos。
        Object.assign(this.updatePos,data);
    },
    handleDelete(index,data){
        this.$confirm('此操作将永久删除['+data.name+'], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/system/basic/pos/" +data.id).then(resp=>{
            if (resp){
              this.initPositions();
            }
          })
        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    initPositions(){
      this.getRequest("/system/basic/pos/").then(resp=>{
        if (resp){
          this.positions = resp;
        }
      })
    }
  }
}
</script>

<style>
  .updatePosInput{
    width: 200px;
    margin-right: 8px;
  }
  .posManaMain{
    margin-top: 10px;
  }
  .addPosInput{
    width: 300px;
    margin-right: 8px;
  }
</style>