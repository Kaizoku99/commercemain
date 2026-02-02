"use client";

import React from 'react';

interface PaymentIconProps {
  className?: string;
  width?: number;
  height?: number;
}

// Shopify official payment SVGs with card styling and brand colors
// Based on payment_type_svg_tag output

export function VisaIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-visa" className={className}>
      <title id="pi-visa">Visa</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/>
    </svg>
  );
}

export function MastercardIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-mastercard" className={className}>
      <title id="pi-mastercard">Mastercard</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <circle fill="#EB001B" cx="15" cy="12" r="7"/>
      <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
      <path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/>
    </svg>
  );
}

export function AmexIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-american_express" viewBox="0 0 38 24" width={width} height={height} className={className}>
      <title id="pi-american_express">American Express</title>
      <path fill="#000" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" opacity=".07"/>
      <path fill="#006FCF" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"/>
      <path fill="#FFF" d="M22.012 19.936v-8.421L37 11.528v2.326l-1.732 1.852L37 17.573v2.375h-2.766l-1.47-1.622-1.46 1.628-9.292-.02Z"/>
      <path fill="#006FCF" d="M23.013 19.012v-6.57h5.572v1.513h-3.768v1.028h3.678v1.488h-3.678v1.01h3.768v1.531h-5.572Z"/>
      <path fill="#006FCF" d="m28.557 19.012 3.083-3.289-3.083-3.282h2.386l1.884 2.083 1.89-2.082H37v.051l-3.017 3.23L37 18.92v.093h-2.307l-1.917-2.103-1.898 2.104h-2.321Z"/>
      <path fill="#FFF" d="M22.71 4.04h3.614l1.269 2.881V4.04h4.46l.77 2.159.771-2.159H37v8.421H19l3.71-8.421Z"/>
      <path fill="#006FCF" d="m23.395 4.955-2.916 6.566h2l.55-1.315h2.98l.55 1.315h2.05l-2.904-6.566h-2.31Zm.25 3.777.875-2.09.873 2.09h-1.748Z"/>
      <path fill="#006FCF" d="M28.581 11.52V4.953l2.811.01L32.84 9l1.456-4.046H37v6.565l-1.74.016v-4.51l-1.644 4.494h-1.59L30.35 7.01v4.51h-1.768Z"/>
    </svg>
  );
}

export function ApplePayIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-apple_pay" className={className}>
      <title id="pi-apple_pay">Apple Pay</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#000" d="M11.5 10.6c-.3.4-.8.7-1.3.7-.1-.5.2-1 .4-1.3.3-.4.8-.6 1.2-.7.1.5-.1 1-.3 1.3zm.4 1.4c-.7 0-1.3.4-1.6.4-.3 0-.9-.4-1.5-.4-.8 0-1.5.5-1.9 1.2-.8 1.4-.2 3.5.6 4.6.4.6.9 1.2 1.5 1.2.6 0 .8-.4 1.5-.4s.9.4 1.6.4c.6 0 1.1-.6 1.5-1.2.5-.7.7-1.3.7-1.4-.7-.3-1.3-1.1-1.3-2.2 0-.9.5-1.7 1.2-2.1-.5-.6-1.2-1-2.3-1.1zm7.7-3c2.5 0 4.3 1.8 4.3 4.3 0 2.5-1.8 4.3-4.4 4.3h-2.8v4.5h-2.1V9h5zm-2.9 6.8h2.3c1.7 0 2.7-1 2.7-2.5s-1-2.5-2.7-2.5h-2.3v5zm8.1 4.6c0-1.4 1.1-2.2 3-2.3l2.2-.1v-.6c0-.9-.6-1.4-1.5-1.4-1 0-1.5.5-1.6 1.1h-1.9c.1-1.6 1.4-2.8 3.6-2.8 2.1 0 3.4 1.1 3.4 2.9v6.1h-1.9v-1.5c-.5.9-1.4 1.6-2.7 1.6-1.7 0-2.8-1-2.8-2.6v-.4zm5.2-.7v-.7l-2 .1c-1 .1-1.5.5-1.5 1.1 0 .7.6 1.1 1.4 1.1 1.2 0 2.1-.8 2.1-1.6zm4.3 5.1c-.2.1-.5.1-.7.1-.7 0-1.2-.4-1.2-1.2v-.2c-.6 1-1.5 1.5-2.8 1.5-1.8 0-3-1-3-2.6 0-1.7 1.2-2.5 3.4-2.7l2.3-.1v-.7c0-.9-.5-1.4-1.6-1.4-.9 0-1.5.4-1.6 1.1h-1.9c.1-1.5 1.4-2.7 3.6-2.7 2.2 0 3.5 1.1 3.5 2.9v4.9c0 .5.2.7.6.7.1 0 .3 0 .4-.1v1.4zm-3-3.2v-.7l-1.9.1c-1 .1-1.6.4-1.6 1.1 0 .6.5 1.1 1.4 1.1 1.2 0 2.1-.8 2.1-1.6z"/>
    </svg>
  );
}

