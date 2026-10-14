import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../data/products'
import { useEffect } from 'react'
import './Products.css'

function Products() {
  const [activeProduct, setActiveProduct] = useState(0)
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
          const cardWidth = event.currentTarget.clientWidth
          const index = Math.round(
            event.currentTarget.scrollLeft / cardWidth
          )

          setActiveProduct(index)
        }}
      >

       {products
  .filter((product) => product.featured === true)
  .map((product) => (
          <article className="product-card" key={product.id}>

            <div className="product-image">
              <img
                src={product.image}
                alt={product.name}
              />

              <button
                className="product-favorite"
                aria-label="Agregar a favoritos"
              >
                ♡
              </button>
            </div>

            <div className="product-info">

              <p className="product-category">
                {product.category}
              </p>

              <h3>{product.name}</h3>

              <p className="product-price">
                {product.price.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                })}
              </p>

            </div>

          </article>
        ))}

      </div>

      <div className="product-indicators">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={activeProduct === index ? 'active' : ''}
          ></span>
        ))}
      </div>

    </section>
  )
}

export default Products