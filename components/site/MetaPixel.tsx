"use client";

/* eslint-disable @next/next/no-img-element -- Meta's <noscript> fallback pixel */
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";

// Meta Pixel for the public site (never rendered in /admin).
// - PageView on first load (in the init snippet) and on every client-side
//   route change after that.
// - Contact when a visitor taps a phone or WhatsApp link anywhere.
// - Lead is fired by the enquiry form (components/site/EnquiryForm.tsx).
export default function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    track("PageView");
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) track("Contact", { method: "phone" });
      else if (href.includes("wa.me/")) track("Contact", { method: "whatsapp" });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
