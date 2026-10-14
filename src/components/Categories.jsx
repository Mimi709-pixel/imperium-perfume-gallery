import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Categories.css'

function Categories() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <section className="categories">

      <div className="categories-header">
        <p>DESCUBRE IMPERIUM</p>

        <h2>
          Encuentra tu<span> esencia.</span>
        </h2>
      </div>

      <div
        className="categories-grid"
        onScroll={(event) => {
          const cardWidth = event.currentTarget.clientWidth
          const index = Math.round(
            event.currentTarget.scrollLeft / cardWidth
          )

          setActiveCategory(index)
        }}
      >

        <Link to="/hombre" className="category-card category-hombre">
          <div className="category-overlay">
            <span>COLECCIÓN</span>
            <h3>Hombre</h3>
            <p>Descubrir colección →</p>
          </div>
        </Link>

        <Link to="/mujer" className="category-card category-mujer">
          <div className="category-overlay">
            <span>COLECCIÓN</span>
            <h3>Mujer</h3>
            <p>Descubrir colección →</p>
          </div>
        </Link>

        <Link to="/arabes" className="category-card category-arabes">
          <div className="category-overlay">
            <span>COLECCIÓN</span>
            <h3>Árabes</h3>
            <p>Descubrir colección →</p>
          </div>
        </Link>

        <Link to="/combos" className="category-card category-combos">
          <div className="category-overlay">
            <span>ESPECIALES</span>
            <h3>Combos</h3>
            <p>Descubrir colección →</p>
          </div>
        </Link>

      </div>

      <div className="category-indicators">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={activeCategory === index ? 'active' : ''}
          ></span>
        ))}
      </div>

    </section>
  )
}

export default Categories