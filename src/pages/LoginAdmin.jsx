import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoreConfig } from '../data/products'
import './LoginAdmin.css'

function LoginAdmin() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()
    const config = getStoreConfig()
    const credenciales = config.adminCredentials || { usuario: 'imperiumadmin', password: 'Imperium2026*' }

    if (usuario === credenciales.usuario && password === credenciales.password) {
      // Guardar sesión activa en sessionStorage
      sessionStorage.setItem('imperium_admin_authenticated', 'true')
      setError('')
      navigate('/admin')
    } else {
      setError('Credenciales incorrectas. Acceso exclusivo para administradores.')
    }
  }

  return (
    <main className="login-pagina">
      <div className="login-caja">
        <div className="login-logo">👑</div>
        <p className="login-etiqueta">IMPERIUM PERFUME GALLERY</p>
        <h2>Acceso Administrativo</h2>
        <p className="login-subtitulo">Ingresa tus credenciales autorizadas para gestionar la tienda.</p>

        <form onSubmit={handleLogin} className="login-form">
          <label className="login-campo">
            Usuario
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </label>

          <label className="login-campo">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-boton">
            Ingresar al Panel
          </button>
        </form>
      </div>
    </main>
  )
}

export default LoginAdmin