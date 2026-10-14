import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Hombre from './pages/Hombre'
import Mujer from './pages/Mujer'
import Arabes from './pages/Arabes'
import Combos from './pages/Combos'
import Carrito from './pages/Carrito'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hombre" element={<Hombre />} />
      <Route path="/mujer" element={<Mujer />} />
      <Route path="/arabes" element={<Arabes />} />
      <Route path="/combos" element={<Combos />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App