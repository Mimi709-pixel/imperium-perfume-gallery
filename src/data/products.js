const initialProducts = [
  {
    id: 1,
    name: 'Invictus Victory',
    category: 'Hombre',
    price: 159900,
    image: '/images/destacada-hombre.webp',
    available: true,
    stock: 0,
    featured: true,
  },
  {
    id: 2,
    name: 'Moschino Toy 2',
    category: 'Mujer',
    price: 139900,
    image: '/images/destacada-mujer.avif',
    available: true,
    stock: 0,
    featured: true,
  },
  {
    id: 3,
    name: 'Royal Bleu',
    category: 'Árabes',
    price: 159900,
    image: '/images/destacada-arabe.jpg',
    available: true,
    stock: 0,featured: true,
  },
  {
    id: 4,
    name: 'Club the nuit/Le Beau',
    category: 'Combos',
    price: 169900,
    image: '/images/destacada-combos.webp',
    available: true,
    stock: 0,
    featured: true,
  },
]

const STORAGE_KEY = 'imperium-products'

export function getProducts() {
  try {
    const savedProducts = localStorage.getItem(STORAGE_KEY)

    if (savedProducts !== null) {
      const parsedProducts = JSON.parse(savedProducts)

      if (Array.isArray(parsedProducts)) {
        return parsedProducts
      }
    }
  } catch (error) {
    console.error('No se pudieron leer los productos guardados:', error)
  }

  return initialProducts
}

export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    window.dispatchEvent(new Event('imperium-products-updated'))
    return true
  } catch (error) {
    console.error('No se pudieron guardar los productos:', error)
    return false
  }
}

export const products = getProducts()