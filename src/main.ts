import { createApp } from 'vue'
import App from './App.vue'
import './logger'
import router from './router'
import icon from './config/icon'
import { directive } from '@/directive/index'

import './assets/style/index.scss'

import './bridge'

// 注册sng
import 'virtual:svg-icons-register'
const app = createApp(App)

icon(app)

// 自定义指令
directive(app)

// 创建路由
router(app)
