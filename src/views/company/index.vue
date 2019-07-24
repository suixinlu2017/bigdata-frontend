<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="开发商管理" name="first">
        <div>
          <el-form ref="queryForm1" :inline="true" :model="queryForm1" class="demo-form-inline">
            <el-form-item label="">
              <SelectTree
                :props="props"
                :options="cityData"
                :clearable="isClearable"
                :accordion="isAccordion"
                @getValue="getValue($event)"
              />
            </el-form-item>
            <el-form-item prop="developersNameOrCode">
              <el-input v-model="queryForm1.developersNameOrCode" placeholder="开发商名称/编号" />
            </el-form-item>
            <el-form-item prop="brandNameOrCode">
              <el-input v-model="queryForm1.brandNameOrCode" placeholder="品牌公司名称/编号" />
            </el-form-item>
            <el-form-item prop="isBrandCompany">
              <el-select v-model="queryForm1.isBrandCompany" placeholder="是否品牌公司">
                <el-option value="" label="是否品牌公司" />
                <el-option :value="false" label="否" />
                <el-option :value="true" label="是" />
              </el-select>
            </el-form-item>
            <el-form-item prop="source">
              <el-select v-model="queryForm1.source" placeholder="来源">
                <el-option value="" label="来源" />
                <el-option value="0" label="运营后台" />
                <el-option value="1" label="案场" />
              </el-select>
            </el-form-item>
            <el-form-item prop="approveStatus">
              <el-select v-model="queryForm1.approveStatus" placeholder="审核状态">
                <el-option value="" label="审核状态" />
                <el-option value="0" label="待审核" />
                <el-option value="1" label="审核通过" />
                <el-option value="2" label="驳回" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('queryForm1')">查询</el-button>
              <el-button @click="resetForm('queryForm1')">重置</el-button>
              <el-button type="primary" @click="addDeveloper">添加开发商</el-button>
              <el-button type="primary" @click="developerExport">导出</el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="listLoading"
            :data="developersPage"
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
            <el-table-column label="开发商编号">
              <template slot-scope="scope">
                <a style="color: #409EFF;" @click="showDeveloperViewDialog(scope.row)">{{ scope.row.code }}</a>
              </template>
            </el-table-column>
            <el-table-column label="开发商名称" prop="name" />
            <el-table-column label="城市" prop="cityName" />
            <el-table-column label="是否品牌公司">
              <template slot-scope="scope">
                {{ scope.row.isBrandCompany ?'是':'否' }}
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建日期">
              <template slot-scope="scope">
                {{ scope.row.createDate }}
              </template>
            </el-table-column>
            <el-table-column label="来源">
              <template slot-scope="scope">
                <span>{{ scope.row.source|sourceFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="审核状态">
              <template slot-scope="scope">
                <span>{{ scope.row.approveStatus|approveStatusFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editDeveloper(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteDeveloper(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="verifyDeveloper(scope.row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="float:right;margin-top:10px;">
            <el-pagination
              :current-page="queryForm1.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="queryForm1.pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="品牌公司管理" name="second">
        <el-form ref="queryForm2" :inline="true" :model="queryForm2" class="demo-form-inline">
          <el-form-item prop="name">
            <el-input v-model="queryForm2.name" placeholder="品牌公司名称/编号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('queryForm2')">查询</el-button>
            <el-button @click="resetForm('queryForm2')">重置</el-button>
            <el-button type="primary" @click="addCompany">添加品牌公司</el-button>
            <el-button type="primary" @click="brandCompanyExport">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="listLoading"
          :data="brandCompanyPage"
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
          <el-table-column label="品牌公司编号" prop="code" />
          <el-table-column label="品牌公司名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="品牌LOGO">
            <template slot-scope="scope">
              <img :src="scope.row.logo" style="width: 70px;height: 70px" @click="viewOriginalPicture(scope.row.logo)">
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建日期">
            <template slot-scope="scope">
              {{ scope.row.createDate }}
            </template>
          </el-table-column>
          <el-table-column label="添加人" prop="createName" />
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editCompany(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteCompany(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="float:right;margin-top:10px;">
          <el-pagination
            :current-page="queryForm2.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryForm2.pageSize"
            :total="total1"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
    <!--添加/编辑开发商-->
    <el-dialog :title="devlopersDialogTitle" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="developerForm" :inline="true" :model="developerForm" :rules="developerRules" class="demo-ruleForm">
        <el-form-item label="开发商名称" prop="name">
          <el-input v-model="developerForm.name" maxlength="30" />
          <span style="color:dodgerblue">(公司全称需与营业执照上的公司名称保持一致)</span>
        </el-form-item>
        <el-form-item label="城市" prop="cityCode">
          <SelectTree
            :props="props"
            :options="cityData"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getDeveloperEditCityCode($event)"
          />
        </el-form-item>
        <el-form-item label="是否品牌公司">
          <el-select v-model="developerForm.isBrandCompany" @change="brandCompanySelectChange(developerForm.isBrandCompany)">
            <el-option :value="false" label="否" />
            <el-option :value="true" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属品牌公司" prop="companyList">
          <div v-for="(company, index) in developerForm.companyList" :key="company.id">
            <el-autocomplete
              v-model="company.name"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearchAsync"
              placeholder="请选择品牌公司"
              :disabled="brandCompanyInputEnable"
              :clearable="true"
              name="companyList"
              @select="((item)=>{handleSelect(item, index)})"
            >
              <template slot-scope="props">
                <div class="name">{{ props.item.name }}</div>
              </template>
            </el-autocomplete>
            <el-button v-if="index === 0" icon="el-icon-circle-plus-outline" :disabled="brandCompanyInputEnable" @click="addParentCompany" />
            <el-button v-else icon="el-icon-remove-outline" :disabled="brandCompanyInputEnable" @click="removeParentCompany(index)" />
          </div>
        </el-form-item>
        <hr style="FILTER: alpha(opacity = 100,finishopacity=0,style=3)" width="100%" color="#DCDFE6" SIZE="3">
        <el-form-item label="是否一般纳税人">
          <el-select v-model="developerForm.isTaxpayer" @change="isTaxpayerSelectChange">
            <el-option :value="false" label="否" />
            <el-option :value="true" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="developerForm.taxRate" type="number" max="9" min="0" style="width: 150px" /> %
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxpayerNumber">
          <el-input v-model="developerForm.taxpayerNumber" maxlength="20" />
        </el-form-item>
        <el-form-item label="开户行" prop="openBank">
          <el-input v-model="developerForm.openBank" maxlength="30" />
        </el-form-item>
        <el-form-item label="账户" prop="bankAccount">
          <el-input v-model="developerForm.bankAccount" maxlength="19" />
        </el-form-item>
        <el-form-item label="联系人" maxlength="20" prop="contacts">
          <el-input v-model="developerForm.contacts" />
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="developerForm.tel" maxlength="13" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="developerForm.address" maxlength="50" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="developerForm.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="备注信息"
            maxlength="300"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('developerForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--开发商审核-->
    <el-dialog :title="verifyTitle" :visible.sync="dialogVerifyVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-row>
        <el-col :span="4"><label><i style="color:red">*</i> 公司名称</label></el-col>
        <el-col :span="8">{{ developerForm.name }}</el-col>
        <el-col :span="4"><label><i style="color:red">*</i> 城市</label></el-col>
        <el-col :span="8">{{ developerForm.cityCode }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>是否有品牌公司</label></el-col>
        <el-col :span="8">{{ developerForm.isBrandCompany?'是':'否' }}</el-col>
        <el-col :span="4"><label>所属品牌公司</label></el-col>
        <el-col :span="8">{{ developerForm.brandCompanyName }}</el-col>
      </el-row>
      <hr style="FILTER: alpha(opacity = 100,finishopacity=0,style=3)" width="100%" color="#DCDFE6" SIZE="3">
      <el-row>
        <el-col :span="4"><label>是否一般纳税人</label></el-col>
        <el-col :span="8">{{ developerForm.isTaxpayer?'是':'否' }}</el-col>
        <el-col :span="4"><label>税率</label></el-col>
        <el-col :span="8">{{ developerForm.taxRate }}%</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>纳税人识别号</label></el-col>
        <el-col :span="8">{{ developerForm.taxpayerNumber }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>开户行</label></el-col>
        <el-col :span="8">{{ developerForm.openBank }}</el-col>
        <el-col :span="4"><label>账户</label></el-col>
        <el-col :span="8">{{ developerForm.bankAccount }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>联系人</label></el-col>
        <el-col :span="8">{{ developerForm.contacts }}</el-col>
        <el-col :span="4"><label>联系方式</label></el-col>
        <el-col :span="8">{{ developerForm.tel }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>地址</label></el-col>
        <el-col :span="8">{{ developerForm.address }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>备注</label></el-col>
        <el-col :span="8">{{ developerForm.remark }}</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = true;verifyForm.desc = ''">驳 回</el-button>
        <el-button type="primary" @click="verifyStatus(1,developerForm.id)">通 过</el-button>
      </div>
      <el-dialog
        width="30%"
        title="驳回原因"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <el-form ref="verifyForm" :inline="true" :model="verifyForm" :rules="verifyRules" class="demo-ruleForm">
          <el-form-item label="原因" prop="desc">
            <el-input
              v-model="verifyForm.desc"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2}"
              placeholder="请输入驳回原因"
              maxlength="50"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="verifyStatus(2,developerForm.id)">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!--查看开发商-->
    <el-dialog :visible.sync="dialogDeveloperViewVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-tabs v-model="activeName1" @tab-click="handleClick">
        <el-tab-pane label="公司详情" name="first">
          <el-row>
            <el-col :span="4"><label><i style="color:red">*</i> 公司名称</label></el-col>
            <el-col :span="8">{{ developerForm.name }}</el-col>
            <el-col :span="4"><label><i style="color:red">*</i> 城市</label></el-col>
            <el-col :span="8">{{ developerForm.cityName }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><label>是否有品牌公司</label></el-col>
            <el-col :span="8">{{ developerForm.isBrandCompany?'是':'否' }}</el-col>
            <el-col :span="4"><label>所属品牌公司</label></el-col>
            <el-col :span="8">{{ developerForm.brandCompanyName }}</el-col>
          </el-row>
          <hr style="FILTER: alpha(opacity = 100,finishopacity=0,style=3)" width="100%" color="#DCDFE6" SIZE="3">
          <el-row>
            <el-col :span="4"><label>是否一般纳税人</label></el-col>
            <el-col :span="8">{{ developerForm.isTaxpayer?'是':'否' }}</el-col>
            <el-col :span="4"><label>税率</label></el-col>
            <el-col :span="8">{{ developerForm.taxRate }}%</el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><label>纳税人识别号</label></el-col>
            <el-col :span="8">{{ developerForm.taxpayerNumber }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><label>开户行</label></el-col>
            <el-col :span="8">{{ developerForm.openBank }}</el-col>
            <el-col :span="4"><label>账户</label></el-col>
            <el-col :span="8">{{ developerForm.bankAccount }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><label>联系人</label></el-col>
            <el-col :span="8">{{ developerForm.contacts }}</el-col>
            <el-col :span="4"><label>联系方式</label></el-col>
            <el-col :span="8">{{ developerForm.tel }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><label>地址</label></el-col>
            <el-col :span="8">{{ developerForm.address }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><label>备注</label></el-col>
            <el-col :span="8">{{ developerForm.remark }}</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="操作记录" name="second">
          <el-table
            v-loading="listLoading"
            :data="developerOperationRecordPage"
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
            <el-table-column label="操作内容" prop="message" />
            <el-table-column label="操作IP" prop="ip" />
            <el-table-column label="时间" prop="createDate" />
          </el-table>
          <div style="float:right;margin-top:10px;">
            <el-pagination
              :current-page="devRecordParams.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="devRecordParams.pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--添加/编辑品牌公司-->
    <el-dialog :title="companyDialogTitle" :visible.sync="dialogCompanyFormVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="companyForm" :model="companyForm" :rules="companyRules" class="demo-ruleForm">
        <el-form-item label="品牌公司名称" prop="name">
          <el-input v-model="companyForm.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCompanyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('companyForm')">确 定</el-button>
      </div>
      <el-upload
        action="http://10.1.220.5:9090/service-oss/upload"
        :file-list="fileList"
        list-type="picture-card"
        limit="1"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { developersPage, brandCompanyPage, developerSave, developerDelete, developerVerifyRequest, brandCompanySave, companyDeleteReq } from '@/api/company'
import SelectTree from '@/components/SelectTree'
import { operationRecordPageReq } from '@/api/operationRecord'
import { isIntegerNotMust } from '@/common/validate'
export default {
  components: {
    SelectTree
  },
  filters: {
    sourceFilter(source) {
      let sourceStr = ''
      if (source === 0) {
        sourceStr = '运营后台'
      } else if (source === 1) {
        sourceStr = '案场'
      }
      return sourceStr
    },
    approveStatusFilter(approveStatus) {
      let statusStr = ''
      if (approveStatus === 0) {
        statusStr = '待审核'
      } else if (approveStatus === 1) {
        statusStr = '审核通过'
      } else if (approveStatus === 2) {
        statusStr = '驳回'
      }
      return statusStr
    }
  },
  data() {
    /* var validateBrandCompany = (rule, value, callback) => {
      if (this.brandCompanyInputEnable) {
        if (value === '') {
          return callback(new Error('请选择所属品牌公司'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }*/
    return {
      activeName: 'first',
      activeName1: 'first',
      queryForm1: {
        cityCode: '',
        developersNameOrCode: '',
        brandNameOrCode: '',
        approveStatus: '',
        isBrandCompany: '',
        source: '',
        pageNo: 1,
        pageSize: 10
      },
      developersPage: null,
      total: null,
      totalPage: null,
      queryForm2: {
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      total1: null,
      totalPage1: null,
      brandCompanyPage: null,
      listLoading: true,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      cityData: this.$store.getters.areaTree,
      props: {
        value: 'code',
        children: 'childrenList',
        label: 'name'
      },
      devlopersDialogTitle: '添加开发商',
      dialogFormVisible: false,
      developerForm: {
        address: '', // 地址
        approveDesc: '', // 审批意见
        approveStatus: 0, // 0:待审核 1：审核通过 2：不通过
        bankAccount: '', // 账户
        brandCompanyId: '', // 品牌公司ID
        brandCompanyIds: [],
        companyList: [],
        brandCompanyName: '', // 品牌公司名称
        cityCode: '', // 城市编码
        cityName: '',
        code: '', // 编号
        contacts: '', // 联系人
        id: '',
        isBrandCompany: false, // 是否品牌公司
        isTaxpayer: false, // 是否纳税人
        name: '', // 名字
        openBank: '', // 开户行
        source: 0, // 0：运营后台 1：案场
        taxRate: '', // 税率
        taxpayerNumber: '', // 纳税人识别号
        tel: '', // 联系方式
        remark: ''// 备注
      },
      developerInfo: {
        address: '', // 地址
        approveDesc: '', // 审批意见
        approveStatus: 0, // 0:待审核 1：审核通过 2：不通过
        bankAccount: '', // 账户
        brandCompanyId: '', // 品牌公司ID
        brandCompanyIds: [],
        companyList: [{
          id: '',
          name: ''
        }],
        brandCompanyName: '', // 品牌公司名称
        cityCode: '', // 城市编码
        code: '', // 编号
        contacts: '', // 联系人
        id: '',
        isBrandCompany: false, // 是否品牌公司
        isTaxpayer: false, // 是否纳税人
        name: '', // 名字
        openBank: '', // 开户行
        source: 0, // 0：运营后台 1：案场
        taxRate: '', // 税率
        taxpayerNumber: '', // 纳税人识别号
        tel: '', // 联系方式
        remark: ''// 备注
      },
      brandCompanyInputEnable: true,
      brandCompanyList: [],
      state: '',
      timeout: null,
      developerRules: {
        name: [
          { required: true, message: '请输入开发商名称', trigger: 'blur' }
        ],
        cityCode: [
          { required: true, message: '请选择城市', trigger: 'blur' }
        ],
        companyList: [],
        taxRate: {},
        taxpayerNumber: {},
        openBank: {},
        bankAccount: [{ validator: isIntegerNotMust, trigger: 'blur' }],
        contacts: {},
        tel: {},
        address: {}
      },
      developerOperationRecordPage: null,
      /* 开发商审核*/
      dialogVerifyVisible: false,
      verifyTitle: '开发商审核',
      innerVisible: false,
      verifyForm: {
        id: '',
        approveStatus: '',
        desc: ''
      },
      verifyRules: {
        desc: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' }
        ]
      },
      /* 开发商查看*/
      dialogDeveloperViewVisible: false,
      devRecordParams: {
        model: 1,
        name: '',
        type: '',
        resourceId: '',
        pageNo: 1,
        pageSize: 10
      },
      /* 品牌公司*/
      companyDialogTitle: '添加品牌公司',
      dialogCompanyFormVisible: false,
      companyForm: {
        id: '',
        logo: '',
        name: ''
      },
      fileList: [],
      companyRules: {
        name: [
          { required: true, message: '请输入品牌公司名称', trigger: 'change' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.getDevelopersPage()
  },
  methods: {
    handleTabsClick(tab, event) {
      debugger
      if (tab.index === '0') {
        this.getDevelopersPage()
      } else {
        this.getBrandCompanyPage()
      }
    },
    getDevelopersPage() {
      this.listLoading = true
      developersPage(this.queryForm1).then(response => {
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        this.developersPage = response.data.result
        this.listLoading = false
      })
    },
    getBrandCompanyPage() {
      this.listLoading = true
      brandCompanyPage(this.queryForm2).then(response => {
        this.total1 = response.data.total
        this.totalPage1 = response.data.totalPage
        this.brandCompanyPage = response.data.result
        this.listLoading = false
      })
    },
    brandCompanySelectChange(val) {
      if (val) {
        this.brandCompanyInputEnable = false
        const rule = [{ required: true, type: 'array', validator: this.parentCompanyValidator, trigger: 'blur' }]
        this.developerRules['companyList'] = rule
      } else {
        this.developerForm.brandCompanyName = ''
        this.developerForm.brandCompanyId = ''
        this.developerRules['companyList'] = []
        this.brandCompanyInputEnable = true
      }
      debugger
    },
    submitForm(formName) {
      if (formName === 'queryForm1') {
        this.getDevelopersPage()
      } else if (formName === 'queryForm2') {
        this.getBrandCompanyPage()
      } else if (formName === 'developerForm') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const ids = []
            for (let i = 0; i < this.developerForm.companyList.length; i++) {
              ids.push(this.developerForm.companyList[i].id)
            }
            debugger
            this.developerForm.brandCompanyIds = ids
            const loadingInstance = this.$loading({ test: '提交中' })
            developerSave(this.developerForm).then(response => {
              loadingInstance.close()
              debugger
              if (response.code === 200) {
                this.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.getDevelopersPage()
              } else {
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            })
          } else {
            return false
          }
        })
      } else if (formName === 'companyForm') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            debugger
            const loadingInstance = this.$loading({ test: '提交中' })
            brandCompanySave(this.companyForm).then(response => {
              loadingInstance.close()
              debugger
              if (response.code === 200) {
                this.dialogCompanyFormVisible = false
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.getBrandCompanyPage()
              } else {
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getValue(value) {
      this.queryForm1.cityCode = value
    },
    handleSizeChange(val) {
      this.queryForm1.pageSize = val
      this.getDevelopersPage()
    },
    handleCurrentChange(val) {
      this.queryForm1.pageNo = val
      this.getDevelopersPage()
    },
    handleSizeChange1(val) {
      this.queryForm2.pageSize = val
      this.getBrandCompanyPage()
    },
    handleCurrentChange1(val) {
      this.queryForm2.pageNo = val
      this.getBrandCompanyPage()
    },
    developerExport() {
      const url = this.CONST.baseUrl + '/developers/download?developersNameOrCode=' + this.queryForm1.developersNameOrCode + '&brandNameOrCode=' + this.queryForm1.brandNameOrCode + '&cityCode=' + this.queryForm1.cityCode + '&isBrandCompany=' + this.queryForm1.isBrandCompany + '&source=' + this.queryForm1.source + '&approveStatus=' + this.queryForm1.approveStatus
      window.location.href = url
      // developerExportRequest(this.queryForm1)
    },
    addDeveloper() {
      this.devlopersDialogTitle = '添加开发商'
      this.developerForm = Object.assign({}, this.developerInfo)
      this.initDeveloperForm(this.developerForm)
      this.dialogFormVisible = true
      SelectTree.clearHandle()
    },
    editDeveloper(obj) {
      debugger
      this.devlopersDialogTitle = '编辑开发商'
      this.developerForm = Object.assign({}, obj)
      if (this.developerForm.taxRate != null) {
        this.developerForm.taxRate = String(this.developerForm.taxRate)
      }
      this.initDeveloperForm(this.developerForm)
      this.dialogFormVisible = true
    },
    deleteDeveloper(obj) {
      this.$confirm('确认删除\n' + obj.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        developerDelete(obj.id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDevelopersPage()
          } else {
            this.$message({
              type: 'info',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getDeveloperEditCityCode(value) {
      this.developerForm.cityCode = value
    },
    verifyDeveloper(obj) {
      debugger
      this.desc = ''
      this.developerForm = obj
      this.dialogVerifyVisible = true
    },
    verifyStatus(state, id) {
      debugger
      this.$refs['verifyForm'].validate((valid) => {
        if (valid) {
          this.verifyForm.id = id
          this.verifyForm.approveStatus = state
          developerVerifyRequest(this.verifyForm).then(response => {
            if (response.code === 200) {
              this.innerVisible = false
              this.dialogVerifyVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getDevelopersPage()
            } else {
              this.$message({
                type: 'info',
                message: '执行失败，请稍后重试!'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    querySearchAsync(keyword, cb) {
      const params = { name: keyword, pageNo: 1, pageSize: 50 }
      brandCompanyPage(params).then(response => {
        debugger
        if (response.code === 200) {
          this.brandCompanyList = response.data.result
          const results = keyword ? this.brandCompanyList.filter(this.createStateFilter(keyword)) : this.brandCompanyList

          // clearTimeout(this.timeout)
          // this.timeout = setTimeout(() => {
          cb(results)
          // }, 3000 * Math.random())
        }
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect(item, index) {
      // this.developerForm.brandCompanyId = item.id
      // this.developerForm.brandCompanyName = item.name
      this.developerForm.companyList[index].id = item.id
      this.developerForm.companyList[index].name = item.name
    },
    initDeveloperForm(formData) {
      this.brandCompanySelectChange(formData.isBrandCompany)
      this.isTaxpayerSelectChange(formData.isTaxpayer)
    },
    showDeveloperViewDialog(formData) {
      this.developerForm = Object.assign({}, formData)
      this.devRecordParams.resourceId = this.developerForm.id
      this.dialogDeveloperViewVisible = true
      this.getOperationRecordPage()
    },
    getOperationRecordPage() {
      this.listLoading = true
      operationRecordPageReq(this.devRecordParams).then(response => {
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        this.developerOperationRecordPage = response.data.result
        this.listLoading = false
      })
    },
    handleSizeChange2(val) {
      this.devRecordParams.pageSize = val
      this.getOperationRecordPage()
    },
    handleCurrentChange2(val) {
      this.devRecordParams.pageNo = val
      this.getOperationRecordPage()
    },
    /* 增加所属品牌公司*/
    addParentCompany(type) {
      const company = { id: '', name: '' }
      this.developerForm.companyList.push(company)
    },
    removeParentCompany(index) {
      this.developerForm.companyList.splice(index, 1)
    },
    autocmpletefocus(index) {
      alert(index)
    },
    /* 品牌公司*/
    brandCompanyExport() {
      const url = this.CONST.baseUrl + '/brandCompany/download?name=' + this.queryForm2.name
      window.location.href = url
    },
    addCompany() {
      this.companyDialogTitle = '添加品牌公司'
      this.companyForm = {}
      this.dialogCompanyFormVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      debugger
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    viewOriginalPicture(url) {
      debugger
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      debugger
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp'
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF/BMP 格式!')
      }
      /* if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }*/
      return isJPG
    },
    handleUploadSuccess(response, file, fileList) {
      debugger
      if (response.code === 200) {
        this.companyForm.logo = response.data.url
      }
    },
    editCompany(obj) {
      debugger
      this.companyDialogTitle = '编辑品牌公司'
      this.companyForm = Object.assign({}, obj)
      this.fileList = []
      this.fileList.push({ name: '', url: obj.logo })
      this.dialogCompanyFormVisible = true
    },
    deleteCompany(obj) {
      this.$confirm('确认删除\n' + obj.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        companyDeleteReq(obj.id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getBrandCompanyPage()
          } else {
            this.$message({
              type: 'info',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    isTaxpayerSelectChange(val) {
      if (val) {
        this.developerRules.taxRate = [
          { required: true, message: '请填写税率', trigger: 'blur' }
        ]
        this.developerRules.taxpayerNumber = [
          { required: true, message: '请填写纳税人识别号', trigger: 'blur' }
        ]
        this.developerRules.openBank = [
          { required: true, message: '请填写开户行', trigger: 'blur' }
        ]
        this.developerRules.bankAccount = [
          { required: true, message: '请填写账户', trigger: 'blur' },
          { validator: isIntegerNotMust, trigger: 'blur' }
        ]
        this.developerRules.contacts = [
          { required: true, message: '请填写联系人', trigger: 'blur' }
        ]
        this.developerRules.tel = [
          { required: true, message: '请填写联系方式', trigger: 'blur' }
        ]
        this.developerRules.address = [
          { required: true, message: '请填写地址', trigger: 'blur' }
        ]
      } else {
        this.developerRules.taxRate = {}
        this.developerRules.taxpayerNumber = {}
        this.developerRules.openBank = {}
        this.developerRules.bankAccount = [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }]
        this.developerRules.contacts = {}
        this.developerRules.tel = {}
        this.developerRules.address = {}
      }
    },
    parentCompanyValidator(rule, value, callback) {
      debugger
      if (!value) {
        callback(new Error('请至少添加一个品牌公司'))
      }
      let validateCount = 0
      for (let i = 0; i < value.length; i++) {
        if (value[i].id !== '') {
          validateCount = validateCount + 1
        }
      }
      if (validateCount === 0) {
        callback(new Error('请至少添加一个品牌公司'))
      } else {
        callback()
      }
      /* setTimeout(() => {
        let validateCount = 0
        for (let i = 0; i < value.length; i++) {
          if (value.id !== '') {
            validateCount = validateCount + 1
          }
        }
        if (validateCount === 0) {
          callback(new Error('请至少添加一个品牌公司'))
        } else {
          callback()
        }
      }, 1000)*/
    }
  }
}
</script>
