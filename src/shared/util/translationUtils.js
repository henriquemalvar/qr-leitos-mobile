import {
  permissions,
  status,
  statusColor,
  statusIcon,
  translatePermissions as translatePermissionsConst,
  translateStatusConstant,
} from "./constantsUtils";

const translateStatus = (status) => translateStatusConstant[status] || status;

const _getColor = (status) => statusColor[status] || "black";

const _getIcon = (status) => statusIcon[status] || "question";

const translatePermission = (permission) =>
  translatePermissionsConst[permission] || permission;

const _getPermissions = (permission) =>
  permission in permissions ? permissions[permission] : [];

const _getOptions = (permission, currentStatus) => {
  let options = [];
  if (permission === "admin") {
    status.forEach((status) => {
      options.push({ label: translateStatus(status), value: status });
    });
    options = options.filter((option) => option.value !== currentStatus);
    return options;
  }

  options = _getPermissions(permission);
  if (currentStatus) {
    options = options.filter((option) => option.from === currentStatus);
  }

  options = options
    ? options.map((option) => {
        return {
          label: translateStatus(option.to || ""),
          value: option.to || "",
        };
      })
    : [];

  return options;
};

export {
  _getColor,
  _getIcon,
  _getOptions,
  _getPermissions,
  translatePermission,
  translateStatus,
};
