import request from '@/utils/request'

const base_points = '/user/points'

export function getPoints(query) {
  return request({
    url: base_points,
    method: 'get',
    params: query
  })
}

export function getPointList() {
  return request({
    url: base_points + '/list',
    method: 'get'
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

export function getLngLat(query) {
  return request({
    url: 'http://api.map.baidu.com/geocoder/v2/',
    method: 'get',
    params: query
  })
}
