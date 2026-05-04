import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import GoToCatalog from '../GoToCatalog/GoToCatalog'
import './product__list.css'
import Loading from '../Loading/Loading'
import AddToCart from '../AddToCart/AddToCart'

export default function ProductList({ limit = null }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [limit])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('catalogs')
      .select('*')
      .order('price', { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  if (error) return <div className="product-list__error">Ошибка: {error}</div>

  return (
    <div className="product-list__container">
      <h1 className="product-list__title">Наши игрушки</h1>
      {loading ? (<Loading/>) : (<>

        <div className="product-list__grid">
          {products.map((product) => (
            <div key={product.id} className="product-list__card">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-list__image"
                  loading="lazy"
                />
              )}
              <h3 className="product-list__name">{product.name}</h3>
              <p className="product-list__description">{product.description}</p>
              <p className="product-list__age">От {product.age_from} лет</p>
              <p className="product-list__price">{product.price} ₽</p>
              <AddToCart product={product}/>
            </div>
          ))}
        </div>

        {limit && (
          <div className="product-list__footer">
            <GoToCatalog text="Посмотреть Все" />
          </div>
        )}
      </>
      )}
    </div>
  )
}

