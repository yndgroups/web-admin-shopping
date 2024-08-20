# PC端WEB集成框架

## Nodejs 环境版本
- node 16版本及以上[下载地址](https://nodejs.org/en)
- 推荐使用pnpm包管理[docs](https://pnpm.io/)

## 开发环境建议使用vscode并安装以下扩展，若使用其他工具请自行搜索进行配置
```
Vue.volar
Vue.vscode-typescript-vue-plugin
esbenp.prettier-vscode
EditorConfig.EditorConfig
dbaeumer.vscode-eslint
usernamehw.errorlens
```

## 项目开发相关命令
```
# 安装依赖
pnpm i

# 添加依赖
pnpm add [jslib]

# 项目运行
pnpm dev

# vite dug
pnpm dev:debug

# 测试环境构建
pnpm build:test

# 开发环境构建
pnpm build:prod

# 项目本地预览
pnpm preview

# 代码格式化
pnpm lint:fix

# 代码eslint检查
pnpm lint

# 代码规范检查
pnpm type-check
```

## 技术栈
- [Vite](https://vitejs.dev/config/)
- [Vue3](https://cn.vuejs.org/)
- [Vue-Router](https://router.vuejs.org/zh/)
- [Pinia](https://pinia.vuejs.org/zh)
- [ESLint](https://eslint.org/)
- [适配方案postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md)
- [Vant4](https://vant-contrib.gitee.io/vant/#/zh-CN)
- [Vite3中文](https://cn.vitejs.dev/ https://vitejs.cn/vite3-cn/)
- [Vue-Router](https://router.vuejs.org/zh/)


## 配置 git cz 
```
"config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "config/.cz-config.ts"
    }
  },
```

## prettier命令格式化时使用该配置 .prettierrc.json
```
{
  bracketSpacing: true, // 是否在对象属性添加空格，这里选择是 { foo: bar }
  printWidth: 520, // 指定代码换行的行长度。单行代码宽度超过指定的最大宽度，将会换行，如果都不想换，可以添加 'proseWrap': 'never'
  semi: false, // 是否在语句末尾打印分号，这里选择不加 字符串是否使用单引号，默认为false，使用双引号
  singleQuote: true, // 是否使用单引号，这里选择使用
  tabWidth: 2, // 缩进4个字符
  trailingComma: 'all', //是否使用尾逗号，有三个可选值'<none|es5|all>'
  arrowParens: 'avoid', // x => x  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  jsxBracketSameLine: true,
  requirePragma: false, //顶部注释
  htmlWhitespaceSensitivity: 'ignore',
}
```

## git hooks 代码提交
```
pnpm add husky -D
pnpm husky install
pnpm husky add .husky/pre-commit "npm run git-cz" 
pnpm husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

## 跳过hooks
···
git commit -m  'fix' --no-verify
···