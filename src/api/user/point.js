import request from '@/utils/request'

const base_points = '/user/points'

export function getPoints(query) {
  return request({
    url: base_points,
    method: 'get',
    params: query
  })
}

export function getOnePoint(pid) {
  console.log(pid)
  return request({
    url: base_points + '/' + pid,
    method: 'get'
  })
}

export function updatePoint(data) {
  return request({
    url: base_points,
    method: 'post',
    data: data
  })
}

export function deletePoint() {
  return request({
    url: base_points,
    method: 'delete'
  })
}
