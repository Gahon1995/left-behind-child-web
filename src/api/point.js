import request from '@/utils/request'

const base_points = '/admin/points'

export function getPoints(query) {
  return request({
    url: base_points,
    method: 'get',
    params: query
  })
}

export function updatePoint(data) {
  return request({
    url: base_points,
    method: 'put',
    data: data
  })
}

export function deletePoint(id) {
  return request({
    url: base_points + '/' + id,
    method: 'delete'
  })
}
