<template>
  <div class="content h-full text-center bg-restricted">
    <div class="flex justify-start items-center mt-12 pt-5">
      <div class="icon-generic"></div>
    </div>
    <p class="text-xl font-black mt-10 text-black text-left">{{ $t('unAvailableDomain.000001') }}</p>
    <p class="text-sm mt-4 text-black text-left">{{ $t('unAvailableDomain.000002', { domain }) }}</p>
    <p class="text-xs mt-4 text-black text-left">DNS_PROBE_FINISHED_NXDOMAIN</p>
    <div class="flex justify-end items-center w-full button-full-container">
      <button class="button-full text-xs" @click="reload">{{ $t('unAvailableDomain.000003') }}</button>
    </div>
  </div>
</template>
<script setup> 
const reload = () => {
  window.location.reload();
};
const domain = location.hostname;
const injectUnupdatekey = () => {
  if (!window.injectUnupdatekeys) {
    window.injectUnupdatekeys = {};
  }
  window.injectUnupdatekeys.unavailable = true;
};

onMounted(() => {
  try {
    injectUnupdatekey();
  } catch (error) {
    console.error('注入 unavailable 标记失败:', error);
  }
});
</script>
<style scoped lang="less">
.content {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.icon-generic {
  content: image-set(url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABIAQMAAABvIyEEAAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAENJREFUeF7tzbEJACEQRNGBLeAasBCza2lLEGx0CxFGG9hBMDDxRy/72O9FMnIFapGylsu1fgoBdkXfUHLrQgdfrlJN1BdYBjQQm3UAAAAASUVORK5CYII=) 1x);
}

.bg-restricted {
  width: 100%;
  background-color: #fff;
  --color-screen-bg: #fff;
  padding: 0 20px;
}

ion-app {
  --color-screen-bg: #fff;
}
@media (max-width: 468px) {
  .button-full-container {
    position: absolute;
    bottom: 22px;
    box-sizing: border-box;
    display: flex;
    left: 0;
    justify-content: center;
  }
  .button-full { 
    margin:20px;
    display: inline-block;
    padding: 16px 12px !important;
    width: calc(100% - 64px);
    font-size: 14px;
  }
}
.button-full {
  background-color: rgb(26, 115, 232);
  color: #fff;
  border: 0;
  border-radius: 20px;
  box-sizing: border-box;
  cursor: pointer;
  float: right;
  margin-top: 50px;
  padding: 8px 16px;
  transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  font-weight: 500;
}
</style>
