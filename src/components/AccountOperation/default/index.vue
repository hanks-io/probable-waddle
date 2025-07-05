<!-- 账号操作弹窗内容 -->
<template>
  <div id="login-modal" @click="closeModal">
    <div class="content" @click.stop>
      <!-- 注册 -->
      <register :tenants="tenants" @toggle="toggleHandle" v-if="operation == 'register'"/>
      <!-- 登陆 -->
      <Login :tenants="tenants" @toggle="toggleHandle" v-if="operation == 'login'"/>
      <!-- 忘记密码 -->
      <Forget v-if="operation == 'forget'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Forget from './components/Forget/index.vue';
import Login from './components/Login/index.vue';
import Register from './components/Register/index.vue';
import useLogic from '../logic';
const { closeModal, toggleHandle, tenants, operation } = useLogic();

</script>

<style scoped lang="less">
#login-modal {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .content{
    width: 20rem;
    max-height: 100%;
    padding: .625rem 1.5625rem;
    overflow-y: auto;
    border-radius: 1rem;
  }
}

.amber-purple {
  #login-modal .content{
    background: #262346;
  }
}

.green-default {
  #login-modal .content{
    background: linear-gradient(0deg, #213b10 85%, #366718 100%);
  }
}

.blue-default {
  #login-modal .content{
    background: #141b24;
  }
}

:global(ion-modal#login-modal::part(content)) {
  --height: 100%;
  --width: 100%;
}
</style>
