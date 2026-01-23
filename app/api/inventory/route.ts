/**
 * API Route: Get Inventory Quantity for a Product Variant
 * 
 * Uses Shopify Admin API to fetch real inventory levels.
 * Required env: SHOPIFY_ADMIN_ACCESS_TOKEN
 */

import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// GraphQL query to get inventory quantity for a product variant
const INVENTORY_QUANTITY_QUERY = `
  query getInventoryQuantity($variantId: ID!) {
    productVariant(id: $variantId) {
      id
      title
      availableForSale
      inventoryItem {
        id
        inventoryLevels(first: 10) {
          edges {
            node {
              id
              quantities(names: ["available", "on_hand", "committed"]) {
                name
                quantity
              }
              location {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

interface InventoryQuantityResponse {
    productVariant: {
        id: string;
        title: string;
        availableForSale: boolean;
        inventoryItem: {
            id: string;
            inventoryLevels: {
                edges: Array<{
                    node: {
                        id: string;
                        quantities: Array<{
                            name: string;
                            quantity: number;
                        }>;
                        location: {
                            id: string;
                            name: string;
                        };
                    };
                }>;
            };
        };
    };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const variantId = searchParams.get('variantId');

    if (!variantId) {
        return NextResponse.json(
            { error: 'variantId is required' },
            { status: 400 }
        );
    }

    if (!SHOPIFY_ADMIN_TOKEN) {
        // Return a default response if admin token is not configured
        // This allows the site to work without admin API access
        return NextResponse.json({
            variantId,
            totalAvailable: null,
            availableForSale: null,
            locations: [],
            error: 'Admin API not configured'
        });
    }

    try {
        const adminApiEndpoint = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

        // Convert the variant ID to a global ID format if needed
        const globalVariantId = variantId.startsWith('gid://shopify/')
            ? variantId
            : `gid://shopify/ProductVariant/${variantId}`;

        const response = await fetch(adminApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
            },
            body: JSON.stringify({
                query: INVENTORY_QUANTITY_QUERY,
                variables: { variantId: globalVariantId },
            }),
            // Cache for 30 seconds to reduce API calls
            next: { revalidate: 30 },
        });

        if (!response.ok) {
            throw new Error(`Shopify API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            console.error('[Inventory API] GraphQL errors:', result.errors);
            return NextResponse.json(
                { error: result.errors[0]?.message || 'GraphQL error' },
                { status: 500 }
            );
        }

        const data = result.data as InventoryQuantityResponse;

        if (!data.productVariant) {
            return NextResponse.json(
                { error: 'Variant not found' },
                { status: 404 }
            );
        }

        // Calculate total available quantity across all locations
        let totalAvailable = 0;
        const locations: Array<{ name: string; available: number }> = [];

        data.productVariant.inventoryItem?.inventoryLevels?.edges?.forEach((edge) => {
            const availableQty = edge.node.quantities.find(q => q.name === 'available');
            if (availableQty) {
                totalAvailable += availableQty.quantity;
                locations.push({
                    name: edge.node.location.name,
                    available: availableQty.quantity,
                });
            }
        });

        return NextResponse.json({
            variantId: data.productVariant.id,
            title: data.productVariant.title,
            availableForSale: data.productVariant.availableForSale,
            totalAvailable,
            locations,
        });
    } catch (error) {
        console.error('[Inventory API] Error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
                variantId,
                totalAvailable: null,
            },
            { status: 500 }
        );
    }
}
