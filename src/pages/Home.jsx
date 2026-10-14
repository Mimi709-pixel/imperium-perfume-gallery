import Header from '../components/Header'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Products from '../components/Products'

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Categories />
        <Products />
      </main>
    </>
  )
}

export default Home