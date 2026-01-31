import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "~/lib/auth";

export default function Logout() {
  const navigate = useNavigate();
  const auth = useAuth();

  onMount(() => {
    auth.clearToken();
    navigate("/login", { replace: true });
  });

  return null;
}
