import { useEffect } from "react";

const CLIENT_KEY  = import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string | undefined;
const IS_PROD     = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true";
const SNAP_URL    = IS_PROD
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export function useMidtransSnap() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SNAP_URL}"]`)) return;
    const script = document.createElement("script");
    script.src = SNAP_URL;
    if (CLIENT_KEY) script.setAttribute("data-client-key", CLIENT_KEY);
    script.async = true;
    document.head.appendChild(script);
  }, []);
}
