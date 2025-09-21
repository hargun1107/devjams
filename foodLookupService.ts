export interface ProductInfo {
  name: string;
  category: string;
  expiryDays?: number;
}

export async function lookupProduct(barcode: string): Promise<ProductInfo | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.status !== 1 || !data.product) {
      return null;
    }

    const product = data.product;
    
    // Extract product name
    const name = product.product_name || product.product_name_en || "Unknown Product";
    
    // Map OpenFoodFacts categories to our categories
    const category = mapToOurCategory(product.categories_tags);
    
    // Estimate expiry days based on category
    const expiryDays = getDefaultExpiryDays(category);

    return {
      name,
      category,
      expiryDays
    };
  } catch (error) {
    console.error("Error looking up product:", error);
    return null;
  }
}

function mapToOurCategory(categoriesTags: string[] = []): string {
  const categoryMap: Record<string, string> = {
    "en:dairy": "Dairy",
    "en:milk": "Dairy", 
    "en:yogurt": "Dairy",
    "en:cheese": "Dairy",
    "en:meat": "Meat",
    "en:poultry": "Meat",
    "en:fish": "Meat",
    "en:seafood": "Meat",
    "en:vegetables": "Vegetables",
    "en:fruits": "Fruits",
    "en:cereals": "Grains",
    "en:bread": "Grains",
    "en:pasta": "Grains",
    "en:rice": "Grains",
    "en:snacks": "Snacks",
    "en:beverages": "Beverages",
    "en:water": "Beverages",
    "en:soft-drinks": "Beverages",
    "en:condiments": "Condiments",
    "en:sauces": "Condiments",
    "en:frozen-foods": "Frozen",
    "en:canned-foods": "Canned"
  };

  for (const tag of categoriesTags) {
    if (categoryMap[tag]) {
      return categoryMap[tag];
    }
  }

  return "Other";
}

function getDefaultExpiryDays(category: string): number {
  const defaultDays: Record<string, number> = {
    "Dairy": 7,
    "Meat": 3,
    "Vegetables": 7,
    "Fruits": 5,
    "Grains": 30,
    "Snacks": 90,
    "Beverages": 365,
    "Condiments": 180,
    "Frozen": 90,
    "Canned": 365,
    "Other": 30
  };

  return defaultDays[category] || 30;
}