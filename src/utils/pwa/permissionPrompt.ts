let permissionPrompt: any = null;

export const getPermissionPrompt = () => permissionPrompt;

export const setPermissionPrompt = (e: any) => {
  permissionPrompt = e;
};