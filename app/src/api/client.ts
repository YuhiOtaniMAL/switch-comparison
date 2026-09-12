import type { User } from "../types";

export class NetworkError extends Error {}
export class NotFoundError extends Error {}

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function getUserByLogin(login: string): Promise<User> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  let response: Response;
  try {
    response = await fetch(
      `${BASE_URL}/api/users/${encodeURIComponent(login)}`,
      { signal: controller.signal }
    );
  } catch {
    throw new NetworkError("Could not reach the server.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 404) {
    throw new NotFoundError("Not found");
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  try {
    return (await response.json()) as User;
  } catch {
    throw new Error("Received an invalid response from the server.");
  }
}
