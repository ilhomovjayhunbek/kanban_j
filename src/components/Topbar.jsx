import { useNavigate } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'

export default function Topbar() {
  const { search, setSearch } = useInventory()
  const navigate = useNavigate()
  return (
    <header className="topbar">
      <input
        className="search"
        placeholder="🔍  Search product, supplier, order"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          navigate('/inventory')
        }}
      />
      <div className="top-right">
        <span>🔔</span>
        <div className="avatar" />
      </div>
    </header>
  )
}