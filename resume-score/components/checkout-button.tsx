"use client";

import { useState } from "react";
import { trackClientEvent } from "@/lib/analytics";

type CheckoutResponse = {
  provider?: "paddle";
  environment?: "sandbox" | "production";
  clientToken?: string;
  priceId?: string;
  successUrl?: string;
  customData?: {
    reportId?: string;
  };
  error?: string;
};

type PaddleCheckoutEvent = {
  name?: string;
  data?: {
    id?: string;
    transaction_id?: string;
    transactionId?: string;
    transaction?: {
      id?: string;
    };
  };
};

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set(environment: "sandbox"): void;
      };
      Initialize(options: {
        token: string;
        eventCallback?: (event: PaddleCheckoutEvent) => void;
      }): void;
      Checkout: {
        open(options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, unknown>;
          settings: {
            displayMode: "overlay";
            theme: "light";
            successUrl: string;
          };
        }): void;
      };
    };
  }
}

export function CheckoutButton({ reportId }: { reportId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setIsLoading(true);
    setError("");

    try {
      trackClientEvent({ event: "checkout_clicked", reportId, source: "preview_unlock_button" });
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 25_000);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId }),
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      const data = (await readApiResponse(res)) as CheckoutResponse;
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");
      if (!data.clientToken || !data.priceId || !data.successUrl || !data.environment) {
        throw new Error("Checkout is not available yet. Please contact support if you need help.");
      }

      await loadPaddleScript();
      if (!window.Paddle) throw new Error("Paddle Checkout could not be loaded. Please try again.");

      if (data.environment === "sandbox") {
        window.Paddle.Environment.set("sandbox");
      }
      window.Paddle.Initialize({
        token: data.clientToken,
        eventCallback: (event) => {
          if (event.name === "checkout.completed") {
            const transactionId = getTransactionId(event);
            const separator = data.successUrl?.includes("?") ? "&" : "?";
            window.location.href = transactionId
              ? `${data.successUrl}${separator}transaction_id=${encodeURIComponent(transactionId)}`
              : data.successUrl || `/success?report_id=${reportId}`;
          }
        }
      });
      window.Paddle.Checkout.open({
        items: [{ priceId: data.priceId, quantity: 1 }],
        customData: data.customData,
        settings: {
          displayMode: "overlay",
          theme: "light",
          successUrl: data.successUrl
        }
      });
      setIsLoading(false);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "Payment checkout took too long to open. Please try again."
          : err instanceof Error
            ? err.message
            : "Could not start checkout.";
      setError(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <button
        onClick={startCheckout}
        disabled={isLoading}
        className="nexx-button-primary w-full"
      >
        {isLoading ? "Opening checkout..." : "Unlock My Improvement Plan — $4.99"}
      </button>
      {error ? <p className="nexx-error mt-3">{error}</p> : null}
    </div>
  );
}

function loadPaddleScript() {
  if (window.Paddle) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Paddle Checkout could not be loaded.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paddle Checkout could not be loaded."));
    document.head.appendChild(script);
  });
}

function getTransactionId(event: PaddleCheckoutEvent) {
  return (
    event.data?.transaction_id ||
    event.data?.transactionId ||
    event.data?.transaction?.id ||
    event.data?.id ||
    ""
  );
}

async function readApiResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Checkout returned an unexpected response. Please try again." };
  }
}
