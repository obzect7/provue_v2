import antdKoKR from 'ant-design-vue/es/locale-provider/ko_KR'
import momentKO from 'moment/locale/ko'
import global from './ko-KR/global'

import menu from './ko-KR/menu'
import setting from './ko-KR/setting'
import user from './ko-KR/user'

import dashboard from './ko-KR/dashboard'
import form from './ko-KR/form'
import result from './ko-KR/result'
import account from './ko-KR/account'

const components = {
  antLocale: antdKoKR,
  momentName: 'ko',
  momentLocale: momentKO
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': '메시지',
  'layouts.usermenu.dialog.content': '로그아웃하시겠습니까?',
  'layouts.userLayout.title': '프로소프트 프레임워크 입니다.',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account
}
