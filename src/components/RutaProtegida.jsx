import { Navigate } from 'react-router-dom'

function RutaProtegida({ children }) {
  const estaAutenticado = sessionStorage.getItem('imperium_admin_authenticated') === 'true'

  if (!estaAutenticado) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default RutaProtegida