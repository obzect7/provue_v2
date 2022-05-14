import request from '@/utils/request'

/**
 * login func
 * parameter: {
 *     userid: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: '',
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: '/user/nav',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