export function GooglePayIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-google_pay" className={className}>
      <title id="pi-google_pay">Google Pay</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#4285F4" d="M18.5 12c0-.7.1-1.4.2-2H13v3.8h3.1c-.1.8-.5 1.5-1.1 1.9v1.6h1.8c1-1 1.7-2.4 1.7-5.3z"/>
      <path fill="#34A853" d="M13 19c1.5 0 2.7-.5 3.6-1.3l-1.8-1.6c-.5.3-1.1.5-1.8.5-1.4 0-2.6-1-3-2.3H8.2v1.6c.9 1.8 2.7 3.1 4.8 3.1z"/>
      <path fill="#FBBC04" d="M10 12c0-.4.1-.8.2-1.2V9.2H8.2c-.4.8-.6 1.7-.6 2.8s.2 2 .6 2.8l2-1.6c-.1-.4-.2-.8-.2-1.2z"/>
      <path fill="#EA4335" d="M13 8.5c.8 0 1.5.3 2.1.8l1.5-1.5C15.7 7 14.5 6.5 13 6.5c-2.1 0-3.9 1.3-4.8 3.1l2 1.6c.4-1.4 1.6-2.7 3-2.7z"/>
      <path fill="#4285F4" d="M28.3 11.7c0-.3 0-.6-.1-.9h-4.4v1.7h2.5c-.1.5-.4 1-1 1.3v1.1h1.6c.9-.9 1.4-2.1 1.4-3.2z"/>
      <path fill="#34A853" d="M23.8 16c1.3 0 2.4-.4 3.2-1.2l-1.6-1.1c-.4.3-.9.5-1.6.5-1.2 0-2.2-.8-2.6-1.9h-1.6v1.1c.8 1.6 2.4 2.6 4.2 2.6z"/>
      <path fill="#FBBC04" d="M21.2 12.4c0-.4.1-.7.1-1.1 0-.4 0-.7-.1-1.1v-1.1h-1.6c-.3.7-.5 1.5-.5 2.2 0 .8.2 1.5.5 2.2l1.6-1.1z"/>
      <path fill="#EA4335" d="M23.8 9.3c.7 0 1.3.2 1.8.7l1.3-1.3c-.8-.8-1.9-1.2-3.1-1.2-1.8 0-3.4 1-4.2 2.6l1.6 1.1c.4-1.1 1.4-1.9 2.6-1.9z"/>
    </svg>
  );
}

export function DinersClubIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-diners_club" className={className}>
      <title id="pi-diners_club">Diners Club</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z" fill="#3086C8"/>
    </svg>
  );
}

