import { useState } from 'react'
import { getProducts, saveProducts } from '../data/products'
import './Admin.css'

function Admin() {
  const [products, setProducts] = useState(() => getProducts())
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  const emptyForm = {
  name: '',
  category: 'Hombre',
  price: '',
  image: '',
  stock: '0',
  available: true,
  featured: false,
}

  const [form, setForm] = useState(emptyForm)

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function updateProducts(updatedProducts, successMessage) {
    const saved = saveProducts(updatedProducts)

    if (!saved) {
      setMessage('No se pudieron guardar los cambios. Revisa el almacenamiento del navegador.')
      return false
    }

    setProducts(updatedProducts)
    setMessage(successMessage)
    return true
  }

  function handleSubmit(event) {
    event.preventDefault()

    const price = Number(form.price)
    const stock = Number(form.stock)

    if (
      !form.name.trim() ||
      !form.image.trim() ||
      form.price === '' ||
      !Number.isFinite(price) ||
      price < 0 ||
      form.stock === '' ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setMessage('Revisa el nombre, la imagen, el precio y las existencias.')
      return
    }

    const productData = {
  name: form.name.trim(),
  category: form.category,
  price,
  image: form.image.trim(),
  stock,
  available: form.available,
  featured: form.featured,
}

    let updatedProducts
    let successMessage

    if (editingId !== null) {
      updatedProducts = products.map((product) =>
        product.id === editingId
          ? { ...product, ...productData }
          : product
      )
      successMessage = 'Producto actualizado y guardado en este navegador.'
    } else {
      const newProduct = {
        id: Math.max(0, ...products.map((product) => product.id)) + 1,
        ...productData,
      }

      updatedProducts = [...products, newProduct]
      successMessage = 'Producto agregado y guardado en este navegador.'
    }

    if (updateProducts(updatedProducts, successMessage)) {
      setForm({ ...emptyForm })
      setEditingId(null)
    }
  }

  function handleEdit(product) {
    setEditingId(product.id)

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      image: product.image,
      stock: String(product.stock ?? 0),
      available: product.available ?? true,
      featured: product.featured ?? false,
    })

    setMessage('')
  }

  function handleCancel() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setMessage('')
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      '¿Quieres quitar este producto de la tienda?'
    )

    if (!confirmed) return

    const updatedProducts = products.filter(
      (product) => product.id !== id
    )

    if (updateProducts(updatedProducts, 'Producto eliminado de la lista guardada.')) {
      if (editingId === id) {
        handleCancel()
      }
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">IMPERIUM PERFUME GALLERY</p>
          <h1>Panel de administración</h1>
          <p>Gestiona los productos de tu tienda.</p>
        </div>
      </header>

      <section className="admin-section">
        <h2>{editingId !== null ? 'Editar producto' : 'Agregar producto'}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Nombre del perfume
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Invictus Victory"
              required
            />
          </label>

          <label>
            Categoría
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Árabes">Árabes</option>
              <option value="Combos">Combos</option>
              <option value="Originales">Originales</option>
            </select>
          </label>

          <label>
            Precio en pesos colombianos (COP)
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              placeholder="Ej. 159900"
              required
            />
          </label>

          <label>
            Ruta o URL de la imagen
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="/images/perfume.jpg"
              required
            />
          </label>

          <label>
            Unidades disponibles
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </label>

          <label className="admin-checkbox">
            <input
              name="available"
              type="checkbox"
              checked={form.available}
              onChange={handleChange}
            />
            Producto disponible para la venta
          </label>

          <label className="admin-checkbox">
  <input
    name="featured"
    type="checkbox"
    checked={form.featured}
    onChange={handleChange}
  />
  Mostrar en destacados
</label>

          <div className="admin-form-actions">
            <button type="submit">
              {editingId !== null ? 'Guardar cambios' : 'Agregar producto'}
            </button>

            {editingId !== null && (
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {message && <p role="status">{message}</p>}
      </section>

      <section className="admin-section">
        <h2>Productos registrados ({products.length})</h2>

        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-item" key={product.id}>
              <div>
                <h3>{product.name}</h3>
                <p>Categoría: {product.category}</p>
                <p>Precio: ${product.price.toLocaleString('es-CO')} COP</p>
                <p>Existencias: {product.stock ?? 0}</p>
                <p>
                  Estado: {product.available ? 'Disponible' : 'No disponible'}
                </p>
              </div>

              <div className="admin-product-actions">
                <button type="button" onClick={() => handleEdit(product)}>
                  Editar
                </button>

                <button type="button" onClick={() => handleDelete(product.id)}>
                  Quitar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Admin