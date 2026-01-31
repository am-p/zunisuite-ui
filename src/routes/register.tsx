import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { apiRegister } from "~/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await apiRegister({ name: name(), email: email(), password: password() });
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ "max-width": "480px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Register</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "12px" }}>
        <label>
          Name
          <input value={name()} onInput={(e) => setName(e.currentTarget.value)} />
        </label>

        <label>
          Email
          <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
        </label>

        <label>
          Password
          <input type="password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)} />
        </label>

        <button type="submit" disabled={busy()}>
          {busy() ? "Creating..." : "Create account"}
        </button>

        {error() && <p style={{ color: "crimson" }}>{error()}</p>}
      </form>

      <p style={{ "margin-top": "16px" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </main>
  );
}
