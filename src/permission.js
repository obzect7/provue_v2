import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then((res) => {
            const roles = res.result && res.result.role
            // generate dynamic router
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 역할 권한을 기반으로 액세스 가능한 라우팅 테이블 생성
              // 액세스 가능한 라우팅 테이블을 동적으로 추가
              // VueRouter@3.5.0+ New API
              store.getters.addRouters.forEach((r) => {
                router.addRoute(r)
              })
              // 요청이 redirect로 리디렉션되는 경우，로그인이 자동으로 이 주소로 리디렉션됩니다.
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 목적지 경로로 점프
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '에러',
              description: '사용자 정보를 요청하지 못했습니다. 다시 시도해 주세요.'
            })
            // 실패 시 사용자 정보 획득 실패 시 로그아웃을 호출하여 이력 보유 정보 삭제
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 로그인 목록에서 직접 입력
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
