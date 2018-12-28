import request from '@/utils/request'

export function getDemands(query) {
  return request({
    url: '/admin/demands',
    method: 'get',
    params: query
  })
}
