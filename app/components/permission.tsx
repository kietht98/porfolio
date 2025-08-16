const PERMISSION = {
  REQUEST: ["read", "search"],
  ADMIN: ["create", "read", "update", "delete", "search", "import"],
};
const local = localStorage.getItem("$regis");
const role = window.atob(local ?? "");

function checkPermission(fn: (props: any) => any) {
  if (
    local &&
    PERMISSION[role as keyof typeof PERMISSION].findIndex((item) =>
      fn.name.toLocaleLowerCase().includes(item)
    ) > -1
  ) {
    return fn;
  }
  // eslint-disable-next-line react/display-name
  return () => <></>;
}

export { checkPermission };
