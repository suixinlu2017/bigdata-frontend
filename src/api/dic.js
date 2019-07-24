import request from '@/utils/request'

export function getListByType(params) {
  return request({
    url: '/service-house/dic/listByType',
    method: 'get',
    params
  })
}
export function pageDic(params) {
  return request({
    url: '/service-house/dic/page',
    method: 'get',
    params
  })
}
export function addDic(params) {
  return request({
    url: '/service-house/dic/add',
    method: 'post',
    data: params
  })
}

export function updateDic(params) {
  return request({
    url: '/service-house/dic/update',
    method: 'post',
    data: params
  })
}
export function deleteDic(id) {
  return request({
    url: '/service-house/dic/delete/' + id,
    method: 'delete'
  })
}
export function listByParentCode(params) {
  return request({
    url: '/service-house/dic/dic/listByParentCode?parentCode=' + params,
    method: 'get'
  })
}
