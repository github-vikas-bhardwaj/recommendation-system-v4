export class RedirectError extends Error {
  readonly url: string;

  constructor(url: string) {
    super(`REDIRECT:${url}`);
    this.name = "RedirectError";
    this.url = url;
  }
}

export function buildLoginFormData(
  values: Record<string, string> = {},
): FormData {
  const formData = new FormData();
  formData.set("email", values.email ?? "you@example.com");
  formData.set("password", values.password ?? "Password1!");
  if (values.next != null) {
    formData.set("next", values.next);
  }
  return formData;
}

export function buildSignupFormData(
  values: Record<string, string> = {},
): FormData {
  const formData = new FormData();
  formData.set("firstName", values.firstName ?? "Alex");
  formData.set("lastName", values.lastName ?? "Rivera");
  formData.set("email", values.email ?? "you@example.com");
  formData.set("password", values.password ?? "Password1!");
  formData.set("confirmPassword", values.confirmPassword ?? "Password1!");
  return formData;
}
