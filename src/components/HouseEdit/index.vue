<template>
  <div>
    <el-dialog ref="myDialog" :visible.sync="dialogTableVisible" lock-sroll="false" class="abow_dialog" width="90%" :close-on-click-modal="false">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange">
        <el-tab-pane label="楼栋单元" name="build">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              楼栋<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">新增独栋</el-dropdown-item>
              <el-dropdown-item command="b">批量新增楼栋</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              单元<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">新增单元</el-dropdown-item>
              <el-dropdown-item command="d">批量新增单元</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div id="BuildingBody" style="max-height: 500px; overflow-y: auto">
            <el-table
              :data="tempBuildList"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              :span-method="arraySpanMethod"
              border
              lazy
              ref="tree"
              :load="load"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column prop="id" type="index" label="序号" />
              <el-table-column prop="unitName" label="单元名">
                <template slot-scope="{row}">
                  <div v-if="row.hasChildren" class="t-cell">
                    楼栋名:<el-input v-model="row.buildingName" style="width: 100px" />
                    备案名:<el-input v-model="row.buildingRegisterName" style="width: 100px" />
                    建造年代：<el-date-picker v-model="row.constructionTime" type="month" placeholder="选择年月" style="width: 120px" />
                    产权：<el-input v-model="row.propertyYear" style="width: 100px" />
                    坐标：<div style="display: inline" @click="showMap(row.id,1)"><el-input v-model="row.tudeString" style="width: 10%" readonly /></div>
                    <div style="display: inline">
                      <el-button type="text" size="small" @click="handleAdd(row)">添加单元</el-button>
                      <el-dropdown @command="copyBuilding">
                        <el-button type="text">
                          复制<i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="composeValue(row,1)">仅复制楼栋</el-dropdown-item>
                          <el-dropdown-item :command="composeValue(row,3)">复制楼栋（含单元）</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-button type="text" size="small" @click="handleDelete(row,1)">删除</el-button>
                    </div>
                  </div>
                  <template v-else>
                    <template v-if="row.isSingleBuild">
                      -
                    </template>
                    <template v-else>
                      <el-input v-model="row.unitName" class="input-100" size="small" />
                    </template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="unitRegisterName" label="单元备案名">
                <template slot-scope="{row}">
                  <div v-if="row.isSingleBuild">
                    -
                  </div>
                  <div v-else>
                    <el-input v-model="row.unitRegisterName" size="small" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="物业类型">
                <template slot-scope="{row}">
                  <el-select v-model="row.propertyType" placeholder="物业类型" size="small">
                    <el-option
                      v-for="item in propertyTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="房屋属性">
                <template slot-scope="{row}">
                  <el-select v-model="row.propertyChargeType" placeholder="房屋属性" size="small">
                    <el-option
                      v-for="item in buildingTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="电梯数">
                <template slot-scope="{row}">
                  <el-input v-model="row.elevatorNum" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="楼层户数">
                <template slot-scope="{row}">
                  <el-input v-model="row.familyCount" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="坐标">
                <template slot-scope="{row}">
                  <template v-if="row.isSingleBuild">
                    -
                  </template>
                  <template v-else>
                    <div @click="showMap(row.id,2,row.buildingId)">
                      <el-input v-model="row.tudeString" style="width: 50%" readonly />
                    </div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{row}">
                  <div v-if="row.isSingleBuild">
                    <el-button type="text" size="small" @click="handleEdit(row,1)">编辑</el-button>
                  </div>
                  <div v-else>
                    <el-button type="text" size="small" @click="handleEdit(row,2)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleCopy(row)">复制</el-button>
                    <el-button type="text" size="small" @click="handleDelete(row,2)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="楼层房号" name="room">
          <div id="RoomBody" style="max-height: 500px; overflow-y: auto">
            <el-row>
              <el-col :span="4"><div><el-tree ref="buildTree" node-key="id" :default-expand-all="true" :data="tempBuildList" :props="defaultProps" @node-click="handleNodeClick" /></div></el-col>
              <el-col :span="20">
                <el-row style="padding: 20px 0 10px 0;">
                  <el-dropdown @command="handleCommand">
                    <el-button type="primary">
                      楼层<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="e">新增楼层</el-dropdown-item>
                      <el-dropdown-item command="f">批量新增楼层</el-dropdown-item>
                      <el-dropdown-item command="g">批量修改楼层</el-dropdown-item>
                      <el-dropdown-item command="h">批量删除楼层</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dropdown @command="handleCommand">
                    <el-button type="primary">
                      房号<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="i">新增房号</el-dropdown-item>
                      <el-dropdown-item command="j">批量新增房号</el-dropdown-item>
                      <el-dropdown-item command="k">批量修改房号</el-dropdown-item>
                      <el-dropdown-item command="l">批量删除房号</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
                <el-row style="padding: 20px 0 10px 0;">
                  <el-col :span="24">
                    {{ name }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-checkbox-group
                      v-model="checkedCities"
                    >
                      <table class="el-table el-table__body el-table__body-wrapper" cellspacing="0" cellpadding="0" border="0">
                        <tr class="el-table__row">
                          <th>   <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">楼层/房号序号</el-checkbox>
                          </th>
                          <th v-for="item in roomSeqs">
                            <el-checkbox :key="item" :label="item" @change="seqCheck($event,item)">  {{ item }} </el-checkbox>
                          </th>
                        </tr>
                        <tr v-for=" floorRoom in floorRooms" class="el-table__row">
                          <td v-for="room in floorRoom">
                            <el-checkbox v-if="room.type ===1 && room.name != ''" :key="room.id" :label="room.id" @change="roomCheck($event,room)">{{ room.name }}</el-checkbox>
                            <el-checkbox v-if="room.type ===0" :key="room.id" v-model="rowCheckFlag" :label="room.id" @change="rowCheck($event,room)">
                              {{ room.name }} </el-checkbox>
                          </td>
                        </tr>
                      </table>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="saveAllButtonFlag" type="primary" @click="handleSubmit()">保存所有</el-button>
        <el-button @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--    新增独栋-->
    <el-dialog
      width="30%"
      title="新增/编辑独栋"
      :visible.sync="newSingleBuilding"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="singleBuildFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="singleBuildForm" :model="buildUnitObj" :rules="singleBuildFormRules">
          <el-form-item label="楼栋名:" :label-width="formLabelWidth" prop="buildingName">
            <el-input v-model="buildUnitObj.buildingName" style="width: 50%" placeholder="请输入楼栋名（如A栋）" @blur="autoFill(1)"/>
          </el-form-item>
          <el-form-item label="楼栋备案名:" :label-width="formLabelWidth" prop="buildingRegisterName">
            <el-input v-model="buildUnitObj.buildingRegisterName" style="width: 50%" placeholder="请输入楼栋备案名（如A栋）" />
          </el-form-item>
          <el-form-item label="建造年代:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.constructionTime"
              type="month"
              placeholder="选择年月"
            />
          </el-form-item>
          <el-form-item label="产权年限:" :label-width="formLabelWidth" prop="propertyYear">
            <el-input v-model="buildUnitObj.propertyYear" style="width: 50%" placeholder="请输入数字" />
            年
          </el-form-item>
          <el-form-item label="楼栋坐标:" :label-width="formLabelWidth" required>
            <div @click="showMap(0,0)">
              <el-input v-model="tudeString" style="width: 50%" readonly />
            </div>
          </el-form-item>
          <el-form-item label="物业类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.propertyType" placeholder="请选择" @change="selectPropertyType(1)">
              <el-option
                v-for="item in propertyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="房屋属性;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.buildingType" placeholder="请选择">
              <el-option
                v-for="item in buildingTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="电梯数:" :label-width="formLabelWidth" prop="elevatorNum">
            <el-input v-model="buildUnitObj.elevatorNum" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="楼层户数:" :label-width="formLabelWidth" prop="familyCount">
            <el-input v-model="buildUnitObj.familyCount" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="物业费区间:" :label-width="formLabelWidth">
            <el-col :span="5">
              <el-form-item prop="propertyFeeMin">
                <el-input v-model="buildUnitObj.propertyFeeMin" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="propertyFeeMax">
                <el-input v-model="buildUnitObj.propertyFeeMax" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-select v-model="buildUnitObj.propertyChargeType" placeholder="请选择">
                  <el-option label="元/平方*月含空调" value="0" />
                  <el-option label="元/平方*月" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="空调费:" :label-width="formLabelWidth" prop="airconditionFee">
            <el-input v-model="buildUnitObj.airconditionFee" style="width: 50%" />
            元/立方/月
          </el-form-item>
          <el-form-item label="空调类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.airconditionerType" placeholder="请选择">
              <el-option label="无中央空调" value="0" />
              <el-option label="有中央空调" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="大堂层高:" :label-width="formLabelWidth" prop="lobbyHigh">
            <el-input v-model="buildUnitObj.lobbyHigh" style="width: 50%" placeholder="请输入数字" />
            m
          </el-form-item>
          <el-form-item label="竣工日期;" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.completionDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="使用周期:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.startUseTime"
              type="date"
              placeholder="选择开始日期"
            />
            -
            <el-date-picker
              v-model="buildUnitObj.endUseTime"
              type="date"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="宗地号:" :label-width="formLabelWidth" prop="landNumber">
            <el-input v-model="buildUnitObj.landNumber" style="width: 50%" />
          </el-form-item>
          <el-form-item label="宗地面积:" :label-width="formLabelWidth" prop="landArea">
            <el-input v-model="buildUnitObj.landArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="总面积:" :label-width="formLabelWidth" prop="totalBuildArea">
            <el-input v-model="buildUnitObj.totalBuildArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSingleBuild('singleBuildForm')">提交</el-button>
        <el-button @click="newSingleBuilding = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量新增楼栋-->
    <el-dialog
      width="30%"
      title="批量新增楼栋"
      :visible.sync="newBatchBuilding"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="batchBuildFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="batchBuildForm" :model="buildUnitObj" :rules="batchBuildFormRules">
          <el-form-item label="楼栋名:" :label-width="formLabelWidth" prop="buildingName"  @blur="autoFill(1)">
            <el-input v-model="buildUnitObj.buildingName" style="width: 50%" placeholder="请输入楼栋名（如A栋）" />
          </el-form-item>
          <el-form-item label="楼栋备案名:" :label-width="formLabelWidth">
            <el-input v-model="buildUnitObj.buildingRegisterName" style="width: 50%" placeholder="请输入楼栋备案名（如A栋）" />
          </el-form-item>
          <el-form-item label="楼栋起止序号:" :label-width="formLabelWidth" required>
            <el-col :span="5">
              <el-form-item prop="buildingSeqStart">
                <el-input v-model="buildUnitObj.buildingSeqStart" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="buildingSeqEnd">
                <el-input v-model="buildUnitObj.buildingSeqEnd" style="width: 80px" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="楼栋名格式;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.buildingNameFormat">
              <el-option label="阿拉伯数字" value="1" />
              <el-option label="大写数字" value="2" />
              <el-option label="小写字母" value="3" />
              <el-option label="大写字母" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="单元名:" :label-width="formLabelWidth" prop="unitName"  @blur="autoFill(2)">
            <el-input v-model="buildUnitObj.unitName" style="width: 50%" placeholder="请输入单元名（如A单元）" />
          </el-form-item>
          <el-form-item label="单元备案名:" :label-width="formLabelWidth">
            <el-input v-model="buildUnitObj.unitRegisterName" style="width: 50%" placeholder="请输入单元名（如单元）" />
          </el-form-item>
          <el-form-item label="单元起止序号:" :label-width="formLabelWidth" required>
            <el-col :span="5">
              <el-form-item prop="unitSeqStart">
                <el-input v-model="buildUnitObj.unitSeqStart" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="unitSeqEnd">
                <el-input v-model="buildUnitObj.unitSeqEnd" style="width: 80px" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="单元名格式;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.unitNameFormat" placeholder="请选择活动区域">
              <el-option label="阿拉伯数字" value="1" />
              <el-option label="大写数字" value="2" />
              <el-option label="小写字母" value="3" />
              <el-option label="大写字母" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="建造年代:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.constructionTime"
              type="month"
              placeholder="选择年月"
            />
          </el-form-item>
          <el-form-item label="产权年限:" :label-width="formLabelWidth" prop="propertyYear">
            <el-input v-model="buildUnitObj.propertyYear" style="width: 50%" placeholder="请输入数字" />
            年
          </el-form-item>
          <el-form-item label="楼栋坐标:" :label-width="formLabelWidth">
            <div @click="showMap(0,0)">
              <el-input v-model="tudeString" style="width: 50%" readonly />
            </div>
          </el-form-item>
          <el-form-item label="物业类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.propertyType" placeholder="物业类型" @change="selectPropertyType(1)">
              <el-option
                v-for="item in propertyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="房屋属性;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.buildingType" placeholder="房屋属性">
              <el-option
                v-for="item in buildingTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="电梯数:" :label-width="formLabelWidth" prop="elevatorNum">
            <el-input v-model="buildUnitObj.elevatorNum" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="楼层户数:" :label-width="formLabelWidth" prop="familyCount">
            <el-input v-model="buildUnitObj.familyCount" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="物业费区间:" :label-width="formLabelWidth">
            <el-col :span="5">
              <el-form-item prop="propertyFeeMin">
                <el-input v-model="buildUnitObj.propertyFeeMin" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="propertyFeeMax">
                <el-input v-model="buildUnitObj.propertyFeeMax" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-select v-model="buildUnitObj.propertyChargeType" placeholder="请选择">
                  <el-option label="元/平方*月含空调" value="0" />
                  <el-option label="元/平方*月" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="空调费:" :label-width="formLabelWidth" prop="airconditionFee">
            <el-input v-model="buildUnitObj.airconditionFee" style="width: 50%" />
            元/立方/月
          </el-form-item>
          <el-form-item label="空调类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.airconditionerType" placeholder="请选择">
              <el-option label="无中央空调" value="0" />
              <el-option label="有中央空调" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="大堂层高:" :label-width="formLabelWidth" prop="lobbyHigh">
            <el-input v-model="buildUnitObj.lobbyHigh" style="width: 50%" placeholder="请输入数字" />
            m
          </el-form-item>
          <el-form-item label="竣工日期;" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.completionDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="使用周期:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.startUseTime"
              type="date"
              placeholder="选择开始日期"
            />
            -
            <el-date-picker
              v-model="buildUnitObj.endUseTime"
              type="date"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="宗地号:" :label-width="formLabelWidth">
            <el-input v-model="buildUnitObj.landNumber" style="width: 50%" />
          </el-form-item>
          <el-form-item label="宗地面积:" :label-width="formLabelWidth" prop="landArea">
            <el-input v-model="buildUnitObj.landArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="总面积:" :label-width="formLabelWidth" prop="totalBuildArea">
            <el-input v-model="buildUnitObj.totalBuildArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createBatchBuild('batchBuildForm')">提交</el-button>
        <el-button @click="newBatchBuilding = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    新增单元-->
    <el-dialog
      width="30%"
      title="新增/编辑单元"
      :visible.sync="newSingleUnit"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="singleUnitFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="singleUnitForm" :model="buildUnitObj" :rules="singleUnitFormRules">
          <el-form-item label="所属楼栋;" :label-width="formLabelWidth" prop="buildingId">
            <div v-if="buildUnitObj.isEdit">
              <el-select v-model="buildUnitObj.buildingId" placeholder="请选择" disabled>
                <el-option
                  v-for="item in tempBuildList"
                  :label="item.buildingName"
                  :value="item.id"
                /></el-select>
            </div>
            <div v-else>
              <el-select v-model="buildUnitObj.buildingId" placeholder="请选择">
                <el-option
                  v-for="item in tempBuildList"
                  :label="item.buildingName"
                  :value="item.id"
                /></el-select>
            </div>
          </el-form-item>
          <el-form-item label="单元名:" :label-width="formLabelWidth" prop="unitName" @blur="autoFill(2)">
            <el-input v-model="buildUnitObj.unitName" style="width: 50%" placeholder="请输入楼栋名（如A栋）" />
          </el-form-item>
          <el-form-item label="单元备案名:" :label-width="formLabelWidth" prop="unitRegisterName">
            <el-input v-model="buildUnitObj.unitRegisterName" style="width: 50%" placeholder="请输入楼栋备案名（如A栋）" />
          </el-form-item>
          <el-form-item label="单元坐标:" :label-width="formLabelWidth" required>
            <div @click="showMap(0,0)">
              <el-input v-model="tudeString" style="width: 50%" readonly />
            </div>
          </el-form-item>
          <el-form-item label="物业类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.propertyType" placeholder="物业类型" @change="selectPropertyType(1)">
              <el-option
                v-for="item in propertyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="房屋属性;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.buildingType" placeholder="房屋属性">
              <el-option
                v-for="item in buildingTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="电梯数:" :label-width="formLabelWidth" prop="elevatorNum">
            <el-input v-model="buildUnitObj.elevatorNum" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="楼层户数:" :label-width="formLabelWidth" prop="familyCount">
            <el-input v-model="buildUnitObj.familyCount" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="物业费区间:" :label-width="formLabelWidth">
            <el-col :span="5">
              <el-form-item prop="propertyFeeMin">
                <el-input v-model="buildUnitObj.propertyFeeMin" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="propertyFeeMax">
                <el-input v-model="buildUnitObj.propertyFeeMax" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-select v-model="buildUnitObj.propertyChargeType" placeholder="请选择">
                  <el-option label="元/平方*月含空调" value="0" />
                  <el-option label="元/平方*月" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="空调费:" :label-width="formLabelWidth" prop="airconditionFee">
            <el-input v-model="buildUnitObj.airconditionFee" style="width: 50%" />
            元/立方/月
          </el-form-item>
          <el-form-item label="空调类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.airconditionerType" placeholder="请选择">
              <el-option label="无中央空调" value="0" />
              <el-option label="有中央空调" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="大堂层高:" :label-width="formLabelWidth" prop="lobbyHigh">
            <el-input v-model="buildUnitObj.lobbyHigh" style="width: 50%" placeholder="请输入数字" />
            m
          </el-form-item>
          <el-form-item label="竣工日期;" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.completionDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="使用周期:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.startUseTime"
              type="date"
              placeholder="选择开始日期"
            />
            -
            <el-date-picker
              v-model="buildUnitObj.endUseTime"
              type="date"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="宗地号:" :label-width="formLabelWidth">
            <el-input v-model="buildUnitObj.landNumber" style="width: 50%" />
          </el-form-item>
          <el-form-item label="宗地面积:" :label-width="formLabelWidth" prop="landArea">
            <el-input v-model="buildUnitObj.landArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="总面积:" :label-width="formLabelWidth" prop="totalBuildArea">
            <el-input v-model="buildUnitObj.totalBuildArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSingleUnit('singleUnitForm')">提交</el-button>
        <el-button @click="newSingleUnit = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量新增单元-->
    <el-dialog
      width="30%"
      title="批量新增单元"
      :visible.sync="newBatchUnit"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="batchUnitFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="batchUnitForm" :model="buildUnitObj" :rules="batchUnitFormRules">
          <el-form-item label="所属楼栋;" :label-width="formLabelWidth" prop="buildingIds">
            <el-select v-model="buildUnitObj.buildingIds" placeholder="请选择" multiple>
              <el-option
                v-for="item in tempBuildList"
                :label="item.buildingName"
                :value="item.id"
              /></el-select>
          </el-form-item>
          <el-form-item label="单元起止序号:" :label-width="formLabelWidth" required>
            <el-col :span="5">
              <el-form-item prop="unitSeqStart">
                <el-input v-model="buildUnitObj.unitSeqStart" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="unitSeqEnd">
                <el-input v-model="buildUnitObj.unitSeqEnd" style="width: 80px" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="单元名格式;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.unitNameFormat" placeholder="请选择活动区域">
              <el-option label="阿拉伯数字" value="1" />
              <el-option label="大写数字" value="2" />
              <el-option label="小写字母" value="3" />
              <el-option label="大写字母" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="物业类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.propertyType" placeholder="物业类型" @change="selectPropertyType(1)">
              <el-option
                v-for="item in propertyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="房屋属性;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.buildingType" placeholder="房屋属性">
              <el-option
                v-for="item in buildingTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="电梯数:" :label-width="formLabelWidth" prop="elevatorNum">
            <el-input v-model="buildUnitObj.elevatorNum" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="楼层户数:" :label-width="formLabelWidth" prop="familyCount">
            <el-input v-model="buildUnitObj.familyCount" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="物业费区间:" :label-width="formLabelWidth">
            <el-col :span="5">
              <el-form-item prop="propertyFeeMin">
                <el-input v-model="buildUnitObj.propertyFeeMin" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="propertyFeeMax">
                <el-input v-model="buildUnitObj.propertyFeeMax" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-select v-model="buildUnitObj.propertyChargeType" placeholder="请选择">
                  <el-option label="元/平方*月含空调" value="0" />
                  <el-option label="元/平方*月" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="空调费:" :label-width="formLabelWidth" prop="airconditionFee">
            <el-input v-model="buildUnitObj.airconditionFee" style="width: 50%" />
            元/立方/月
          </el-form-item>
          <el-form-item label="空调类型;" :label-width="formLabelWidth">
            <el-select v-model="buildUnitObj.airconditionerType" placeholder="请选择">
              <el-option label="无中央空调" value="0" />
              <el-option label="有中央空调" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="大堂层高:" :label-width="formLabelWidth" prop="lobbyHigh">
            <el-input v-model="buildUnitObj.lobbyHigh" style="width: 50%" placeholder="请输入数字" />
            m
          </el-form-item>
          <el-form-item label="竣工日期;" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.completionDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="使用周期:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="buildUnitObj.startUseTime"
              type="date"
              placeholder="选择开始日期"
            />
            -
            <el-date-picker
              v-model="buildUnitObj.endUseTime"
              type="date"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="宗地号:" :label-width="formLabelWidth">
            <el-input v-model="buildUnitObj.landNumber" style="width: 50%" />
          </el-form-item>
          <el-form-item label="宗地面积:" :label-width="formLabelWidth" prop="landArea">
            <el-input v-model="buildUnitObj.landArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="总面积:" :label-width="formLabelWidth" prop="totalBuildArea">
            <el-input v-model="buildUnitObj.totalBuildArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createBatchUnit('batchUnitForm')">提交</el-button>
        <el-button @click="newBatchUnit = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    新增楼层-->
    <el-dialog
      width="30%"
      title="新增楼层"
      :visible.sync="newSingleFloor"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="singleFloorFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="singleFloorForm" :model="floorRoomObj" :rules="singleFloorFormRules">
          <el-form-item label="名义楼层:" :label-width="formLabelWidth" prop="nominalFloorNum">
            <el-input v-model="floorRoomObj.nominalFloorNum" style="width: 50%" />层
          </el-form-item>
          <el-form-item label="实际楼层:" :label-width="formLabelWidth" prop="actualFloorNum">
            <el-input v-model="floorRoomObj.actualFloorNum" style="width: 50%" />层
          </el-form-item>
          <el-form-item label="层高:" :label-width="formLabelWidth" prop="floorHeight">
            <el-input v-model="floorRoomObj.floorHeight" style="width: 50%" placeholder="请输入数字" />米
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSingleFloor('singleFloorForm')">提交</el-button>
        <el-button @click="newSingleFloor = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量新增楼层-->
    <el-dialog
      width="30%"
      title="批量新增楼层"
      :visible.sync="newBatchFloor"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="batchFloorFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="batchFloorForm" :model="floorRoomObj" :rules="batchFloorFormRules">
          <el-form-item label="楼层起止:" :label-width="formLabelWidth" required>
            <el-col :span="5">
              <el-form-item prop="floorStartSeq">
                <el-input v-model="floorRoomObj.floorStartSeq" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="floorEndSeq">
                <el-input v-model="floorRoomObj.floorEndSeq" style="width: 80px" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="层高:" :label-width="formLabelWidth" prop="floorHeight">
            <el-input v-model="floorRoomObj.floorHeight" style="width: 50%" placeholder="请输入数字" />米
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createBatchFloor('batchFloorForm')">提交</el-button>
        <el-button @click="newBatchFloor = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量修改楼层-->
    <el-dialog
      width="40%"
      title="批量修改楼层"
      :visible.sync="editBatchFloor"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="editBatchFloorFormBody" style="max-height: 500px; overflow-y: auto">
        <span>所属楼栋单元:{{ name }}</span>
        <el-table
          :data="checkFloorData"
          style="width: 100%;margin-bottom: 20px;"
          border
        >
          <el-table-column prop="id" type="index" label="序号" />
          <el-table-column label="实际楼层:">
            <template slot-scope="{row}">
              <el-input v-model="row.actualFloorNum" class="input-100" size="small" readonly />
            </template>
          </el-table-column>
          <el-table-column label="名义楼层:">
            <template slot-scope="{row}">
              <el-input v-model="row.nominalFloorNum" class="input-100" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="层高">
            <template slot-scope="{row}">
              <el-input v-model="row.floorHeight" class="input-100" size="small" />m
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editBatchFloorMethod()">提交</el-button>
        <el-button @click="editBatchFloor = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    新增房号-->
    <el-dialog
      width="30%"
      title="新增房号"
      :visible.sync="newSingleRoom"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="singleRoomFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="singleRoomForm" :model="floorRoomObj" :rules="singleRoomFormRules">
          <el-form-item label="楼层:" :label-width="formLabelWidth" prop="floorId">
            <el-select v-model="floorRoomObj.floorId" placeholder="请选择">
              <el-option
                v-for="item in floorRoomList"
                :label="item.actualFloorNum"
                :value="item.id"
              /></el-select>
          </el-form-item>
          <el-form-item label="房号序号:" :label-width="formLabelWidth" prop="roomSeq">
            <el-input v-model="floorRoomObj.roomSeq" style="width: 50%" placeholder="请输入数字" />
          </el-form-item>
          <el-form-item label="房号名:" :label-width="formLabelWidth" prop="roomNumber">
            <el-input v-model="floorRoomObj.roomNumber" style="width: 50%" />
          </el-form-item>
          <el-form-item label="房号备案名:" :label-width="formLabelWidth">
            <el-input v-model="floorRoomObj.roomRegisterNumber" style="width: 50%" />
          </el-form-item>
          <el-form-item label="房号备案状态;" :label-width="formLabelWidth">
            <el-select v-model="floorRoomObj.roomRegisterStatus" placeholder="请选择">
              <el-option
                v-for="item in roomRegisterStatus"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="物业类型;" :label-width="formLabelWidth">
            <el-select v-model="floorRoomObj.propertyType" placeholder="物业类型" @change="selectPropertyType(2)">
              <el-option
                v-for="item in propertyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="房屋属性;" :label-width="formLabelWidth">
            <el-select v-model="floorRoomObj.buildingType" placeholder="房屋属性">
              <el-option
                v-for="item in buildingTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="房屋结构 ;" :label-width="formLabelWidth">
            <el-select v-model="floorRoomObj.roomStructural" placeholder="房屋结构">
              <el-option
                v-for="item in roomStructural"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="备案价/参考价:" :label-width="formLabelWidth" prop="roomRegisterPrice">
            <el-input v-model="floorRoomObj.roomRegisterPrice" style="width: 50%" />
            元/立方/月
          </el-form-item>
          <el-form-item label="户型:" :label-width="formLabelWidth">
            <el-col :span="5">
              <el-form-item prop="bedRoom">
                <el-input v-model="floorRoomObj.bedRoom" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">室</el-col>
            <el-col :span="5">
              <el-form-item prop="livingRoom">
                <el-input v-model="floorRoomObj.livingRoom" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">厅</el-col>
            <el-col :span="5">
              <el-form-item prop="bathRoom">
                <el-input v-model="floorRoomObj.bathRoom" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">卫</el-col>
          </el-form-item>
          <el-form-item label="阳台数量:" :label-width="formLabelWidth" prop="balcony">
            <el-input v-model="floorRoomObj.balcony" style="width: 50%" placeholder="请输入数字" />
            个
          </el-form-item>
          <el-form-item label="建筑面积:" :label-width="formLabelWidth" prop="buildArea">
            <el-input v-model="floorRoomObj.buildArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="套内面积:" :label-width="formLabelWidth" prop="roomArea">
            <el-input v-model="floorRoomObj.roomArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="公摊面积:" :label-width="formLabelWidth" prop="inventoryArea">
            <el-input v-model="floorRoomObj.inventoryArea" style="width: 50%" placeholder="请输入数字（支持2位小数）" />
            ㎡
          </el-form-item>
          <el-form-item label="朝向;" :label-width="formLabelWidth">
            <el-select v-model="floorRoomObj.direction" placeholder="请选择">
              <el-option
                v-for="item in orientedTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
          <el-form-item label="装修;" :label-width="formLabelWidth">
            <el-select v-model="floorRoomObj.decoration" placeholder="请选择">
              <el-option
                v-for="item in decorationTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              /></el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSingleRoom('singleRoomForm')">提交</el-button>
        <el-button @click="newSingleRoom = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量新增房号-->
    <el-dialog
      width="30%"
      title="批量新增房号"
      :visible.sync="newBatchRoom"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="batchRoomFormBody" style="max-height: 500px; overflow-y: auto">
        <el-form ref="batchRoomForm" :model="floorRoomObj" :rules="batchRoomFormRules">
          <el-form-item label="楼层单元:" :label-width="formLabelWidth">
            {{ name }}
          </el-form-item>
          <el-form-item label="楼层起止:" :label-width="formLabelWidth" required>
            <el-select v-model="floorRoomObj.floorStartSeq" placeholder="请选择">
              <el-option
                v-for="item in floorRoomList"
                :label="item.actualFloorNum"
                :value="item.actualFloorNum"
              /></el-select>
            -
            <el-select v-model="floorRoomObj.floorEndSeq" placeholder="请选择">
              <el-option
                v-for="item in floorRoomList"
                :label="item.actualFloorNum"
                :value="item.actualFloorNum"
              /></el-select>
          </el-form-item>
          <el-form-item label="房号序号起止:" :label-width="formLabelWidth">
            <el-col :span="5">
              <el-form-item prop="roomStartSeq">
                <el-input v-model="floorRoomObj.roomStartSeq" style="width: 80px" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="5">
              <el-form-item prop="roomEndSeq">
                <el-input v-model="floorRoomObj.roomEndSeq" style="width: 80px" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="房号前缀:" :label-width="formLabelWidth">
            <el-input v-model="floorRoomObj.roomNumberPrefix" style="width: 50%" />
          </el-form-item>
          <el-form-item label="房号后缀:" :label-width="formLabelWidth">
            <el-input v-model="floorRoomObj.roomNumberSuffix" style="width: 50%" />
          </el-form-item>
          <el-form-item label="房号格式:" :label-width="formLabelWidth">
            <el-input v-model="floorRoomObj.roomNumberFormat" style="width: 50%" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createBatchRoom('batchRoomForm')">提交</el-button>
        <el-button @click="newBatchRoom = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量修改房号-->
    <el-dialog
      width="80%"
      title="批量修改房号"
      :visible.sync="editBatchRoom"
      append-to-body
      :close-on-click-modal="false"
    >
      <div id="editBatchRoomFormBody" style="max-height: 500px; overflow-y: auto">
        <span>所属楼栋单元:{{ name }}</span>
        <el-table
          :data="checkRoomData"
          style="width: 100%;margin-bottom: 20px;"
          border
        >
          <el-table-column prop="id" type="index" label="序号" />
          <el-table-column label="实际楼层:">
            <template slot-scope="{row}">
              <el-input v-model="row.actualFloorNum" readonly />
            </template>
          </el-table-column>
          <el-table-column label="名义楼层:">
            <template slot-scope="{row}">
              <el-input v-model="row.nominalFloorNum" readonly />
            </template>
          </el-table-column>
          <el-table-column label="房号名:">
            <template slot-scope="{row}">
              <el-input v-model="row.roomNumber" />
            </template>
          </el-table-column>
          <el-table-column label="房号序号:">
            <template slot-scope="{row}">
              <el-input v-model="row.roomSeq" />
            </template>
          </el-table-column>
          <el-table-column label="房号备案名:">
            <template slot-scope="{row}">
              <el-input v-model="row.roomRegisterNumber" />
            </template>
          </el-table-column>
          <el-table-column label="房号备案状态:">
            <template slot-scope="{row}">
              <el-select v-model="row.roomRegisterStatus" placeholder="请选择">
                <el-option
                  v-for="item in roomRegisterStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                /></el-select>
            </template>
          </el-table-column>
          <el-table-column label="物业类型:">
            <template slot-scope="{row}">
              <el-select v-model="row.propertyType" placeholder="请选择">
                <el-option
                  v-for="item in propertyTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                /></el-select>
            </template>
          </el-table-column>
          <el-table-column label="房屋属性;">
            <template slot-scope="{row}">
              <el-select v-model="row.buildingType" placeholder="请选择">
                <el-option
                  v-for="item in propertyTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                /></el-select>
            </template>
          </el-table-column>
          <el-table-column label="房屋结构;">
            <template slot-scope="{row}">
              <el-select v-model="row.roomStructural" placeholder="请选择">
                <el-option
                  v-for="item in propertyTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                /></el-select>
            </template>
          </el-table-column>
          <el-table-column label="备案价/参考价;">
            <template slot-scope="{row}">
              <el-input v-model="row.roomRegisterPrice" />
              元/立方/月
            </template>
          </el-table-column>
          <el-table-column label="户型;">
            <template slot-scope="{row}">
              <el-input v-model="row.bedRoom" />
              室
              <el-input v-model="row.livingRoom" />
              厅
              <el-input v-model="row.bathRoom" />
              卫
            </template>
          </el-table-column>
          <el-table-column label="阳台数量;">
            <template slot-scope="{row}">
              <el-input v-model="row.balcony" />
              元/立方/月
            </template>
          </el-table-column>
          <el-table-column label="建筑面积;">
            <template slot-scope="{row}">
              <el-input v-model="row.buildArea" placeholder="请输入数字（支持2位小数）" />
              ㎡
            </template>
          </el-table-column>
          <el-table-column label="套内面积;">
            <template slot-scope="{row}">
              <el-input v-model="row.roomArea" placeholder="请输入数字（支持2位小数）" />
              ㎡
            </template>
          </el-table-column>
          <el-table-column label="公摊面积;">
            <template slot-scope="{row}">
              <el-input v-model="row.inventoryArea" placeholder="请输入数字（支持2位小数）" />
              ㎡
            </template>
          </el-table-column>
          <el-table-column label="朝向;">
            <template slot-scope="{row}">
              <el-select v-model="row.direction" placeholder="请选择">
                <el-option
                  v-for="item in orientedTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                /></el-select>
            </template>
          </el-table-column>
          <el-table-column label="装修;">
            <template slot-scope="{row}">
              <el-select v-model="row.decoration" placeholder="请选择">
                <el-option
                  v-for="item in decorationTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                /></el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editBatchRoomMethod()">提交</el-button>
        <el-button @click="editBatchRoom = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    删除弹窗-->
    <el-dialog
      width="30%"
      title="删除弹窗"
      :visible.sync="deleteDialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <span>确定删除?</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doDelete()">确定</el-button>
        <el-button @click="deleteDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="map-container">
      <LxBaiduMap map-keyword="北京" :center="center" :map-visible="dialogMapVisible" @handleClose="mapClose" @getMap="onEnlargeText" />
    </div>
  </div>
</template>

<script>
import { addBuildings, addUnits, addBrokerFloors, addBrokerRooms } from '@/api/house'
import { updateBuildings, updateUnit } from '@/api/house'
import { updateBrokerFloors, updateBrokerRooms } from '@/api/house'
import { deleteBuilding, deleteUnit, deleteBrokerFloors, deleteBrokerRooms } from '@/api/house'
import { saveOrUpdateBuildings } from '@/api/house'
import { findBuildingList, findBrokerRoomList, getRoomSeqByUnitId } from '@/api/house'
import { listByParentCode } from '@/api/dic'
import LxBaiduMap from '@/components/BaiduMap'
import { isIntegerNotMust, isFloatNotMust, isIntegerMustNotZero } from '@/common/validate'

const defaultBuildUnitObj = function() {
  return {
    airconditionFee: '',
    airconditionerType: '',
    buildingId: '',
    buildingName: '栋',
    buildingNameFormat: '1',
    buildingRegisterName: '栋',
    buildingSeq: 0,
    buildingSeqEnd: 0,
    buildingSeqStart: 0,
    buildingType: '',
    completionDate: '',
    constructionTime: '',
    deleteFlag: 0,
    elevatorNum: '',
    endUseTime: '',
    familyCount: '',
    houseId: '',
    id: 0,
    landArea: '',
    landNumber: '',
    latitude: 0,
    lobbyHigh: '',
    longitude: 0,
    propertyChargeType: '0',
    propertyFeeMax: '',
    propertyFeeMin: '',
    propertyType: '',
    propertyYear: '',
    startUseTime: '',
    status: '',
    totalBuildArea: '',
    unitName: '',
    unitNameFormat: '1',
    unitRegisterName: '',
    unitSeq: 0,
    unitSeqEnd: 0,
    unitSeqStart: 0,
    buildingIds: []
  }
}
const defaultFloorRoomObj = function() {
  return {
    actualFloorNum: '',
    balcony: '',
    bathRoom: '',
    bedRoom: '',
    buildArea: '',
    buildingId: 0,
    buildingName: '',
    buildingType: '',
    decoration: '',
    deleteFlag: '',
    direction: '',
    floorEndSeq: 0,
    floorHeight: '',
    floorId: 0,
    floorNumber: '',
    floorStartSeq: 0,
    govId: '',
    houseId: 0,
    id: 0,
    inventoryArea: '',
    kitchen: '',
    latitude: 0,
    legalNumber: '',
    livingRoom: '',
    longitude: 0,
    nominalFloorNum: '',
    ownerName: '',
    ownerTel: '',
    popularizeName: '',
    propertyType: '',
    roomArea: '',
    roomEndSeq: 0,
    roomNumber: '',
    roomNumberFormat: '',
    roomNumberPrefix: '',
    roomNumberSuffix: '',
    roomPattern: '',
    roomRegisterNumber: '',
    roomRegisterPrice: '',
    roomRegisterStatus: '',
    roomSalesStatus: '',
    roomSeq: 0,
    roomStartSeq: 0,
    roomStructural: '',
    sorted: 0,
    unitId: 0,
    unitName: ''
  }
}

export default {
  components: {
    LxBaiduMap
  },
  data() {
    return {
      dialogMapVisible: false,
      buildList: [],
      tempBuildList: [],
      listLoading: true,
      param: {
        house_id: '',
        id: ''
      },
      propertyTypes: this.$store.getters.dics(this.CONST.dic.type.propertyType),
      buildingTypes: [],
      orientedTypes: this.$store.getters.dics(this.CONST.dic.type.orientedType),
      decorationTypes: this.$store.getters.dics(this.CONST.dic.type.decorationType),
      roomRegisterStatus: this.$store.getters.dics(this.CONST.dic.type.registerStatus),
      roomStructural: this.$store.getters.dics(this.CONST.dic.type.Structural, this.CONST.dic.tagType.Structural),
      activeName: 'build',
      saveAllButtonFlag: true,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      buildUnitObj: {},
      floorRoomObj: {},
      // 新增独栋
      newSingleBuilding: false,
      singleBuildFormRules: {
        buildingName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        buildingRegisterName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        propertyYear: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        elevatorNum: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        familyCount: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        propertyFeeMin: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        propertyFeeMax: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        airconditionFee: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        lobbyHigh: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        landArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        totalBuildArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 批量新增楼栋
      newBatchBuilding: false,
      batchBuildFormRules: {
        buildingName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        buildingSeqStart: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        buildingSeqEnd: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        unitName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        unitSeqStart: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        unitSeqEnd: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        propertyYear: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        elevatorNum: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        familyCount: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        propertyFeeMin: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        propertyFeeMax: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        airconditionFee: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        lobbyHigh: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        landArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        totalBuildArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 新增单元
      newSingleUnit: false,
      singleUnitFormRules: {
        buildingId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        unitName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        unitRegisterName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        propertyYear: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        elevatorNum: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        familyCount: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        propertyFeeMin: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        propertyFeeMax: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        airconditionFee: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        lobbyHigh: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        landArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        totalBuildArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 批量新增单元
      newBatchUnit: false,
      batchUnitFormRules: {
        buildingIds: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        unitSeqStart: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        unitSeqEnd: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        propertyYear: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        elevatorNum: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        familyCount: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        propertyFeeMin: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        propertyFeeMax: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        airconditionFee: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        lobbyHigh: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        landArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        totalBuildArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 新增楼层
      newSingleFloor: false,
      singleFloorFormRules: {
        nominalFloorNum: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        actualFloorNum: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        floorHeight: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 批量新增楼层
      newBatchFloor: false,
      batchFloorFormRules: {
        floorStartSeq: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        floorEndSeq: [
          { required: true, trigger: 'blur' },
          { validator: isIntegerMustNotZero }
        ],
        floorHeight: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 批量修改楼层
      editBatchFloor: false,
      // 新增房号
      newSingleRoom: false,
      singleRoomFormRules: {
        floorId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        roomSeq: [
          { required: true, message: '必须为数字', trigger: 'change' },
          { validator: isIntegerNotMust }
        ],
        roomNumber: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        roomRegisterPrice: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        bedRoom: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        livingRoom: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        bathRoom: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        balcony: [
          { validator: isIntegerNotMust, trigger: 'blur' }
        ],
        roomArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        buildArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ],
        inventoryArea: [
          { validator: isFloatNotMust, trigger: 'blur' }
        ]
      },
      // 批量新增房号
      newBatchRoom: false,
      batchRoomFormRules: {
        roomStartSeq: [
          { required: true, message: '必须为数字', trigger: 'change' },
          { validator: isIntegerNotMust }
        ],
        roomEndSeq: [
          { required: true, message: '必须为数字', trigger: 'change' },
          { validator: isIntegerNotMust }
        ]
      },
      // 批量修改房号
      editBatchRoom: false,
      editBatchRoomFormRules: {},
      // 删除弹窗
      deleteDialog: false,
      deleteObj: {
        data: '',
        type: ''
      },

      // 楼层房号
      name: '',
      checkAll: false,
      rowCheckFlag: false,
      reqCheckFlag: false,
      isIndeterminate: true,
      // 选中楼层
      checkFloorId: [],
      checkFloorData: [],
      // 全部楼层
      allFloorId: [],
      // 选中房号
      checkRoomId: [],
      checkRoomData: [],
      // 全部房号
      allRoomId: [],
      // 查询楼层房号
      getFloorRoomParam: {
        buildingId: '',
        unitId: ''
      },
      // 楼层房号列表
      floorRoomList: [],
      // 房号序号集合
      roomSeqs: [],
      // 楼层和房号集合
      floorRooms: [],
      ids: [],
      checkedCities: [],
      checks: {
        florChecks: {},
        seqChecks: {}

      },
      roomIds: '',
      tudeString: '',

      defaultProps: {
        value: 'id', // ID字段名
        children: 'tbBrokerUnitVos',
        label: 'name'
      },
      center: {
        lng: 114.064543,
        lat: 22.548427
      },
      rowId: 0,
      rowType: 0,
      rowBuildingId: 0
    }
  },
  methods: {
    showMap: function(id, type, rowBuildingId) {
      this.rowId = id
      this.rowType = type
      this.rowBuildingId = rowBuildingId
      this.dialogMapVisible = true
    },
    onEnlargeText: function(enlargeAmount) {
      if (this.rowId === 0) {
        this.buildUnitObj.longitude = enlargeAmount.lng
        this.buildUnitObj.latitude = enlargeAmount.lat
        this.tudeString = this.buildUnitObj.longitude + ',' + this.buildUnitObj.latitude
      } else {
        if (this.rowType === 1) {
          var buildTempFlag = true
          this.tempBuildList.forEach(value => {
            if (buildTempFlag && value.id === this.rowId) {
              buildTempFlag = false
              value.longitude = enlargeAmount.lng
              value.latitude = enlargeAmount.lat
            }
          })
        } else {
          var unitTempFlag = true
          this.tempBuildList.forEach(value => {
            if (value.id === this.rowBuildingId) {
              value.tbBrokerUnitVos.forEach(val => {
                if (unitTempFlag && val.id === this.rowId) {
                  unitTempFlag = false
                  val.longitude = enlargeAmount.lng
                  val.latitude = enlargeAmount.lat
                }
              })
            }
          })
        }
        this.newBuildList()
      }
      this.dialogMapVisible = false
    },
    buildListByHouseId() {
      this.listLoading = true
      findBuildingList(this.param).then(response => {
        this.buildList = response.data
        this.newBuildList()
        this.listLoading = false
      })
    },
    newBuildList() {
      const arr = []
      this.getFloorRoomParam = {
        buildingId: '',
        unitId: ''
      }
      this.name = ''
      if (this.buildList.length > 0) {
        this.saveAllButtonFlag = true
        this.buildList.forEach((val, index) => {
          val.children = val.tbBrokerUnitVos
          val.name = val.buildingName
          val.isBuild = true

          val.tudeString = val.longitude + ',' + val.latitude
          const $buildIndex = index
          const $build = val
          if (val.tbBrokerUnitVos.length > 0) {
            val.hasChildren = true
            val.tbBrokerUnitVos.forEach((val, index2) => {
              if ($buildIndex === 0 && index2 === 0) {
                this.getFloorRoomParam.buildingId = $build.id
                this.getFloorRoomParam.unitId = val.id
                this.name = val.unitName
                this.$refs.buildTree.setCheckedKeys([val.id + ''])
              }
              val.tudeString = val.longitude + ',' + val.latitude
              val.name = val.unitName
              val.isBuild = false
            })
          } else {
            const unitList = []
            var newObj = JSON.parse(JSON.stringify(val))
            newObj.id = newObj.id + 1
            newObj.hasChildren = false
            newObj.isSingleBuild = true
            unitList.push(newObj)
            val.children = unitList
            val.hasChildren = true
          }
          arr.push(val)
        })
      } else {
        this.saveAllButtonFlag = false
      }
      this.tempBuildList = arr
      this.getRoomSeqByUnitId()
      this.brokerRoomList()
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.hasChildren) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 8
          }
        }
      }
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([])
      }, 1)
    },
    init(id) {
      this.param.house_id = id
      this.buildListByHouseId()
      this.dialogTableVisible = true
    },
    handleCommand(command) {
      if (command === 'a') { // 新增独栋
        this.buildUnitObj = defaultBuildUnitObj()
        this.buildUnitObj.houseId = this.param.house_id
        this.tudeString = this.buildUnitObj.longitude + ',' + this.buildUnitObj.latitude

        this.newSingleBuilding = true
        this.$refs.singleBuildForm.resetFields()
      } else if (command === 'b') { // 批量新增楼栋
        this.buildUnitObj = defaultBuildUnitObj()
        this.buildUnitObj.buildingSeqStart = this.buildList.length + 1
        this.buildUnitObj.buildingSeqEnd = ''
        this.buildUnitObj.unitSeqStart = 1
        this.buildUnitObj.unitSeqEnd = ''
        this.buildUnitObj.houseId = this.param.house_id
        this.tudeString = this.buildUnitObj.longitude + ',' + this.buildUnitObj.latitude
        this.newBatchBuilding = true
        this.$refs.batchBuildForm.resetFields()
      } else if (command === 'c') { // 新增单元
        if (this.tempBuildList.length < 1) {
          this.$message('请先添加楼栋')
        } else {
          this.buildUnitObj = defaultBuildUnitObj()
          this.buildUnitObj.houseId = this.param.house_id
          this.tudeString = this.buildUnitObj.longitude + ',' + this.buildUnitObj.latitude
          this.newSingleUnit = true
          this.$refs.singleUnitForm.resetFields()
        }
      } else if (command === 'd') { // 批量新增单元
        if (this.tempBuildList.length < 1) {
          this.$message('请先添加楼栋')
        } else {
          this.buildUnitObj = defaultBuildUnitObj()
          this.buildUnitObj.unitSeqStart = 1
          this.buildUnitObj.unitSeqEnd = ''
          this.buildUnitObj.houseId = this.param.house_id
          this.newBatchUnit = true
          this.$refs.batchUnitForm.resetFields()
        }
      } else if (command === 'e') { // 新增楼层
        if (this.getFloorRoomParam.unitId === '' && this.getFloorRoomParam.buildingId === '') {
          this.$message('请先添加单元')
        } else {
          this.floorRoomObj = defaultFloorRoomObj()
          this.floorRoomObj.houseId = this.param.house_id
          this.newSingleFloor = true
          this.$refs.singleFloorForm.resetFields()
        }
      } else if (command === 'f') { // 批量新增楼层
        debugger
        if (this.getFloorRoomParam.unitId === '' && this.getFloorRoomParam.buildingId === '') {
          this.$message('请先选中单元或楼栋')
        } else {
          this.floorRoomObj = defaultFloorRoomObj()
          this.floorRoomObj.houseId = this.param.house_id
          this.newBatchFloor = true
          this.$refs.batchFloorForm.resetFields()
        }
      } else if (command === 'g') { // 批量编辑楼层
        if (this.checkFloorId && this.checkFloorId.length < 1) {
          this.$message('请先选择楼层')
        } else {
          this.checkFloorData = []
          this.floorRoomList.forEach(value => {
            this.checkFloorId.forEach(value1 => {
              if (value.id === value1) {
                this.checkFloorData.push(value)
              }
            })
          })
          this.editBatchFloor = true
        }
      } else if (command === 'h') { // 批量删除楼层
        if (this.checkFloorId && this.checkFloorId.length < 1) {
          this.$message('请先选择楼层')
        } else {
          var floorIds = ''
          this.checkFloorId.forEach(val => {
            floorIds = floorIds + val + ','
          })
          floorIds = floorIds.substring(0, floorIds.length - 1)
          this.handleDelete(floorIds, 3)
        }
      } else if (command === 'i') { // 新增房号
        if (this.floorRoomList) {
          if (this.floorRoomList.length < 1) {
            this.$message('请先添加楼层')
          } else {
            this.floorRoomObj = defaultFloorRoomObj()
            this.newSingleRoom = true
            this.$refs.singleRoomForm.resetFields()
          }
        } else {
          this.$message('请先添加楼层')
        }
      } else if (command === 'j') { // 批量新增房号
        if (this.floorRoomList) {
          if (this.floorRoomList.length < 1) {
            this.$message('请先添加楼层')
          } else {
            this.floorRoomObj = defaultFloorRoomObj()
            this.newBatchRoom = true
            this.$refs.batchRoomForm.resetFields()
          }
        } else {
          this.$message('请先添加楼层')
        }
      } else if (command === 'k') { // 批量编辑房号
        if (this.checkRoomId && this.checkRoomId.length < 1) {
          this.$message('请先选择房号')
        } else {
          this.checkRoomData = []
          this.floorRoomList.forEach(floor => {
            floor.tbBrokerRoomVoList.forEach(room => {
              this.checkRoomId.forEach(id => {
                if (room.id === id) {
                  room.actualFloorNum = floor.actualFloorNum
                  room.nominalFloorNum = floor.nominalFloorNum
                  this.checkRoomData.push(room)
                }
              })
            })
          })
          this.editBatchRoom = true
        }
      } else if (command === 'l') { // 批量删除房号
        if (this.checkRoomId && this.checkRoomId.length < 1) {
          this.$message('请先选择房号')
        } else {
          var roomIds = ''
          this.checkRoomId.forEach(val => {
            roomIds = roomIds + val + ','
          })
          roomIds = roomIds.substring(0, roomIds.length - 1)
          this.handleDelete(roomIds, 4)
        }
      }
    },
    selectPropertyType(type) {
      if (type === 1) {
        listByParentCode(this.buildUnitObj.propertyType).then(response => {
          if (response.code === 200) {
            this.buildUnitObj.buildingType = ''
            this.buildingTypes = response.data
          } else {
            this.$message(response.desc)
          }
        })
      } else {
        listByParentCode(this.floorRoomObj.propertyType).then(response => {
          if (response.code === 200) {
            this.floorRoomObj.buildingType = ''
            this.buildingTypes = response.data
          } else {
            this.$message(response.desc)
          }
        })
      }
    },
    autoFill(type) {
      if (type === 1) {
        this.buildUnitObj.buildingRegisterName = this.buildUnitObj.buildingName
      } else {
        this.buildUnitObj.unitRegisterName = this.buildUnitObj.unitName
      }
    },
    createSingleBuild(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.buildUnitObj.propertyFeeMax < this.buildUnitObj.propertyFeeMin) {
            this.$message('物业费区间填写有误')
            return false
          } else {
            if (this.buildUnitObj.isEdit) {
              updateBuildings(this.buildUnitObj).then(response => {
                if (response.code === 200) {
                  this.$message('保存成功')
                  this.buildListByHouseId()
                  this.newSingleBuilding = false
                } else {
                  this.$message(response.desc)
                }
              })
            } else {
              addBuildings(this.buildUnitObj).then(response => {
                if (response.code === 200) {
                  this.$message('保存成功')
                  this.buildListByHouseId()
                  this.newSingleBuilding = false
                } else {
                  this.$message(response.desc)
                }
              })
            }
          }
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    createBatchBuild(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.buildUnitObj.buildingSeqEnd < this.buildUnitObj.buildingSeqStart){
            this.$message('楼栋序号填写有误')
            return false
          } else if (this.buildUnitObj.unitSeqEnd < this.buildUnitObj.unitSeqStart) {
            this.$message('单元序号填写有误')
            return false
          } else if (this.buildUnitObj.propertyFeeMax < this.buildUnitObj.propertyFeeMin) {
            this.$message('物业费区间填写有误')
            return false
          } else {
            addBuildings(this.buildUnitObj).then(response => {
              if (response.code === 200) {
                this.$message('保存成功')
                this.buildListByHouseId()
                this.newBatchBuilding = false
              } else {
                this.$message(response.desc)
              }
            })
          }
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    createSingleUnit(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.buildUnitObj.propertyFeeMax < this.buildUnitObj.propertyFeeMin) {
            this.$message('物业费区间填写有误')
            return false
          } else {
            if (this.buildUnitObj.isEdit) {
              updateUnit(this.buildUnitObj).then(response => {
                if (response.code === 200) {
                  this.$message('保存成功')
                  this.buildListByHouseId()
                  this.newSingleUnit = false
                } else {
                  this.$message(response.desc)
                }
              })
            } else {
              addUnits(this.buildUnitObj).then(response => {
                if (response.code === 200) {
                  this.$message('保存成功')
                  this.buildListByHouseId()
                  this.newSingleUnit = false
                } else {
                  this.$message(response.desc)
                }
              })
            }
          }
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    createBatchUnit(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.buildUnitObj.unitSeqEnd < this.buildUnitObj.unitSeqStart) {
            this.$message('单元序号填写有误')
            return false
          } else if (this.buildUnitObj.propertyFeeMax < this.buildUnitObj.propertyFeeMin) {
            this.$message('物业费区间填写有误')
            return false
          } else {
            addUnits(this.buildUnitObj).then(response => {
              if (response.code === 200) {
                this.$message('保存成功')
                this.buildListByHouseId()
                this.newBatchUnit = false
              } else {
                this.$message(response.desc)
              }
            })
          }
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    createSingleFloor(formData) {
      this.floorRoomObj.buildingId = this.getFloorRoomParam.buildingId
      this.floorRoomObj.unitId = this.getFloorRoomParam.unitId
      this.$refs[formData].validate((valid) => {
        if (valid) {
          addBrokerFloors(this.floorRoomObj).then(response => {
            if (response.code === 200) {
              this.$message('保存成功')
              this.newSingleFloor = false
              this.buildListByHouseId()
            } else {
              this.$message(response.desc)
            }
          })
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    createBatchFloor(formData) {
      this.floorRoomObj.buildingId = this.getFloorRoomParam.buildingId
      this.floorRoomObj.unitId = this.getFloorRoomParam.unitId
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.floorRoomObj.floorEndSeq < this.floorRoomObj.floorStartSeq) {
            this.$message('楼层起止填写有误')
            return false
          } else {
            addBrokerFloors(this.floorRoomObj).then(response => {
              if (response.code === 200) {
                this.$message('保存成功')
                this.newBatchFloor = false
                this.buildListByHouseId()
              } else {
                this.$message(response.desc)
              }
            })
          }
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    editBatchFloorMethod() {
      updateBrokerFloors(this.checkFloorData).then(response => {
        if (response.code === 200) {
          this.$message('保存成功')
          this.buildListByHouseId()
          this.editBatchFloor = false
        } else {
          this.$message(response.desc)
        }
      })
    },
    createSingleRoom(formData) {
      this.floorRoomObj.buildingId = this.getFloorRoomParam.buildingId
      this.floorRoomObj.unitId = this.getFloorRoomParam.unitId
      this.$refs[formData].validate((valid) => {
        if (valid) {
          addBrokerRooms(this.floorRoomObj).then(response => {
            if (response.code === 200) {
              this.$message('保存成功')
              this.buildListByHouseId()
              this.newSingleRoom = false
            } else {
              this.$message(response.desc)
            }
          })
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    createBatchRoom(formData) {
      this.floorRoomObj.buildingId = this.getFloorRoomParam.buildingId
      this.floorRoomObj.unitId = this.getFloorRoomParam.unitId
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.floorRoomObj.floorEndSeq < this.floorRoomObj.floorStartSeq) {
            this.$message('楼层起止有误')
            return false
          } else if (this.floorRoomObj.roomEndSeq < this.floorRoomObj.roomStartSeq) {
            this.$message('房号起止填写有误')
            return false
          } else {
            addBrokerRooms(this.floorRoomObj).then(response => {
              if (response.code === 200) {
                this.$message('保存成功')
                this.buildListByHouseId()
                this.newBatchRoom = false
              } else {
                this.$message(response.desc)
              }
            })
          }
        } else {
          this.$message('提交失败，请检查验证提醒')
          return false
        }
      })
    },
    editBatchRoomMethod() {
      updateBrokerRooms(this.checkRoomData).then(response => {
        if (response.code === 200) {
          this.$message('保存成功')
          this.buildListByHouseId()
          this.editBatchRoom = false
        } else {
          this.$message(response.desc)
        }
      })
    },
    handleDelete(data, type) {
      this.deleteDialog = true
      this.deleteObj.data = data
      this.deleteObj.type = type
    },
    handleEdit(data, type) {
      debugger
      this.buildUnitObj = data
      this.buildUnitObj.houseId = this.param.house_id
      this.buildUnitObj.isEdit = true
      if (data.isSingleBuild) {
        this.buildUnitObj.id = data.id.substring(0, data.id.length - 1)
      }
      if (type === 1) {
        this.newSingleBuilding = true
      } else if (type === 2) {
        this.newSingleUnit = true
      }
    },
    handleAdd(data) {
      this.buildUnitObj = defaultBuildUnitObj()
      this.buildUnitObj.buildingId = data.id
      this.newSingleUnit = true
    },
    handleCopy(data) {
      var tempFlag = true
      this.buildList.forEach((val) => {
        if (val.id === data.buildingId && tempFlag) {
          var newObj = JSON.parse(JSON.stringify(data))
          newObj.id = newObj.id + 2
          newObj.unitName = newObj.unitName + 1
          newObj.isCopy = true
          // val.children.push(newObj)
          val.tbBrokerUnitVos.push(newObj)
          tempFlag = false
        }
      })
      this.newBuildList()
    },
    copyBuilding(obj) {
      if (obj.type === 1) {
        var newObj = JSON.parse(JSON.stringify(obj.data))
        newObj.id = newObj.id + 3
        newObj.buildingName = newObj.buildingName + 1
        newObj.isCopy = true
        newObj.tbBrokerUnitVos = []
        this.buildList.push(newObj)
        this.newBuildList()
      } else {
        var tempObj = JSON.parse(JSON.stringify(obj.data))
        tempObj.id = tempObj.id + 4
        tempObj.buildingName = tempObj.buildingName + 1
        tempObj.isCopy = true
        tempObj.tbBrokerUnitVos.forEach(value => {
          value.id = value.id + 5
          value.isCopy = true
          value.buildingId = tempObj.id
        })
        this.buildList.push(tempObj)
        this.newBuildList()
      }
    },
    composeValue(data, type) {
      return {
        'data': data,
        'type': type
      }
    },
    handleSubmit() {
      this.tempBuildList.forEach((val) => {
        if (val.isCopy) {
          val.id = ''
        }
        if (val.children[0].isSingleBuild) {
          val.propertyType = val.children[0].propertyType
          val.buildingType = val.children[0].buildingType
          val.elevatorNum = val.children[0].elevatorNum
          val.familyCount = val.children[0].familyCount
          val.unitParamList = []
        } else {
          val.children.forEach((unit) => {
            if (val.isCopy) {
              unit.buildingId = ''
            }
            if (unit.isCopy) {
              unit.id = ''
            }
          })
          val.unitParamList = val.children
        }
      })
      saveOrUpdateBuildings(this.tempBuildList).then(response => {
        if (response.code === 200) {
          this.buildListByHouseId()
          this.$message('保存成功')
          this.dialogTableVisible = false
        } else {
          this.$message(response.desc)
        }
      })
    },
    doDelete() {
      if (this.deleteObj.type === 1) {
        if (this.deleteObj.data.isCopy) {
          this.tempBuildList.forEach((value, index) => {
            if (value.id === this.deleteObj.data.id) {
              this.tempBuildList.splice(index, 1)
              this.$message('删除成功')
              this.deleteDialog = false
              this.buildListByHouseId()
            }
          })
        } else {
          deleteBuilding(this.deleteObj.data.id).then(response => {
            if (response.code === 200) {
              this.buildListByHouseId()
              this.$message('删除成功')
              this.deleteDialog = false
            } else {
              this.$message(response.desc)
            }
          })
        }
      } else if (this.deleteObj.type === 2) {
        if (this.deleteObj.data.isCopy) {
          this.tempBuildList.forEach(value => {
            if (value.id === this.deleteObj.data.buildingId) {
              value.children.forEach((val, index) => {
                if (val.id === this.deleteObj.data.id) {
                  value.children.splice(index, 1)
                  this.$message('删除成功')
                  this.deleteDialog = false
                  this.newBuildList()
                }
              })
            }
          })
        } else {
          deleteUnit(this.deleteObj.data.id).then(response => {
            if (response.code === 200) {
              this.buildListByHouseId()
              this.$message('删除成功')
              this.deleteDialog = false
            } else {
              this.$message(response.desc)
            }
          })
        }
      } else if (this.deleteObj.type === 3) {
        deleteBrokerFloors(this.deleteObj.data).then(response => {
          if (response.code === 200) {
            this.checkFloorId = []
            this.buildListByHouseId()
            this.$message('删除成功')
            this.deleteDialog = false
          } else {
            this.$message(response.desc)
          }
        })
      } else if (this.deleteObj.type === 4) {
        deleteBrokerRooms(this.deleteObj.data).then(response => {
          if (response.code === 200) {
            this.checkRoomId = []
            this.buildListByHouseId()
            this.$message('删除成功')
            this.deleteDialog = false
          } else {
            this.$message(response.desc)
          }
        })
      }
    },
    tabChange(tab) {
      if (tab.name === 'build'&& this.tempBuildList.length > 0) {
        this.saveAllButtonFlag = true
      } else {
        this.saveAllButtonFlag = false
      }
    },
    rowCheck(val, data) {
      if (val) {
        this.checkFloorId.push(data.id)
        this.checks.florChecks[data.id].forEach((roomId) => {
          if (this.checkRoomId.indexOf(roomId) === -1) {
            this.checkRoomId.push(roomId)
          }
        })
      } else {
        var index = this.checkFloorId.indexOf(data.id)
        this.checkFloorId.splice(index, 1)
        this.checks.florChecks[data.id].forEach((roomId) => {
          for (let i = this.checkRoomId.length - 1; i >= 0; i--) {
            if (this.checkRoomId[i] === roomId) {
              this.checkRoomId.splice(i, 1)
            }
          }
        })
      }
      this.checkedCities = this.toArray(val, this.checkedCities, this.checks.florChecks[data.id])
    },
    seqCheck(val, data) {
      if (val) {
        this.checks.seqChecks[data].forEach((roomId) => {
          if (this.checkRoomId.indexOf(roomId) === -1) {
            this.checkRoomId.push(roomId)
          }
        })
      } else {
        this.checks.seqChecks[data].forEach((roomId) => {
          for (let i = this.checkRoomId.length - 1; i >= 0; i--) {
            if (this.checkRoomId[i] === roomId) {
              this.checkRoomId.splice(i, 1)
            }
          }
        })
      }
      this.checkedCities = this.toArray(val, this.checkedCities, this.checks.seqChecks[data])
    },
    roomCheck(val, data) {
      if (val) {
        this.checkRoomId.push(data.id)
      } else {
        var index = this.checkRoomId.indexOf(data.id)
        this.checkRoomId.splice(index, 1)
      }
    },
    // 获取房号序号
    getRoomSeqByUnitId() {
      this.listLoading = true

      const param = {}
      if (this.getFloorRoomParam.unitId !== '') {
        param.id = this.getFloorRoomParam.unitId
        param.flag = 0
      } else if (this.getFloorRoomParam.buildingId !== '') {
        param.id = this.getFloorRoomParam.buildingId
        param.flag = 1
      }
      if (param.flag === 0 || param.flag === 1) {
        getRoomSeqByUnitId(param.id, param.flag).then(response => {
          this.roomSeqs = response.data
          this.listLoading = false
        })
      }
    },
    brokerRoomList() {
      this.listLoading = true
      const $this = this
      $this.floorRooms = []
      this.checkedCities = []
      if (this.getFloorRoomParam.unitId !== '' || this.getFloorRoomParam.buildingId !== '') {
        findBrokerRoomList(this.getFloorRoomParam).then(response => {
          this.floorRoomList = response.data
          this.allRoomId = []
          this.allFloorId = []
          if (this.floorRoomList && this.floorRoomList.length > 0) {
            this.floorRoomList.forEach((val, index) => {
              const floorArray = []
              const rowChecksArray = []
              // 解析楼层
              $this.ids.push(val.id)
              this.allFloorId.push(val.id)
              floorArray.push({ name: val.actualFloorNum + '层', id: val.id, type: 0 })
              // 解析房号
              if ($this.roomSeqs && $this.roomSeqs.length > 0) {
                $this.roomSeqs.forEach((req) => {
                // 根据序列号存储列数据
                  let columArray = $this.checks.seqChecks[req]
                  if (columArray == null) {
                    columArray = []
                  }
                  if (val.tbBrokerRoomVoList.length === 0) {
                    floorArray.push({ name: '', id: '', type: 1 })
                  } else {
                    const room = val.tbBrokerRoomVoList.filter(room => room.roomSeq === req)
                    if (room.length === 0) {
                      floorArray.push({ name: '', id: '', type: 1 })
                    } else {
                      $this.ids.push(room[0].id)
                      this.allRoomId.push(room[0].id)
                      rowChecksArray.push(room[0].id)
                      columArray.push(room[0].id)
                      $this.checks.seqChecks[req + ''] = columArray
                      floorArray.push({ name: room[0].roomNumber, id: room[0].id, type: 1 })
                    }
                  }
                })
              }
              $this.checks.florChecks[val.id] = rowChecksArray
              $this.floorRooms.push(floorArray)
            })
          }
          this.listLoading = false
        })
      }
    },
    handleNodeClick(data) {
      this.checkFloorId = []
      this.checkRoomId = []
      if (data.isBuild && data.tbBrokerUnitVos.length === 0) {
        this.getFloorRoomParam.buildingId = data.id
        this.name = data.buildingName
      }
      if (!data.isBuild) {
        this.getFloorRoomParam.buildingId = data.buildingId
        this.getFloorRoomParam.unitId = data.id

        this.name = data.unitName
      }
      this.getRoomSeqByUnitId()
      this.brokerRoomList()
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.ids : []
      this.checkFloorId = val ? this.allFloorId : []
      this.checkRoomId = val ? this.allRoomId : []
      this.isIndeterminate = false
    },
    // 数组操作
    toArray(flag, oldArray = [], newArray = []) {
      if (flag) {
        if (newArray.length > 0) {
          newArray.forEach(val => {
            var index = oldArray.indexOf(val)
            if (index < 0) {
              oldArray.push(val)
            }
          })
        }
      } else {
        if (newArray.length > 0) {
          newArray.forEach(val => {
            var index = oldArray.indexOf(val)
            if (index > -1) {
              oldArray.splice(index, 1)
            }
          })
        }
      }
      return oldArray
    },
    mapClose() {
      this.dialogMapVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .cell {
    .t-cell {
      display: inline-block;
      width: 80%;
      .el-input {
        width: auto;
      }
      /*.el-input__inner {*/
      /*  width: 40%;*/
      /*}*/
    }
    .input-100 {
      width: 100px;
    }
  }

</style>
