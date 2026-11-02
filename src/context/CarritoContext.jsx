import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const CarritoContext = createContext(null)
const STORAGE_KEY = 'imperium-carrito'
const PRODUCTS_KEY = 'imperium-products'

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)

    if (!guardado) return []

    const parsed = JSON.parse(guardado)

    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item) =>
        item &&
        item.id !== undefined &&
        Number.isInteger(Number(item.cantidad)) &&
        Number(item.cantidad) > 0
    ).map((item) => ({
      ...item,
      cantidad: Number(item.cantidad),
    }))
  } catch (error) {
    console.error('No se pudo leer el carrito guardado:', error)
    return []
  }
}

function leerProductosGuardados() {
  try {
    const guardados = localStorage.getItem(PRODUCTS_KEY)

    if (!guardados) return null

    const productos = JSON.parse(guardados)

    return Array.isArray(productos) ? productos : null
  } catch (error) {
    console.error('No se pudo leer el inventario:', error)
    return null
  }
}

function buscarProducto(productos, id) {
  if (!productos) return null

  return productos.find(
    (producto) => String(producto.id) === String(id)
  ) || null
}

function obtenerStock(producto) {
  if (!producto || producto.available === false) return 0

  const stock = Number(producto.stock)

  if (!Number.isFinite(stock) || stock < 0) return 0

  return Math.floor(stock)
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)

  // Guarda los cambios del carrito.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error)
    }
  }, [items])

  // Sincroniza los datos del carrito con el inventario actual.
  useEffect(() => {
    function sincronizarProductos() {
      const productosGuardados = leerProductosGuardados()

      if (!productosGuardados) return

      setItems((actuales) => {
        let huboCambios = false

        const actualizados = actuales.map((item) => {
          const productoActual = buscarProducto(
            productosGuardados,
            item.id
          )

          if (!productoActual) return item

          const itemActualizado = {
            ...item,
            ...productoActual,
            cantidad: item.cantidad,
          }

          if (
            item.name !== itemActualizado.name ||
            item.price !== itemActualizado.price ||
            item.image !== itemActualizado.image ||
            item.stock !== itemActualizado.stock ||
            item.available !== itemActualizado.available ||
            item.category !== itemActualizado.category ||
            item.description !== itemActualizado.description
          ) {
            huboCambios = true
          }

          return itemActualizado
        })

        return huboCambios ? actualizados : actuales
      })
    }

    // Actualiza al guardar cambios en el administrador.
    window.addEventListener(
      'imperium-products-updated',
      sincronizarProductos
    )

    // Actualiza si el inventario cambia en otra pestaña.
    window.addEventListener('storage', sincronizarProductos)

    // Comprueba los datos al volver a la pestaña.
    window.addEventListener('focus', sincronizarProductos)

    return () => {
      window.removeEventListener(
        'imperium-products-updated',
        sincronizarProductos
      )

      window.removeEventListener('storage', sincronizarProductos)

      window.removeEventListener('focus', sincronizarProductos)
    }
  }, [])

  function agregarProducto(producto, cantidad = 1) {
    if (!producto || producto.id === undefined) {
      return {
        ok: false,
        mensaje: 'No se pudo identificar el producto.',
      }
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return {
        ok: false,
        mensaje: 'La cantidad no es válida.',
      }
    }

    const productosGuardados = leerProductosGuardados()

    if (!productosGuardados) {
      return {
        ok: false,
        mensaje: 'No se pudo comprobar el inventario. Inténtalo de nuevo.',
      }
    }

    const productoActual = buscarProducto(
      productosGuardados,
      producto.id
    )

    if (!productoActual) {
      return {
        ok: false,
        mensaje: 'Este producto ya no está disponible en el catálogo.',
      }
    }

    if (productoActual.available === false) {
      return {
        ok: false,
        mensaje: 'Este producto no está disponible.',
      }
    }

    const stock = obtenerStock(productoActual)

    if (stock <= 0) {
      return {
        ok: false,
        mensaje: 'Este perfume no tiene unidades disponibles.',
      }
    }

    const existente = items.find(
      (item) => String(item.id) === String(producto.id)
    )

    const cantidadActual = Number(existente?.cantidad) || 0

    if (cantidadActual + cantidad > stock) {
      return {
        ok: false,
        mensaje: `Solo hay ${stock} unidades disponibles.`,
      }
    }

    setItems((actuales) => {
      const itemExistente = actuales.find(
        (item) => String(item.id) === String(producto.id)
      )

      if (itemExistente) {
        return actuales.map((item) =>
          String(item.id) === String(producto.id)
            ? {
                ...item,
                ...productoActual,
                cantidad: Number(item.cantidad) + cantidad,
              }
            : item
        )
      }

      return [
        ...actuales,
        {
          ...productoActual,
          cantidad,
        },
      ]
    })

    return {
      ok: true,
      mensaje: 'Producto agregado al carrito.',
    }
  }

  function cambiarCantidad(id, cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return {
        ok: false,
        mensaje: 'La cantidad no es válida.',
      }
    }

    const productosGuardados = leerProductosGuardados()

    if (!productosGuardados) {
      return {
        ok: false,
        mensaje: 'No se pudo comprobar el inventario.',
      }
    }

    const productoActual = buscarProducto(productosGuardados, id)

    if (!productoActual || productoActual.available === false) {
      return {
        ok: false,
        mensaje: 'Este producto ya no está disponible.',
      }
    }

    const stock = obtenerStock(productoActual)

    if (cantidad > stock) {
      return {
        ok: false,
        mensaje: `Solo hay ${stock} unidades disponibles.`,
      }
    }

    setItems((actuales) =>
      actuales.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              ...productoActual,
              cantidad,
            }
          : item
      )
    )

    return {
      ok: true,
      mensaje: 'Cantidad actualizada.',
    }
  }

  function eliminarProducto(id) {
    setItems((actuales) =>
      actuales.filter(
        (item) => String(item.id) !== String(id)
      )
    )
  }

  function vaciarCarrito() {
    setItems([])
  }

  const total = items.reduce((suma, item) => {
    const precio = Number(item.price) || 0
    const cantidad = Number(item.cantidad) || 0

    return suma + precio * cantidad
  }, 0)

  return (
    <CarritoContext.Provider
      value={{
        items,
        total,
        agregarProducto,
        cambiarCantidad,
        eliminarProducto,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error(
      'useCarrito debe usarse dentro de CarritoProvider'
    )
  }

  return contexto
}