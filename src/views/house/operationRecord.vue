<template>
  <div class="app-container">
    <el-form ref="params" :inline="true" :model="params" class="demo-form-inline">
      <el-form-item prop="name">
        <el-input v-model="params.resouceName" placeholder="楼盘名称" />
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="params.type" placeholder="所属模块">
          <el-option value="" label="全部模块" />
          <el-option value="0" label="基础信息" />
          <el-option value="1" label="销售信息" />
          <el-option value="2" label="户型信息" />
          <el-option value="3" label="相册" />
          <el-option value="4" label="楼栋单元" />
          <el-option value="5" label="楼层房号" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryForm('params')">查询</el-button>
        <el-button @click="resetForm('params')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="operationRecordPage"
      style="width: 100%"
      max-height="500"
      element-loading-text="Loading"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="createName" />
      <el-table-column label="楼盘名称" prop="resouceName" />
      <!--<el-table-column label="资源类型">
        <template slot-scope="scope">
          <span>{{ scope.row.model|modelFilter }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="模块" prop="typeName" />
      <el-table-column label="操作内容" prop="message" />
      <el-table-column label="操作IP" prop="ip" />
      <el-table-column label="时间" prop="createDate" />
    </el-table>
    <div style="float:right;margin-top:10px;">
      <el-pagination
        :current-page="params.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { operationRecordPageReq } from '@/api/operationRecord'
export default {
  name: 'OperationRecord',
  data() {
    return {
      logInfo: {
        createDate: '',
        createId: '',
        createName: '',
        deleteFlag: 0,
        resourceId: '',
        resouceName: '',
        model: '', // 0：楼盘 1：开发商 2：公司
        id: '',
        ip: '',
        message: '',
        remark: '',
        type: '', // 0：基础信息 1：销售信息 2：户型信息 3：相册 4，楼栋单元 5：楼层房号
        typeName: '',
        updateDate: null,
        updateId: null
      },
      params: {
        model: 0,
        name: '',
        type: '',
        resourceId: '',
        pageNo: 1,
        pageSize: 10
      },
      listLoading: false,
      operationRecordPage: null,
      total: null,
      totalPage: null
    }
  },
  created() {
    this.getOperationRecordPage()
  },
  methods: {
    queryForm() {
      this.params.pageNo = 1
      this.getOperationRecordPage()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getOperationRecordPage() {
      this.listLoading = true
      operationRecordPageReq(this.params).then(response => {
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        this.operationRecordPage = response.data.result
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getOperationRecordPage()
    },
    handleCurrentChange(val) {
      this.params.pageNo = val
      this.getOperationRecordPage()
    }
  },
  filters: {
    modelFilter(model) {
      let modelName = ''
      if (model === 0) {
        modelName = '楼盘'
      } else if (model === 1) {
        modelName = '开发商'
      } else if (model === 2) {
        modelName = '公司'
      }
      return modelName
    }
  }
}
</script>

<style scoped>

</style>
