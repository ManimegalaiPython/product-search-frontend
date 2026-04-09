// SearchBar.jsx
// Matches YOUR Django backend exactly:
//   URL:    GET /api/products/
//   Params: search=..., category=...
//   Model:  name, description, category (CharField with choices), price, image, is_active
// No /api/categories/ or /api/brands/ endpoints needed — uses static choices from your model
import { useState, useEffect } from 'react';

// Debounce hook — no lodash needed
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Filter chip
function Chip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: '#0d0d0d', color: '#fff',
      fontSize: '11px', fontWeight: 600,
      padding: '4px 10px', borderRadius: '20px',
      fontFamily: 'monospace',
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#fff', fontSize: '13px', lineHeight: 1, padding: 0,
      }}>✕</button>
    </span>
  );
}

// Toggle switch
function Toggle({ checked, onChange, label }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      cursor: 'pointer', fontSize: '13px', color: '#374151',
      fontFamily: "'Sora', sans-serif", userSelect: 'none',
    }}>
      <div onClick={() => onChange(!checked)} style={{
        width: '36px', height: '20px', borderRadius: '10px',
        background: checked ? '#0d0d0d' : '#d1d5db',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: '3px',
          left: checked ? '19px' : '3px',
          width: '14px', height: '14px',
          background: '#fff', borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      {label}
    </label>
  );
}

// ── CATEGORY_CHOICES from your Django model ───────────────────────────────────
const CATEGORIES = ['Electronics', 'Beauty', 'Clothing'];

function SearchBar({ onSearch }) {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('');
  const [focused,  setFocused]  = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  // Fire onSearch every time debounced query or category changes
  useEffect(() => {
    onSearch({ search: debouncedQuery, category });
  }, [debouncedQuery, category]);

  const clearAll = () => { setQuery(''); setCategory(''); };
  const hasFilters = category;

  // Active chips
  const chips = [
    category && { label: category, clear: () => setCategory('') },
  ].filter(Boolean);

  const selectStyle = {
    padding: '9px 30px 9px 12px',
    border: '1.5px solid #e8e3db',
    borderRadius: '10px',
    fontSize: '13px',
    fontFamily: "'Sora', sans-serif",
    background: '#fafaf8',
    color: '#0d0d0d',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    minWidth: '160px',
  };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", marginBottom: '24px' }}>

      {/* ── Search input ── */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <svg style={{
          position: 'absolute', left: '14px', top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={focused ? '#0d0d0d' : '#9ca3af'} strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products by name, description, or category…"
          style={{
            width: '100%',
            padding: '14px 44px 14px 44px',
            border: `2px solid ${focused ? '#0d0d0d' : '#e8e3db'}`,
            borderRadius: '12px',
            fontSize: '15px',
            fontFamily: "'Sora', sans-serif",
            background: '#fff',
            color: '#0d0d0d',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(13,13,13,0.08)' : 'none',
          }}
        />

        {query && (
          <button onClick={() => setQuery('')} style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)',
            background: '#f0ede8', border: 'none', cursor: 'pointer',
            color: '#78716c', fontSize: '13px',
            width: '26px', height: '26px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        )}
      </div>

      {/* ── Filter row ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end',
        padding: '14px 16px',
        background: '#fff',
        borderRadius: '12px',
        border: '1.5px solid #e8e3db',
      }}>

        {/* Category — matches CATEGORY_CHOICES in models.py */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{
            fontSize: '10px', color: '#9ca3af',
            fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={selectStyle}
          >
            <option value="">All categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Live search hint */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 12px',
          background: '#f5f2ec', borderRadius: '8px',
          fontSize: '12px', color: '#78716c',
          fontFamily: 'monospace',
        }}>
          <span style={{ color: '#16a34a', fontSize: '8px' }}>●</span>
          Searches: name · description · category
        </div>

        {/* Clear all */}
        {hasFilters && (
          <button onClick={clearAll} style={{
            padding: '9px 14px',
            background: 'none',
            border: '1.5px solid #e8e3db',
            borderRadius: '8px',
            fontSize: '12px', fontWeight: 600,
            color: '#e85d2f', cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}>
            Clear all ✕
          </button>
        )}
      </div>

      {/* ── Active filter chips ── */}
      {chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', alignSelf: 'center', fontFamily: 'monospace' }}>
            Active:
          </span>
          {chips.map((chip, i) => (
            <Chip key={i} label={chip.label} onRemove={chip.clear} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
