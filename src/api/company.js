import request from '@/utils/request'

export function developersPage(params) {
  return request({
    url: '/service-house/developers/page',
    method: 'get',
    params
  })
}
export function brandCompanyPage(params) {
  return request({
    url: '/service-house/brandCompany/page',
    method: 'get',
    params
  })
}

export function developerExportRequest(params) {
  return request({
    url: '/service-house/developers/download',
    method: 'get',
    data: params
  })
}
export function developerSave(params) {
  return request({
    url: '/service-house/developers/save',
    method: 'POST',
    data: params
  })
}
export function developerDelete(id) {
  return request({
    url: '/service-house/developers/delete/' + id,
    method: 'DELETE'
  })
}
export function developerVerifyRequest(params) {
  return request({
    url: '/service-house/developers/approve',
    method: 'get',
    params
  })
}
export function companyExportRequest(params) {
  return request({
    url: '/service-house/brandCompany/download',
    method: 'get',
    params
  })
}
export function brandCompanySave(params) {
  return request({
    url: '/service-house/brandCompany/save',
    method: 'POST',
    data: params
  })
}
export function companyDeleteReq(id) {
  return request({
    url: '/service-house/brandCompany/delete/' + id,
    method: 'DELETE'
  })
}
