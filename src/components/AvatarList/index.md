# AvatarList 用户头像列表


프로젝트/팀 구성원 목록에서 일반적으로 사용되는 사용자 아바타 세트입니다. 아바타 크기는 `size` 속성을 설정하여 지정할 수 있습니다.



사용 방법：

```javascript
import AvatarList from '@/components/AvatarList'
const AvatarListItem = AvatarList.Item

export default {
    components: {
        AvatarList,
        AvatarListItem
    }
}
```



## 코드 데모  [demo](https://pro.loacg.com/test/home)

```html
<avatar-list size="mini">
    <avatar-list-item tips="Jake" src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" />
    <avatar-list-item tips="Andy" src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png" />
    <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
</avatar-list>
```
또는
```html
<avatar-list :max-length="3">
    <avatar-list-item tips="Jake" src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" />
    <avatar-list-item tips="Andy" src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png" />
    <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
    <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
    <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
    <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
    <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
</avatar-list>
```



## API

### AvatarList

| 파라미터             | 설명       | 타입                                 | 기본값       |
|------------------|----------|------------------------------------| --------- |
| size             | 头像大小     | `large`、`small` 、`mini`, `default` | `default` |
| maxLength        | 要显示的最大项目 | number                             | -         |
| excessItemsStyle | 多余的项目风格  | CSSProperties                      | -         |

### AvatarList.Item

| 参数   | 说明     | 类型        | 默认值 |
| ---- | ------ | --------- | --- |
| tips | 头像展示文案 | string | -   |
| src  | 头像图片连接 | string    | -   |

