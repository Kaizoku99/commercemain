import { getCollectionProducts } from "@/lib/shopify/server";
import { ThreeItemGridClient } from "./three-items-client";

export async function ThreeItemGridWrapper() {
  // Using the actual collection handle from Shopify store
  const homepageItems = await getCollectionProducts({
    collection: "amazing-thai-products",
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  return <ThreeItemGridClient products={homepageItems} />;
}
