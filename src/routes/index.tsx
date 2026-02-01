import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main class="home">
      <h1>Bienvenido a ZuniSuite</h1>

      <nav class="home-actions">
        <A href="/login">Iniciar sesión</A>
        <A href="/register">Crear cuenta</A>
        <A href="/app">PDF → Excel</A>
      </nav>
    </main>
  );
}

