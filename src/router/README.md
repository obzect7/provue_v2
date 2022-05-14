라우팅/메뉴 설명
====


형식 및 설명
----

```ecmascript 6
const routerObject = {
  redirect: noredirect,
  name: 'router-name',
  hidden: true,
  meta: {
    title: 'title',
    icon: 'a-icon',
    target: '_blank|_self|_top|_parent',
    keepAlive: true,
    hiddenHeaderContent: true,
  }
}
```



`{ Route }` 개체

| 파라미터             | 설명                                    | 타입      | 기본값 |
|--------------------|---------------------------------------|---------| ------ |
| hidden             | 경로가 사이드바에 표시되는지 여부를 제어합니다.                     | boolean | false |
| redirect           | 리디렉션 주소, 이 경로에 액세스할 때 직접 리디렉션                | string  | -      |
| name               | 경로 이름은 설정해야 하며 같은 이름을 가질 수 없습니다.                      | string  | -      |
| meta               | 라우팅 메타 정보(라우트는 확장 정보와 함께 제공됨)                       | object  | {}     |
| hideChildrenInMenu | 메뉴를 하위 항목 대신 항목으로 강제 표시합니다(meta.hidden 포함). | boolean | -   |


`{ Meta }` 라우팅 메타 정보 개체

| 파라미터                | 설명                                                                                                                                                 | 타입           | 기본값 |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|--------------| ------ |
| title               | 경로 제목, 이동 경로 표시, 페이지 제목 *권장 설정                                                                                                                          | string       | -      |
| icon                | 메뉴에서 경로로 표시되는 아이콘                                                                                                                                    | [string,svg] | -      |
| keepAlive           | 경로를 캐시                                                                                                                                              | boolean      | false  |
| target              | 메뉴 링크 점프 대상(html a 태그 참조)                                                                                                                             | string       | -  |
| hidden              | 'hideChildrenInMenu'와 함께 사용하며, 메뉴를 숨길 때 부모 메뉴를 재귀적으로 제공하여 선택한 메뉴 항목을 표시_(개인 페이지 구성 방법 참조)_                                                                                  | boolean      | false  |
| hiddenHeaderContent | *[PageHeader](https://github.com/vueComponent/ant-design-vue-pro/blob/master/src/components/PageHeader/PageHeader.vue#L6) 구성 요소에서 페이지의 이동 경로와 페이지를 특별히 숨깁니다. 제목 | boolean      | false  |
| permission          | 프로젝트에서 제공한 권한 가로채기와 일치하는 권한이 일치하지 않을 경우 라우팅 페이지 접근이 금지됩니다.                                                                                                                 | array        | []     |

> 경로 사용자 정의 `Icon` 커스텀을 소개해주세요 `svg` Icon 파일은 경로에 전달됩니다. `meta.icon` 매개변수

라우팅 구축 예 1

라우팅 예
----

```ecmascript 6
const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '첫 장' },
    redirect: '/dashboard/analysis',
    children: [
      {
        path: '/dashboard',
        component: RouteView,
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        meta: {title: '대시보드', icon: 'dashboard', permission: ['dashboard']},
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: {title: '분석 페이지', permission: ['dashboard']}
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: {title: '모니터링 페이지', permission: ['dashboard']}
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: {title: '워크플레이스', permission: ['dashboard']}
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '결과 페이지', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            // 페이지는 탐색경로와 페이지 제목 표시줄을 숨깁니다.
            meta: { title: '성공', hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            // 페이지는 탐색경로와 페이지 제목 표시줄을 숨깁니다.
            meta: { title: '失败', hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },
      ...
    ]
  },
]
```

> 1. `component: () => import('..') ` 경로로 가져온 페이지 구성 요소는 지연 로드 모드에 있습니다. 자세한 내용은 [Vue 공식 문서](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)를 참조하세요.
> 2. 새 경로 추가는 다음에 추가해야 합니다. '/' (index) 라우팅 `children` 내부에
> 3. 하위 경로의 상위 경로는 하위 경로를 렌더링하려면 'router-view'가 있어야 합니다. vue-router 설명서를 주의 깊게 읽으십시오.
> 4. '권한'은 사용자 정의할 수 있습니다. 이 모듈만 사용자 정의하면 됩니다 [src/store/modules/permission.js#L10](https://github.com/vueComponent/ant-design-vue-pro/blob/master/ src/store/modules/permission.js#L10)


첨부된 권한 라우팅 구조：

![권한 구조](https://static-2.loacg.com/open/static/github/permissions.png)


두 번째 프론트 엔드 라우팅은 백엔드 디자인에 의해 동적으로 생성되며 공식 웹 사이트 문서 https://pro.antdv.com/docs/authority-management 참조로 이동할 수 있습니다.