export function DiscoverIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" width={width} height={height} role="img" aria-labelledby="pi-discover" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title id="pi-discover">Discover</title>
      <path fill="#000" opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#fff"/>
      <path d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z" fill="#231F20"/>
      <path d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint0_linear_discover)"/>
      <path opacity=".65" d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint1_linear_discover)"/>
      <path d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z" fill="#231F20"/>
      <path d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z" fill="#231F20"/>
      <path d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z" fill="#F48120"/>
      <defs>
        <linearGradient id="pi-paint0_linear_discover" x1="21.657" y1="12.275" x2="19.632" y2="9.104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F89F20"/>
          <stop offset=".25" stopColor="#F79A20"/>
          <stop offset=".533" stopColor="#F68D20"/>
          <stop offset=".62" stopColor="#F58720"/>
          <stop offset=".723" stopColor="#F48120"/>
          <stop offset="1" stopColor="#F37521"/>
        </linearGradient>
        <linearGradient id="pi-paint1_linear_discover" x1="21.338" y1="12.232" x2="18.378" y2="6.446" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F58720"/>
          <stop offset=".359" stopColor="#E16F27"/>
          <stop offset=".703" stopColor="#D4602C"/>
          <stop offset=".982" stopColor="#D05B2E"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function JCBIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-jcb" className={className}>
      <title id="pi-jcb">JCB</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="url(#pi-jcb-a)" d="M11.5 5H15c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-3.5V5z"/>
      <path fill="url(#pi-jcb-b)" d="M17.5 5H21c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-3.5V5z"/>
      <path fill="url(#pi-jcb-c)" d="M23.5 5H27c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-3.5V5z"/>
      <path fill="#fff" d="M13.1 8.8c.2-.1.5-.1.8-.1.7 0 1.1.2 1.4.5.3.3.4.7.4 1.2 0 .5-.1.9-.4 1.2-.3.3-.7.5-1.2.5-.2 0-.4 0-.6-.1-.2 0-.4-.1-.6-.2v.1c0 .2 0 .4.1.5.1.3.4.4.8.4.2 0 .4 0 .6-.1.2 0 .3-.1.5-.2v1.1c-.2.1-.4.2-.7.2-.2.1-.5.1-.8.1-.5 0-.9-.1-1.3-.3-.3-.2-.5-.5-.6-.8-.1-.3-.2-.7-.2-1.1v-.5c0-.7.2-1.3.6-1.7.3-.4.8-.6 1.4-.6h-.2zm0 2.4c.1 0 .2.1.4.1.3 0 .5-.1.6-.2.1-.1.2-.3.2-.6 0-.3-.1-.5-.2-.6-.1-.2-.4-.2-.7-.2-.2 0-.3 0-.4.1v1.4h.1z"/>
      <path fill="#fff" d="M20.4 11.3c0 .3-.1.6-.2.8-.2.2-.4.4-.7.5-.3.1-.6.2-1 .2h-1.3v-4h1.2c.4 0 .7 0 1 .1.3.1.5.2.7.4.2.2.3.5.3.8 0 .2-.1.4-.2.6-.1.2-.3.3-.5.4.3.1.5.2.6.5.1.2.1.4.1.7zm-1.6-1.7c0-.2-.1-.3-.2-.4-.1-.1-.3-.1-.5-.1h-.2v1h.2c.2 0 .4 0 .5-.1.1-.1.2-.2.2-.4zm.1 1.6c0-.2-.1-.3-.2-.4-.1-.1-.3-.2-.5-.2h-.3v1.2h.3c.2 0 .4-.1.5-.2.1-.1.2-.2.2-.4z"/>
      <path fill="#fff" d="M25.2 11.9c-.2.2-.4.4-.7.5-.3.1-.6.2-.9.2-.4 0-.8-.1-1.1-.3-.3-.2-.5-.4-.7-.8-.2-.3-.2-.7-.2-1.1 0-.4.1-.8.2-1.1.2-.3.4-.6.7-.8.3-.2.7-.3 1.1-.3.3 0 .6.1.9.2.2.1.5.2.7.4v1.3c-.2-.2-.4-.4-.6-.5-.2-.1-.5-.2-.7-.2-.3 0-.6.1-.8.3-.2.2-.3.5-.3.8 0 .4.1.6.3.8.2.2.5.3.8.3.3 0 .5-.1.7-.2.2-.1.4-.3.6-.5v1z"/>
      <defs>
        <linearGradient id="pi-jcb-a" x1="13.25" y1="19" x2="13.25" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#007940"/>
          <stop offset=".229" stopColor="#00873F"/>
          <stop offset=".743" stopColor="#40A737"/>
          <stop offset="1" stopColor="#5CB531"/>
        </linearGradient>
        <linearGradient id="pi-jcb-b" x1="19.25" y1="19" x2="19.25" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1F286F"/>
          <stop offset=".475" stopColor="#004E94"/>
          <stop offset=".826" stopColor="#0066B1"/>
          <stop offset="1" stopColor="#006BB7"/>
        </linearGradient>
        <linearGradient id="pi-jcb-c" x1="25.25" y1="19" x2="25.25" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C2C2F"/>
          <stop offset=".173" stopColor="#882730"/>
          <stop offset=".573" stopColor="#BE1833"/>
          <stop offset=".859" stopColor="#DC0436"/>
          <stop offset="1" stopColor="#E60039"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PayPalIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width={width} height={height} role="img" aria-labelledby="pi-paypal" className={className}>
      <title id="pi-paypal">PayPal</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"/>
      <path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"/>
      <path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"/>
    </svg>
  );
}

