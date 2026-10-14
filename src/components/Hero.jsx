import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">
        <p className="hero-subtitle">
          IMPERIUM PERFUME GALLERY
        </p>

        <h1>
          Una esencia
          <br />
          <span>que habla por ti.</span>
        </h1>

        <p className="hero-description">
          Descubre fragancias que representan tu estilo,
          tu personalidad y la forma en que quieres dejar
          huella.
        </p>

        <Link to="/hombre" className="hero-button">
          EXPLORAR COLECCIÓN
          <span>→</span>
        </Link>
      </div>

      <div className="hero-indicators">
        <span className="active"></span>
        <span></span>
        <span></span>
      </div>

    </section>
  )
}

export default Hero