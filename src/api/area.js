import request from '@/utils/request'

export function treeByCode(params) {
  return request({
    url: '/service-house/area/treeByCode',
    method: 'get',
    params
  })
}
