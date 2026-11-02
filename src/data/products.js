import { supabase } from '../services/supabase'

const CONFIG_KEY = 'imperium-store-config'

const initialProducts = [
  {
    id: '1',
    name: 'Invictus Victory',
    category: 'Hombre',
    categories: ['Hombre'],
    price: 169900,
    originalPrice: 199900,
    image: '/images/destacada-hombre.webp',
    stock: 20,
    available: true,
    featured: true,
    promoBadge: '',
  },
  {
    id: '2',
    name: 'Moschino Toy 2',
    category: 'Mujer',
    categories: ['Mujer'],
    price: 139900,
    originalPrice: 0,
    image: '/images/destacada-mujer.avif',
    stock: 20,
    available: true,
    featured: true,
    promoBadge: '',
  },
  {
    id: '3',
    name: 'Royal Bleu',
    category: 'Árabes',
    categories: ['Árabes'],
    price: 159900,
    originalPrice: 180000,
    image: '/images/destacada-arabe.jpg',
    stock: 20,
    available: true,
    featured: true,
    promoBadge: 'MÁS VENDIDO',
  },
  {
    id: '4',
    name: 'Club the nuit/Le Beau',
    category: 'Combos',
    categories: ['Combos'],
    price: 169900,
    originalPrice: 210000,
    image: '/images/destacada-combos.webp',
    stock: 20,
    available: true,
    featured: true,
    promoBadge: 'COMBO 2X1',
  },
]

const defaultConfig = {
  freeShippingThreshold: 200000,
  enableFreeShipping: true,
  shippingNotice: 'Selecciona tu sector para calcular la tarifa exacta de entrega.',
  zones: [
    { name: 'Bosa / Porvenir', price: 15000 },
    { name: 'Chapinero / Central', price: 30000 },
    { name: 'Kennedy / Fontibón', price: 15000 },
    { name: 'Suba / Usaquén', price: 20000 },
    { name: 'Otras zonas de Bogotá', price: 18000 },
  ],
  announcementBar: {
    enabled: true,
    text: '✨ ENVÍOS GRATIS A BOGOTÁ POR COMPRAS SUPERIORES A $200.000 COP ✨',
  },
  whatsappSupport: {
    phone: '573000000000',
    message: 'Hola Imperium Perfume Gallery, quisiera recibir información sobre...',
  },
  coupons: [
    { code: 'IMPERIUM10', discountType: 'percentage', discountValue: 10, active: true },
    { code: 'BIENVENIDA20k', discountType: 'fixed', discountValue: 20000, active: true },
  ],
}

// Inicializamos con los productos locales para que nunca esté vacío al arrancar
let cachedProducts = [...initialProducts]

// Función síncrona/asíncrona unificada para obtener productos sin romper componentes
export async function getProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    if (data && data.length > 0) {
      cachedProducts = data.map(p => ({
        ...p,
        id: String(p.id),
        originalPrice: p.original_price || p.originalPrice || 0,
        promoBadge: p.promo_badge || p.promoBadge || '',
        categories: p.categories || [p.category]
      }))
      return cachedProducts
    }
  } catch (error) {
    console.error('Error al sincronizar con Supabase:', error)
  }
  return cachedProducts
}

export async function saveProducts(productsList) {
  try {
    if (Array.isArray(productsList)) {
      cachedProducts = productsList
      for (const prod of productsList) {
        await supabase.from('products').upsert({
          id: String(prod.id),
          name: prod.name,
          category: prod.category,
          price: prod.price,
          stock: prod.stock,
          image: prod.image,
          description: prod.description || ''
        })
      }
      window.dispatchEvent(new Event('imperium-products-updated'))
      return true
    }
    return false
  } catch (error) {
    console.error('Error al guardar en Supabase:', error)
    return false
  }
}

export function getStoreConfig() {
  const saved = localStorage.getItem(CONFIG_KEY)
  if (!saved) return defaultConfig

  try {
    const parsed = JSON.parse(saved)
    return {
      ...defaultConfig,
      ...parsed,
      zones: Array.isArray(parsed.zones) ? parsed.zones : defaultConfig.zones,
      coupons: Array.isArray(parsed.coupons) ? parsed.coupons : defaultConfig.coupons,
    }
  } catch (error) {
    return defaultConfig
  }
}

export function saveStoreConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    window.dispatchEvent(new Event('imperium-config-updated'))
    return true
  } catch (error) {
    return false
  }
}