import request from '@/utils/request'
const demands = '/demands'
export function getDemands(query) {
  return request({
    url: demands,
    method: 'get',
    params: query
  })
}
