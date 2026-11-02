import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../data/products'
import './Products.css'

function Products() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [products, setProducts] = useState(() => getProducts())

  const featuredProducts = products.filter(
    (product) => product.featured === true
  )

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

  return (
    <section className="products">
      <div className="products-header">
        <div>
          <p>SELECCIÓN IMPERIUM</p>

          <h2>
            Nuestros <span>destacados.</span>
          </h2>
        </div>

        <Link to="/hombre" className="products-link">
          VER COLECCIÓN
          <span>→</span>
        </Link>
      </div>

      <div
        className="products-grid"
        onScroll={(event) => {
          const container = event.currentTarget
          const card = container.querySelector('.product-card')

          if (card) {
            const cardWidth = card.getBoundingClientRect().width
            const gap = parseFloat(
              getComputedStyle(container).columnGap
            ) || 0

            const index = Math.round(
              container.scrollLeft / (cardWidth + gap)
            )

            setActiveProduct(index)
          }
        }}
      >
        {featuredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image">
              <Link
                to={`/producto/${product.id}`}
                aria-label={`Ver detalles de ${product.name}`}
                className="product-image-link"
              >
                <img
                  src={product.image}
                  alt={product.name}
                />
              </Link>

              <button
                type="button"
                className="product-favorite"
                aria-label="Agregar a favoritos"
                onClick={(event) => event.stopPropagation()}
              >
                ♡
              </button>
            </div>

            <div className="product-info">
              <p className="product-category">
                {product.category}
              </p>

              <Link
                to={`/producto/${product.id}`}
                className="product-title-link"
              >
                <h3>{product.name}</h3>
              </Link>

              <p className="product-price">
                {Number(product.price).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                })}
              </p>

              <Link
                to={`/producto/${product.id}`}
                className="product-detail-link"
              >
                VER PERFUME →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="product-indicators">
        {featuredProducts.map((product, index) => (
          <button
            type="button"
            key={product.id}
            aria-label={`Ver destacado ${index + 1}`}
            className={activeProduct === index ? 'active' : ''}
            onClick={() => {
              const container = document.querySelector('.products-grid')
              const card = container?.querySelectorAll('.product-card')[index]

              if (container && card) {
                container.scrollTo({
                  left: card.offsetLeft - container.offsetLeft,
                  behavior: 'smooth',
                })

                setActiveProduct(index)
              }
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Products