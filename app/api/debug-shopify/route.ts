import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

const domain = `https://${config.shopify.domain}`;
const endpoint = `${domain}/api/${config.shopify.apiVersion}/graphql.json`;
const key = config.shopify.accessToken!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionHandle = searchParams.get('collection') || 'amazing-thai-products';
  
  try {
    // Test 1: Direct products query with @inContext
    const directProductsQuery = `
      query testDirectProducts($language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
        products(first: 5) {
          edges {
            node {
              id
              handle
              title
            }
          }
        }
      }
    `;

    // Test 2: Collection products query with @inContext (same as getCollectionProductsQuery)
    const collectionProductsQuery = `
      query testCollectionProducts($handle: String!, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
        collection(handle: $handle) {
          id
          handle
          title
          products(first: 5) {
            edges {
              node {
                id
                handle
                title
              }
            }
          }
        }
      }
    `;

    const variables = {
      language: 'AR',
      country: 'AE'
    };

    console.log('[Debug] Testing with collection:', collectionHandle);

    // Execute both queries
    const [directResult, collectionResult] = await Promise.all([
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': key,
        },
        body: JSON.stringify({ query: directProductsQuery, variables }),
        cache: 'no-store',
      }).then(r => r.json()),
      
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': key,
        },
        body: JSON.stringify({ 
          query: collectionProductsQuery, 
          variables: { ...variables, handle: collectionHandle }
        }),
        cache: 'no-store',
      }).then(r => r.json()),
    ]);

    const analyzeProducts = (edges: any[]) => edges?.map((edge: any) => ({
      handle: edge.node.handle,
      title: edge.node.title,
      hasArabicHandle: /[\u0600-\u06FF]/.test(edge.node.handle),
      hasArabicTitle: /[\u0600-\u06FF]/.test(edge.node.title),
    })) || [];

    return NextResponse.json({
      success: true,
      config: {
        domain: config.shopify.domain,
        apiVersion: config.shopify.apiVersion,
      },
      variables,
      collectionHandle,
      
      directProductsQuery: {
        description: 'Products queried directly with @inContext(language: AR)',
        products: analyzeProducts(directResult.data?.products?.edges),
        raw: directResult.data?.products?.edges?.slice(0, 2),
      },
      
      collectionProductsQuery: {
        description: `Products from collection "${collectionHandle}" with @inContext(language: AR)`,
        collection: {
          handle: collectionResult.data?.collection?.handle,
          title: collectionResult.data?.collection?.title,
          hasArabicTitle: /[\u0600-\u06FF]/.test(collectionResult.data?.collection?.title || ''),
        },
        products: analyzeProducts(collectionResult.data?.collection?.products?.edges),
        raw: collectionResult.data?.collection?.products?.edges?.slice(0, 2),
      },
      
      conclusion: {
        directQueryWorking: analyzeProducts(directResult.data?.products?.edges).some((p: any) => p.hasArabicHandle || p.hasArabicTitle),
        collectionQueryWorking: analyzeProducts(collectionResult.data?.collection?.products?.edges).some((p: any) => p.hasArabicHandle || p.hasArabicTitle),
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
