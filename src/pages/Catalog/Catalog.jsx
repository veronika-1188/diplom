import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AddToCart from '../../components/AddToCart/AddToCart';
import ProductList from '../../components/ProductList/ProductList';

export default function Catalog() {
    return (
            <ProductList/>
    )
}
