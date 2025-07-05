import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'

export default () => {
  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()
  
  // 事件处理函数
  const loginEvent = () => showLogin()
  const registerEvent = () => showLogin('register')
  const navigateToTopUp =  async() => {
    const bool = await useHandleRecharge()
    if (!bool) router.push('/main/entrar')
  }
  const navigateToWithdraw = async() => {
    const bool = await useHandleWithdraw()
    if (!bool) router.push('/main/withdraw')
  } 

  // 使用 computed 计算按钮文本
  const btnText1 = computed(() => 
    userStore.user?.userId ? t("main.entrar") : t("main.login")
  )
  
  const btnText2 = computed(() => 
    userStore.user?.userId ? t("main.withdraw") : t("main.signUp")
  )




  // 使用 computed 计算按钮事件
  const btnClick1 = computed(() => 
    userStore.user?.userId ? navigateToTopUp : loginEvent
  )
  
  const btnClick2 = computed(  () => 
    userStore.user?.userId ?  navigateToWithdraw : registerEvent
  )

  return {
    btnText1,
    btnText2,
    btnClick1,
    btnClick2
  }
}
