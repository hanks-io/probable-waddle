<!-- 登录&注册 弹窗-->
<template>
  <div class="warpper">
    <div class="header">
      <div class="header-content">
        <ion-img class="logo" :src="logoUrl" alt="logo"></ion-img>
        <span class="btn-close" @click="closeModal">
          <ion-icon src="/first/svg/login/close.svg"></ion-icon>
        </span>
      </div>
    </div>
    <div class="content">
      <!-- 登陆 -->
      <Login @toggle="toggleHandle" v-if="operation === 'login'" />
      <!-- 注册 -->
      <Register @toggle="toggleHandle" v-else-if="operation === 'register'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue';
import Login from './components/login/index.vue';
import Register from './components/register/index.vue';
import useLogic from './logic';

const {
  operation,
  logoUrl,
  closeModal,
  toggleHandle,
} = useLogic();

</script>

<style scoped lang="less">
@import "@/components/loginModal/styles/index-base.less";
@import "@/components/loginModal/styles/theme-style.less";

.yellow-dark {
  #components-loginModal-index.style();
}

.green-dark {
  #components-loginModal-index.style(rgba(3, 177, 58, 0.44);
  );
}

.purple-light {
  #components-loginModal-index.style(rgba(67, 3, 177, 0.44);
    rgba(255, 255, 255, 0.2);
    var(--text-color-white-100);
  );
}

.green-default,
.green-v01,
.green-v02,
.forest-green {
  #components-loginModal-index.style(rgba(3, 177, 58, 0.44);
    rgba(255, 255, 255, 0.2);
    var(--color-text-white-100);
  );
}

.blue-default {
  #components-loginModal-index.style(rgba(3, 177, 58, 0.44);
    rgba(255, 255, 255, 0.2);
    var(--color-text-white-100);
  );
}

.auroral-yellow {
  #components-loginModal-index.style(rgba(219, 247, 79, 0.44);
    rgba(255, 255, 255, 0.2);
    var(--color-text-white-100);
  );
}

.amber-purple {
  #components-loginModal-index.style(rgba(163, 79, 247, 0.44);
    rgba(255, 255, 255, 0.2);
    var(--text-color-white-100);
  );
}

// new skin defult
#components-loginModal-index.style(
  @--content-filter-color: var(--ep-color-background-fill-glow-primary-opacity-40);
  @--content-box-shadow-color:var(--ep-color-background-fill-glow-primary-opacity-100);
  @--btn-close-text-color:var(--ep-color-icon-default);
  @--content-bg-color:var(--ep-color-background-fill-surface-raised-L1);
  @--btn-close-bg-color: var(--ep-color-text-weakest);
);
</style>
