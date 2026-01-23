"use client";

// Define allowed Schema.org types for better type safety
type SchemaOrgType =
  | "Organization"
  | "Product"
  | "WebSite"
  | "BreadcrumbList"
  | "CollectionPage"
  | "ItemList"
  | "Article"
  | "BlogPosting"
  | "FAQPage"
  | "ContactPage";

interface StructuredDataProps {
  type: SchemaOrgType;
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    };

    // Handle specific schema types with custom logic
    switch (type) {
      case "Organization":
        return {
          ...baseSchema,
          name: "ATP Group Services",
          url: "https://atpgroupservices.com",
          logo: "https://atpgroupservices.com/logo.png",
          description:
            "Premium wellness and technology solutions with exclusive ATP membership benefits",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-800-ATP-GROUP",
            contactType: "customer service",
          },
          sameAs: [
            "https://twitter.com/atpgroupservices",
            "https://linkedin.com/company/atp-group-services",
          ],
        };

      case "CollectionPage":
        return {
          ...baseSchema,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: data.products || [],
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://atpgroupservices.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: data.name || "Collection",
                item: data.url || "https://atpgroupservices.com",
              },
            ],
          },
        };

      case "Product":
        return {
          ...baseSchema,
          brand: {
            "@type": "Brand",
            name: "ATP Group Services",
          },
          seller: {
            "@type": "Organization",
            name: "ATP Group Services",
          },
        };

      default:
        return baseSchema;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateSchema()).replace(/</g, "\u003c"),
      }}
    />
  );
}
