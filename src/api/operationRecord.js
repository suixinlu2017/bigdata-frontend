import request from '@/utils/request'

export function operationRecordPageReq(params) {
  return request({
    url: '/service-house/OperationLog/page',
    method: 'get',
    params
  })
}

