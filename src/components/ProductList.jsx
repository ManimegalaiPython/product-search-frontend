// ProductList.jsx
// Handles 3 states: loading (skeleton), empty, loaded grid
import ProductCard from './ProductCard';

function SkeletonCard() {
  const s = {
    background: 'linear-gradient(90deg,#f0ede8 25%,#e8e3db 50%,#f0ede8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.6s ease-in-out infinite',
    borderRadius: '8px',
  };
  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1.5px solid #e8e3db', overflow: 'hidden',
    }}>
      <div style={{ height: '200px', ...s, borderRadius: 0 }} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '18px', width: '55px', ...s }} />
        <div style={{ height: '15px', width: '90%', ...s }} />
        <div style={{ height: '13px', width: '70%', ...s }} />
        <div style={{ height: '13px', width: '80%', ...s }} />
        <div style={{ height: '22px', width: '80px', ...s }} />
      </div>
      <div style={{ padding: '0 14px 14px' }}>
        <div style={{ height: '40px', ...s }} />
      </div>
    </div>
  );
}

function EmptyState({ query, onClear }) {
  return (
    <div style={{
      gridColumn: '1/-1',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '72px 24px', textAlign: 'center',
      fontFamily: "'Sora', sans-serif",
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: '#f5f2ec',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="#a8a29e" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0d0d0d' }}>
        No products found
      </h3>
      <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#78716c' }}>
        {query
          ? <>No results for <strong>"{query}"</strong> — try different keywords.</>
          : 'No products available. Try adding some via Django Admin.'}
      </p>
      {onClear && (
        <button onClick={onClear} style={{
          marginTop: '20px', padding: '10px 24px',
          background: '#0d0d0d', color: '#fff',
          border: 'none', borderRadius: '10px',
          fontSize: '13px', fontWeight: 600,
          fontFamily: "'Sora', sans-serif", cursor: 'pointer',
        }}>
          Clear filters
        </button>
      )}
    </div>
  );
}

function ProductList({ products, loading, total = 0, query = '', onClear }) {
  // Inject CSS animations
  if (typeof document !== 'undefined' && !document.getElementById('pl-style')) {
    const s = document.createElement('style');
    s.id = 'pl-style';
    s.textContent = `
      @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    `;
    document.head.appendChild(s);
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Result count */}
      <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#78716c' }}>
        {loading
          ? <span style={{ color: '#9ca3af', fontFamily: 'monospace' }}>Searching…</span>
          : <><strong style={{ color: '#0d0d0d', fontWeight: 700 }}>{total}</strong>
            {' '}result{total !== 1 ? 's' : ''}
            {query && <> for <em style={{ color: '#0d0d0d' }}>"{query}"</em></>}
          </>
        }
      </p>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : !products || products.length === 0
            ? <EmptyState query={query} onClear={onClear} />
            : products.map((product, i) => (
                <div key={product.id} style={{
                  animation: 'fadeUp 0.3s ease both',
                  animationDelay: `${Math.min(i * 0.04, 0.28)}s`,
                }}>
                  <ProductCard product={product} />
                </div>
              ))
        }
      </div>
    </div>
  );
}

export default ProductList;
