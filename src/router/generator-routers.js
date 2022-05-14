// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'

// 프런트 엔드 라우팅 테이블
const constantRouterComponents = {
  // 기본 페이지 레이아웃을 가져와야 합니다.
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  403: () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  404: () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  500: () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 페이지 구성 요소를 동적으로 가져와야 합니다.
  Workplace: () => import('@/views/dashboard/Workplace'),
  Analysis: () => import('@/views/dashboard/Analysis'),

  // form
  BasicForm: () => import('@/views/form/basicForm'),
  StepForm: () => import('@/views/form/stepForm/StepForm'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  TableList: () => import('@/views/list/TableList'),
  StandardList: () => import('@/views/list/BasicList'),
  CardList: () => import('@/views/list/CardList'),
  SearchLayout: () => import('@/views/list/search/SearchLayout'),
  SearchArticles: () => import('@/views/list/search/Article'),
  SearchProjects: () => import('@/views/list/search/Projects'),
  SearchApplications: () => import('@/views/list/search/Applications'),
  ProfileBasic: () => import('@/views/profile/basic'),
  ProfileAdvanced: () => import('@/views/profile/advanced/Advanced'),

  // result
  ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // account
  AccountCenter: () => import('@/views/account/center'),
  AccountSettings: () => import('@/views/account/settings/Index'),
  BasicSetting: () => import('@/views/account/settings/BasicSetting'),
  SecuritySettings: () => import('@/views/account/settings/Security'),
  CustomSettings: () => import('@/views/account/settings/Custom'),
  BindingSettings: () => import('@/views/account/settings/Binding'),
  NotificationSettings: () => import('@/views/account/settings/Notification')

  // 'TestWork': () => import(/* webpackChunkName: "TestWork" */ '@/views/dashboard/TestWork')
}

// 프론트엔드가 페이지 경로를 찾지 못함(변경 없이 고정됨)
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 루트 수준 메뉴
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/dashboard',
  meta: {
    title: '메인'
  },
  children: []
}

/**
 * 메뉴를 동적으로 생성
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (token) => {
  return new Promise((resolve, reject) => {
    loginService
      .getCurrentUserNav(token)
      .then((res) => {
        console.log('generatorDynamicRouter response:', res)
        const { result } = res
        const menuNav = []
        const childrenNav = []
        //      백엔드 데이터, 루트 레벨 트리 배열, 루트 레벨 PID
        listToTree(result, childrenNav, 0)
        rootRouter.children = childrenNav
        menuNav.push(rootRouter)
        console.log('menuNav', menuNav)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        console.log('routers', routers)
        resolve(routers)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 트리 구조 데이터 형식화 vue-router 계층적 라우팅 테이블 생성
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map((item) => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 경로가 경로로 설정되어 있으면 기본 경로로 사용되며, 그렇지 않으면 경로 주소가 /dashboard/workplace와 같이 동적으로 연결되어 생성됩니다.
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 경로 이름은 고유해야 합니다.
      name: item.name || item.key || '',
      // 이 경로에 해당하는 페이지의 구성 요소: Scheme 1
      // component: constantRouterComponents[item.component || item.key],
      // 이 경로에 해당하는 페이지의 구성 요소: Scheme 2(동적 로딩)
      component: constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`)),

      // meta: 페이지 제목, 메뉴 아이콘, 페이지 권한(명령 권한의 경우 제거 가능)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 숨겨진 메뉴 설정 여부
    if (show === false) {
      currentRouter.hidden = true
    }
    // 숨겨진 하위 메뉴 설정 여부
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 백엔드에서 불규칙한 반환 결과를 방지하기 위해 두 개의 백슬래시가 처리에 접합될 수 있습니다.
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 리디렉션
    item.redirect && (currentRouter.redirect = item.redirect)
    // 하위 메뉴가 있는지 여부 및 재귀 적으로 처리
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 트리 구조에 대한 배열
 * @param list 배열
 * @param tree 트리
 * @param parentId 부모ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach((item) => {
    // 상위 메뉴인지 확인
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 목록을 반복하여 현재 메뉴와 일치하는 모든 하위 메뉴를 찾습니다.
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 트리에 추가함.
      tree.push(child)
    }
  })
}
