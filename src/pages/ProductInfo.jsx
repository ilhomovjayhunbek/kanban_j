import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'
import { downloadFile } from '../utils'

const tabs = ['Overview', 'Purchases', 'Adjustments', 'History']

export default function ProductInfo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, updateProduct, deleteProduct } = useInventory()
  const product = products.find((p) => String(p.id) === id)

  const [tab, setTab] = useState('Overview')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)

  if (!product) {
    return (
      <section className="card">
        <p>Mahsulot topilmadi.</p>
        <Link to="/inventory">← Orqaga</Link>
      </section>
    )
  }

  const data = editing ? draft : product
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))

  const startEdit = () => { setDraft({ ...product }); setEditing(true) }
  const save = () => {
    updateProduct(product.id, {
      ...draft,
      quantity: Number(draft.quantity),
      threshold: Number(draft.threshold),
      buyingPrice: Number(draft.buyingPrice),
    })
    setEditing(false)
  }
  const remove = () => {
    if (confirm("Mahsulotni o'chirmoqchimisiz?")) {
      deleteProduct(product.id)
      navigate('/inventory')
    }
  }

  const Field = ({ label, k, type = 'text' }) => (
    <div className="info-row">
      <span>{label}</span>
      {editing ? (
        <input type={type} value={data[k]} onChange={(e) => set(k, e.target.value)} />
      ) : (
        <b>{data[k]}</b>
      )}
    </div>
  )

  return (
    <section className="card">
      <div className="card-head">
        <h2>{product.name}</h2>
        <div className="actions">
          {editing ? (
            <>
              <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn primary" onClick={save}>Save</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={startEdit}>✎ Edit</button>
              <button className="btn" onClick={() => downloadFile(`${product.name}.json`, JSON.stringify(product, null, 2), 'application/json')}>Download</button>
              <button className="btn danger" onClick={remove}>Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab !== 'Overview' ? (
        <p className="empty">{tab} bo'yicha hozircha ma'lumot yo'q.</p>
      ) : (
        <div className="info-grid">
          <div>
            <h4>Primary Details</h4>
            <Field label="Product name" k="name" />
            <Field label="Product ID" k="productId" />
            <Field label="Product category" k="category" />
            <Field label="Expiry Date" k="expiry" type="date" />
            <Field label="Threshold Value" k="threshold" type="number" />

            <h4>Supplier Details</h4>
            <Field label="Supplier name" k="supplier" />
            <Field label="Contact Number" k="contact" />

            <h4>Stock Locations</h4>
            <table>
              <thead><tr><th>Store Name</th><th style={{ textAlign: 'right' }}>Stock in hand</th></tr></thead>
              <tbody>
                {product.stores.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td style={{ textAlign: 'right' }} className="link">{s.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="img-box">
              {product.image ? <img src={product.image} alt={product.name} /> : <span>Rasm yo'q</span>}
            </div>
            <div className="info-row"><span>Opening Stock</span><b>{product.opening}</b></div>
            <Field label="Remaining Stock" k="quantity" type="number" />
            <div className="info-row"><span>On the way</span><b>{product.onTheWay}</b></div>
            <div className="info-row"><span>Threshold value</span><b>{product.threshold}</b></div>
          </div>
        </div>
      )}
    </section>
  )
}