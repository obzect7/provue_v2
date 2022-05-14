import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 로그인
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            console.log('reponse == ', response)
            const result = response
            if (result.code === 200 && result.data) {
              storage.set(ACCESS_TOKEN, result.data.token, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', result.data.token)
              resolve()
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 사용자 정보 가져오기
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            const result = response.result

            if (result.role && result.role.permissions.length > 0) {
              const role = result.role
              role.permissions = result.role.permissions
              role.permissions.map((per) => {
                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                  const action = per.actionEntitySet.map((action) => {
                    return action.action
                  })
                  per.actionList = action
                }
              })
              role.permissionList = role.permissions.map((permission) => {
                return permission.permissionId
              })
              commit('SET_ROLES', result.role)
              commit('SET_INFO', result)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }

            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)

            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 로그아웃
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            storage.remove(ACCESS_TOKEN)
            resolve()
          })
          .catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          })
          .finally(() => {})
      })
    }
  }
}

export default user
