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
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [descripcionExpandida, setDescripcionExpandida] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const data = await getProducts()
        if (isMounted && Array.isArray(data)) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Error al cargar productos:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    function updateProducts() {
      loadData()
    }

    window.addEventListener('imperium-products-updated', updateProducts)
    window.addEventListener('storage', updateProducts)

    return () => {
      isMounted = false
      window.removeEventListener('imperium-products-updated', updateProducts)
      window.removeEventListener('storage', updateProducts)
    }
  }, [])

  if (loading) {
    return (
      <main className="producto-detalle" style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
        <p>Cargando detalle del perfume...</p>
      </main>
    )
  }

  const product = products.find((item) => String(item.id) === String(id))

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

  // Verificación flexible de disponibilidad basada principalmente en el stock
  const esDisponible = product.available !== false && Number(product.stock) > 0

  return (
    <main className="producto-detalle">
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

          {esDisponible ? (
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