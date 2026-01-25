import { getProducts } from "@/lib/shopify/server";
import {
  getLocalizedProductTitle,
  getLocalizedProductDescription,
} from "@/lib/shopify/i18n-queries";

// Force dynamic rendering - this page uses no-store fetch for fresh Shopify data
export const dynamic = 'force-dynamic';

export default async function DebugTranslationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = await getProducts({
    locale: { 
      language: locale === 'ar' ? 'ar' : 'en',
      country: 'AE'
    }
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Debug Translations - {locale.toUpperCase()}
      </h1>

      <div className="space-y-8">
        {products.slice(0, 5).map((product) => (
          <div key={product.id} className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Product: {product.handle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">English Content:</h3>
                <p>
                  <strong>Title:</strong> {product.title}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {product.description.substring(0, 100)}...
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Arabic Content:</h3>
                <p>
                  <strong>Title:</strong>{" "}
                  {getLocalizedProductTitle(product, locale as "en" | "ar")}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {getLocalizedProductDescription(
                    product,
                    locale as "en" | "ar"
                  ).substring(0, 100)}
                  ...
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h4 className="font-medium mb-2">Raw Translation Data:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(product.translations, null, 2)}
              </pre>
            </div>

            <div className="mt-4 p-4 bg-blue-100 rounded">
              <h4 className="font-medium mb-2">Metafield Data:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(
                  {
                    titleAr: product.titleAr,
                    descriptionAr: product.descriptionAr,
                    descriptionHtmlAr: product.descriptionHtmlAr,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
