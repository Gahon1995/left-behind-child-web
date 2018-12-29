import request from '@/utils/request'
const demands = '/admin/demands'
export function getDemands(query) {
  return request({
    url: demands,
    method: 'get',
    params: query
  })
}

export function updateDemands(data) {
  return request({
    url: demands,
    method: 'put',
    data: data
  })
}

export function deleteDemand(id) {
  return request({
    url: demands + '/' + id,
    method: 'DELETE'
  })
}
