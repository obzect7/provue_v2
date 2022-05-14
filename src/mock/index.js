import { isIE } from '@/utils/util'

// 환경이 prod가 아니거나 미리보기가 참이라고 판단되면 mock 서비스를 로드
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  if (isIE()) {
    console.error('[antd-pro] ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.')
  }
  // 종속성의 동기 로딩 사용
  // vuex의 GetInfo가 mock보다 먼저 실행되는 것을 방지하여 결과를 반환하기 위해 요청을 모의할 수 없게 됩니다.
  console.log('[antd-pro] mock mounting')
  const Mock = require('mockjs2')
  require('./services/auth')
  require('./services/user')
  require('./services/manage')
  require('./services/other')
  require('./services/tagCloud')
  require('./services/article')

  Mock.setup({
    timeout: 800 // setter delay time
  })
  console.log('[antd-pro] mock mounted')
}
