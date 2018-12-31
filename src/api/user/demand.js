import request from '@/utils/request'
const demands = '/user/demands'
export function getDemands(query) {
  return request({
    url: demands,
    method: 'get',
    params: query
  })
}

export function getDemand(did) {
  console.log(did)
  return request({
    url: demands + '/' + did,
    method: 'get'
  })
}

export function updateDemand(data) {
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
