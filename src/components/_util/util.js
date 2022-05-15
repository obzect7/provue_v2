/**
 * components util
 */

/**
 * null 객체 정리
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
  return children.filter((c) => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 문자열 길이, 영문자 길이 1byte, 한글 길이 2byte가져오기
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 문자열을 가로채서 maxLength에 따라 반환합니다.
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}
