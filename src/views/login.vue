<template>
  <div class="frame-page-login">
    <img
      class="login-bg"
      src="/static/images/prod/login_bg.jpg"
    />
    <div class="form-container">
      <div class="form-box">
        <a-form
          ref="formRef"
          :model="state.formState"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-form-item
            label="用户名 :"
            name="userName"
          >
            <a-input
              v-model:value="state.formState.userName"
              placeholder="请输入用户名"
            />
          </a-form-item>
          <a-form-item
            label="密码: "
            name="password"
          >
            <a-input
              type="password"
              placeholder="请输入密码"
              v-model:value="state.formState.password"
              :maxlength="30"
            />
          </a-form-item>
          <a-form-item
            label="登录验证: "
            name="verification"
            :key="state.key"
          >
            <div style="height: 0px; visibility: hidden">
              <a-switch
                placeholder="请输入密码"
                v-model:checked="state.formState.verification"
              />
            </div>
            <div
              class="v-btn"
              style="text-align: center"
              :class="!state.formState.verification ? 'v-btn-start' : 'v-btn-end'"
              @click="startValidation"
            >
              <span
                v-if="!state.formState.verification"
                style="position: relative; top: -2px"
              >
                <i class="fa-li fa fa-spinner fa-spin"></i>
              </span>
              <i
                v-else
                class="fa fa-check-circle"
              ></i>
              {{ !state.formState.verification ? '点击完成验证' : '验证通过' }}
            </div>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button @click="resetForm">重新填写</a-button>
            <a-button
              type="primary"
              @click="onSubmit"
              class="confirm"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
        <div class="copyright">
          <div>
            <a href="https://beian.miit.gov.cn/">备案号： 黔ICP备20003005号-2</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 滑块验证 -->
    <template v-if="state.visible">
      <a-modal
        v-model:open="state.visible"
        width="400px"
        :footer="null"
        :maskClosable="false"
        :destroyOnClose="true"
        title="登录验证"
      >
        <CommonDragVerifyImgChip
          ref="sss"
          :width="355"
          radius="0"
          :imgsrc="state.imgSrc"
          :isPassing="state.isPassing"
          :showRefresh="true"
          :barWidth="40"
          :height="50"
          text="请按住滑块拖动"
          successText="验证通过"
          handlerIcon="fa fa-angle-double-right fa-5x"
          successIcon="fa fa-check-circle fa-5x ok"
          background="#F2F2F2"
          textColor="#2a62ff"
          handlerBg="#dddddd"
          @refresh="reimg"
          @passcallback="verificationPass"
        ></CommonDragVerifyImgChip>
      </a-modal>
    </template>
  </div>
</template>
<script lang="ts" setup title="系统-登录">
import apis from '@/apis'
import { message } from 'ant-design-vue'
const key = 'updatable'
const router = useRouter()
// 验证码
const formRef = ref()
let state = reactive<any>({
  imgSrc: '/static/images/prod/1.png',
  isPassing: false,
  visible: false,
  key: 1,
  formState: {
    userName: '',
    password: '',
    verification: false,
    email: '',
    phone: '',
    loginType: 1,
  },
})

// 规则效验
const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 30, message: '用户名长度必须在5-20位之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入用密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度必须在6-30位之间', trigger: 'blur' },
  ],
  verification: [
    {
      required: true,
      type: 'boolean',
      message: '请点击登录验证进行验证',
      trigger: 'change',
    },
  ],
} as any

onBeforeMount(() => {
  sessionStorage.clear()
  localStorage.clear()
})

onMounted(() => {
  getAnonymousToke()
})

const startValidation = () => {
  const i = parseInt(Math.random() * 9)
  state.imgSrc = `/static/images/prod/0${i + 1}.png`
  state.formState.verification = false
  state.visible = true
}

const reimg = () => {
  const i = parseInt(Math.random() * 9)
  state.imgSrc = `/static/images/prod/0${i}.png`
  state.formState.verification = false
}

// 验证通过
const verificationPass = (bool: boolean) => {
  if (bool) {
    state.formState.verification = true
  }
  state.visible = false
  state.key += 1
}

/**
 * 用户登录
 */
const adminLogin = async (params: any) => {
  message.loading({ content: '登录中...', key })
  let { data, code, msg }: any = await apis.postJSON(apis.login, {
    data: params,
  })
  if (code === 1) {
    sessionStorage.setItem('menus', JSON.stringify(data.menus))
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('powerSign', data.powerSign)
    sessionStorage.setItem('userName', data.userName)
    message.success({
      content: '登录成功，欢迎使用本系统',
      key,
      duration: 2,
    })
    router.push('/')
    sessionStorage.removeItem('anonymous')
  } else {
    message.destroy()
    message.error(msg)
  }
  return data
}

// 提交表单
const onSubmit = () => {
  formRef.value.validate().then(() => {
    if (!state.formState.verification) {
      message.error('请点击登录验证进行验证！')
      return
    }
    adminLogin(toRaw(state.formState))
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}

// 获取匿名token
const getAnonymousToke = async () => {
  let { data, code, msg } = await apis.getJSON(apis.createAnonymityToken)
  if (code === 1) {
    sessionStorage.setItem('anonymous', data)
  } else {
    message.error(msg)
  }
}
</script>
<style lang="scss">
.frame-page-login {
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  min-height: 400px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  .confirm {
    width: 100px;
    margin-left: 20px;
  }

  .form-container {
    width: 100vw;
    min-width: 560px;
    height: 100vh;
    min-height: 400px;
    box-sizing: border-box;
    display: flex;
    position: absolute;
    z-index: 2;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .form-box {
    width: 560px;
    padding: 60px 0;
    border-radius: 20px;
    background: #fff;
    overflow: hidden;
  }

  .copyright {
    text-align: center;
    margin-top: 40px;
  }

  .login-bg {
    width: 100vw;
    height: 100vh;
    display: inline-block;
    position: absolute;
    z-index: 1;
  }

  .v-btn {
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 5px;
    position: relative;

    &-start {
      color: rgb(0, 183, 255);
      border: 1px solid rgb(0, 183, 255);
    }

    &-end {
      color: rgb(12, 172, 84);
      border: 1px solid rgb(12, 172, 84);
    }
  }
}
</style>
