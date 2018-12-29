import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    data: token
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}
