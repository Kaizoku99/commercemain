// Script to analyze ATP Group Services product data from Shopify CSV export

const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products_export-ybJfZRl1K510NGZy32mUO5ElgbDLsp.csv"

async function analyzeProductData() {
  try {
    console.log("[v0] Fetching product data from Shopify CSV...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV data
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""))

    console.log("[v0] CSV Headers found:", headers.slice(0, 10)) // Show first 10 headers

    const products = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // Simple CSV parsing (handles basic cases)
        const values = lines[i].split(",").map((v) => v.replace(/"/g, ""))
        const product = {}

        headers.forEach((header, index) => {
          product[header] = values[index] || ""
        })

        products.push(product)
      }
    }

    console.log("[v0] Total products found:", products.length)

    // Analyze product categories
    const categories = new Set()
    const vendors = new Set()
    const productTypes = new Set()

    products.forEach((product) => {
      if (product["Product Category"]) {
        categories.add(product["Product Category"])
      }
      if (product["Vendor"]) {
        vendors.add(product["Vendor"])
      }
      if (product["Type"]) {
        productTypes.add(product["Type"])
      }
    })

    console.log("[v0] Product Categories:", Array.from(categories))
    console.log("[v0] Vendors:", Array.from(vendors))
    console.log("[v0] Product Types:", Array.from(productTypes))

    // Analyze specific products
    console.log("[v0] Sample Products:")
    products.slice(0, 5).forEach((product, index) => {
      console.log(`[v0] Product ${index + 1}:`, {
        title: product["Title"],
        price: product["Variant Price"],
        category: product["Product Category"],
        vendor: product["Vendor"],
        published: product["Published"],
      })
    })

    // Group products by category for ATP store structure
    const skincareSupplements = products.filter(
      (p) =>
        p["Product Category"]?.toLowerCase().includes("health") ||
        p["Product Category"]?.toLowerCase().includes("beauty") ||
        p["Title"]?.toLowerCase().includes("skincare") ||
        p["Title"]?.toLowerCase().includes("supplement") ||
        p["Title"]?.toLowerCase().includes("vitamin") ||
        p["Title"]?.toLowerCase().includes("collagen"),
    )

    const waterSoilTech = products.filter(
      (p) =>
        p["Product Category"]?.toLowerCase().includes("garden") ||
        p["Product Category"]?.toLowerCase().includes("lawn") ||
        p["Title"]?.toLowerCase().includes("transform") ||
        p["Title"]?.toLowerCase().includes("agricultural") ||
        p["Title"]?.toLowerCase().includes("fertilizer") ||
        p["Title"]?.toLowerCase().includes("water") ||
        p["Title"]?.toLowerCase().includes("soil"),
    )

    console.log("[v0] Skincare & Supplements products:", skincareSupplements.length)
    console.log("[v0] Water & Soil Technology products:", waterSoilTech.length)

    // Show sample products from each category
    if (skincareSupplements.length > 0) {
      console.log("[v0] Sample Skincare/Supplement:", {
        title: skincareSupplements[0]["Title"],
        price: skincareSupplements[0]["Variant Price"],
        image: skincareSupplements[0]["Image Src"],
      })
    }

    if (waterSoilTech.length > 0) {
      console.log("[v0] Sample Water/Soil Tech:", {
        title: waterSoilTech[0]["Title"],
        price: waterSoilTech[0]["Variant Price"],
        image: waterSoilTech[0]["Image Src"],
      })
    }

    // Analyze pricing
    const prices = products
      .map((p) => Number.parseFloat(p["Variant Price"]))
      .filter((p) => !isNaN(p))
      .sort((a, b) => a - b)

    if (prices.length > 0) {
      console.log("[v0] Price Analysis:", {
        min: prices[0],
        max: prices[prices.length - 1],
        average: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
      })
    }

    return {
      totalProducts: products.length,
      categories: Array.from(categories),
      skincareSupplements,
      waterSoilTech,
      allProducts: products,
    }
  } catch (error) {
    console.error("[v0] Error analyzing product data:", error)
    return null
  }
}

// Run the analysis
analyzeProductData().then((result) => {
  if (result) {
    console.log("[v0] Product analysis complete!")
    console.log("[v0] Ready to update product catalogs with real data")
  }
})
