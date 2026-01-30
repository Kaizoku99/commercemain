import type { Cart, Collection, Product } from './types'

// Real product data based on actual Shopify store inventory
export const mockCart: Cart = {
  id: 'mock-cart-id',
  checkoutUrl: '/checkout',
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: '0.00', currencyCode: 'AED' },
    totalAmount: { amount: '0.00', currencyCode: 'AED' },
  },
}

export const mockCollections: Collection[] = [
  {
    handle: 'ems-products',
    title: 'EMS Products',
    description: 'Electrical Muscle Stimulation equipment for fitness and recovery',
    seo: {
      title: 'EMS Products - Fitness & Recovery Equipment',
      description: 'Professional EMS equipment for muscle stimulation and recovery',
    },
    path: '/search/ems-products',
    updatedAt: new Date().toISOString(),
  },
  {
    handle: 'skincare',
    title: 'Skincare',
    description: 'Advanced skincare products for radiant, healthy skin',
    seo: {
      title: 'Skincare Products - Advanced Beauty Solutions',
      description: 'Professional skincare products for all skin types',
    },
    path: '/search/skincare',
    updatedAt: new Date().toISOString(),
  },
  {
    handle: 'supplements',
    title: 'Supplements',
    description: 'Premium health supplements for wellness and vitality',
    seo: {
      title: 'Health Supplements - Premium Wellness Products',
      description: 'High-quality supplements for health and wellness',
    },
    path: '/search/supplements',
    updatedAt: new Date().toISOString(),
  },
  {
    handle: 'beverages',
    title: 'Functional Beverages',
    description: 'Healthy drinks and functional beverages',
    seo: {
      title: 'Functional Beverages - Healthy Drinks',
      description: 'Premium functional beverages for health and wellness',
    },
    path: '/search/beverages',
    updatedAt: new Date().toISOString(),
  },
  {
    handle: 'all',
    title: 'All Products',
    description: 'Complete collection of health and beauty products',
    seo: {
      title: 'All Products - Health & Beauty Collection',
      description: 'Complete range of health, beauty, and wellness products',
    },
    path: '/search',
    updatedAt: new Date().toISOString(),
  },
]

