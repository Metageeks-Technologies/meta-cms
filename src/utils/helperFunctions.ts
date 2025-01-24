export function generateSku(categoryCode: string, productTitle: string, variantId: string): string {
    // Normalize the category code
    const normalizedCategoryCode = categoryCode.trim().toUpperCase();
  
    // Normalize the product title: remove special characters and replace spaces with hyphens
    const normalizedTitle = productTitle
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .toUpperCase();
  
    // Concatenate with variantId
    const sku = `${normalizedCategoryCode}-${normalizedTitle}-${variantId.trim().toUpperCase()}`;
  
    return sku;
  }
  