import request from '@/utils/request'

export function getUsers(query) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: query
  })
}