export const mockProducts: Product[] = [
  // EMS Products
  {
    id: 'ems-home-training',
    handle: 'ems',
    availableForSale: true,
    title: 'EMS Home Training',
    description: 'Boost Recovery & Enhance Performance with EMS Technology! Revolutionize your fitness and recovery routine with our cutting-edge EMS (Electrical Muscle Stimulation) products.',
    descriptionHtml: '<p><strong>Boost Recovery & Enhance Performance with EMS Technology!</strong></p><p>Revolutionize your fitness and recovery routine with our cutting-edge EMS (Electrical Muscle Stimulation) products. Designed to stimulate muscle contractions using safe, low-frequency electrical impulses.</p>',
    options: [
      {
        id: 'option-ems-package',
        name: 'Package',
        values: ['10 sessions', '20 sessions', '30 sessions'],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: '5400.00', currencyCode: 'AED' },
      minVariantPrice: { amount: '2000.00', currencyCode: 'AED' },
    },
    variants: [
      {
        id: 'variant-ems-10',
        title: '10 sessions',
        availableForSale: true,
        selectedOptions: [{ name: 'Package', value: '10 sessions' }],
        price: { amount: '2000.00', currencyCode: 'AED' },
      },
      {
        id: 'variant-ems-20',
        title: '20 sessions',
        availableForSale: true,
        selectedOptions: [{ name: 'Package', value: '20 sessions' }],
        price: { amount: '3800.00', currencyCode: 'AED' },
      },
      {
        id: 'variant-ems-30',
        title: '30 sessions',
        availableForSale: true,
        selectedOptions: [{ name: 'Package', value: '30 sessions' }],
        price: { amount: '5400.00', currencyCode: 'AED' },
      },
    ],
    featuredImage: {
      altText: 'EMS Home Training Equipment',
      url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/IMG_3990.jpg?v=1743431166',
      width: 800,
      height: 600,
    },
    images: [
      {
        id: 'image-ems-1',
        altText: 'EMS Home Training Equipment',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/IMG_3990.jpg?v=1743431166',
        width: 800,
        height: 600,
      },
      {
        id: 'image-ems-2',
        altText: 'EMS Training Session',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/IMG_3549.jpg?v=1743431166',
        width: 800,
        height: 600,
      },
    ],
    seo: {
      title: 'EMS Home Training - Electrical Muscle Stimulation',
      description: 'Professional EMS equipment for muscle stimulation and recovery at home',
    },
    tags: ['ems', 'fitness', 'muscle-stimulation', 'recovery'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ems-pro-one-suit',
    handle: 'ems-pro-one-suit',
    availableForSale: true,
    title: 'EMS PRO ONE SUIT',
    description: 'The EMS PRO ONE SUIT is a cutting-edge garment designed for advanced athletes and fitness enthusiasts. With its innovative technology and ergonomic design, this suit provides targeted electrical muscle stimulation.',
    descriptionHtml: '<p>The EMS PRO ONE SUIT is a cutting-edge garment designed for advanced athletes and fitness enthusiasts. With its innovative technology and ergonomic design, this suit provides targeted electrical muscle stimulation to enhance performance and improve muscle recovery.</p>',
    options: [
      {
        id: 'option-ems-suit-package',
        name: 'packages',
        values: ['EMS PRO ONE SUIT', 'EMS Start Package 1x EMS Suit Unisex + 1x Control Box', 'Partner Package 2x EMS Suit Unisex + 1x Control Box', 'Friends-Package: 2x EMS Suit Unisex + 2x Control Box'],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: '11700.00', currencyCode: 'AED' },
      minVariantPrice: { amount: '2900.00', currencyCode: 'AED' },
    },
    variants: [
      {
        id: 'variant-ems-suit-single',
        title: 'EMS PRO ONE SUIT',
        availableForSale: true,
        selectedOptions: [{ name: 'packages', value: 'EMS PRO ONE SUIT' }],
        price: { amount: '2900.00', currencyCode: 'AED' },
      },
      {
        id: 'variant-ems-suit-start',
        title: 'EMS Start Package 1x EMS Suit Unisex + 1x Control Box',
        availableForSale: true,
        selectedOptions: [{ name: 'packages', value: 'EMS Start Package 1x EMS Suit Unisex + 1x Control Box' }],
        price: { amount: '6200.00', currencyCode: 'AED' },
      },
    ],
    featuredImage: {
      id: 'image-ems-suit-1',
      altText: 'EMS PRO ONE SUIT',
      url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/Suit-double-shadow.png?v=1739547755',
      width: 800,
      height: 600,
    },
    images: [
      {
        id: 'image-ems-suit-1',
        altText: 'EMS PRO ONE SUIT',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/Suit-double-shadow.png?v=1739547755',
        width: 800,
        height: 600,
      },
      {
        id: 'image-ems-suit-2',
        altText: 'EMS Control Box',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/phone-shadow.png?v=1739547755',
        width: 800,
        height: 600,
      },
    ],
    seo: {
      title: 'EMS PRO ONE SUIT - Advanced Muscle Stimulation',
      description: 'Professional EMS suit for advanced athletes and fitness enthusiasts',
    },
    tags: ['ems', 'fitness', 'muscle-stimulation', 'athletic'],
    updatedAt: new Date().toISOString(),
  },
  // Skincare Products
  {
    id: 'smone-brightening-cream',
    handle: 'smone-brightening-cream',
    availableForSale: true,
    title: 'S\'MONE Brightening Cream – Advanced Radiance Formula',
    description: 'With NIO VCS, Fermented Honey & Botanical Extracts. Reveal Brighter, Smoother, Stronger Skin – Naturally. A clinically-tested lightweight gel-cream using a 4-step system.',
    descriptionHtml: '<h2>S\'MONE Brightening Cream – Advanced Radiance Formula</h2><h3>With NIO VCS, Fermented Honey & Botanical Extracts</h3><h4>Reveal Brighter, Smoother, Stronger Skin – Naturally</h4>',
    options: [
      {
        id: 'option-smone-size',
        name: 'Title',
        values: ['Default Title'],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: '170.00', currencyCode: 'AED' },
      minVariantPrice: { amount: '170.00', currencyCode: 'AED' },
    },
    variants: [
      {
        id: 'variant-smone-default',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        price: { amount: '170.00', currencyCode: 'AED' },
      },
    ],
    featuredImage: {
      id: 'image-smone-1',
      altText: 'S\'MONE Brightening Cream',
      url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/Brightening_cream_page-0001.jpg?v=1743429669',
      width: 800,
      height: 600,
    },
    images: [
      {
        id: 'image-smone-1',
        altText: 'S\'MONE Brightening Cream',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/Brightening_cream_page-0001.jpg?v=1743429669',
        width: 800,
        height: 600,
      },
      {
        id: 'image-smone-2',
        altText: 'S\'MONE Brightening Cream Product',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/KV_S_Mone_001_1.jpg?v=1744371803',
        width: 800,
        height: 600,
      },
    ],
    seo: {
      title: 'S\'MONE Brightening Cream - Advanced Radiance Formula',
      description: 'Clinically-tested brightening cream with NIO VCS and botanical extracts',
    },
    tags: ['skincare', 'brightening', 'vitamin-c', 'hyaluronic-acid', 'collagen', 'niacinamide'],
    updatedAt: new Date().toISOString(),
  },
  // Supplements
  {
    id: 'mores-collagen',
    handle: 'mores-collagen',
    availableForSale: true,
    title: 'MORES Collagen – Deep Beauty Marine Collagen Drink',
    description: 'Skin that Glows. Confidence that Lasts. MORES Collagen is a scientifically formulated beauty supplement that works from within to restore your skin\'s radiance, firmness, and hydration.',
    descriptionHtml: '<p><strong>MORES Collagen – Deep Beauty Marine Collagen Drink</strong></p><p>(15 Sachets – Powder Form)</p><h3><strong>Skin that Glows. Confidence that Lasts.</strong></h3>',
    options: [
      {
        id: 'option-mores-size',
        name: 'Title',
        values: ['Default Title'],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: '220.00', currencyCode: 'AED' },
      minVariantPrice: { amount: '220.00', currencyCode: 'AED' },
    },
    variants: [
      {
        id: 'variant-mores-default',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        price: { amount: '220.00', currencyCode: 'AED' },
      },
    ],
    featuredImage: {
      id: 'image-mores-1',
      altText: 'MORES Collagen Drink',
      url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/Mores_collagen_page-0001.jpg?v=1743430659',
      width: 800,
      height: 600,
    },
    images: [
      {
        id: 'image-mores-1',
        altText: 'MORES Collagen Drink',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/Mores_collagen_page-0001.jpg?v=1743430659',
        width: 800,
        height: 600,
      },
      {
        id: 'image-mores-2',
        altText: 'MORES Collagen Product',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/P21_9545c98e-2b61-4287-be8e-9f43a16362f2.jpg?v=1743700863',
        width: 800,
        height: 600,
      },
    ],
    seo: {
      title: 'MORES Collagen - Deep Beauty Marine Collagen Drink',
      description: 'Scientifically formulated marine collagen supplement for skin health',
    },
    tags: ['collagen', 'supplement', 'marine-collagen', 'beauty', 'skin-health'],
    updatedAt: new Date().toISOString(),
  },
  // Functional Beverages
  {
    id: 'brazilian-arabica-coffee',
    handle: 'brazilian-arabica-coffee',
    availableForSale: true,
    title: 'Brazilian Arabica Coffee – Functional Beauty Coffee Blend',
    description: 'Premium Brazilian Arabica coffee with functional beauty ingredients. A unique blend that combines the rich taste of coffee with beauty-enhancing properties.',
    descriptionHtml: '<h2>Brazilian Arabica Coffee – Functional Beauty Coffee Blend</h2><p>Premium Brazilian Arabica coffee with functional beauty ingredients.</p>',
    options: [
      {
        id: 'option-coffee-size',
        name: 'Title',
        values: ['Default Title'],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: '0.00', currencyCode: 'AED' },
      minVariantPrice: { amount: '0.00', currencyCode: 'AED' },
    },
    variants: [
      {
        id: 'variant-coffee-default',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        price: { amount: '0.00', currencyCode: 'AED' },
      },
    ],
    featuredImage: {
      id: 'image-coffee-1',
      altText: 'Brazilian Arabica Coffee',
      url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/WhatsAppImage2025-04-02at20.26.52_c7b1fb12.jpg?v=1743875850',
      width: 800,
      height: 600,
    },
    images: [
      {
        id: 'image-coffee-1',
        altText: 'Brazilian Arabica Coffee',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/WhatsAppImage2025-04-02at20.26.52_c7b1fb12.jpg?v=1743875850',
        width: 800,
        height: 600,
      },
      {
        id: 'image-coffee-2',
        altText: 'Coffee Product',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/WhatsAppImage2025-04-02at20.26.54_98646d27.jpg?v=1743875850',
        width: 800,
        height: 600,
      },
    ],
    seo: {
      title: 'Brazilian Arabica Coffee - Functional Beauty Coffee Blend',
      description: 'Premium Brazilian Arabica coffee with beauty-enhancing properties',
    },
    tags: ['coffee', 'arabica', 'functional', 'beauty', 'beverage'],
    updatedAt: new Date().toISOString(),
  },
  // Personal Care
  {
    id: 'dna-hya-facial-cleanser',
    handle: 'dna-hya-facial-cleanser',
    availableForSale: true,
    title: 'DNA HYA Facial Cleanser – With Salmon DNA & Hyaluronic Acid',
    description: 'Advanced facial cleanser with Salmon DNA and Hyaluronic Acid for deep cleansing and hydration. Suitable for all skin types.',
    descriptionHtml: '<h2>DNA HYA Facial Cleanser – With Salmon DNA & Hyaluronic Acid</h2><p>Advanced facial cleanser with Salmon DNA and Hyaluronic Acid for deep cleansing and hydration.</p>',
    options: [
      {
        id: 'option-cleanser-size',
        name: 'Title',
        values: ['Default Title'],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: '0.00', currencyCode: 'AED' },
      minVariantPrice: { amount: '0.00', currencyCode: 'AED' },
    },
    variants: [
      {
        id: 'variant-cleanser-default',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        price: { amount: '0.00', currencyCode: 'AED' },
      },
    ],
    featuredImage: {
      id: 'image-cleanser-1',
      altText: 'DNA HYA Facial Cleanser',
      url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/DSC_1167.jpg?v=1744372382',
      width: 800,
      height: 600,
    },
    images: [
      {
        id: 'image-cleanser-1',
        altText: 'DNA HYA Facial Cleanser',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/DSC_1167.jpg?v=1744372382',
        width: 800,
        height: 600,
      },
      {
        id: 'image-cleanser-2',
        altText: 'Facial Cleanser Product',
        url: 'https://cdn.shopify.com/s/files/1/0723/0744/1902/files/DSC_1149.jpg?v=1744372382',
        width: 800,
        height: 600,
      },
    ],
    seo: {
      title: 'DNA HYA Facial Cleanser - With Salmon DNA & Hyaluronic Acid',
      description: 'Advanced facial cleanser with Salmon DNA and Hyaluronic Acid',
    },
    tags: ['skincare', 'cleanser', 'hyaluronic-acid', 'salmon-dna', 'facial-care'],
    updatedAt: new Date().toISOString(),
  },
]

// Mock response functions
export function createMockResponse<T>(data: T) {
  return {
    status: 200,
    body: {
      data,
    },
  }
}
