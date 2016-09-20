export const AUTH_PERMISSION_AUDIT_VIEW = 'audit.view';
export const AUTH_PERMISSION_AUDIT_REFRESH = 'audit.refresh';

export function hasPermission(permissions, permission) {
  return (permissions || []).indexOf(permission) !== -1;
}
