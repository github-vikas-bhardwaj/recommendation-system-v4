import { logoutAction } from "@/actions/logout";

import { LogoutSubmitButton } from "./LogoutSubmitButton";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutSubmitButton />
    </form>
  );
}
