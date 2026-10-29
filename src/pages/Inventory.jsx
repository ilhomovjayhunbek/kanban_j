import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'
import AddProductModal from '../components/AddProductModal'
import { fmtDate, getStatus, downloadFile } from '../utils'

const PAGE_SIZE = 8

export default function Inventory() {
  const { products, search } = useInventory()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const categories = [...new Set(products.map((p) => p.category))]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (p.name + p.productId + p.supplier).toLowerCase().includes(q)
    )
  }, [products, category, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const low = products.filter((p) => getStatus(p).key === 'low').length
  const out = products.filter((p) => getStatus(p).key === 'out').length
  const revenue = products.reduce((s, p) => s + p.buyingPrice * p.quantity, 0)

  const downloadAll = () => {
    const head = 'Name,Product ID,Category,Buying Price,Quantity,Unit,Threshold,Expiry\n'
    const body = products
      .map((p) =>
        [p.name, p.productId, p.category, p.buyingPrice, p.quantity, p.unit, p.threshold, p.expiry].join(',')
      )
      .join('\n')
    downloadFile('inventory.csv', head + body)
  }

  return (
    <>
      <section className="card">
        <h2>Overall Inventory</h2>
        <div className="stats">
          <div className="stat">
            <h4 className="blue">Categories</h4>
            <b>{categories.length}</b>
            <small>Last 7 days</small>
          </div>
          <div className="stat">
            <h4 className="orange">Total Products</h4>
            <div className="two"><b>{products.length}</b><b>₹{revenue}</b></div>
            <div className="two"><small>Last 7 days</small><small>Revenue</small></div>
          </div>
          <div className="stat">
            <h4 className="purple">Top Selling</h4>
            <div className="two"><b>5</b><b>₹2500</b></div>
            <div className="two"><small>Last 7 days</small><small>Cost</small></div>
          </div>
          <div className="stat">
            <h4 className="red">Low Stocks</h4>
            <div className="two"><b>{low}</b><b>{out}</b></div>
            <div className="two"><small>Ordered</small><small>Not in stock</small></div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Products</h2>
          <div className="actions">
            <button className="btn primary" onClick={() => setShowModal(true)}>Add Product</button>
            <div className="filter-wrap">
              <button className="btn" onClick={() => setShowFilter((v) => !v)}>⚲ Filters</button>
              {showFilter && (
                <div className="dropdown">
                  <label>Category</label>
                  <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }}>
                    <option value="">Hammasi</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>
            <button className="btn" onClick={downloadAll}>Download all</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Products</th><th>Buying Price</th><th>Quantity</th>
              <th>Threshold Value</th><th>Expiry Date</th><th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const s = getStatus(p)
              return (
                <tr key={p.id} className="row" onClick={() => navigate(`/inventory/${p.id}`)}>
                  <td>{p.name}</td>
                  <td>₹{p.buyingPrice}</td>
                  <td>{p.quantity} {p.unit}</td>
                  <td>{p.threshold} {p.unit}</td>
                  <td>{fmtDate(p.expiry)}</td>
                  <td className={`st-${s.key}`}>{s.label}</td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan="6" className="empty">Mahsulot topilmadi</td></tr>
            )}
          </tbody>
        </table>

        <div className="pager">
          <button className="btn" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
          <span>Page {current} of {totalPages}</span>
          <button className="btn" disabled={current === totalPages} onClick={() => setPage(current + 1)}>Next</button>
        </div>
      </section>

      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
    </>
  )
}