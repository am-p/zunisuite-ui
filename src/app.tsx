import { MetaProvider, Title } from "@solidjs/meta";
import { Router, A } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>ZuniSuite</Title>
	    <header class="app-header">
              <A href="/" class="app-logo">ZuniSuite</A>
            </header>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
