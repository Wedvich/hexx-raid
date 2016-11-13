export const AUTH_PERMISSION_RAIDS_VIEW = 'raids.view';
export const AUTH_PERMISSION_RAIDS_SIGNUP = 'raids.signup';
export const AUTH_PERMISSION_RAIDS_MANAGE = 'raids.manage';
export const AUTH_PERMISSION_AUDIT_VIEW = 'audit.view';
export const AUTH_PERMISSION_AUDIT_REFRESH = 'audit.refresh';
export const AUTH_PERMISSION_USERS_VIEW = 'users.view';
export const AUTH_PERMISSION_USERS_MANAGE = 'users.manage';

export function hasPermission(permissions, permission) {
  return (permissions || []).indexOf(permission) !== -1;
}
