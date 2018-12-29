import request from '@/utils/request'

const base = '/admin/users'

export function getUsers(query) {
  return request({
    url: base,
    method: 'get',
    params: query
  })
}

export function deleteUser(id) {
  return request({
    url: base + '/' + id,
    method: 'delete'
  })
}