export function ShopPayIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-shopify_pay" className={className}>
      <title id="pi-shopify_pay">Shop Pay</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#5A31F4" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#fff" d="M13.3 9.5c-.3-.1-.5-.1-.8-.1-.4 0-.7.2-.7.5 0 .3.2.4.6.5l.3.1c.7.2 1.1.5 1.1 1.1 0 .8-.6 1.3-1.6 1.3-.5 0-.9-.1-1.3-.2l.1-.7c.4.1.8.2 1.2.2.4 0 .8-.2.8-.6 0-.3-.2-.5-.7-.6l-.3-.1c-.6-.2-1-.5-1-1.1 0-.7.6-1.2 1.5-1.2.4 0 .8.1 1.1.2l-.3.7zm2.7-.6c1.1 0 1.9.8 1.9 1.8 0 1-.8 1.8-1.9 1.8-1.1 0-1.9-.8-1.9-1.8 0-1 .8-1.8 1.9-1.8zm0 2.9c.6 0 1.1-.5 1.1-1.1 0-.6-.5-1.1-1.1-1.1-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1zm5 1.4h-.8v-2.4c0-.5-.2-.8-.7-.8-.4 0-.8.3-.8.8v2.4h-.8V9h.7v.4c.3-.3.6-.5 1.1-.5.8 0 1.3.5 1.3 1.4v2.9zm2.9-4.3h.9v4.3h-.8v-.4c-.2.3-.6.5-1 .5-.9 0-1.6-.8-1.6-1.8 0-1 .7-1.8 1.6-1.8.4 0 .7.2 1 .5V8.9zm-1 3.8c.6 0 1-.4 1-1.1s-.4-1.1-1-1.1c-.6 0-1 .4-1 1.1s.4 1.1 1 1.1zm5-3c.1 0 .2 0 .3.1l-.1.8c-.1 0-.2-.1-.3-.1-.5 0-.9.4-.9 1v1.8h-.8V9h.7v.5c.2-.4.6-.6 1.1-.6zm1.2 3.7c-.3-.1-.5-.2-.8-.4l.4-.6c.2.2.5.3.8.4.2.1.5.1.7.1.4 0 .6-.1.6-.3 0-.2-.2-.3-.6-.4l-.4-.1c-.6-.1-1-.4-1-.9 0-.6.5-1 1.4-1 .6 0 1.1.2 1.4.4l-.4.6c-.3-.2-.6-.3-1-.3-.4 0-.5.1-.5.3 0 .2.2.3.5.3l.4.1c.7.2 1 .4 1 1 0 .6-.5 1-1.5 1-.4 0-.8-.1-1-.2z"/>
      <path fill="#fff" d="M24.3 15.7c-.8 0-1.4-.3-1.8-.8l.5-.4c.3.4.8.6 1.3.6.7 0 1.2-.5 1.2-1.1 0-.4-.2-.7-.5-.9l-.8-.4c-.5-.3-.9-.6-.9-1.2 0-.7.6-1.2 1.4-1.2.5 0 1 .2 1.4.5l-.4.5c-.3-.2-.6-.4-1-.4-.5 0-.8.3-.8.7 0 .3.2.5.5.7l.8.4c.6.3.9.7.9 1.3 0 .9-.8 1.6-1.8 1.6v.1zm3.7-5.4h.8v4.9h-.8v-4.9z"/>
    </svg>
  );
}

