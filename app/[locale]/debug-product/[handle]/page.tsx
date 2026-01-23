import { getProduct } from "@/lib/shopify/server";
import { notFound } from "next/navigation";
import { 
  getLocalizedProductTitle,
  getLocalizedProductDescription 
} from "@/lib/shopify/i18n-queries";

export default async function DebugProductPage(props: {
  params: Promise<{ handle: string; locale: string }>;
}) {
  const params = await props.params;
  
  // Next.js automatically decodes URL parameters
  // params.handle will already be: "واقي-الشمس-s-mone-sherbet" (decoded)
  const handle = params.handle;

  console.log('[Debug Page] Handle from params:', handle);
  console.log('[Debug Page] Handle length:', handle.length);
  console.log('[Debug Page] Locale:', params.locale);

  const product = await getProduct(handle, {
    language: params.locale === "ar" ? "ar" : "en",
    country: "AE",
  });

  if (!product) return notFound();

  // Get localized content using the helper functions
  const localizedTitle = getLocalizedProductTitle(product, params.locale as "en" | "ar");
  const localizedDescription = getLocalizedProductDescription(product, params.locale as "en" | "ar");

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Product Debug Info</h1>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4 bg-green-50">
          <h2 className="text-xl font-semibold mb-2 text-green-800">✅ Request Info</h2>
          <p><strong>Handle from URL:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{handle}</code></p>
          <p><strong>Locale Param:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{params.locale}</code></p>
          <p><strong>GraphQL Language:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{params.locale === "ar" ? "AR" : "EN"}</code></p>
          <p className="mt-2 text-sm text-gray-600">
            ℹ️ Next.js automatically decodes URL parameters. The handle above is ready to use with Shopify API.
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-blue-50">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">📝 Localized Content (What Users See)</h2>
          <div className="space-y-2">
            <div>
              <strong>Localized Title:</strong>
              <p className="mt-1 p-2 bg-white rounded border">{localizedTitle}</p>
            </div>
            <div>
              <strong>Localized Description:</strong>
              <p className="mt-1 p-2 bg-white rounded border whitespace-pre-wrap">{localizedDescription.substring(0, 300)}...</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">🔧 Raw Product Data</h2>
          <p><strong>Product ID:</strong> {product.id}</p>
          <p><strong>Default Title:</strong> {product.title}</p>
          <p><strong>Default Description:</strong> {product.description.substring(0, 100)}...</p>
        </div>

        <div className="border rounded-lg p-4 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-2 text-yellow-800">🌐 Translations Array</h2>
          {(product as any).translations && (product as any).translations.length > 0 ? (
            <div className="space-y-2">
              <p className="text-green-600">✅ Translations found: {(product as any).translations.length}</p>
              <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-sm border">
                {JSON.stringify((product as any).translations, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p className="text-red-600">❌ No translations array found</p>
              <p className="text-sm text-gray-600 mt-2">
                This means the product hasn't been translated using Shopify's Translate & Adapt app.
              </p>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">📋 Metafields (Arabic - Fallback)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify({
              titleAr: (product as any).titleAr,
              descriptionAr: (product as any).descriptionAr,
              descriptionHtmlAr: (product as any).descriptionHtmlAr,
            }, null, 2)}
          </pre>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">🔍 Translation Logic Check</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Step 1:</strong> Check for native Shopify translations with locale = 'ar'
              <span className="ml-2">
                {(product as any).translations?.find((t: any) => t.locale === 'ar') 
                  ? '✅ Found' 
                  : '❌ Not found'}
              </span>
            </p>
            <p>
              <strong>Step 2:</strong> Check for translations without locale (fallback)
              <span className="ml-2">
                {(product as any).translations?.length > 0 
                  ? '✅ Available' 
                  : '❌ Not available'}
              </span>
            </p>
            <p>
              <strong>Step 3:</strong> Check for Arabic metafields
              <span className="ml-2">
                {(product as any).titleAr?.value 
                  ? '✅ Found' 
                  : '❌ Not found'}
              </span>
            </p>
            <p>
              <strong>Step 4:</strong> Fallback to default English
              <span className="ml-2">
                {product.title ? '✅ Available' : '❌ Not available'}
              </span>
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-purple-50">
          <h2 className="text-xl font-semibold mb-2 text-purple-800">📊 Summary</h2>
          <div className="space-y-2">
            <p>
              <strong>Translation Status:</strong>
              <span className={`ml-2 px-3 py-1 rounded ${
                localizedTitle !== product.title 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-orange-200 text-orange-800'
              }`}>
                {localizedTitle !== product.title 
                  ? '✅ Translated (showing localized content)' 
                  : '⚠️ Using default content (translation may be missing)'}
              </span>
            </p>
            <p>
              <strong>Expected for locale "{params.locale}":</strong>
              <span className="ml-2">
                {params.locale === 'ar' ? 'Arabic content' : 'English content'}
              </span>
            </p>
            <p>
              <strong>Actually showing:</strong>
              <span className="ml-2">
                {localizedTitle !== product.title ? `Localized (${params.locale})` : 'Default (en)'}
              </span>
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">🔧 Full Product Object (for debugging)</h2>
          <details className="cursor-pointer">
            <summary className="font-semibold hover:text-blue-600">Click to expand full JSON</summary>
            <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-xs mt-2">
              {JSON.stringify(product, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
