/**
 * ============================================
 * FILE: ProductGrid.jsx
 * SHARED BY: Seluruh Tim (COMPONENT UTILITY)
 * Digunakan untuk menampilkan grid produk
 * ============================================
 */

import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div
      id="product-grid"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animation: `fadeInUp 0.5s ease ${i * 0.05}s forwards` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;