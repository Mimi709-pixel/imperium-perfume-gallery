import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Hombre from './pages/Hombre'
import Mujer from './pages/Mujer'
import Arabes from './pages/Arabes'
import Combos from './pages/Combos'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'
import Producto from './pages/ProductoDetalle'
import LoginAdmin from './pages/LoginAdmin'
import RutaProtegida from './components/RutaProtegida'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Páginas de categorías */}
        <Route path="/hombre" element={<Hombre />} />
        <Route path="/mujer" element={<Mujer />} />
        <Route path="/arabes" element={<Arabes />} />
        <Route path="/combos" element={<Combos />} />

        {/* Detalle del producto */}
        <Route path="/producto/:id" element={<Producto />} />

        {/* Carrito y checkout */}
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Login de Administrador */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Panel administrativo PROTEGIDO */}
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <Admin />
            </RutaProtegida>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App