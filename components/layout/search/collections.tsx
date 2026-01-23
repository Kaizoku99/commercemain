import { getCollections } from "@/lib/shopify/server"
import CollectionsClient from "./collections-client"

export default async function Collections() {
  const collections = await getCollections()
  
  return <CollectionsClient collections={collections} />
}