<script setup lang="ts">
import Input from '@/components/first/Input/index.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import { IonPage, IonContent } from '@ionic/vue';
import AssetsFooter from '@/components/first/AssetsFooter.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
import useLogic from "./useLogic";

const {
  params,
  formEl,
  bindCPF,
  btnDisabled,
  inputChange,
  inputInfoList,
} = useLogic();

</script>
<template>
  <IonPage>
    <NavigationBar :title="$t('viewsAssets.bindCPF')" :bgColor="useHeaderBgColor()" />
    <IonContent class="bind-CPF-content">
      <div ref="formEl" class="form-wrap">
        <div v-for="(item, i) in inputInfoList" :class="{ item: i !== 0 }">
          <p class="label">{{ item.label }}</p>
          <div class="input-area">
            <Input :type="item.type" :placeholder="item.placeholder" :error-text="item.errorText"
              v-model="params[item.name]" @update:modelValue="inputChange" v-bind="item.rule" :clear="true"
            />
          </div>
        </div>
      </div>
      <AssetsFooter :disabled="!btnDisabled" ref="footEl" :isHasBottomTab="false" :btnText="$t('main.submit')"
        @submitForm="bindCPF" :isFixedBottom="false" />
    </IonContent>
  </IonPage>
</template>

<style scoped lang="less">
@import "../style/index.less";
</style>
