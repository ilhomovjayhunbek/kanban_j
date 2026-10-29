import { createContext, useContext, useEffect, useState } from 'react'

const make = (id, name, price, qty, thr, expiry, category) => ({
  id, name, productId: String(456560 + id), category,
  buyingPrice: price, quantity: qty, unit: 'Packets',
  expiry, threshold: thr, supplier: 'Ronald Martin', contact: '98789 86757',
  image: '', opening: qty + 5, onTheWay: 15,
  stores: [
    { name: 'Sulur Branch', stock: Math.floor(qty / 2) },
    { name: 'Singanallur Branch', stock: qty - Math.floor(qty / 2) },
  ],
})

const seed = [
  make(1, 'Maggi', 430, 43, 12, '2022-12-11', 'Instant food'),
  make(2, 'Bru', 257, 0, 12, '2022-12-21', 'Beverages'),
  make(3, 'Red Bull', 405, 36, 9, '2022-12-05', 'Beverages'),
  make(4, 'Bourn Vita', 502, 14, 6, '2022-12-08', 'Beverages'),
  make(5, 'Horlicks', 530, 5, 5, '2023-01-09', 'Beverages'),
  make(6, 'Harpic', 605, 10, 5, '2023-01-09', 'Cleaning'),
  make(7, 'Ariel', 408, 0, 7, '2023-12-15', 'Cleaning'),
  make(8, 'Scotch Brite', 359, 43, 8, '2023-06-06', 'Cleaning'),
  make(9, 'Coca cola', 205, 8, 10, '2022-11-11', 'Beverages'),
]

const Ctx = createContext()
export const useInventory = () => useContext(Ctx)

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('products')
      return saved ? JSON.parse(saved) : seed
    } catch {
      return seed
    }
  })
  const [search, setSearch] = useState('')

  useEffect(() => {
    try { localStorage.setItem('products', JSON.stringify(products)) } catch {}
  }, [products])

  const addProduct = (data) => {
    const id = Date.now()
    setProducts((prev) => [
      {
        ...data, id,
        supplier: 'Ronald Martin', contact: '98789 86757',
        opening: Number(data.quantity), onTheWay: 0,
        stores: [{ name: 'Sulur Branch', stock: Number(data.quantity) }],
      },
      ...prev,
    ])
  }
  const updateProduct = (id, data) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))

  return (
    <Ctx.Provider value={{ products, search, setSearch, addProduct, updateProduct, deleteProduct }}>
      {children}
    </Ctx.Provider>
  )
}