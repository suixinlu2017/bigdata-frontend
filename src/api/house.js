import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/service-house/house/page',
    // url: '/test/table/list',

    method: 'get',
    params
  })
}
// 查询楼栋单元列表
export function findBuildingList(params) {
  return request({
    url: '/service-house/brokerBuilding/findBuildingList',
    method: 'get',
    params
  })
}
// 查询楼层房号列表
export function findBrokerRoomList(params) {
  return request({
    url: '/service-house/brokerFloor/findBrokerFloorAndRoomList',
    method: 'get',
    params
  })
}
// 获取房号序号
export function getRoomSeqByUnitId(id, flag) {
  return request({
    url: '/service-house/brokerFloor/getRoomSeq/' + id + '/isUnitOrBuilding/' + flag,
    method: 'get'
  })
}
// 新增楼栋或批量
export function addBuildings(params) {
  return request({
    url: '/service-house/brokerBuilding/addBuildings',
    method: 'post',
    data: params
  })
}
// 修改楼栋
export function updateBuildings(params) {
  return request({
    url: '/service-house/brokerBuilding',
    method: 'put',
    data: params
  })
}
// 删除楼栋
export function deleteBuilding(params) {
  return request({
    url: '/service-house/brokerBuilding/deleteBuilding/' + params,
    method: 'delete'
  })
}
// 新增单元或批量
export function addUnits(params) {
  return request({
    url: '/service-house/brokerUnit/addUnits',
    method: 'post',
    data: params
  })
}
// 修改楼层
export function updateUnit(params) {
  return request({
    url: '/service-house/brokerUnit',
    method: 'put',
    data: params
  })
}
// 删除单元
export function deleteUnit(params) {
  return request({
    url: '/service-house/brokerUnit/deleteUnit/' + params,
    method: 'delete'
  })
}
// 批量保存楼栋单元数据
export function saveOrUpdateBuildings(params) {
  return request({
    url: '/service-house/brokerBuilding/saveOrUpdateBuildings',
    method: 'put',
    data: params
  })
}
// 新增楼层
export function addBrokerFloors(params) {
  return request({
    url: '/service-house/brokerFloor/addBrokerFloors',
    method: 'post',
    data: params
  })
}
// 修改楼层
export function updateBrokerFloors(params) {
  return request({
    url: '/service-house/brokerFloor/updateBrokerFloors',
    method: 'put',
    data: params
  })
}
// 删除楼层
export function deleteBrokerFloors(params) {
  return request({
    url: '/service-house/brokerFloor/deleteBrokerFloors/' + params,
    method: 'delete'
  })
}
// 新增房号
export function addBrokerRooms(params) {
  return request({
    url: '/service-house/brokerRoom/addBrokerRooms',
    method: 'post',
    data: params
  })
}
// 修改房号
export function updateBrokerRooms(params) {
  return request({
    url: '/service-house/brokerRoom/updateBrokerRooms',
    method: 'put',
    data: params
  })
}
// 删除房号
export function deleteBrokerRooms(params) {
  return request({
    url: '/service-house/brokerRoom/deleteBrokerRooms/' + params,
    method: 'delete'
  })
}

