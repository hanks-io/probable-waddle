<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl'
import { showToast } from '@/utils/toast';
import { getImageUrl } from '@/utils/url'
import { IonIcon, IonSpinner } from '@ionic/vue'
import PreviewModal from '@/components/previewModal/index.vue'
const { t } = useI18n();
const props = withDefaults(defineProps<{
  accept?: string,
  multiple?: boolean,
  maxCount?: number,
  maxSize?: number,
  action?: string,
  extraData?: Record<string, any>,
  autoUpload?: boolean,

}>(), {
  multiple: false,
  accept: 'image/*',
  maxCount: 1,
  maxSize: 5,
  action: `${getApiUrl()}/api/public/upload?platform=aliyun`,
  autoUpload: true,
});



const emit = defineEmits(['success', 'error', 'change', 'exceed']);

const fileInput = ref(null);
const fileList = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const isTouching = ref(false);
const previewImage = ref(null);

// 计算属性
const canUpload = computed(() => {
  return fileList.value.length > 0 && !uploading.value;
});

// 触发文件选择
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理触摸开始
const startTouch = () => {
  isTouching.value = true;
};

// 处理触摸结束
const endTouch = () => {
  isTouching.value = false;
};

interface FileItem {
  uid: string;
  name: string;
  size: number;
  type: string;
  file: File;
  status: 'ready' | 'uploading' | 'done' | 'error';
  response?: any;
  thumbnail?: string;
}

// 处理文件选择
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target || !target.files) return;

  const files = Array.from(target.files);

  // 验证数量
  if (fileList.value.length + files.length > props.maxCount) {
    emit('exceed', files);
    showToast(`最多只能上传${props.maxCount}个文件`);
    return;
  }

  // 验证大小
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  const oversizedFiles = files.filter(file => file.size > maxSizeBytes);
  if (oversizedFiles.length > 0) {
    emit('exceed', oversizedFiles);
    showToast(`${t(`depositWithdrawal.000023`, { size: props.maxSize })}`);
    return;
  }

  // 添加到列表
  files.forEach(file => {
    fileList.value.push({
      uid: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: 'ready',
    });
  });

  emit('change', fileList.value);

  // 自动上传
  if ('autoUpload' in props && props.autoUpload) {
    startUpload();
  }

  target.value = '';
};

// 删除文件
const removeFile = (index: number) => {
  fileList.value.splice(index, 1);
  emit('change', fileList.value);
};

// 重试上传
const retryUpload = (index: number) => {
  const file = fileList.value[index] as FileItem;
  file.status = 'ready';
  startUpload();
};

// 开始上传
const startUpload = async () => {
  if (fileList.value.length === 0 || uploading.value) return;

  uploading.value = true;
  uploadProgress.value = 0;


  try {
    for (const file of fileList.value as FileItem[]) {
      if (file.status === 'done') continue;

      file.status = 'uploading';
      await uploadFile(file);
    }

    showToast(`${t("depositWithdrawal.000026")}`);
    emit('success', fileList.value);
  } catch (error) {
    showToast(`${t("depositWithdrawal.000027")}`);
    emit('error', error);
  } finally {
    uploading.value = false;

  }
};

// 上传单个文件
const uploadFile = async (fileItem: FileItem) => {
  const formData = new FormData();
  formData.append('file', fileItem.file);

  // 添加额外参数
  if (props.extraData) {
    Object.keys(props.extraData).forEach(key => {
      formData.append(key, props.extraData[key]);
    });
  }

  try {
    fileItem.status = 'uploading';

    const response = await fetch(props.action, {
      method: 'PUT', // 保持PUT方法
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`上传失败: ${response.statusText}`);
    }

    fileItem.status = 'done';
    fileItem.response = await response.json();
    return fileItem;

  } catch (error) {
    fileItem.status = 'error';
    throw error; // 可以在这里添加更详细的错误处理
  }
};


// 获取缩略图
const getThumbnail = (file: FileItem) => {
  if (file.thumbnail) return file.thumbnail;

  if (isImage(file)) {
    return URL.createObjectURL(file.file);
  }

  return '';
};

// 预览图片
const handlePreviewImage = (file: FileItem) => {
  if (isImage(file)) {
    previewImage.value = URL.createObjectURL(file.file);
  }
};

// 判断是否是图片
const isImage = (file: FileItem) => {
  return file.type.startsWith('image/');
};

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / (k ** i)).toFixed(1)) + ' ' + sizes[i];
};

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'ready': '等待上传',
    'uploading': `${t("depositWithdrawal.000025")}`,
    'done': `${t("depositWithdrawal.000026")}`,
    'error': `${t("depositWithdrawal.000027")}`
  };
  return texts[status] || status;
};

</script>



