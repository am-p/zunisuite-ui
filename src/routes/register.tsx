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
    <main class="auth-page">
      <h1>Registrarse</h1>

      <form class="auth-form" onSubmit={onSubmit}>
        <label for="name">Nombre</label>
        <input
          id="name"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />

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
          {busy() ? "Creando..." : "Crea una cuenta"}
        </button>

        {error() && <p class="auth-error">{error()}</p>}
      </form>

      <p class="auth-footer">
        ¿Ya tenés una cuenta? <a href="/login">Iniciar sesión</a>
      </p>
    </main>
  );
}
