<template>
  <div class="app-container">

    <el-form ref="param" :inline="true" :model="param" class="demo-form-inline">
      <el-form-item label="">
        <SelectTree
          :props="props"
          :options="cityData"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
        />
      </el-form-item>

      <el-form-item label="" prop="nameOrCode">
        <el-input
          v-model="param.nameOrCode"
          placeholder="楼盘名称/编码"
          :disabled="false"
        />
      </el-form-item>
      <el-form-item label="" prop="propertyType">
        <el-select v-model="param.propertyType" placeholder="物业类型">
          <el-option value="" label="全部">全部</el-option>
          <el-option
            v-for="item in dics"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />

        </el-select>
      </el-form-item>

      <el-form-item label="" prop="createDateStart">
        <el-date-picker v-model="param.createDateStart" type="date" placeholder="开始日期" /> 至

      </el-form-item>

      <el-form-item label="" prop="createDateEnd">
        <el-date-picker v-model="param.createDateEnd" placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetForm('param')">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-radio-group v-model="param.approveStatus" @change="fetchData()">
        <el-radio-button label="0">待审核</el-radio-button>
        <el-radio-button label="1">已通过</el-radio-button>
        <el-radio-button label="2">未通过</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="楼盘编码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="楼盘名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属物业" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.developercp }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="物业类型" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.propertyTypesName|propertyTypesName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="所在区域" width="200">
        <template slot-scope="scope">
          {{ scope.row.areaName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="上架状态" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.approveStatus|statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最后更新人" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updateName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text" size="small">编辑</el-button>
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
    <HouseEdit ref="edit"></HouseEdit>
  </div>

</template>

<script>
import { getList } from '@/api/house'
import SelectTree from '@/components/SelectTree'
import HouseEdit from '@/components/HouseEdit'

export default {
  components: {
    SelectTree,
    HouseEdit
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '待审核',
        1: '通过',
        2: '不通过'
      }
      return statusMap[status]
    },
    propertyTypesName(names) {
      var types = ''
      names.forEach(item => {
        types = types + ',' + item
      })
      return types.replace(/^,|,$/, '')
    }
  },
  data() {
    return {
      param: {
        propertyType: null,
        approveStatus: 0,
        createDateEnd: null,
        createDateStart: null,
        nameOrCode: null,
        areaCode: '',
        pageNo: 1,
        pageSize: 10
      },
      dics: this.$store.getters.dics(this.CONST.dic.type.propertyType),
      approveStatus: 0,
      list: null,
      total: null,
      totalPage: null,
      listLoading: true,
      filterText: '',
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      cityData: this.$store.getters.areaTree,
      props: {
        value: 'code',
        children: 'childrenList',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.param).then(response => {
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        this.list = response.data.result
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.param.pageSize = val
      this.fetchData()
    },

    handleCurrentChange(val) {
      this.param.pageNo = val
      this.fetchData()
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 取值
    getValue(value) {
      this.valueId = value
      this.param.areaCode = value
      console.log(this.valueId)
    },
    handleClick(id) {
      this.$refs.edit.init(id)
    }
  }
}
</script>
