import { logoutAction } from "@/actions/logout";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
      >
        Log out
      </button>
    </form>
  );
}
