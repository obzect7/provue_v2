export const PERMISSION_ENUM = {
  add: { key: 'add', label: '추가' },
  delete: { key: 'delete', label: '삭제' },
  edit: { key: 'edit', label: '수정' },
  query: { key: 'query', label: '조회' },
  get: { key: 'get', label: '상세' },
  enable: { key: 'enable', label: '사용가능' },
  disable: { key: 'disable', label: '사용불가' },
  import: { key: 'import', label: 'Import' },
  export: { key: 'export', label: 'Export' }
}

/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param Vue
 */
function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth &&
    Object.defineProperties(Vue.prototype, {
      $auth: {
        get () {
          const _this = this
          return (permissions) => {
            const [permission, action] = permissions.split('.')
            const permissionList = _this.$store.getters.roles.permissions
            return (
              permissionList
                .find((val) => {
                  return val.permissionId === permission
                })
                .actionList.findIndex((val) => {
                  return val === action
                }) > -1
            )
          }
        }
      }
    })

  !Vue.prototype.$enum &&
    Object.defineProperties(Vue.prototype, {
      $enum: {
        get () {
          // const _this = this;
          return (val) => {
            let result = PERMISSION_ENUM
            val &&
              val.split('.').forEach((v) => {
                result = (result && result[v]) || null
              })
            return result
          }
        }
      }
    })
}

export default plugin
