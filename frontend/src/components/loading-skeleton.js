/**
 * Mengembalikan HTML untuk skeleton loading card produk
 */
export const renderProductSkeleton = (count = 4) => {
  let skeletons = '';
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="product-card" style="border-color: transparent;">
        <div class="product-img-wrapper skeleton skeleton-img" style="aspect-ratio: 4/5;"></div>
        <div class="product-info">
          <div class="skeleton skeleton-text" style="width: 40%"></div>
          <div class="skeleton skeleton-text" style="width: 80%"></div>
          <div class="skeleton skeleton-text" style="width: 60%"></div>
        </div>
      </div>
    `;
  }
  return skeletons;
};
