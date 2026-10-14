import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts } from '../data/products'
import './Header.css'

function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState(() => getProducts())

const navigate = useNavigate()

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

const term = searchTerm.trim().toLowerCase()

const searchResults = term
  ? products.filter((product) =>
      (product.name || '').toLowerCase().includes(term) ||
      (product.category || '').toLowerCase().includes(term)
    ).slice(0, 8)
  : []

  return (
    <header className="header">


      {/* BARRA DE NAVEGACIÓN */}
      <div className="navigation-bar">

        <nav className="nav">
          <Link to="/">Inicio</Link>
          <Link to="/hombre">Hombre</Link>
          <Link to="/mujer">Mujer</Link>
          <Link to="/arabes">Árabes</Link>
          <Link to="/combos">Combos</Link>
        </nav>

        <div className="header-actions">

          <button
            className="search-button"
            aria-label="Buscar productos"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <span>⌕</span>
          </button>

          <Link
            to="/carrito"
            className="cart-button"
            aria-label="Carrito de compras"
          >
            <span>🛒</span>
            <span className="cart-count">0</span>
          </Link>

          <button
            className="menu-button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
          <Link to="/hombre" onClick={() => setMenuOpen(false)}>
            Hombre
          </Link>
          <Link to="/mujer" onClick={() => setMenuOpen(false)}>
            Mujer
          </Link>
          <Link to="/arabes" onClick={() => setMenuOpen(false)}>
            Árabes
          </Link>
          <Link to="/combos" onClick={() => setMenuOpen(false)}>
            Combos
          </Link>
        </div>
      )}

      {/* BUSCADOR */}
      {searchOpen && (
        <div className="search-panel">
          <div className="search-panel-content">

            <input
              type="text"
              placeholder="Buscar perfumes..."
              aria-label="Buscar perfumes"
              autoFocus
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
/>

            <button
              className="search-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Cerrar búsqueda"
            >
              ×
            </button>

          </div>

          {term && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <button
                    type="button"
                    className="search-result"
                    key={product.id}
                    onClick={() => {
                      const paths = {
                        Hombre: '/hombre',
                        Mujer: '/mujer',
                        'Árabes': '/arabes',
                        Combos: '/combos',
                        Originales: '/',
                      }

                      navigate(paths[product.category] || '/')
                      setSearchOpen(false)
                      setSearchTerm('')
                    }}
                  >
                    <img src={product.image} alt={product.name} />

                    <span className="search-result-info">
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                      <span>
                        {Number(product.price || 0).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="search-no-results">
                  No encontramos perfumes con ese nombre.
                </p>
              )}
            </div>
          )}
        </div>
      )}

    </header>
  )
}

export default Header