import { getCollectionProducts, getCollections } from "@/lib/shopify/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DebugCollectionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ collection?: string }>;
}) {
  const { locale } = await params;
  const { collection: collectionParam } = await searchParams;
  
  // Parse locale for Shopify API
  const localeForApi = locale === 'ar' 
    ? { language: 'AR', country: 'AE' }
    : { language: 'EN', country: 'AE' };

  // Fetch all collections
  const collections = await getCollections(localeForApi);
  
  // Get products from the specified collection or first non-empty collection
  let products: any[] = [];
  let selectedCollection = collectionParam || '';
  
  if (selectedCollection) {
    products = await getCollectionProducts({
      collection: selectedCollection,
      locale: localeForApi,
    });
  } else {
    for (const collection of collections) {
      if (collection.handle && collection.handle !== '') {
        const collectionProducts = await getCollectionProducts({
          collection: collection.handle,
          locale: localeForApi,
        });
        if (collectionProducts.length > 0) {
          products = collectionProducts;
          selectedCollection = collection.handle;
          break;
        }
      }
    }
  }

  return (
    <div className="container mx-auto p-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">
        Debug Collection Products - {locale.toUpperCase()}
      </h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">API Context</h2>
        <pre className="bg-white p-4 rounded overflow-x-auto">
          {JSON.stringify({
            ...localeForApi,
            shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN || 'NOT SET (using demo store)',
            apiVersion: process.env.SHOPIFY_API_VERSION || '2026-01',
          }, null, 2)}
        </pre>
        <p className="text-sm text-red-600 mt-2">
          ⚠️ If using demo store, Arabic translations won&apos;t work. Set SHOPIFY_STORE_DOMAIN in .env.local
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Selected Collection: {selectedCollection}</h2>
        <p className="text-sm text-gray-600">
          Products fetched with @inContext(language: {localeForApi.language})
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Handles Analysis</h2>
        <p className="mb-4 text-sm">
          <strong>Expected behavior:</strong> When locale is AR, handles should be Arabic (if translated in Shopify).
        </p>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Handle</th>
              <th className="border border-gray-300 p-2 text-left">Title</th>
              <th className="border border-gray-300 p-2 text-left">Has Arabic Chars</th>
              <th className="border border-gray-300 p-2 text-left">Generated Link</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 10).map((product, index) => {
              const hasArabicChars = /[\u0600-\u06FF]/.test(product.handle);
              const generatedLink = `/${locale}/product/${product.handle}`;
              
              return (
                <tr key={product.id} className={hasArabicChars ? 'bg-green-100' : 'bg-red-50'}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2 font-mono text-sm">
                    {product.handle}
                  </td>
                  <td className="border border-gray-300 p-2">{product.title}</td>
                  <td className="border border-gray-300 p-2">
                    {hasArabicChars ? '✅ Yes' : '❌ No'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <a 
                      href={generatedLink} 
                      className="text-blue-600 hover:underline text-sm"
                      target="_blank"
                    >
                      {generatedLink}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Raw Product Data (First 3)</h2>
        <p className="text-sm text-gray-600 mb-2">
          If titles are in English when locale is AR, the @inContext directive is not working.
          This usually means you&apos;re connected to a demo store or the store doesn&apos;t have Arabic translations.
        </p>
        <pre className="bg-white p-4 rounded overflow-x-auto text-xs">
          {JSON.stringify(
            products.slice(0, 3).map(p => ({
              id: p.id,
              handle: p.handle,
              title: p.title,
              hasArabicTitle: /[\u0600-\u06FF]/.test(p.title),
              hasArabicHandle: /[\u0600-\u06FF]/.test(p.handle),
              translations: p.translations?.slice(0, 4),
            })),
            null,
            2
          )}
        </pre>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Verification Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Check handles:</strong> For Arabic locale, handles should contain Arabic characters 
            (if products are translated in Shopify Translate & Adapt)
          </li>
          <li>
            <strong>Check titles:</strong> Titles should be in Arabic when locale is AR
          </li>
          <li>
            <strong>Test links:</strong> Click the generated links to verify they work
          </li>
          <li>
            <strong>Compare locales:</strong> Visit this page in both /en/ and /ar/ to compare
          </li>
        </ol>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Collections</h2>
        <div className="flex flex-wrap gap-2">
          {collections.map((col) => (
            <a
              key={col.handle}
              href={`/${locale}/debug-collections?collection=${col.handle}`}
              className={`px-3 py-1 rounded text-sm ${
                col.handle === selectedCollection
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-orange-300 hover:bg-orange-100'
              }`}
            >
              {col.title} ({col.handle})
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <a 
          href={`/en/debug-collections${collectionParam ? `?collection=${collectionParam}` : ''}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View English Version
        </a>
        <a 
          href={`/ar/debug-collections${collectionParam ? `?collection=${collectionParam}` : ''}`}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View Arabic Version
        </a>
      </div>
    </div>
  );
}
