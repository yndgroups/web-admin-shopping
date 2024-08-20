<template>
  <div
    class="ez-upload"
    :style="{ '--width': ezWidth }"
  >
    <a-upload
      :action="state.uploadUrl"
      list-type="picture-card"
      v-model:file-list="fileList"
      :headers="state.headers"
      @change="handleChange"
      @preview="handlePreview"
      v-bind="$attrs"
      @remove="handleRemove"
      :before-upload="beforeUpload"
      ref="upload"
    >
      <div v-if="fileList.length < maxCount">
        <PlusOutlined />
        <!-- <div class="ant-upload-text">{{title}}</div> -->
      </div>
    </a-upload>
    <div class="title">{{ title }}</div>
  </div>
  <a-modal
    v-model:open="state.previewVisible"
    :footer="null"
    @cancel="state.previewVisible = false"
  >
    <img
      alt="图片预览"
      style="width: 100%"
      :src="showImag(state.previewImage)"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { showImag } from '@/utils'
import apis from '@/apis'
import { message } from 'ant-design-vue'
import { compressionFile } from '@/utils/compressedImage'
import { HttpMethod } from '@/config/axios'
const upload = ref()
let props = defineProps({
  value: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '文件上传',
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  ezWidth: {
    type: String,
    default: '100px',
  },
})
const emit = defineEmits(['update:modelValue', 'update:value'])
let state = reactive({
  headers: {},
  previewImage: '',
  previewVisible: false,
  uploadUrl: `${apis.fileUpload}1`,
  fileList: new Array<any>(),
})
let { fileList } = toRefs(state)
function handlePreview(value: any) {
  state.previewImage = value.url
  state.previewVisible = true
}

watch(
  () => props.value,
  (nv: any) => {
    if (nv != '') {
      state.fileList = nv.split(',').map((item: any) => {
        return { url: showImag(item) }
      })
    }
  },
)

onMounted(() => {
  if (props.modelValue) {
    state.fileList = props.modelValue
      .split(',')
      .map((item: any) => {
        return { url: showImag(item) }
      })
      .filter(item => item.url)
  }
  let token = sessionStorage.getItem('token')
  if (token) {
    state.headers = {
      accessToken: 'Bearer ' + token,
      appId: apis.appId,
    }
  }
})

const loading = ref<boolean>(false)

function beforeUpload(file: File): any {
  return new Promise(function (resolve, reject) {
    if (file.size > 2097152) {
      compressionFile(file).then(res => {
        resolve(res)
      })
    } else {
      resolve(file)
    }
  })
}

const handleChange = (info: any) => {
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done') {
    if (info.file.response.code === 1) {
      info.fileList[info.fileList.length - 1] = {
        url: apis.imageViewHost + info.file.response.data,
      }
      let reg = new RegExp(apis.imageViewHost)
      state.fileList.map((item: any) => {
        return item.url.replace(reg, '')
      })
      emit(
        'update:value',
        state.fileList
          .map(item => item.url)
          .filter((url: any) => url != '')
          .join(','),
      )
      emit(
        'update:modelValue',
        state.fileList
          .map(item => item.url)
          .filter((url: any) => url != '')
          .join(','),
      )
      message.success(info.file.response.msg || '上传成功')
      loading.value = false
    } else {
      state.fileList = []
      // if (state.fileList.length > 0) {
      //   if (upload.value) {
      //     upload.value?.remove()
      //   }
      // }
      message.error(info.file.response.msg || '上传失败')
    }
  }
  if (info.file.status === 'error') {
    loading.value = false
    message.error('上传失败')
  }
}
const handleRemove = (val: any) => {
  apis
    .request({
      url: apis.removeFile,
      method: HttpMethod.POST,
      data: {
        filePath: val.url.replace(apis.imageViewHost, '') || '',
        sizeType: 1,
      },
    })
    .then(({ code, msg }) => {
      if (code === 1) {
        fileList.value = fileList.value.filter((item: any) => {
          return item.uid !== val.uid
        })
        let reg = new RegExp(apis.imageViewHost)
        let list = fileList.value.map((item: any) => {
          return item.url.replace(reg, '')
        })
        emit('update:value', list.join(','))
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    })
}
</script>
<style lang="scss" scoped>
.ez-upload {
  width: var(--width);

  .title {
    width: 100px;
    text-align: center;
  }
}
</style>