export function TabbyIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-tabby" className={className}>
      <title id="pi-tabby">Tabby</title>
      {/* Card shadow */}
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      {/* White card background */}
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      {/* Embed the official Tabby SVG as image */}
      <image href="/Tabby.svg" x="1" y="1" width="36" height="22" preserveAspectRatio="xMidYMid meet"/>
    </svg>
  );
}

export function TamaraIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-tamara" className={className}>
      <title id="pi-tamara">Tamara</title>
      {/* Card shadow */}
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      {/* White card background */}
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      {/* Embed the official Tamara SVG as image */}
      <image href="/Tamara-En.svg" x="1" y="1" width="36" height="22" preserveAspectRatio="xMidYMid meet"/>
    </svg>
  );
}

export function MadaIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-mada" className={className}>
      <title id="pi-mada">Mada</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#1DB954" d="M13.1 8H9.4c-.2 0-.4.2-.4.4v7.2c0 .2.2.4.4.4h3.7c.2 0 .4-.2.4-.4V8.4c0-.2-.2-.4-.4-.4z"/>
      <path fill="#7D40E7" d="M19.3 8h-3.7c-.2 0-.4.2-.4.4v7.2c0 .2.2.4.4.4h3.7c.2 0 .4-.2.4-.4V8.4c0-.2-.2-.4-.4-.4z"/>
      <path fill="#00A4DB" d="M28.6 8h-6.8c-.2 0-.4.2-.4.4v7.2c0 .2.2.4.4.4h6.8c.2 0 .4-.2.4-.4V8.4c0-.2-.2-.4-.4-.4z"/>
      <path fill="#fff" d="M11.3 11.8c.5 0 .8.4.8.8 0 .5-.4.8-.8.8-.5 0-.8-.4-.8-.8 0-.4.3-.8.8-.8zM17.4 11.8c.5 0 .8.4.8.8 0 .5-.4.8-.8.8-.5 0-.8-.4-.8-.8 0-.4.3-.8.8-.8z"/>
      <path fill="#fff" d="M25.2 10.5c.7 0 1.2.3 1.5.7v-.5h.9v3.8h-.9v-.5c-.3.4-.8.6-1.5.6-.6 0-1.1-.2-1.5-.6-.4-.4-.6-1-.6-1.7s.2-1.3.6-1.7c.4-.1.9-.1 1.5-.1zm.1.8c-.4 0-.7.1-.9.4-.2.2-.4.6-.4 1s.1.7.4 1c.2.2.5.4.9.4.4 0 .7-.1.9-.4.2-.2.4-.6.4-1s-.1-.7-.4-1c-.2-.3-.5-.4-.9-.4z"/>
    </svg>
  );
}

