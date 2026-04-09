// ProductCard.jsx  ── upgraded for new model
// Model fields used: name, description, category_name, price,
//                    rating, stock, in_stock, brand, image, is_featured
import { useState } from 'react';

const CAT_STYLES = {
  Electronics: { bg: '#0d0d0d', text: '#ffffff', dot: '#60a5fa' },
  Beauty:      { bg: '#1a0a14', text: '#f9a8d4', dot: '#f472b6' },
  Clothing:    { bg: '#0a1a0a', text: '#86efac', dot: '#4ade80' },
};
const DEFAULT_CAT = { bg: '#1a1a1a', text: '#d4d0c8', dot: '#a8a29e' };

function StarRating({ rating }) {
  const clamped = Math.max(0, Math.min(5, rating || 0));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={{ display: 'flex', gap: '1px' }}>
        {[1, 2, 3, 4, 5].map(s => {
          const fill = clamped >= s ? 1 : clamped >= s - 0.5 ? 0.5 : 0;
          return (
            <svg key={s} width="13" height="13" viewBox="0 0 24 24"
              fill={fill === 1 ? '#f59e0b' : fill === 0.5 ? 'url(#half)' : 'none'}
              stroke="#f59e0b" strokeWidth="1.5"
            >
              {fill === 0.5 && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          );
        })}
      </div>
      <span style={{ fontSize: '11px', color: '#a8a29e', fontFamily: 'monospace' }}>
        {clamped.toFixed(1)}
      </span>
    </div>
  );
}

function StockBar({ stock }) {
  const pct = Math.min(100, (stock / 50) * 100);
  const color = stock === 0 ? '#dc2626' : stock < 10 ? '#f59e0b' : '#22c55e';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '10px', color: '#78716c', fontFamily: 'monospace', letterSpacing: '.04em' }}>
          STOCK
        </span>
        <span style={{ fontSize: '10px', fontWeight: 700, color, fontFamily: 'monospace' }}>
          {stock === 0 ? 'OUT' : `${stock} left`}
        </span>
      </div>
      <div style={{ height: '3px', background: '#e8e3db', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: '2px',
          transition: 'width .4s ease',
        }} />
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [added,   setAdded]   = useState(false);
  const [imgErr,  setImgErr]  = useState(false);

  const cat    = product.category_name || product.category || '';
  const style  = CAT_STYLES[cat] || DEFAULT_CAT;
  const canBuy = product.in_stock ?? product.stock > 0;
  const imgSrc = !imgErr && product.image ? product.image : null;

  const handleAdd = () => {
    if (!canBuy) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: `1.5px solid ${hovered ? '#a8a29e' : '#e8e3db'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color .2s, transform .25s, box-shadow .25s',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,.12)'
          : '0 2px 8px rgba(0,0,0,.04)',
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* ── Image ── */}
      <div style={{
        position: 'relative', height: '210px',
        background: '#f5f2ec', overflow: 'hidden', flexShrink: 0,
      }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgErr(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform .45s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#c4b5a0', gap: '8px',
          }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style={{ fontSize: '10px', letterSpacing: '.08em' }}>NO IMAGE</span>
          </div>
        )}

        {/* Featured ribbon */}
        {product.is_featured && (
          <div style={{
            position: 'absolute', top: '12px', right: '-28px',
            background: '#e85d2f', color: '#fff',
            fontSize: '9px', fontWeight: 800,
            padding: '4px 36px', letterSpacing: '.1em',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
          }}>FEATURED</div>
        )}

        {/* Out of stock overlay */}
        {!canBuy && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              color: '#fff', fontSize: '11px', fontWeight: 700,
              letterSpacing: '.12em', textTransform: 'uppercase',
              border: '1.5px solid rgba(255,255,255,.5)',
              padding: '5px 16px', borderRadius: '4px',
            }}>Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '9px' }}>

        {/* Category + Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{
            display: 'inline-block',
            background: style.bg, color: style.text,
            fontSize: '9px', fontWeight: 700,
            padding: '3px 8px', borderRadius: '20px',
            letterSpacing: '.08em', textTransform: 'uppercase',
            fontFamily: 'monospace',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
            {cat || 'Uncategorised'}
          </span>
          {product.brand && (
            <span style={{
              fontSize: '9px', color: '#a8a29e', fontFamily: 'monospace',
              letterSpacing: '.05em', textTransform: 'uppercase',
            }}>{product.brand}</span>
          )}
        </div>

        {/* Name */}
        <h3 style={{
          margin: 0, fontSize: '14px', fontWeight: 700,
          color: '#0d0d0d', lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        {/* Description */}
        <p style={{
          margin: 0, fontSize: '12px', color: '#78716c',
          lineHeight: 1.6, flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Real star rating from model */}
        <StarRating rating={product.rating} />

        {/* Stock bar */}
        <StockBar stock={product.stock ?? 0} />

        {/* Price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
          <span style={{
            fontSize: '21px', fontWeight: 800,
            color: '#0d0d0d', letterSpacing: '-0.03em',
          }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 700, fontFamily: 'monospace',
            color: canBuy ? '#16a34a' : '#dc2626',
            letterSpacing: '.06em',
          }}>
            ● {canBuy ? 'IN STOCK' : 'SOLD OUT'}
          </span>
        </div>
      </div>

      {/* ── CTA button ── */}
      <div style={{ padding: '0 14px 14px' }}>
        <button
          onClick={handleAdd}
          disabled={!canBuy}
          style={{
            width: '100%', padding: '11px',
            border: 'none', borderRadius: '10px',
            fontSize: '13px', fontWeight: 700,
            fontFamily: "'Sora', sans-serif",
            letterSpacing: '.02em',
            cursor: canBuy ? 'pointer' : 'not-allowed',
            background: added
              ? '#16a34a'
              : canBuy ? '#0d0d0d' : '#f1ede8',
            color: canBuy ? '#fff' : '#a8a29e',
            transition: 'background .25s, transform .1s',
            transform: hovered && canBuy ? 'scale(1.01)' : 'scale(1)',
          }}
        >
          {added ? '✓  Added to Cart!' : canBuy ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}