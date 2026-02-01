import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { apiLogin } from "~/lib/api";
import { useAuth } from "~/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const data = await apiLogin({ email: email(), password: password() });
      auth.setToken(data.access_token);
      navigate("/app", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
  <main class="auth-page">
    <h1>Iniciar sesión</h1>

    <form class="auth-form" onSubmit={onSubmit}>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
      />

      <label for="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password()}
        onInput={(e) => setPassword(e.currentTarget.value)}
      />

      <button type="submit" disabled={busy()}>
        {busy() ? "Logging in..." : "Login"}
      </button>

      {error() && <p class="auth-error">{error()}</p>}
    </form>

    <p class="auth-footer">
      ¿No tienes cuenta aún? <a href="/register">Registrate</a>
    </p>
  </main>
);
}
