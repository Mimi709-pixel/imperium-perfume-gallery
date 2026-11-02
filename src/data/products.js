const STORAGE_KEY = 'imperium-products'
const CONFIG_KEY = 'imperium-store-config'

const initialProducts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
  // MÓDULOS DE NIVEL EMPRESARIAL
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

export function getProducts() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return initialProducts

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : initialProducts
  } catch (error) {
    return initialProducts
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    window.dispatchEvent(new Event('imperium-products-updated'))
    return true
  } catch (error) {
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

export const products = getProducts()