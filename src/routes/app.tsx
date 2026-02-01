import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "~/lib/auth";
import { apiUploadPdf } from "~/lib/api";

export default function AppPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [file, setFile] = createSignal<File | null>(null);
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [message, setMessage] = createSignal<string | null>(null);

  onMount(() => {
    const t = auth.requireAuth("/login");
    if (!t) return;
  });

  async function onUpload(e: Event) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const f = file();
    if (!f) {
      setError("Elegí un PDF.");
      return;
    }
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("No es un PDF el archivo que subiste.");
      return;
    }

    setBusy(true);
    try {
      const result = await apiUploadPdf(f);
      setMessage(`Downloaded: ${result.filename}`);
      setFile(null);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      setError(msg);
      if (msg.includes("401")) navigate("/login", { replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ "max-width": "720px", margin: "40px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", "justify-content": "space-between", "align-items": "center" }}>
        <h1>PDF → Excel</h1>
        <nav style={{ display: "flex", gap: "12px" }}>
          <a href="/logout">Salir de sesión</a>
        </nav>
      </header>

      <form onSubmit={onUpload} style={{ display: "grid", gap: "12px", "margin-top": "20px" }}>
        <div class="file-upload-wrapper">
          <label for="pdf-upload" class="file-upload-trigger">
            {file() ? "Cambiar archivo" : "Seleccionar archivo PDF"}
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf,.pdf"
            class="file-input-hidden"
            onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
          />
          <div class="file-name-display">
            {file() ? file()?.name : "Ningún archivo seleccionado"}
          </div>
        </div>

        <button type="submit" disabled={busy()}>
          {busy() ? "Subiendo & convirtiendo..." : "Subir PDF y descargar Excel"}
        </button>

        {error() && <p style={{ color: "crimson" }}>{error()}</p>}
        {message() && <p style={{ color: "green" }}>{message()}</p>}
      </form>

      <section style={{ "margin-top": "28px", opacity: 0.8 }}>

      </section>
    </main>
  );
}
