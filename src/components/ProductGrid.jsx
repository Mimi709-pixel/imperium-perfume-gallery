import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../data/products'
import './ProductGrid.css'

function ProductGrid({ category }) {
  const [products, setProducts] = useState(() => getProducts())

  useEffect(() => {
    function updateProducts() {
      setProducts(getProducts())
    }

    window.addEventListener('imperium-products-updated', updateProducts)
    window.addEventListener('storage', updateProducts)

    return () => {
      window.removeEventListener('imperium-products-updated', updateProducts)
      window.removeEventListener('storage', updateProducts)
    }
  }, [])

  const categoryProducts = products.filter((product) => {
    const productCategories = Array.isArray(product.categories)
      ? product.categories
      : [product.category]

    return productCategories.includes(category) && product.available
  })

  return (
    <main className="catalog-page">
      <p className="catalog-eyebrow">IMPERIUM PERFUME GALLERY</p>

      <h1>Perfumes para {category}</h1>

      <p className="catalog-description">
        Descubre nuestra colección y encuentra tu esencia.
      </p>

      {categoryProducts.length === 0 ? (
        <p className="catalog-empty">
          Próximamente encontrarás aquí nuestra colección.
        </p>
      ) : (
        <div className="catalog-grid">
          {categoryProducts.map((product) => (
            <article className="catalog-card" key={product.id}>
              <Link
                to={`/producto/${product.id}`}
                className="catalog-product-link"
                aria-label={`Ver detalles de ${product.name}`}
              >
                <div className="catalog-image">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="catalog-info">
                  <p>
                    {(Array.isArray(product.categories)
                      ? product.categories
                      : [product.category]
                    ).join(' · ')}
                  </p>

                  <h2>{product.name}</h2>

                  <p className="catalog-price">
                    {Number(product.price).toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      maximumFractionDigits: 0,
                    })}
                  </p>

                  {product.stock > 0 ? (
                    <span>Disponible</span>
                  ) : (
                    <span>Consulta disponibilidad</span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default ProductGrid