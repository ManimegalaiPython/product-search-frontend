// App.jsx  ── upgraded for new model
// Endpoint: GET http://127.0.0.1:8000/api/products/
// Params:   search= | category= | brand= | min_price= | max_price=
//           min_rating= | in_stock= | sort_by= | is_featured=
import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar   from './components/SearchBar';
import ProductList from './components/ProductList';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://manipython3.pythonanywhere.com/api';
const PRODUCTS_URL = `${API_BASE}/products/`;
const CATS_URL     = `${API_BASE}/categories/`;
const BRANDS_URL   = `${API_BASE}/brands/`;
const STATS_URL    = `${API_BASE}/stats/`;

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first'    },
  { value: 'price_asc',  label: 'Price: Low → High'},
  { value: 'price_desc', label: 'Price: High → Low'},
  { value: 'rating',     label: 'Top rated'        },
  { value: 'name',       label: 'A → Z'            },
];

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  // ── Results ──
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [total,     setTotal]     = useState(0);

  // ── Filter state ──
  const [query,      setQuery]     = useState('');
  const [category,   setCategory]  = useState('');
  const [brand,      setBrand]     = useState('');
  const [minPrice,   setMinPrice]  = useState('');
  const [maxPrice,   setMaxPrice]  = useState('');
  const [minRating,  setMinRating] = useState('');
  const [inStock,    setInStock]   = useState(false);
  const [featured,   setFeatured]  = useState(false);
  const [sortBy,     setSortBy]    = useState('newest');

  // ── Sidebar option lists ──
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [stats,      setStats]      = useState(null);

  // ── Debounced search query (420ms) ──
  const debouncedQuery = useDebounce(query, 420);
  const abortRef = useRef(null);

  // ── Load filter options once ──
  useEffect(() => {
    fetch(CATS_URL)
      .then(r => r.json())
      .then(d => setCategories(Array.isArray(d) ? d : d.results || []))
      .catch(() => {});
    fetch(BRANDS_URL)
      .then(r => r.json())
      .then(d => setBrands(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch(STATS_URL)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  // ── Fetch products ──
  const fetchProducts = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const params = new URLSearchParams();
    if (debouncedQuery) params.set('search', debouncedQuery);
    if (category)       params.set('category', category);
    if (brand)          params.set('brand', brand);
    if (minPrice)       params.set('min_price', minPrice);
    if (maxPrice)       params.set('max_price', maxPrice);
    if (minRating)      params.set('min_rating', minRating);
    if (inStock)        params.set('in_stock', 'true');
    if (featured)       params.set('is_featured', 'true');
    params.set('sort_by', sortBy);

    setLoading(true);
    setError('');

    fetch(`${PRODUCTS_URL}?${params}`, { signal: abortRef.current.signal })
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); })
      .then(data => {
        const results = Array.isArray(data) ? data : (data.results || []);
        setProducts(results);
        setTotal(Array.isArray(data) ? data.length : (data.count ?? results.length));
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(
          `Cannot reach Django API.\n\n` +
          `Make sure:\n` +
          `  1.  python manage.py runserver   is running\n` +
          `  2.  django-cors-headers is installed & configured\n` +
          `  3.  urlpatterns has  path('api/', include('searchapp.urls'))\n\n` +
          `Error: ${err.message}`
        );
        setProducts([]); setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, category, brand, minPrice, maxPrice, minRating, inStock, featured, sortBy]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetFilters = () => {
    setQuery(''); setCategory(''); setBrand('');
    setMinPrice(''); setMaxPrice(''); setMinRating('');
    setInStock(false); setFeatured(false); setSortBy('newest');
  };

  const activeFilterCount = [
    category, brand, minPrice, maxPrice, minRating,
    inStock && 'x', featured && 'x',
  ].filter(Boolean).length;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #f5f2ec; color: #0d0d0d; min-height: 100vh; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #d1cdc4; border-radius: 3px; }
        input[type=range] { accent-color: #e85d2f; }
        input[type=checkbox] { accent-color: #e85d2f; width: 14px; height: 14px; cursor: pointer; }
        select { font-family: 'Sora', sans-serif; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: '#0d0d0d', color: '#fff',
        padding: '0 28px', height: '58px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 300,
        borderBottom: '2.5px solid #e85d2f',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
            ⚡ SearchKit
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: '9px', fontWeight: 700,
            background: '#e85d2f', padding: '3px 8px', borderRadius: '3px',
            letterSpacing: '.12em', color: '#fff',
          }}>ECOMMERCE</span>
        </div>

        {/* Stats pills */}
        {stats && (
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Products', val: stats.total_products },
              { label: 'In Stock', val: stats.in_stock },
              { label: 'Featured', val: stats.featured },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e85d2f' }}>{s.val}</div>
                <div style={{ fontSize: '9px', color: '#6b7280', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'monospace' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* API status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '8px',
            color: error ? '#dc2626' : loading ? '#f59e0b' : '#16a34a',
          }}>●</span>
          <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>
            {error ? 'API offline' : loading ? 'fetching…' : `${total} results`}
          </span>
        </div>
      </header>

      {/* ── Page Layout ── */}
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 20px', display: 'flex', gap: '22px', alignItems: 'flex-start' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: '240px', flexShrink: 0,
          background: '#fff', borderRadius: '16px',
          border: '1.5px solid #e8e3db',
          padding: '20px 18px',
          display: 'flex', flexDirection: 'column', gap: '22px',
          position: 'sticky', top: '74px',
          fontFamily: "'Sora', sans-serif",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Filters</span>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} style={{
                background: '#fef2f2', border: 'none', borderRadius: '6px',
                padding: '3px 9px', fontSize: '11px', fontWeight: 600,
                color: '#dc2626', cursor: 'pointer',
              }}>
                Reset {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            )}
          </div>

          {/* Category */}
          <FilterSection title="Category">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={selectStyle}
            >
              <option value="">All categories</option>
              {categories.map(c => (
                <option key={c.id || c.name} value={c.slug || c.name}>{c.name}</option>
              ))}
            </select>
          </FilterSection>

          {/* Brand */}
          <FilterSection title="Brand">
            <select value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle}>
              <option value="">All brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </FilterSection>

          {/* Price range */}
          <FilterSection title="Price Range">
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="number" placeholder="Min ₹"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{ ...inputStyle, width: '50%' }}
              />
              <span style={{ color: '#a8a29e', fontSize: '12px' }}>–</span>
              <input
                type="number" placeholder="Max ₹"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ ...inputStyle, width: '50%' }}
              />
            </div>
          </FilterSection>

          {/* Min rating */}
          <FilterSection title={`Min Rating: ${minRating || '0'}★`}>
            <input
              type="range" min="0" max="5" step="0.5"
              value={minRating || 0}
              onChange={e => setMinRating(e.target.value === '0' ? '' : e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a8a29e', fontFamily: 'monospace' }}>
              <span>0</span><span>2.5</span><span>5</span>
            </div>
          </FilterSection>

          {/* Toggles */}
          <FilterSection title="Options">
            <label style={checkLabelStyle}>
              <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
              In stock only
            </label>
            <label style={{ ...checkLabelStyle, marginTop: '8px' }}>
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              Featured only
            </label>
          </FilterSection>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Search + sort bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <SearchBar
                onSearch={({ search }) => setQuery(search || '')}
                initialValue={query}
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                ...selectStyle,
                height: '44px', minWidth: '170px',
                borderRadius: '12px', fontSize: '13px',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {category  && <FilterPill label={`Category: ${category}`}   onRemove={() => setCategory('')} />}
              {brand     && <FilterPill label={`Brand: ${brand}`}         onRemove={() => setBrand('')} />}
              {minPrice  && <FilterPill label={`Min ₹${minPrice}`}         onRemove={() => setMinPrice('')} />}
              {maxPrice  && <FilterPill label={`Max ₹${maxPrice}`}         onRemove={() => setMaxPrice('')} />}
              {minRating && <FilterPill label={`${minRating}★+`}           onRemove={() => setMinRating('')} />}
              {inStock   && <FilterPill label="In stock"                   onRemove={() => setInStock(false)} />}
              {featured  && <FilterPill label="Featured"                   onRemove={() => setFeatured(false)} />}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1.5px solid #fecaca',
              borderRadius: '12px', padding: '16px 20px', marginBottom: '18px',
            }}>
              <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: '8px', fontSize: '13px' }}>
                ⚠️ Connection Error
              </p>
              <pre style={{
                fontSize: '11px', color: '#7f1d1d', whiteSpace: 'pre-wrap',
                fontFamily: 'monospace', background: '#fee2e2',
                padding: '10px 12px', borderRadius: '8px',
              }}>{error}</pre>
            </div>
          )}

          {/* Product list */}
          <ProductList
            products={products}
            loading={loading}
            total={total}
            query={query}
            onClear={resetFilters}
          />
        </main>
      </div>
    </>
  );
}

