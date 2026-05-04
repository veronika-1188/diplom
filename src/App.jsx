import './index.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom' 
import SignUp from './pages/SignUp/SignUp'
import SignIn from './pages/SignIn/SignIn'
import HomePage from './pages/HomePage/HomePage'
import { AuthProvider } from './contexts/AuthContext'
import NotFound from './components/NotFound/NotFound'
import Header from './components/Header/Header'
import Catalog from './pages/Catalog/Catalog'
import Cart from './pages/Cart/Cart'
import Order from './pages/Order/Order'
import Account from './pages/Account/Account'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'


export default function App() {
  return (
    <AuthProvider>

      <Header/>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/account" element={<Account />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>

    </AuthProvider>
  )
}