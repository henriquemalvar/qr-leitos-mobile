import {
  permissions,
  translatePermissions,
  statusColor,
  statusIcon,
  translateStatusConstant,
} from "./constantsUtils";

const translateStatus = (status) => translateStatusConstant[status] || status;

const _getColor = (status) => statusColor[status] || "black";

const _getIcon = (status) => statusIcon[status] || "question";

const _getOptions = (permission, currentStatus) => {
  const options = permissions[permission] || [];

  if (permission !== 'admin' && currentStatus) {
    return options.filter((option) => option.from === currentStatus);
  }

  return options;
};

const translatePermission = (permission) => translatePermissions[permission] || permission;

export {
  translateStatus,
  _getColor,
  _getIcon,
  _getOptions,
  translatePermission,
};
