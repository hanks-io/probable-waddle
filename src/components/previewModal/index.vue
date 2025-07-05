<script setup lang="ts">
defineProps<{
  previewImage: string | null

}
>()
const emit = defineEmits<{
  (e: 'closePreviewModal',): void

}>()
const closePreviewModal = () => {
  emit('closePreviewModal')
}
</script>


<template>
  <!-- 图片预览模态框 -->
  <div class="preview-modal" v-if="previewImage" @click="closePreviewModal">
    <div class="modal-content">
      <img :src="previewImage" alt="preview" />
    </div>
  </div>


</template>

<style scoped lang="less">
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-content {
    max-width: 90%;
    max-height: 90%;
  }

  .modal-content img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
