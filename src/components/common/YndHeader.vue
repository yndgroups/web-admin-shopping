<template>
  <div class="layout-header">
    <!-- <h1 class="logo">乡村振兴-智慧应用平台</h1> -->
    <div class="left">
      <div class="logo">后台管理系统</div>
      <!-- 菜单 -->
      <div class="tabs-box">
        <a-tabs
          v-model:activeKey="state.activeKey"
          @change="onTabChange"
          @tabScroll="callback"
        >
          <a-tab-pane
            :key="index"
            v-for="(item, index) in menuList"
          >
            <template #tab>
              <div
                class="text-center menu-item"
                :class="{ active: route.path.split('/')[1] === item.url }"
              >
                <div class="pd-t5 icons pd-l10">
                  <component
                    v-if="item.icon"
                    :is="item.icon"
                  ></component>
                </div>
                <div class="action-name">{{ item.name }}</div>
              </div>
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <section class="user-info">
      <div
        class="ant-dropdown-link"
        @click.prevent
      >
        <img
          class="avatar"
          @mouseover="showDrawer"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <p class="user-name">{{ userName }}</p>
      </div>
      <a-dropdown>
        <template #overlay>
          <a-menu @click="selectUserItem">
            <a-menu-item key="1">退出登录</a-menu-item>
            <a-menu-item key="2">修改密码</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-drawer
        v-model:open="visible"
        class="custom-class"
        title="会员信息中心"
        placement="right"
        @after-open-change="afterVisibleChange"
      >
        <div class="member-info">
          <div class="avatar">
            <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            <div>
              <div class="user-name">{{ userName }}</div>
              <div>
                <span class="update-pwd">修改密码</span>
                <span
                  @click="logout"
                  class="logout"
                >
                  退出登陆
                </span>
              </div>
            </div>
          </div>
          <ul>
            <li>会员等级： 金牌会员</li>
            <li>购买力：实力卖家</li>
            <li>授权平台</li>
            <li>关闭路径提示</li>
          </ul>
        </div>
      </a-drawer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@ant-design/icons-vue'
import apis from '@/apis'
import { message } from 'ant-design-vue'
const emit = defineEmits(['setMenuList'])
const visible = ref(false)
const router = useRouter()
const route = useRoute()
interface Menu {
  name: string
  menuId: string
  parentId: string
  icon: string
  url: string
  menuType: number
  sortBy: number
  path: string
  children: Menu[]
}
interface Data {
  menuList: Menu[]
  activeIndex: number
  activeKey: string
  basePath: string
  userName: string
}
let state = reactive<Data>({
  menuList: [],
  activeIndex: 0,
  basePath: '',
  activeKey: 'system',
  userName: '',
})
let { menuList, userName } = toRefs(state)

const afterVisibleChange = (bool: boolean) => {
  Logger.log(bool)
}

const callback = (val: any) => {
  console.log(val)
}

const selectUserItem = (item: any) => {
  switch (item.key) {
    case '1':
      router.push('/login')
      break
    case '2':
      break
  }
}

const logout = async () => {
  let { code, msg } = await apis.getJSON(apis.logout)
  if (code === 1) {
    message.success(msg || '退出成功！')
    setTimeout(() => {
      sessionStorage.clear()
      localStorage.clear()
      router.push('/login')
    }, 1000)
  } else {
    message.warning('退出失败, 请重试')
  }
}

onMounted(() => {
  getMenuData()
  let userName = sessionStorage.getItem('userName')
  if (userName) {
    state.userName = userName
  }
})

// tab切换
const onTabChange = (index: any) => {
  let checkedMenu = state.menuList[index] as any
  console.log(checkedMenu, 'checkedMenu')
  if (checkedMenu && checkedMenu.children && checkedMenu.children.length > 0) {
    emit('setMenuList', checkedMenu.children)
  } else {
    console.log('请检查点击获取的数据是否正确')
  }
  // if (checkedMenu.url) {
  //   router.push('/')
  // }
}

/**
 * 获取菜单数据
 */
const getMenuData = async () => {
  let menuList = sessionStorage.getItem('menus')
  if (menuList) {
    state.menuList = JSON.parse(menuList)
    let children = sessionStorage.getItem('currentMenuList')
    if (children) {
      emit('setMenuList', JSON.parse(children as string))
      return
    }
    emit('setMenuList', state.menuList[0].children)
  } else {
    message.warning('未获取菜单数据')
  }
}

/**
 * 显示抽屉
 */
const showDrawer = () => {
  visible.value = true
}
</script>

<style lang="scss" scoped>
.icons {
  font-size: 16px;
}
.layout-header :deep(.ant-tabs-tab) {
  margin-left: 0;
  line-height: normal;
  padding: 0;
  height: 60px;
  overflow: hidden;
}
.layout-header :deep(.ant-tabs-nav) {
  padding: 0;
  margin: 0;
}
.layout-header :deep(.ant-tabs-top > .ant-tabs-nav::before, .ant-tabs-bottom > .ant-tabs-nav::before, .ant-tabs-top > div > .ant-tabs-nav::before, .ant-tabs-bottom > div > .ant-tabs-nav::before) {
  display: none;
}

.layout-header :deep(.ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar, .ant-tabs-top > div > .ant-tabs-nav .ant-tabs-ink-bar) {
  display: none;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $color-white;
  box-sizing: border-box;
  padding: 0 30px 0 10px;
  color: #333;
  width: 100vw;
  box-sizing: border-box;

  .left {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 60px;
    width: calc(100vw - 200px);
    overflow: hidden;

    .tabs-box {
      height: 60px;
      overflow: hidden;
    }

    .logo {
      color: #04895f;
      font-size: 16px;
      margin-right: 10px;
      height: 43px;
      width: 190px;
      min-width: 190px;
      border: 1px dashed $text-main-color;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .menu-item {
    padding: 0 20px;
    border: #c9c9c9 dashed 1px;
    margin-right: 5px;
    border-radius: 5px;
  }

  .menu-item:hover {
    border: #04895f dashed 1px;
    color: #04895f;
  }

  .menu-item.active:hover {
    border: #04895f dashed 1px;
    color: #fff;
  }

  .active {
    border: #04895f dashed 1px;
    background: #04895f;
    color: #fff;
  }

  .user-info {
    cursor: pointer;
    text-align: center;
    min-width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    overflow: hidden;

    .user-name {
      font-size: 12px;
      color: $text-main-color;
    }

    .avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-top: 5px;
    }
    .avatar:hover {
      cursor: pointer;
      -webkit-transform: rotate(360deg);
      -moz-animation: rotation 3s linear infinite;
      -webkit-animation: rotation 3s linear infinite;
      -o-animation: rotation 3s linear infinite;
      animation: rotation 3s linear infinite;
      transform: rotate(360deg);
    }
  }
}

.member-info {
  .avatar {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #04895f;
  }
  .update-pwd {
    padding-right: 15px;
    color: $warning-color;
  }

  .logout {
    color: $dangger-color;
    cursor: pointer;
  }
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid $success-color;
    margin-right: 20px;
  }
  .user-name {
    font-size: 18px;
    padding: 5px 0 15px 0;
  }

  ul,
  li {
    padding: 0;
    margin: 0 8px;
    padding-bottom: 10px;
  }
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
