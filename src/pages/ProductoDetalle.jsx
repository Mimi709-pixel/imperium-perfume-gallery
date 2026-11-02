import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { getProducts } from '../data/products'
import { useCarrito } from '../context/CarritoContext'
import './ProductoDetalle.css'

function pareceHTML(texto) {
  return /<\/?(p|h[1-6]|strong|em|u|s|ol|ul|li|span|a|br|div|blockquote)(\s|>|\/)/i.test(texto)
}

function ProductoDetalle() {
  const { id } = useParams()
  const { agregarProducto } = useCarrito()
  const [products, setProducts] = useState(() => getProducts())
  const [mensaje, setMensaje] = useState('')
  const [descripcionExpandida, setDescripcionExpandida] = useState(false)

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

  const product = products.find((item) => String(item.id) === id)

  if (!product) {
    return (
      <main className="producto-detalle">
        <h1>Producto no encontrado</h1>
        <Link to="/" className="producto-volver">
          ← Volver a la tienda
        </Link>
      </main>
    )
  }

  const categories = Array.isArray(product.categories)
    ? product.categories
    : [product.category]

  // Detectar la categoría del producto para armar la ruta de retorno específica (ej: /mujer, /hombre)
  const categoriaPrincipal = categories.filter(Boolean)[0] || 'Hombre'
  const rutaCategoria = `/${categoriaPrincipal.toLowerCase()}`

  function handleAgregar() {
    const resultado = agregarProducto(product)
    setMensaje(resultado.mensaje)
  }

  const descripcion =
    product.description ||
    'Descubre esta fragancia de Imperium Perfume Gallery.'

  const descripcionTieneFormato = pareceHTML(descripcion)

  const descripcionSegura = descripcionTieneFormato
    ? DOMPurify.sanitize(descripcion)
    : ''

  const seccionesDescripcion = descripcionTieneFormato
    ? []
    : descripcion
        .split('\n')
        .map((linea) => linea.trim())
        .filter(Boolean)

  const descripcionLarga = descripcion.length > 280

  return (
    <main className="producto-detalle">
      {/* Navegación superior: Volver a tienda + Volver a la sección del perfume */}
      <div className="producto-navegacion-superior">
        <Link to="/" className="producto-volver">
          ← Volver a la tienda
        </Link>
        <span className="producto-separador-nav">|</span>
        <Link to={rutaCategoria} className="producto-volver-categoria">
          ← Volver a sección {categoriaPrincipal}
        </Link>
      </div>

      <div className="producto-detalle-contenido">
        <div className="producto-detalle-imagen">
          <img src={product.image} alt={product.name} />
        </div>

        <section className="producto-detalle-info">
          <p className="producto-detalle-categoria">
            {categories.filter(Boolean).join(' · ')}
          </p>

          <h1>{product.name}</h1>

          <p className="producto-detalle-precio">
            {Number(product.price).toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              maximumFractionDigits: 0,
            })}
          </p>

          <div className="producto-descripcion">
            <div
              className={
                descripcionExpandida
                  ? 'producto-descripcion-contenido expandida'
                  : 'producto-descripcion-contenido contraida'
              }
            >
              {descripcionTieneFormato ? (
                <div
                  className="producto-descripcion-formateada"
                  dangerouslySetInnerHTML={{
                    __html: descripcionSegura,
                  }}
                />
              ) : (
                seccionesDescripcion.map((linea, index) => {
                  const separador = linea.indexOf(':')

                  if (separador > 0 && separador < 35) {
                    return (
                      <p
                        className="producto-descripcion-linea"
                        key={`${index}-${linea}`}
                      >
                        <strong>
                          {linea.slice(0, separador + 1)}
                        </strong>
                        {linea.slice(separador + 1)}
                      </p>
                    )
                  }

                  return (
                    <p
                      className="producto-descripcion-linea"
                      key={`${index}-${linea}`}
                    >
                      {linea}
                    </p>
                  )
                })
              )}
            </div>

            {descripcionLarga && (
              <button
                type="button"
                className="producto-leer-mas"
                aria-expanded={descripcionExpandida}
                onClick={() => {
                  setDescripcionExpandida((anterior) => !anterior)
                }}
              >
                {descripcionExpandida ? 'Leer menos −' : 'Leer más +'}
              </button>
            )}
          </div>

          {product.available ? (
            Number(product.stock) > 0 ? (
              <>
                <p>Disponibles: {product.stock}</p>

                <button
                  type="button"
                  className="producto-agregar"
                  onClick={handleAgregar}
                >
                  Agregar al carrito
                </button>
              </>
            ) : (
              <p>Consulta disponibilidad antes de comprar.</p>
            )
          ) : (
            <p>Producto no disponible actualmente.</p>
          )}

          {mensaje && (
            <p role="status" aria-live="polite">
              {mensaje}
            </p>
          )}

          <Link to="/carrito" className="producto-ir-carrito">
            Ver carrito
          </Link>
        </section>
      </div>
    </main>
  )
}

export default ProductoDetalle