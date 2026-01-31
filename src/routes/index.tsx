import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
      <a href="/app">App</a>
    </main>
  );
}
