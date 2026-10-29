import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'

const empty = {
  name: '', productId: '', category: '', buyingPrice: '',
  quantity: '', unit: '', expiry: '', threshold: '', image: '',
}

const fields = [
  ['name', 'Product Name', 'Enter product name', 'text'],
  ['productId', 'Product ID', 'Enter product ID', 'text'],
  ['category', 'Category', 'Select product category', 'text'],
  ['buyingPrice', 'Buying Price', 'Enter buying price', 'number'],
  ['quantity', 'Quantity', 'Enter product quantity', 'number'],
  ['unit', 'Unit', 'Enter product unit', 'text'],
  ['expiry', 'Expiry Date', 'Enter expiry date', 'date'],
  ['threshold', 'Threshold Value', 'Enter threshold value', 'number'],
]

export default function AddProductModal({ onClose }) {
  const { addProduct } = useInventory()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const readImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => set('image', reader.result)
    reader.readAsDataURL(file)
  }

  const submit = () => {
    const required = ['name', 'productId', 'category', 'buyingPrice', 'quantity', 'threshold']
    if (required.some((k) => String(form[k]).trim() === '')) {
      setError("Iltimos, majburiy maydonlarni to'ldiring")
      return
    }
    addProduct({
      ...form,
      buyingPrice: Number(form.buyingPrice),
      quantity: Number(form.quantity),
      threshold: Number(form.threshold),
      unit: form.unit || 'Packets',
    })
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>New Product</h3>

        <label
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); readImage(e.dataTransfer.files[0]) }}
        >
          {form.image ? (
            <img src={form.image} alt="preview" />
          ) : (
            <span>Drag image here<br />or <b className="link">Browse image</b></span>
          )}
          <input type="file" accept="image/*" hidden onChange={(e) => readImage(e.target.files[0])} />
        </label>

        {fields.map(([key, label, ph, type]) => (
          <div className="form-row" key={key}>
            <label>{label}</label>
            <input
              type={type}
              min={type === 'number' ? 0 : undefined}
              placeholder={ph}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        ))}

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Discard</button>
          <button className="btn primary" onClick={submit}>Add Product</button>
        </div>
      </div>
    </div>
  )
}