<template>
  <div class="mobile-uploader">

    <!-- 文件列表 -->
    <div class="file-list" v-if="fileList.length > 0">



      <div v-for="(file, index) in fileList" :key="file.uid" class="file-item item" :class="file.status">
        <div v-if="file.status === 'uploading'" class="spinner-warp item">
          <ion-spinner class="spinner" name="bubbles" />
          <span class="text">{{ $t("depositWithdrawal.000025") }}</span>
        </div>
        <div class="file-info" v-else>
          <div class="file-thumbnail" v-if="isImage(file)" @click="handlePreviewImage(file)">
            <img :src="getThumbnail(file)" alt="预览" />
          </div>
          <div v-if="file.status !== 'uploading'" class="remove-area">
            <ion-icon slot="icon-only" class="close" src="/first/svg/login/close.svg" @click.stop="removeFile(index)" />
          </div>
          <!-- <div class="file-details">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-meta">
              <span class="file-size">{{ formatSize(file.size) }}</span>
              <span class="file-status">{{ getStatusText(file.status) }}</span>
            </div>
            <div class="upload-progress" v-if="file.status === 'uploading'">
              <div class="progress-bar" :style="{ width: file.progress + '%' }"></div>
            </div>
          </div> -->
        </div>

      </div>
    </div>

    <!-- 上传区域 -->
    <div class="uploader-area" @click="triggerUpload" @touchstart="startTouch" @touchend="endTouch"
      v-if="maxCount !== fileList.length">
      <slot name="upload-area">
        <div class="uploader-wrap item">
          <ion-icon class="upload-icon" :src="getImageUrl('svg/upload.svg')" />
        </div>
      </slot>
      <input type="file" ref="fileInput" class="file-input" :multiple="multiple" :accept="accept"
        @change="handleFileChange" />
    </div>




    <!-- 上传按钮 -->
    <button class="upload-button" @click="startUpload" :disabled="uploading || fileList.length === 0"
      v-if="!autoUpload">
      {{ uploading ? `上传中 (${uploadProgress}%)` : '开始上传' }}
    </button>

    <!-- 图片预览模态框 -->

    <PreviewModal :previewImage="previewImage" @closePreviewModal="previewImage = null" />
  </div>
</template>

<style scoped lang="less">
#uploader-component-index {

  .style(@uploadBgColor: --ep-color-background-fill-surface-raised-L2,
    @lineColor: --ep-color-border-default,
    @textColor: --ep-color-text-default,
    @uploadIconColor: --ep-color-icon-default,
  ) {
    .mobile-uploader {
      display: flex;
      justify-content: start;
      align-items: center;
      touch-action: manipulation;
    }

    .item {
      width: 4.5rem;
      height: 4.5rem;
      background: var(@uploadBgColor);
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(@lineColor);
      border-radius: var(--ep-border-radius-m, .375rem);

    }

    .file-list {
      display: flex;
      align-items: center;
      justify-content: start;
      position: relative;

      .spinner-warp {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .text {
          font-size: var(--ep-font-size-xs, .625rem);
          color: var(@textColor);
        }

      }

      .file-item {
        .file-thumbnail {
          width: 4.5rem;
          height: 4.5rem;
          border-radius: var(--ep-border-radius-m, .375rem);
          overflow: hidden;


        }


      }

      .file-info {
        position: relative;
        overflow: hidden;

        .remove-area {
          width: 1.875rem;
          height: 1.875rem;
          background: rgba(0, 0, 0, .5);
          position: absolute;
          border-radius: 50%;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
          cursor: pointer;

          .close {
            position: absolute;
            bottom: 0;
            left: 0;
            transform: translate(50%, -50%);
            font-size: var(--ep-font-size-xs, 10px);
            color: var(--ep-color-text-default, #fff);
          }

        }



      }
    }

    .uploader-wrap {


      .upload-icon {
        font-size: 2.25rem;
        cursor: pointer;
        color: var(@uploadIconColor);

      }



    }

  }
}

.green-dark,
.yellow-dark,
.purple-light,
.amber-purple,
.green-default,
.blue-default,
.forest-green,
.auroral-yellow {
  #uploader-component-index .style(@lineColor: --color-line,
    @uploadBgColor: --color-bg-200,
    @textColor: --color-text-100,
    @uploadIconColor: --color-text-100,
  )
}

.purple-light {
  #uploader-component-index .style(@lineColor: --color-line,
    @uploadBgColor: --color-bg-400,
    @textColor: --color-text-100,
    @uploadIconColor: --color-text-100,
  )
}

.new-skin-symbol {
  #uploader-component-index.style()
}



.upload-text {
  font-size: 16px;
  color: #1890ff;
}

.file-input {
  display: none;
}



</style>
