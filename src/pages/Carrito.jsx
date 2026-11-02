import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import './Carrito.css'


function formatoPrecio(valor) {
  return Number(valor).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })
}

function Carrito() {
  const {
    items,
    total,
    cambiarCantidad,
    eliminarProducto,
    vaciarCarrito,
  } = useCarrito()

  return (
    <main className="carrito-pagina">
      <header className="carrito-encabezado">
        <p className="carrito-etiqueta">IMPERIUM PERFUME GALLERY</p>
        <h1>Tu carrito</h1>
        <p>Tu próxima fragancia favorita está más cerca.</p>
      </header>

      {items.length === 0 ? (
        <section className="carrito-vacio">
          <span className="carrito-icono" aria-hidden="true">
            ◇
          </span>

          <h2>Tu carrito está esperando</h2>
          <p>Descubre nuestras fragancias y encuentra tu esencia.</p>

          <Link to="/" className="carrito-boton-principal">
            Explorar perfumes
          </Link>
        </section>
      ) : (
        <div className="carrito-contenido">
          <section className="carrito-lista">
            {items.map((item) => {
              const stock = Number(item.stock) || 0
              const cantidad = Number(item.cantidad) || 1

              return (
                <article className="carrito-producto" key={item.id}>
                  <Link
                    to={`/producto/${item.id}`}
                    className="carrito-producto-imagen"
                  >
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="carrito-producto-info">
                    <p className="carrito-producto-categoria">
                      {(Array.isArray(item.categories)
                        ? item.categories
                        : [item.category]
                      )
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    <h2>
                      <Link to={`/producto/${item.id}`}>
                        {item.name}
                      </Link>
                    </h2>

                    <p className="carrito-precio-unitario">
                      {formatoPrecio(item.price)} por unidad
                    </p>

                    <div className="carrito-acciones-producto">
                      <label>Cantidad</label>

                      <div
                        className="carrito-cantidad-control"
                        aria-label={`Cantidad de ${item.name}`}
                      >
                        <button
                          type="button"
                          aria-label={`Restar una unidad de ${item.name}`}
                          disabled={cantidad <= 1}
                          onClick={() =>
                            cambiarCantidad(item.id, cantidad - 1)
                          }
                        >
                          −
                        </button>

                        <span
                          className="carrito-cantidad-numero"
                          aria-live="polite"
                        >
                          {cantidad}
                        </span>

                        <button
                          type="button"
                          aria-label={`Agregar una unidad de ${item.name}`}
                          disabled={cantidad >= stock || stock <= 0}
                          onClick={() =>
                            cambiarCantidad(item.id, cantidad + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      {stock > 0 && (
                        <span className="carrito-stock">
                          {stock} disponibles
                        </span>
                      )}

                      <button
                        type="button"
                        className="carrito-eliminar"
                        onClick={() => eliminarProducto(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <p className="carrito-subtotal">
                    {formatoPrecio(Number(item.price) * cantidad)}
                  </p>
                </article>
              )
            })}

            <button
              type="button"
              className="carrito-vaciar"
              onClick={vaciarCarrito}
            >
              Vaciar carrito
            </button>
          </section>

          <aside className="carrito-resumen">
            <h2>Resumen de compra</h2>

            <div className="carrito-resumen-linea">
              <span>Unidades</span>
              <span>
                {items.reduce(
                  (suma, item) =>
                    suma + (Number(item.cantidad) || 0),
                  0
                )}
              </span>
            </div>

            <div className="carrito-resumen-linea carrito-total">
              <span>Total</span>
              <span>{formatoPrecio(total)}</span>
            </div>

            <p className="carrito-nota">
              El costo de envío y las opciones de pago se confirmarán
              antes de finalizar el pedido.
            </p>

            <Link
              to="/checkout"
              className="carrito-boton-principal"
            >
              Continuar con la compra
            </Link>

            <Link to="/" className="carrito-seguir-comprando">
              Seguir explorando
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Carrito