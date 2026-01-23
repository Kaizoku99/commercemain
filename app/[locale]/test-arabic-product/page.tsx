import { getProduct } from "@/lib/shopify/server"
import { getLocalizedHandle } from "@/lib/shopify/handle-mapping"

export default async function TestArabicProduct() {
  // Test with the actual Arabic handle
  const arabicHandle = "غسول-الوجه-dna-hya"
  const englishHandle = "dna-hya-facial-cleanser"
  
  console.log("Testing Arabic handle:", arabicHandle)
  console.log("Testing English handle:", englishHandle)
  
  // Test direct Arabic handle
  const arabicProduct = await getProduct(arabicHandle, { 
    language: 'ar',
    country: 'AE'
  })
  
  // Test English handle with Arabic context
  const englishProductWithArabic = await getProduct(englishHandle, { 
    language: 'ar',
    country: 'AE'
  })
  
  // Test localized handle function
  const localizedArabicHandle = getLocalizedHandle('dna-hya-facial-cleanser', 'ar')
  const localizedProduct = await getProduct(localizedArabicHandle, { 
    language: 'ar',
    country: 'AE'
  })
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Arabic Product Handle Test</h1>
      
      <div className="space-y-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Direct Arabic Handle Test</h2>
          <p><strong>Handle:</strong> {arabicHandle}</p>
          <p><strong>Product Found:</strong> {arabicProduct ? 'Yes' : 'No'}</p>
          {arabicProduct && (
            <div>
              <p><strong>Title:</strong> {arabicProduct.title}</p>
              <p><strong>Description:</strong> {arabicProduct.description.substring(0, 100)}...</p>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">English Handle with Arabic Context</h2>
          <p><strong>Handle:</strong> {englishHandle}</p>
          <p><strong>Product Found:</strong> {englishProductWithArabic ? 'Yes' : 'No'}</p>
          {englishProductWithArabic && (
            <div>
              <p><strong>Title:</strong> {englishProductWithArabic.title}</p>
              <p><strong>Description:</strong> {englishProductWithArabic.description.substring(0, 100)}...</p>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Localized Handle Function Test</h2>
          <p><strong>Input Handle:</strong> dna-hya-facial-cleanser</p>
          <p><strong>Localized Handle:</strong> {localizedArabicHandle}</p>
          <p><strong>Product Found:</strong> {localizedProduct ? 'Yes' : 'No'}</p>
          {localizedProduct && (
            <div>
              <p><strong>Title:</strong> {localizedProduct.title}</p>
              <p><strong>Description:</strong> {localizedProduct.description.substring(0, 100)}...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
