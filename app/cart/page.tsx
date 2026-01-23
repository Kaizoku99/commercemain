import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

/**
 * Redirect page for /cart -> /[locale]/cart
 * This ensures users accessing /cart are redirected to the locale-specific cart page
 * where the CartProvider is available.
 */
export default async function CartRedirect() {
  const locale = await getLocale();
  redirect(`/${locale}/cart`);
}
