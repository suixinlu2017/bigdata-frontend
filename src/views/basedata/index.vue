<template>
  <div class="app-container">

    <el-form ref="param" :inline="true" :model="param" class="demo-form-inline">

      <el-form-item label="" prop="name">
        <el-input
          v-model="param.name"
          placeholder="字典名称"
          :disabled="false"
        />
      </el-form-item>
      <el-form-item label="" prop="type">
        <el-select v-model="param.type" placeholder="类型" @change="list">
          <el-option value="" label="全部">全部</el-option>
          <el-option
            v-for="item in dicTypes"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          />

        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()">查询</el-button>
        <el-button @click="resetForm('param')">重置</el-button>
        <el-button type="primary" @click="adddic">添加</el-button>

      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="dicList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="code">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column v-if="this.param.type===29" label="物业类型" prop="parentName" />
      <el-table-column label="编码" prop="code" />

      <el-table-column label="名称" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="映射编码" prop="aliasCode" />
      <el-table-column label="顺序" prop="sorted" />

      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editDic(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteDic(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div style="float:right;margin-top:10px;">
      <el-pagination
        :current-page="param.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="param.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--添加编辑楼盘字典-->
    <el-dialog :title="dicDialogTitle" :visible.sync="dialogDicFormVisible" :close-on-click-modal="false">
      <el-form ref="dicForm" :model="dicForm" :rules="dicRules" class="demo-ruleForm">
        <el-form-item label="类型" prop="type">
          <el-select v-model="dicForm.type" placeholder="类型">
            <el-option
              v-for="item in dicTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />

          </el-select>
        </el-form-item>
        <el-form-item v-if="dicForm.type===29" label="物业类型" prop="parentCode">
          <el-select v-model="dicForm.parentCode" placeholder="物业类型">
            <el-option
              v-for="item in propertyTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />

          </el-select>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="dicForm.code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dicForm.name" />
        </el-form-item>
        <el-form-item label="映射编码" prop="aliasCode">
          <el-input v-model="dicForm.aliasCode" />
        </el-form-item>
        <el-form-item label="顺序" prop="sorted">
          <el-input v-model="dicForm.sorted" maxlength="3" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDicFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import { pageDic, addDic, updateDic, deleteDic } from '@/api/dic'
import { isIntegerNotMust } from '@/common/validate'

export default {
  name: 'Dic',
  data() {
    return {
      listLoading: true,
      dicList: [],
      total: null,
      totalPage: null,
      param: {
        type: '',
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      propertyTypes: this.$store.getters.dics(this.CONST.dic.type.propertyType),
      dicTypes: [{ name: '物业类型', type: 1 }, { name: '房屋备案状态', type: 28 }, { name: '房屋属性', type: 29 }],
      /** 添加编辑楼盘字典*/
      dicDialogTitle: '编辑楼盘字典',
      dialogDicFormVisible: false,
      dicRules: {
        aliasCode: [
          { required: true, message: '请输入映射编码', trigger: 'blur' },
          { min: 1, max: 30, message: '长度小于30个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度小于30个字符', trigger: 'blur' }

        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 30, message: '长度小于30个字符', trigger: 'blur' }
        ],
        sorted: [{
          validator: isIntegerNotMust, trigger: 'blur'
        }],
        parentCode: [
          { required: true, message: '请选择物业类型', trigger: 'blur' }
        ]

      },
      isEdit: false,
      dicForm: {
        id: '',
        code: '',
        name: '',
        type: '',
        parentCode: '',
        aliasCode: '',
        sorted: 1
      }
    }
  },
  created() {
    this.list()
  },
  methods: {

    handleSizeChange(val) {
      this.param.pageSize = val
      this.list()
    },

    handleCurrentChange(val) {
      this.param.pageNo = val
      this.list()
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    list() {
      this.listLoading = true
      pageDic(this.param).then(response => {
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        this.dicList = response.data.result
        this.listLoading = false
      })
    },
    save() {
      this.$refs['dicForm'].validate((valid) => {
        if (valid) {
          if (this.dicForm.id !== '') {
            updateDic(this.dicForm).then(response => {
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.dialogDicFormVisible = false

                this.list()
              } else {
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            })
          } else {
            addDic(this.dicForm).then(response => {
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.dialogDicFormVisible = false
                this.list()
              } else {
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            })
          }
        }
      })
    },
    adddic() {
      this.dicForm = { id: '', sorted: 1 }
      this.isEdit = false
      this.dialogDicFormVisible = true
      this.dicDialogTitle = '添加楼盘字典'
      this.$refs['dicForm'].clearValidate()
    },
    editDic(obj) {
      this.dicForm = Object.assign({}, obj)
      this.isEdit = true
      this.dicDialogTitle = '编辑楼盘字典'
      this.dialogDicFormVisible = true
    },
    deleteDic(id) {
      this.$confirm('确定删除该数据吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDic(id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.list()
          }
        })
      }).catch(() => {

      })
    }
  }
}

</script>
