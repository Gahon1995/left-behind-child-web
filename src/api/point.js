import request from '@/utils/request'

export function getPoints(query) {
  return request({
    url: '/admin/points',
    method: 'get',
    params: query
  })
}
