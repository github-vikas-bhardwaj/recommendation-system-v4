export type E2eCredentials = {
  email: string;
  password: string;
};

export function getE2eCredentials(): E2eCredentials | null {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export function hasE2eCredentials(): boolean {
  return getE2eCredentials() != null;
}
