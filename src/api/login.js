import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    data: token
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data: data
  })
}
