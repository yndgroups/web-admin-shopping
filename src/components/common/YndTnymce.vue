<template>
  <Editor
    api-key="m6o6ytlqxqgc43ykrpe5ukz71joycrzvwfd02ptmzg4o4u9x"
    :init="state.init"
    initial-value="请输入内容"
    v-model="state.richTextValue"
  />
</template>
<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'
import { Modal } from 'ant-design-vue'
import apis from '@/apis'
let uploadUrl = `${apis.fileUpload}${apis.appId}`
let timeId: NodeJS.Timeout
let props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: 'tinymce',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: [String, Array],
    default: 'link lists image code table wordcount',
  },
  toolbar: {
    type: [String, Array],
    default: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
  },
  height: {
    type: [String, Number],
    default: '500px',
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
})

// 文件上传方法
const uploadHandle = (filetype: string, callback: Function) => {
  let input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', filetype)
  input.click()
  input.onchange = function () {
    let file = input.files && (input.files[0] as any)
    let xhr: any, formData
    xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    xhr.open('POST', uploadUrl)
    // token
    let token = sessionStorage.getItem('token')
    if (token) {
      xhr.setRequestHeader('accessToken', 'Bearer ' + token)
    }
    xhr.onload = function () {
      let json
      if (xhr.status != 200) {
        console.log('文件上传失败: ' + xhr)
        Modal.error({
          title: '文件上传失败: ' + xhr.status,
          zIndex: 9999,
        })
        return
      } else {
        Modal.success({
          title: '文件上传成功',
          zIndex: 9999,
        })
      }
      json = JSON.parse(xhr.responseText)
      if (json.code === 1) {
        callback(apis.imageViewHost + json.data, { text: file.name })
      } else {
        console.log('文件上传失败: ' + json.message)
        Modal.error({
          title: '文件上传失败: ' + json.message,
          zIndex: 9999,
        })
      }
      // json = JSON.parse(xhr.responseText);
      // if (!json.success) {
      //     console.log('Invalid JSON: ' + json.msg);
      //     return;
      // }
      // callback(json.data, { text: file.name });
    }
    formData = new FormData()
    formData.append('file', file)
    formData.append('appId', apis.appId)
    xhr.send(formData)
  }
}