/* ── Small helpers ── */
function FilterSection({ title, children }) {
  return (
    <div>
      <p style={{
        fontSize: '9px', fontWeight: 700, color: '#a8a29e',
        textTransform: 'uppercase', letterSpacing: '.1em',
        fontFamily: 'monospace', marginBottom: '8px',
      }}>{title}</p>
      {children}
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: '#0d0d0d', color: '#fff',
      fontSize: '11px', fontWeight: 600,
      padding: '3px 10px', borderRadius: '20px',
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#9ca3af', fontSize: '14px', lineHeight: 1, padding: 0,
      }}>×</button>
    </span>
  );
}

const selectStyle = {
  width: '100%', padding: '8px 10px',
  border: '1.5px solid #e8e3db', borderRadius: '8px',
  fontSize: '12px', background: '#faf8f5', color: '#0d0d0d',
  outline: 'none', cursor: 'pointer',
};

const inputStyle = {
  padding: '7px 9px',
  border: '1.5px solid #e8e3db', borderRadius: '8px',
  fontSize: '12px', background: '#faf8f5', color: '#0d0d0d',
  outline: 'none', fontFamily: "'Sora', sans-serif",
};

const checkLabelStyle = {
  display: 'flex', alignItems: 'center', gap: '8px',
  fontSize: '12px', cursor: 'pointer', color: '#374151',
};
