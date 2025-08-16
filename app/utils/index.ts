const ROLE = "ADMIN";
const PERMISSION = {
  REQUEST: ["read", "search"],
  ADMIN: ["create", "read", "update", "delete", "search", "import"],
};
function checkPermission(fn: (props: any) => any) {
  if (PERMISSION[ROLE].indexOf(fn.name.toLocaleLowerCase())) {
    return fn;
  }
  return undefined;
}

export { checkPermission };
