import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
// export function login(data) {
//   return request({
//     url: '/Login/JWTToken3.0',
//     method: 'post',
//     data
//   })
// }

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// // 新增地址接口
// export function createAddress(data) {
//   return request({
//     url: '/save_new_address',
//     method: 'post',
//     headers: {'Content-type': 'application/json;charset=UTF-8'},
//     data
//   });
// }
// //导出
// export function Download(data) {
//   return request({
//     url: '/admin/merchant/download',
//     method: 'post',
//     headers: {"Content-Type": "application/json;application/octet-stream"},
//     responseType: 'blob',
//     data
//   });
// }