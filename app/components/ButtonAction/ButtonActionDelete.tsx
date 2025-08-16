import { Button } from "@radix-ui/themes";
import { memo } from "react";
import { checkPermission } from "../permission";

function ButtonActionDelete(props: any) {
  return <Button>Delete {props.name}</Button>;
}

export default checkPermission(ButtonActionDelete);