let emit = defineEmits(['update:value'])
let state = reactive({
  richTextValue: props.value,
  // editor 配置项
  init: {
    height: props.height,
    width: props.width,
    min_height: '300px',
    // language_url: "http://www.npwl.shop/resources/tinymce/langs/zh_CN.js",
    language: 'zh_CN',
    // skin_url: "http://www.npwl.shop/resources/tinymce/skins/ui/oxide",
    toolbar: 'image',
    // content_css: "http://www.npwl.shop/resources/tinymce/skins/content/document/content.css",
    plugins: ['autolink', 'lists', 'advlist', 'link', 'image', 'charmap', 'print', 'preview', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'image', 'paste ', 'emoticons', 'codesample', 'hr', 'textpattern', 'pagebreak'],
    toolbar1: `undo redo | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify  outdent indent | table bullist numlist blockquote`,
    toolbar2: `link unlink image media code codesample pagebreak | removeformat subscript superscript hr charmap emoticons insertdatetime |
     print preview restoredraft cut copy paste pastetext | fullscreen anchor styleselect formatselect fontselect fontsizeselect | bdmap indent2em lineheight formatpainter axupimgs myUpload uploadimage
     `,
    branding: false,
    paste_data_images: true, // 设置为“true”将允许粘贴图像，而将其设置为“false”将不允许粘贴图
    // plugin_preview_width: 375, // 预览宽度 plugin_preview_height: 668,
    content_style: `img {max-width:100%;height:auto}`,
    mobile: {
      // 当tinymce检测到当前环境为移动设备时，该参数允许你配置在移动设备生效配置参数。
      plugins: ['autosave', 'lists', 'autolink'],
      toolbar: ['undo', 'bold', 'italic', 'styleselect'],
      images_upload_handler: (blobInfo: any, success: any, failure: any) => {
        const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        if (blobInfo.blob().size > 1000000) {
          failure('单张图片大小不能超过1000k')
          return
        } else {
          success(img)
        }
      },
      file_picker_callback: function (callback: any, value: any, meta: any) {
        let _this = this
        let filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4'
        //后端接收上传文件的地址
        //为不同插件指定文件类型及后端地址
        switch (meta.filetype) {
          case 'image':
            filetype = '.jpg, .jpeg, .png, .gif'
            break
          case 'media':
            filetype = '.mp3, .mp4'
            break
          case 'file':
          default:
        }
        //模拟出一个input用于添加本地文件
        uploadHandle(filetype, callback)
      },
      init_instance_callback: function (editor: any) {
        // tinymce.editors['mytextarea']
        // editor.ui.disable();
        // mceInsertContent
        editor.on('ExecCommand', function (e: any) {
          let length = editor.getContent({ format: 'text' }).length
          if (length > 4000) {
            console.log('ExecCommand 长度 > 4000 ：' + length)
            // $('.wordnum').html(`<span style='font-weight: bold;color: #ff0007'>${length}</span>`);
            // document.querySelector('.wordnum').innerHTML(`<span style='font-weight: bold;color: #ff0007'>${length}</span>`)
          } else {
            // document.querySelector('.wordnum').innerHTML(length)
            // $('.wordnum').text(length);
            console.log('ExecCommand 长度 < 4000：' + length)
          }
        })
      },
      setup: function (editor: any) {
        editor.ui.registry.addButton('myCustomToolbarButton', {
          text: '保存文章',
          onAction: function () {
            alert('敬请期待!')
          },
        })
        // editor.on('paste', function (e) {
        //     let pastedData = e.clipboardData.getData('text/plain');
        //     let content = editor.getContent({'format': 'text'});
        //     let contentLength = content.length;
        //     if (contentLength > 0) {
        //         contentLength = contentLength - 15
        //     }
        //     if (contentLength + pastedData.length > 4000) {
        //         e.preventDefault();
        //         e.stopPropagation();
        //         Toast.fire({
        //             icon: 'error',
        //             title: "内容长度超出篇幅限制,或复制内容过多"
        //         })
        //     }
        // });
        editor.on('keyup', function (e: any) {
          // let length = editor.getContent({ 'format': 'text' }).length;
          // if (length > 4000) {
          //   console.log('keyup 长度：' + length)
          //   // $('.wordnum').html(`<span style='font-weight: bold;color: #ff0007'>${length}</span>`);
          // } else {
          //   console.log('keyup 长度：' + length)
          //   // $('.wordnum').text(length);
          // };
          // let content = tinymce.activeEditor.getContent()
          // console.log( content, 'content')
          // emit('update:modelValue', formatRichText(content))
          // emit('update:modelValue', content)
        })
        editor.on('keydown', function (e: any) {
          // let length = editor.getContent().length;
          // if (length > 10) {
          //     e.preventDefault();
          //     e.stopPropagation();
          // }
          if (e.keyCode == 9) {
            e.preventDefault()
            e.stopPropagation()
            if (e.shiftKey) {
              //editor.execCommand('Outdent');
            } else {
              //editor.execCommand('Indent');
            }
          }
          if (e.which === 27) {
            editor.execCommand('removeformat')
          }
          if (e.ctrlKey == true && e.keyCode == 83) {
            e.preventDefault()
            e.stopPropagation()
            //发送ajax 保存数据
            //获取标题
            // let title = $.trim($('.title').val());
            //获取内容
            let content = editor.getContent()
            /*$.ajax({
                url: "/article",
                type: 'POST',
                data: {
                  aid,
                  title,
                  content,

                },
                dataType: 'json',
                success: ({ msg, data, code }) => {
                  if (code === 200) {
                    //清除掉编辑器的内容


                  } else {

                  }
                }
              })*/
          }
        })
      },
    },
    file_picker_callback: function (callback: any, value: any, meta: any) {
      let _this = this
      let filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4'
      //后端接收上传文件的地址
      //为不同插件指定文件类型及后端地址
      switch (meta.filetype) {
        case 'image':
          filetype = '.jpg, .jpeg, .png, .gif'
          break
        case 'media':
          filetype = '.mp3, .mp4'
          break
        case 'file':
        default:
      }
      //模拟出一个input用于添加本地文件
      uploadHandle(filetype, callback)
    },
    init_instance_callback: function (editor: any) {
      // tinymce.editors['mytextarea']
      // editor.ui.disable();
      // mceInsertContent
      editor.on('ExecCommand', function (e: any) {
        let length = editor.getContent({ format: 'text' }).length
        if (length > 4000) {
          console.log('ExecCommand 长度 > 4000 ：' + length)
          // $('.wordnum').html(`<span style='font-weight: bold;color: #ff0007'>${length}</span>`);
          // document.querySelector('.wordnum').innerHTML(`<span style='font-weight: bold;color: #ff0007'>${length}</span>`)
        } else {
          // document.querySelector('.wordnum').innerHTML(length)
          // $('.wordnum').text(length);
          console.log('ExecCommand 长度 < 4000：' + length)
        }
      })
    },
    setup: function (editor: any) {
      editor.ui.registry.addButton('myCustomToolbarButton', {
        text: '保存文章',
        onAction: function () {
          alert('敬请期待!')
        },
      })
      // editor.on('paste', function (e) {
      //     let pastedData = e.clipboardData.getData('text/plain');
      //     let content = editor.getContent({'format': 'text'});
      //     let contentLength = content.length;
      //     if (contentLength > 0) {
      //         contentLength = contentLength - 15
      //     }
      //     if (contentLength + pastedData.length > 4000) {
      //         e.preventDefault();
      //         e.stopPropagation();
      //         Toast.fire({
      //             icon: 'error',
      //             title: "内容长度超出篇幅限制,或复制内容过多"
      //         })
      //     }
      // });
      editor.on('keyup', function (e: any) {
        // let length = editor.getContent({ 'format': 'text' }).length;
        // if (length > 4000) {
        //   console.log('keyup 长度：' + length)
        //   // $('.wordnum').html(`<span style='font-weight: bold;color: #ff0007'>${length}</span>`);
        // } else {
        //   console.log('keyup 长度：' + length)
        //   // $('.wordnum').text(length);
        // };
        // let content = tinymce.activeEditor.getContent()
        // console.log( content, 'content')
        // emit('update:modelValue', formatRichText(content))
        // emit('update:modelValue', content)
      })
      editor.on('keydown', function (e: any) {
        // let length = editor.getContent().length;
        // if (length > 10) {
        //     e.preventDefault();
        //     e.stopPropagation();
        // }
        if (e.keyCode == 9) {
          e.preventDefault()
          e.stopPropagation()
          if (e.shiftKey) {
            //editor.execCommand('Outdent');
          } else {
            //editor.execCommand('Indent');
          }
        }
        if (e.which === 27) {
          editor.execCommand('removeformat')
        }
        if (e.ctrlKey == true && e.keyCode == 83) {
          e.preventDefault()
          e.stopPropagation()
          let content = editor.getContent()
        }
      })
    },
  },
})

// 监听加防抖
watch(
  () => state.richTextValue,
  (nv, ov) => {
    if (nv !== ov) {
      if (timeId) {
        clearTimeout(timeId)
      }
      timeId = setTimeout(() => {
        emit('update:value', state.richTextValue)
      }, 500)
    }
  },
)
</script>
