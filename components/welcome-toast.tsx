"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Link } from "@/src/i18n/navigation";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("🌟 Welcome to ATP Group Services!", {
        id: "welcome-toast",
        duration: Number.POSITIVE_INFINITY,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            Discover premium wellness products, advanced technology solutions,
            and Transform Plus agricultural formulas.{" "}
            <Link
              href="/atp-membership"
              className="text-atp-gold hover:underline font-semibold"
            >
              Join ATP Membership
            </Link>{" "}
            for exclusive benefits and save up to 15% on all products.
          </>
        ),
        style: {
          background: "white",
          color: "black",
          border: "1px solid #E2E8F0",
        },
      });
    }
  }, []);

  return null;
}
