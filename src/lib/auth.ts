import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

const TOKEN_KEY = "zuni_token";

const [token, setTokenSignal] = createSignal<string | null>(null);

export function useAuth() {
  const navigate = useNavigate();

  onMount(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) setTokenSignal(t);
  });

  function setToken(t: string) {
    localStorage.setItem(TOKEN_KEY, t);
    setTokenSignal(t);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    setTokenSignal(null);
  }

  function requireAuth(redirectTo = "/login") {
    const t = token() ?? localStorage.getItem(TOKEN_KEY);
    if (!t) navigate(redirectTo, { replace: true });
    return t;
  }

  return { token, setToken, clearToken, requireAuth };
}

export function getTokenUnsafe(): string | null {
  return token() ?? (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
}
