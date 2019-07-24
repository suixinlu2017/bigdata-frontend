<template>
  <div>
    <el-row style="padding: 20px 0 10px 0;">

      <el-col :span="24" style="float: right"> <el-button type="primary">主要按钮</el-button>     <el-button type="primary">主要按钮</el-button></el-col>

    </el-row>
    <el-row>

      <el-col :span="4"><div><el-tree ref="buildTree" node-key="id"  :default-expand-all = 'true' :data="newBuildList" :props="defaultProps" @node-click="handleNodeClick" /></div></el-col>
      <el-col :span="20">
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
                    <el-checkbox :key="item" :label="item"  @change="seqCheck($event,item)">  {{ item }} </el-checkbox>
                  </th>
                </tr>

                <tr v-for=" floorRoom in floorRooms" class="el-table__row">
                  <td v-for="room in floorRoom">
                    <el-checkbox v-if="room.type ===1 && room.name != ''" :key="room.id" :label="room.id">{{ room.name }}</el-checkbox>
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
</template>
<script>

import { findBuildingList, findBrokerRoomList, getRoomSeqByUnitId } from '@/api/house'

export default {
  name: 'InlineEditTable',
  data() {
    return {
      name: '',
      checkAll: false,
      rowCheckFlag: false,
      reqCheckFlag: false,
      isIndeterminate: true,
      dialogTableVisible: false,
      buildList: [],
      newBuildList: [],
      listLoading: true,
      getBuildParam: {
        house_id: '6532553509382914051'
      },
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

      defaultProps: {
        value: 'id', // ID字段名
        children: 'tbBrokerUnitVos',
        label: 'name'
      }

    }
  },
  computed: {

  },
  mounted() {
    this.buildListByHouseId()
  },
  methods: {
    buildListByHouseId() {
      this.listLoading = true
      findBuildingList(this.getBuildParam).then(response => {
        this.buildList = response.data
        const arr = []

        if (this.buildList.length > 0) {
          this.buildList.forEach((val, index) => {
            val.name = val.buildingName
            val.isBuild = true
            const $buindIndex = index
            if (val.tbBrokerUnitVos.length > 0) {
              val.tbBrokerUnitVos.forEach(val => {
                if ($buindIndex === 0 && index === 0) {
                  this.getFloorRoomParam.unitId = val.id
                  this.name = val.unitName
                  this.$refs.buildTree.setCheckedKeys([val.id + ''])
                }
                val.name = val.unitName
                val.isBuild = false
              })
            }
            arr.push(val)
          })
          this.newBuildList = arr
        }
        this.getRoomSeqByUnitId()
        this.brokerRoomList()

        this.listLoading = false
      })
    },
    rowCheck(val, data) {
      this.checkedCities = this.toArray(val, this.checkedCities, this.checks.florChecks[data.id])
    },
    seqCheck(val, data) {
      this.checkedCities = this.toArray(val, this.checkedCities, this.checks.seqChecks[data])
    },
    // 获取房号序号
    getRoomSeqByUnitId() {
      this.listLoading = true
      getRoomSeqByUnitId(this.getFloorRoomParam).then(response => {
        this.roomSeqs = response.data

        this.listLoading = false
      })
    },
    brokerRoomList() {
      this.listLoading = true
      const $this = this
      $this.floorRooms = []
      findBrokerRoomList(this.getFloorRoomParam).then(response => {
        this.floorRoomList = response.data
        if (this.floorRoomList != null) {
          this.floorRoomList.forEach((val, index) => {
            const floorArray = []
            const rowChecksArray = []
            // 解析楼层

            floorArray.push({ name: val.actualFloorNum + '层', id: val.id, type: 0 })
            // 解析房号
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
                  rowChecksArray.push(room[0].id)
                  columArray.push(room[0].id)
                  $this.checks.seqChecks[req + ''] = columArray
                  floorArray.push({ name: room[0].roomNumber, id: room[0].id, type: 1 })
                }
              }
            })
            $this.checks.florChecks[val.id] = rowChecksArray
            $this.floorRooms.push(floorArray)
          })
        }
        this.listLoading = false
      })
    },
    handleClick(row) {
      console.log(row)
    },
    handleNodeClick(data) {
      if (data.isBuild && data.tbBrokerUnitVos.length === 0) {
        this.getFloorRoomParam.buildingId = data.id
        this.name = data.buildingName
      }
      if (!data.isBuild) {
        this.getFloorRoomParam.unitId = data.id
        this.name = data.unitName
      }
      this.brokerRoomList()

      console.log(data)
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.ids : []
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
    }

  }
}
</script>

