"use client";

import { useEffect } from "react";

interface TabbyPromoProps {
  price: string;
  currencyCode: string;
  locale: "en" | "ar";
  publicKey: string;
  merchantCode: "ksa" | "KW" | "default"; // 'ksa' for SAR, 'KW' for KWD, 'default' for AED
}

declare global {
  interface Window {
    TabbyPromo?: any;
  }
}

export function TabbyPromo({
  price,
  currencyCode,
  locale,
  publicKey,
  merchantCode,
}: TabbyPromoProps) {
  useEffect(() => {
    // Check if Tabby script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://checkout.tabby.ai/tabby-promo.js"]'
    );

    const initTabby = () => {
      const SUPPORTED_CURRENCIES = {
        AED: "AED",
        KWD: "KWD",
        SAR: "SAR",
      };

      // Currency digits count
      const CURRENCY_DIGITS_COUNT = {
        AED: 2,
        SAR: 2,
        KWD: 3,
      };

      const installmentsCount = 4;
      const tabbyElementId = "#TabbyPromo";

      // Normalize currency code
      const currency =
        SUPPORTED_CURRENCIES[currencyCode as keyof typeof SUPPORTED_CURRENCIES];

      if (!currency) {
        console.warn("Tabby: Currency not supported", currencyCode);
        return;
      }

      // Convert price to proper format
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));

      if (!numericPrice || numericPrice <= 0) {
        console.warn("Tabby: Invalid price", price);
        return;
      }

      // Initialize Tabby Promo
      if (window.TabbyPromo) {
        const tabbyElement = document.querySelector(tabbyElementId) as HTMLElement;
        if (tabbyElement) {
          tabbyElement.style.display = "block";
        }

        new window.TabbyPromo({
          selector: tabbyElementId,
          currency,
          price: numericPrice,
          lang: locale === "ar" ? "ar" : "en",
          installmentsCount,
          publicKey: publicKey,
          merchantCode: merchantCode,
        });
      }
    };

    if (existingScript) {
      // Script already exists, just initialize
      initTabby();
      return;
    } else {
      // Load the script
      const script = document.createElement("script");
      script.src = "https://checkout.tabby.ai/tabby-promo.js";
      script.async = true;
      script.onload = initTabby;
      document.body.appendChild(script);

      return () => {
        // Cleanup: remove script on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [price, currencyCode, locale, publicKey, merchantCode]);

  return (
    <>
      <div id="TabbyPromo" style={{ display: "none" }}></div>
      <style jsx>{`
        #TabbyPromo div:empty {
          display: block;
        }
      `}</style>
    </>
  );
}