export function UnionPayIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-unionpay" className={className}>
      <title id="pi-unionpay">UnionPay</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#E21836" d="M11.2 5c-.7 0-1.4.5-1.6 1.2L6.5 17.6c-.2.7.2 1.4.9 1.4h6.5c.7 0 1.4-.5 1.6-1.2l3.1-11.4c.2-.7-.2-1.4-.9-1.4h-6.5z"/>
      <path fill="#00447B" d="M17.2 5c-.7 0-1.4.5-1.6 1.2l-3.1 11.4c-.2.7.2 1.4.9 1.4h6.5c.7 0 1.4-.5 1.6-1.2l3.1-11.4c.2-.7-.2-1.4-.9-1.4h-6.5z"/>
      <path fill="#007B85" d="M24.2 5c-.7 0-1.4.5-1.6 1.2l-3.1 11.4c-.2.7.2 1.4.9 1.4h6.5c.7 0 1.4-.5 1.6-1.2l3.1-11.4c.2-.7-.2-1.4-.9-1.4h-6.5z"/>
      <path fill="#fff" d="M13.5 9l-.8 3h-1.2l.2-.6c-.3.5-.7.7-1.2.7-.4 0-.7-.1-.9-.4-.2-.3-.2-.6-.1-1l.5-1.7h1.1l-.4 1.4c-.1.2 0 .4.1.5.1.1.3.2.5.1.2 0 .4-.1.6-.3.1-.2.3-.4.3-.6l.3-1.1h1zm1.4 0l-.1.5c.2-.4.6-.6 1-.6h.2l-.2.9h-.3c-.4 0-.7.2-.9.6l-.4 1.6h-1.1l.7-3h1.1zm1.3 0h1.1l-.7 3h-1.1l.7-3zm1.2 0h1.1l-.1.5c.2-.4.6-.6 1-.6.4 0 .7.2.8.5.3-.3.6-.5 1-.5.3 0 .6.1.8.4.2.3.2.6.1 1l-.5 1.7H21l.4-1.4c.1-.2 0-.4-.1-.5-.1-.1-.3-.2-.5-.1-.2 0-.4.1-.6.3-.1.2-.3.4-.3.6l-.3 1.1h-1.1l.4-1.4c.1-.2 0-.4-.1-.5-.1-.1-.3-.2-.5-.1-.2 0-.4.1-.6.3-.1.2-.3.4-.3.6l-.3 1.1h-1.1l.7-3z"/>
      <path fill="#fff" d="M23.2 9l-.1.5c.2-.4.6-.6 1-.6.4 0 .7.2.8.5.2-.3.6-.5 1-.5.3 0 .6.1.8.4.2.3.2.6.1 1l-.5 1.7H25l.4-1.4c.1-.2 0-.4-.1-.5-.1-.1-.3-.2-.5-.1-.2 0-.4.1-.6.3-.1.2-.3.4-.3.6l-.3 1.1h-1.1l.4-1.4c.1-.2 0-.4-.1-.5-.1-.1-.3-.2-.5-.1-.2 0-.4.1-.6.3-.1.2-.3.4-.3.6l-.3 1.1h-1.1l.7-3h1z"/>
    </svg>
  );
}

export function MaestroIcon({ className = "", width = 38, height = 24 }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height} aria-labelledby="pi-maestro" className={className}>
      <title id="pi-maestro">Maestro</title>
      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <circle fill="#EB001B" cx="15" cy="12" r="7"/>
      <circle fill="#00A2E5" cx="23" cy="12" r="7"/>
      <path fill="#7375CF" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/>
    </svg>
  );
}

// Payment icon lookup map
export const PaymentIcons: Record<string, React.FC<PaymentIconProps>> = {
  'visa': VisaIcon,
  'mastercard': MastercardIcon,
  'american_express': AmexIcon,
  'amex': AmexIcon,
  'apple_pay': ApplePayIcon,
  'applepay': ApplePayIcon,
  'google_pay': GooglePayIcon,
  'googlepay': GooglePayIcon,
  'diners_club': DinersClubIcon,
  'dinersclub': DinersClubIcon,
  'discover': DiscoverIcon,
  'jcb': JCBIcon,
  'paypal': PayPalIcon,
  'shop_pay': ShopPayIcon,
  'shoppay': ShopPayIcon,
  'shopify_pay': ShopPayIcon,
  'tabby': TabbyIcon,
  'tamara': TamaraIcon,
  'mada': MadaIcon,
  'unionpay': UnionPayIcon,
  'maestro': MaestroIcon,
};

// Helper to get icon component by name
export function getPaymentIcon(name: string): React.FC<PaymentIconProps> | null {
  const normalizedName = name.toLowerCase().replace(/[\s-]/g, '_');
  return PaymentIcons[normalizedName] || null;
}
