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
    <main style={{ "max-width": "480px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Login</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "12px" }}>
        <label>
          Email
          <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
        </label>

        <label>
          Password
          <input type="password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)} />
        </label>

        <button type="submit" disabled={busy()}>
          {busy() ? "Logging in..." : "Login"}
        </button>

        {error() && <p style={{ color: "crimson" }}>{error()}</p>}
      </form>

      <p style={{ "margin-top": "16px" }}>
        No account yet? <a href="/register">Register</a>
      </p>
    </main>
  );
}
