
export default (path: string) => {
    const tenantStore = useTenantStore();
    const skin = import.meta.env.VITE_SKIN || tenantStore.tenantInfo?.skin;
    return  new URL(`../assets/${skin}/${path}`, import.meta.url).href
}



