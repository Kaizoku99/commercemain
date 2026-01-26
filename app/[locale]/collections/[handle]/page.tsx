import { getTranslations } from "next-intl/server";
import { getCollection, getCollectionProducts } from "@/lib/shopify/server";
import { defaultSort, sorting } from "@/lib/constants";
import { Grid } from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import CollectionHero from "@/components/collections/collection-hero";

export default async function CollectionPage(props: {
    params: Promise<{ handle: string; locale: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const { sort } = searchParams as { [key: string]: string };
    const { sortKey, reverse } =
        sorting.find((item) => item.slug === sort) || defaultSort;

    const localeForApi = params.locale === 'ar'
        ? { language: 'AR', country: 'AE' }
        : { language: 'EN', country: 'AE' };

    const [products, collection] = await Promise.all([
        getCollectionProducts({
            collection: params.handle,
            sortKey,
            reverse,
            locale: localeForApi,
        }),
        getCollection(params.handle, localeForApi),
    ]);

    if (!collection) {
        return (
            <div className="container-premium section-padding text-center">
                <h1 className="text-3xl font-serif">Collection Not Found</h1>
            </div>
        );
    }

    // Default image if collection image is missing
    const heroImage = collection.image ? {
        src: collection.image.url,
        alt: collection.image.altText || collection.title
    } : {
        src: "/images/hero-wellness.jpg", // Fallback
        alt: collection.title
    };

    return (
        <>
            <CollectionHero
                title={collection.title}
                description={collection.description}
                image={heroImage}
                isRTL={params.locale === 'ar'}
            />

            <section className="section-padding bg-atp-off-white">
                <div className="container-premium">
                    {products.length > 0 ? (
                        <Grid variant="luxury">
                            <ProductGridItems
                                products={products}
                                locale={params.locale as "en" | "ar"}
                            />
                        </Grid>
                    ) : (
                        <p className="text-center text-gray-500">No products found in this collection.</p>
                    )}
                </div>
            </section>
        </>
    );
}
