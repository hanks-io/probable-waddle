import { showLogin } from '@/hooks/ShowLogin';
import { showLoading } from '@/utils/loading';
import { showToast, debounce } from '@/utils'


export default debounce(async () => {
    const appStore = useAppStore();
    const tenantStore = useTenantStore();
    if (!appStore.token) {
        showLogin();
        return true
    }
    showLoading();
    const res = await tenantStore.setPayList();

    if (res.tenantPayTypeList.length) {
        return false;
    }
    if (res.limitType.length) {
        showToast('toast.accountError');
    } else {
        showToast('toast.rechargemaintenance');
    }
    return true
}, 1000, { leading: true, trailing: false });



