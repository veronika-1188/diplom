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
  
  const [maxPrice, setMaxPrice] = useState('')
  const [minAge, setMinAge] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('catalogs')
        .select('*')
        .limit(limit ?? 9999);

      error ? setError(error.message) : setProducts(data);
      setLoading(false);
    })();
  }, [limit]);

  const filtered = products.filter(p => {
    const priceOk = maxPrice === '' || p.price <= Number(maxPrice)
    const ageOk = minAge === '' || p.age_from >= Number(minAge)
    return priceOk && ageOk
  })

  if (error) return <div className="product-list__error">Ошибка: {error}</div>

  return (
    <div className="product-list__container">
      <h1 className="product-list__title">Наши игрушки</h1>

    {!limit && (

      <div className="product-list__filters">
        <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
          <option value="">Любая цена</option>
          <option value="500">до 500 ₽</option>
          <option value="1000">до 1000 ₽</option>
          <option value="2000">до 2000 ₽</option>
          <option value="5000">до 5000 ₽</option>
        </select>

        <select value={minAge} onChange={e => setMinAge(e.target.value)}>
          <option value="">Любой возраст</option>
          <option value="0">0+</option>
          <option value="3">3+</option>
          <option value="6">6+</option>
          <option value="12">12+</option>
        </select>
      </div>
      )}

      {loading ? (<Loading/>) : (
        <>
          {filtered.length === 0 ? (
            <p className="product-list__empty">По заданным фильтрам товары не найдены</p>
          ) : (
            <div className="product-list__grid">
              {filtered.map((product) => (
                <div key={product.id} className="product-list__card">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="product-list__image" loading="lazy" />
                  )}
                  <h3 className="product-list__name">{product.name}</h3>
                  <p className="product-list__description">{product.description}</p>
                  <p className="product-list__age">От {product.age_from} лет</p>
                  <p className="product-list__price">{product.price} ₽</p>
                  <AddToCart product={product}/>
                </div>
              ))}
            </div>
          )}

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