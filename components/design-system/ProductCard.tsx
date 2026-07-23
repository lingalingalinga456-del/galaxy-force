'use client';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true}}
      transition={{ duration: 0.4 }}
      className="rounded-[20px] bg-white border border-warm-border shadow-sm hover:shadow-card transition-all duration-200 hover:scale-[1.02] overflow-hidden w-full flex flex-col"
    >
      {/* Product Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-warm-beige to-warm-cream">
        <img
          src={product.image_url || '/default-product.png'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock_quantity > 0 && (
          <div className="absolute bottom-2 left-2 bg-white/80 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
            <span className="text-warm-green">✓</span> In Stock
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute bottom-2 left-2 bg-white/80 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
            <span className="text-warm-red">✗</span> Out of Stock
          </div>
        )}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="absolute bottom-2 left-2 bg-white/80 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
            <span className="text-warm-yellow">⚠</span> Low Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-medium text-warm-ink">{product.name}</h3>
        <p className="text-sm text-warm-muted mt-0.5">{product.description}</p>
        <div className="mt-2 flex-1 justify-between items-center">
          <span className="font-semibold text-warm-red text-lg">${product.price.toFixed(2)}</span>
          <span className="text-xs rounded-full px-2 py-0.5 bg-warm-green/10 text-warm-green capitalize">{product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
        </div>
        <div className="mt-3 flex justify-center">
          <Button 
            variant="default" 
            className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}