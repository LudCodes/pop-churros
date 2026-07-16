import { useMemo, useState } from "react";
import {
  MapPin, Search, User, ShoppingBag, ChevronDown, Plus, Minus, X,
  Check, Trash2, ChevronDown as ChevronDownSm,
} from "lucide-react";

/**
 * Design tokens
 * ink       #2B1B12  — warm near-black, base text / top bar
 * cream     #FBF3E7  — page background
 * paper     #FFFFFF  — card surface
 * ember     #D62828  — brand red, primary accent / CTA
 * marigold  #F4C430  — brand yellow, secondary accent
 * toasted   #C97B3C  — caramel accent, used in swatches
 * success   #2E7D32  — "added to quote" check state
 * line      rgba(43,27,18,.12) — hairline borders
 */

const CATEGORIES = [
  { id: "mesas", name: "Mesas e Cadeiras", count: 412, pattern: "weave", tone: "toasted" },
  { id: "toalhas", name: "Toalhas e Sousplats", count: 238, pattern: "stripe", tone: "marigold" },
  { id: "loucas", name: "Louças e Taças", count: 301, pattern: "rim", tone: "ink" },
  { id: "decor", name: "Decoração e Arranjos", count: 156, pattern: "scatter", tone: "ember" },
  { id: "estruturas", name: "Estruturas e Tendas", count: 64, pattern: "stripe", tone: "ink" },
  { id: "som", name: "Som e Iluminação", count: 98, pattern: "scatter", tone: "toasted" },
  { id: "churros", name: "Carrinho de Churros", count: 78, pattern: "swirl", tone: "ember" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Jogo de Mesa Redonda (1,40m) com 8 Cadeiras Tiffany Imbuia",
    cat: "mesas",
    price: 64,
    kit: [
      { name: "Tampo de Mesa 1,40m Redonda sem suporte", qty: 1 },
      { name: "Cavalete de Metal para Base de Mesa Tampo", qty: 1 },
      { name: "Cadeira Tiffany Madeira Imbuia", qty: 8 },
    ],
  },
  { id: 2, name: "Cadeira Tiffany Dourada c/ Coxim", cat: "mesas", price: 9 },
  { id: 3, name: "Toalha Redonda Cetim Marfim 3,00m", cat: "toalhas", price: 22 },
  { id: 4, name: "Sousplat Rattan Natural", cat: "toalhas", price: 4 },
  { id: 5, name: "Taça Cristal Colorida (kit 10un)", cat: "loucas", price: 30 },
  { id: 6, name: "Jogo de Louça Branca Borda Dourada", cat: "loucas", price: 45 },
  { id: 7, name: "Arranjo de Mesa Floral Rústico", cat: "decor", price: 38 },
  { id: 8, name: "Painel de Flores 2x2m", cat: "decor", price: 180 },
  { id: 9, name: "Tenda Piramidal 6x6m", cat: "estruturas", price: 420 },
  { id: 10, name: "Caixa de Som Ativa 15\" + Microfone", cat: "som", price: 150 },
  { id: 11, name: "Carrinho de Churros Completo + Operador", cat: "churros", price: 690 },
  { id: 12, name: "Mini Carrinho de Churros Doces", cat: "churros", price: 390 },
];

const EMPTY_EVENT = {
  pickupDate: "", pickupTime: "", returnDate: "", returnTime: "", whatsapp: "",
};

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Swatch({ pattern, tone }) {
  return <div className={`swatch swatch--${pattern} tone--${tone}`} aria-hidden="true" />;
}

export default function CatalogoPopChurros() {
  const [view, setView] = useState("catalog"); // 'catalog' | 'cart'
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [quote, setQuote] = useState([]);
  const [eventInfo, setEventInfo] = useState(EMPTY_EVENT);
  const [eventSaved, setEventSaved] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [email, setEmail] = useState("");

  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

  const visible = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.cat === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const quoteCount = quote.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = quote.reduce((sum, i) => sum + i.qty * i.price, 0);

  function addToQuote(product) {
    const isFirstItem = quote.length === 0;
    setQuote((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...current, { ...product, qty: 1 }];
    });
    if (isFirstItem && !eventSaved) {
      setShowEventModal(true);
    }
  }

  function changeQty(id, delta) {
    setQuote((current) =>
      current.flatMap((i) => {
        if (i.id !== id) return [i];
        const qty = i.qty + delta;
        return qty > 0 ? [{ ...i, qty }] : [];
      })
    );
  }

  function removeItem(id) {
    setQuote((current) => current.filter((i) => i.id !== id));
  }

  function saveEventInfo(e) {
    e.preventDefault();
    setEventSaved(true);
    setShowEventModal(false);
  }

  return (
    <div className="pc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        .pc-root {
          --ink: #2B1B12;
          --cream: #FBF3E7;
          --paper: #FFFFFF;
          --ember: #D62828;
          --marigold: #F4C430;
          --toasted: #C97B3C;
          --success: #2E7D32;
          --line: rgba(43,27,18,0.12);
          font-family: 'Inter', sans-serif;
          background: var(--cream);
          color: var(--ink);
          min-height: 100vh;
        }
        .pc-root * { box-sizing: border-box; }

        .topbar {
          background: var(--ink);
          color: var(--cream);
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .topbar .dot { opacity: 0.5; margin: 0 4px; }

        .header {
          background: var(--paper);
          border-bottom: 1px solid var(--line);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 20px;
          white-space: nowrap;
          cursor: pointer;
          background: none;
          border: none;
          color: inherit;
        }
        .logo-mark {
          width: 36px; height: 36px; border-radius: 50%;
          background: conic-gradient(from 200deg, var(--ember), var(--marigold), var(--toasted), var(--ember));
          flex-shrink: 0;
        }
        .search-wrap {
          flex: 1;
          min-width: 220px;
          position: relative;
        }
        .search-wrap input {
          width: 100%;
          padding: 11px 16px 11px 42px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--cream);
          font-family: inherit;
          font-size: 14px;
          color: var(--ink);
          outline: none;
        }
        .search-wrap input:focus { border-color: var(--ember); }
        .search-wrap svg {
          position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
          color: var(--ink); opacity: 0.5;
        }
        .header-actions { display: flex; align-items: center; gap: 10px; }
        .icon-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid var(--line); background: var(--paper);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; color: var(--ink);
        }
        .icon-btn:hover { border-color: var(--ink); }
        .badge {
          position: absolute; top: -4px; right: -4px;
          background: var(--ember); color: white;
          font-size: 10px; font-weight: 700;
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .nav {
          padding: 10px 24px;
          display: flex; gap: 10px;
          border-bottom: 1px solid var(--line);
          font-size: 14px; font-weight: 600;
          background: var(--paper);
        }
        .nav button {
          border: none; background: none; cursor: pointer;
          font: inherit; opacity: 0.55; padding: 8px 16px; border-radius: 999px;
        }
        .nav button.active { opacity: 1; background: var(--ink); color: var(--cream); }

        .crumb {
          max-width: 1180px; margin: 0 auto;
          padding: 20px 24px 0;
          font-size: 13px; opacity: 0.6;
        }
        .crumb b { color: var(--ink); opacity: 1; }

        .layout {
          max-width: 1180px; margin: 0 auto;
          padding: 16px 24px 64px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 32px;
        }
        @media (max-width: 760px) {
          .layout { grid-template-columns: 1fr; }
        }

        .sidebar-title {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          opacity: 0.5; margin-bottom: 10px; font-weight: 600;
        }
        .cat-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 12px; border-radius: 10px; margin-bottom: 4px;
          font-size: 14px; cursor: pointer; font-weight: 500;
        }
        .cat-item:hover { background: rgba(43,27,18,0.05); }
        .cat-item.active { background: var(--ink); color: var(--cream); font-weight: 700; }
        .cat-item .n { opacity: 0.55; font-size: 12px; }
        .cat-item.active .n { opacity: 0.7; }

        .main-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 20px; gap: 16px; flex-wrap: wrap;
        }
        .main-head h1 {
          font-family: 'Fraunces', serif; font-size: 28px; margin: 0 0 4px;
          font-weight: 600;
        }
        .main-head p { margin: 0; font-size: 13px; opacity: 0.6; }
        .sort {
          display: flex; align-items: center; gap: 6px;
          border: 1px solid var(--line); border-radius: 999px;
          padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

        .card {
          background: var(--paper);
          border-radius: 18px;
          overflow: visible;
          border: 1px solid var(--line);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(43,27,18,0.12); }

        .swatch { height: 148px; position: relative; border-radius: 18px 18px 0 0; }
        .tone--toasted { background: var(--toasted); }
        .tone--marigold { background: var(--marigold); }
        .tone--ink { background: var(--ink); }
        .tone--ember { background: var(--ember); }

        .swatch--weave { background-image:
          repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0 6px, transparent 6px 12px),
          repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0 6px, transparent 6px 12px); }
        .swatch--stripe { background-image:
          repeating-linear-gradient(115deg, rgba(255,255,255,0.22) 0 10px, transparent 10px 26px); }
        .swatch--rim { background-image:
          radial-gradient(circle at 22% 30%, rgba(255,255,255,0.35) 0 14px, transparent 15px),
          radial-gradient(circle at 68% 65%, rgba(255,255,255,0.25) 0 20px, transparent 21px),
          radial-gradient(circle at 85% 20%, rgba(255,255,255,0.3) 0 10px, transparent 11px); }
        .swatch--scatter { background-image:
          radial-gradient(rgba(255,255,255,0.5) 2.5px, transparent 3px);
          background-size: 18px 18px; }
        .swatch--swirl { background-image:
          repeating-radial-gradient(circle at 50% 120%, rgba(255,255,255,0.3) 0 8px, transparent 8px 16px); }

        .tag {
          position: absolute; left: 12px; bottom: -12px;
          background: var(--paper); color: var(--ink);
          font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
          padding: 4px 10px; border-radius: 999px;
          box-shadow: 0 2px 6px rgba(43,27,18,0.15);
        }

        .card-body { padding: 22px 16px 16px; position: relative; }
        .card-body h3 {
          font-size: 14px; font-weight: 600; line-height: 1.35;
          margin: 0 0 12px; min-height: 38px;
        }
        .card-foot { display: flex; align-items: center; justify-content: space-between; }
        .price { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .price small { font-size: 11px; font-weight: 400; opacity: 0.55; }
        .add-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--ink); color: var(--cream);
          border: none; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s ease;
          position: absolute; right: 16px; top: -18px;
          box-shadow: 0 4px 10px rgba(43,27,18,0.2);
        }
        .add-btn:hover { background: var(--ember); }
        .add-btn.added { background: var(--success); }

        /* ---- Modal: Quando é o seu evento? ---- */
        .overlay {
          position: fixed; inset: 0; background: rgba(43,27,18,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 20px;
        }
        .modal {
          width: min(440px, 100%); background: var(--cream);
          border-radius: 20px; padding: 28px; position: relative;
          box-shadow: 0 24px 60px rgba(43,27,18,0.3);
        }
        .modal-close {
          position: absolute; top: 18px; right: 18px;
          width: 30px; height: 30px; border-radius: 50%;
          border: none; background: var(--paper); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .modal h2 { font-family: 'Fraunces', serif; font-size: 20px; margin: 0 0 8px; }
        .modal-sub { font-size: 13px; opacity: 0.65; line-height: 1.5; margin: 0 0 22px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .field label {
          display: block; font-size: 12px; opacity: 0.6; margin-bottom: 6px; font-weight: 500;
        }
        .field input, .field select {
          width: 100%; padding: 10px 12px; border-radius: 10px;
          border: 1px solid var(--line); background: var(--paper);
          font-family: inherit; font-size: 14px; color: var(--ink); outline: none;
        }
        .field input:focus, .field select:focus { border-color: var(--ember); }
        .whatsapp-row { display: flex; gap: 8px; }
        .whatsapp-code {
          display: flex; align-items: center; gap: 4px;
          padding: 10px 10px; border-radius: 10px; border: 1px solid var(--line);
          background: var(--paper); font-size: 14px; white-space: nowrap;
        }
        .modal-actions {
          display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px;
        }
        .btn-outline {
          padding: 11px 20px; border-radius: 999px; border: 1px solid var(--line);
          background: var(--paper); font-weight: 600; font-size: 14px; cursor: pointer;
        }
        .btn-solid {
          padding: 11px 22px; border-radius: 999px; border: none;
          background: var(--ink); color: var(--cream); font-weight: 700; font-size: 14px; cursor: pointer;
        }
        .btn-solid:hover { background: var(--ember); }

        /* ---- Cart page ---- */
        .cart-layout {
          max-width: 1180px; margin: 0 auto;
          padding: 24px 24px 64px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 860px) { .cart-layout { grid-template-columns: 1fr; } }

        .cart-title h1 {
          font-family: 'Fraunces', serif; font-size: 30px; margin: 0 0 4px; font-weight: 600;
        }
        .cart-title p { margin: 0 0 20px; font-size: 13px; opacity: 0.6; }

        .panel-card {
          background: var(--paper); border: 1px solid var(--line);
          border-radius: 16px; padding: 20px; margin-bottom: 16px;
        }
        .panel-card > .sidebar-title { margin-bottom: 16px; }

        .kit-card { padding: 18px; }
        .kit-top { display: flex; gap: 14px; align-items: flex-start; }
        .kit-thumb {
          width: 76px; height: 76px; border-radius: 12px; flex-shrink: 0; position: relative;
        }
        .kit-badge {
          position: absolute; top: -6px; left: -6px;
          background: var(--ink); color: var(--cream);
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
        }
        .kit-info { flex: 1; min-width: 0; }
        .kit-info .eyebrow { font-size: 12px; opacity: 0.55; margin: 0 0 4px; }
        .kit-info h4 { font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px; line-height: 1.35; }
        .kit-controls { display: flex; align-items: center; gap: 14px; }
        .qty-input {
          width: 56px; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--line);
          font-family: inherit; font-size: 13px; text-align: center;
        }
        .remove-link {
          display: flex; align-items: center; gap: 5px; font-size: 12px; opacity: 0.6;
          background: none; border: none; cursor: pointer; color: var(--ink);
        }
        .remove-link:hover { color: var(--ember); opacity: 1; }
        .kit-price { text-align: right; flex-shrink: 0; }
        .kit-price .total { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; }
        .kit-price .unit { font-size: 11px; opacity: 0.55; margin-top: 2px; }

        .kit-included {
          margin-top: 16px; background: var(--cream); border-radius: 12px; padding: 14px;
        }
        .kit-included .label {
          font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          opacity: 0.55; font-weight: 700; margin-bottom: 10px;
        }
        .included-list { display: flex; flex-wrap: wrap; gap: 14px; }
        .included-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .included-thumb { width: 30px; height: 30px; border-radius: 8px; background: var(--toasted); }
        .included-x {
          font-size: 11px; opacity: 0.55; background: var(--paper);
          border-radius: 999px; padding: 1px 7px; margin-left: 2px;
        }

        .empty-cart { font-size: 13px; opacity: 0.6; padding: 10px 0; }

        .summary-card {
          background: var(--paper); border: 1px solid var(--line);
          border-radius: 16px; padding: 22px; position: sticky; top: 20px;
        }
        .summary-card h3 { font-family: 'Fraunces', serif; font-size: 18px; margin: 0 0 16px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; }
        .summary-row.total { font-weight: 700; font-size: 17px; border-top: 1px solid var(--line); margin-top: 6px; padding-top: 14px; }
        .summary-card .btn-solid, .summary-card .btn-outline { width: 100%; margin-top: 14px; text-align: center; }
        .cancel-link {
          display: block; text-align: center; margin-top: 12px; font-size: 12px;
          opacity: 0.55; background: none; border: none; cursor: pointer; width: 100%;
        }
        .cancel-link:hover { opacity: 0.8; }
        .disclaimer { font-size: 11px; opacity: 0.5; line-height: 1.5; margin-top: 16px; }
      `}</style>

      <div className="topbar">
        <MapPin size={13} /> Brasília · DF <span className="dot">•</span> Reserve online em minutos
      </div>

      <header className="header">
        <button className="logo" onClick={() => setView("catalog")}>
          <span className="logo-mark" />
          Pop Churros
        </button>
        <div className="search-wrap">
          <Search size={16} />
          <input
            placeholder="O que você quer alugar hoje?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="header-actions">
          <div className="icon-btn"><User size={17} /></div>
          <div className="icon-btn" onClick={() => setView("cart")}>
            <ShoppingBag size={17} />
            {quoteCount > 0 && <span className="badge">{quoteCount}</span>}
          </div>
        </div>
      </header>

      <nav className="nav">
        <button className={view === "catalog" ? "active" : ""} onClick={() => setView("catalog")}>Início</button>
        <button>Destaques</button>
        <button>Promoções</button>
      </nav>

      {view === "catalog" && (
        <>
          <div className="crumb">Início &nbsp;›&nbsp; <b>Todo o catálogo</b></div>

          <div className="layout">
            <aside>
              <div className="sidebar-title">Categorias</div>
              <div
                className={`cat-item ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                <span>Todas</span><span className="n">{totalItems}</span>
              </div>
              {CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  className={`cat-item ${activeCategory === c.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  <span>{c.name}</span><span className="n">{c.count}</span>
                </div>
              ))}
            </aside>

            <main>
              <div className="main-head">
                <div>
                  <h1>Todo o catálogo</h1>
                  <p>{totalItems.toLocaleString("pt-BR")} itens</p>
                </div>
                <div className="sort">Mais relevantes <ChevronDown size={14} /></div>
              </div>

              <div className="grid">
                {visible.map((p) => {
                  const cat = CATEGORIES.find((c) => c.id === p.cat);
                  const inQuote = quote.some((i) => i.id === p.id);
                  return (
                    <div className="card" key={p.id}>
                      <div style={{ position: "relative" }}>
                        <Swatch pattern={cat.pattern} tone={cat.tone} />
                        <span className="tag">Aluguel</span>
                      </div>
                      <div className="card-body">
                        <button
                          className={`add-btn ${inQuote ? "added" : ""}`}
                          onClick={() => addToQuote(p)}
                          aria-label={inQuote ? "Item adicionado ao orçamento" : "Adicionar ao orçamento"}
                        >
                          {inQuote ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                        <h3>{p.name}</h3>
                        <div className="card-foot">
                          <span className="price">{formatBRL(p.price)} <small>/dia</small></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </>
      )}

      {view === "cart" && (
        <div className="cart-layout">
          <div>
            <div className="cart-title">
              <h1>Seu carrinho</h1>
              <p>Revise os itens antes de continuar</p>
            </div>

            <div className="panel-card">
              <div className="sidebar-title">Período da locação</div>
              <div className="field-row">
                <div className="field">
                  <label>Data da retirada</label>
                  <input
                    placeholder="DD/MM/AAAA"
                    value={eventInfo.pickupDate}
                    onChange={(e) => setEventInfo({ ...eventInfo, pickupDate: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Hora da retirada</label>
                  <select
                    value={eventInfo.pickupTime}
                    onChange={(e) => setEventInfo({ ...eventInfo, pickupTime: e.target.value })}
                  >
                    <option value="">–</option>
                    <option value="08:00">08:00</option>
                    <option value="14:00">14:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>
              <div className="field-row" style={{ marginBottom: 0 }}>
                <div className="field">
                  <label>Data da devolução</label>
                  <input
                    placeholder="DD/MM/AAAA"
                    value={eventInfo.returnDate}
                    onChange={(e) => setEventInfo({ ...eventInfo, returnDate: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Hora da devolução</label>
                  <select
                    value={eventInfo.returnTime}
                    onChange={(e) => setEventInfo({ ...eventInfo, returnTime: e.target.value })}
                  >
                    <option value="">–</option>
                    <option value="08:00">08:00</option>
                    <option value="14:00">14:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="panel-card">
              <div className="sidebar-title">Seus dados</div>
              <div className="field">
                <label>E-mail</label>
                <input
                  placeholder="Informe seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {quote.length === 0 ? (
              <p className="empty-cart">Seu carrinho está vazio. Volte ao catálogo para adicionar itens.</p>
            ) : (
              quote.map((item) => (
                <div className="panel-card kit-card" key={item.id}>
                  <div className="kit-top">
                    <div className="kit-thumb">
                      <Swatch
                        pattern={CATEGORIES.find((c) => c.id === item.cat).pattern}
                        tone={CATEGORIES.find((c) => c.id === item.cat).tone}
                      />
                      {item.kit && <span className="kit-badge">Kit</span>}
                    </div>
                    <div className="kit-info">
                      <p className="eyebrow">{item.kit ? `Kit · ${item.kit.length} itens` : "Item avulso"}</p>
                      <h4>{item.name}</h4>
                      <div className="kit-controls">
                        <input
                          className="qty-input"
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value) || 1);
                            setQuote((current) =>
                              current.map((i) => (i.id === item.id ? { ...i, qty: val } : i))
                            );
                          }}
                        />
                        <button className="remove-link" onClick={() => removeItem(item.id)}>
                          <Trash2 size={13} /> Remover
                        </button>
                      </div>
                    </div>
                    <div className="kit-price">
                      <div className="total">{formatBRL(item.qty * item.price)}</div>
                      <div className="unit">{formatBRL(item.price)} / un</div>
                    </div>
                  </div>

                  {item.kit && (
                    <div className="kit-included">
                      <div className="label">Itens inclusos neste kit</div>
                      <div className="included-list">
                        {item.kit.map((k, idx) => (
                          <div className="included-item" key={idx}>
                            <span className="included-thumb" />
                            <span>{k.name}</span>
                            {k.qty > 1 && <span className="included-x">{k.qty}×</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <aside className="summary-card">
            <h3>Resumo do pedido</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
            <div className="summary-row total"><span>Total</span><span>{formatBRL(subtotal)}</span></div>
            <button className="btn-solid">Solicitar orçamento</button>
            <button className="btn-outline" onClick={() => setView("catalog")}>Continuar comprando</button>
            <button className="cancel-link" onClick={() => setQuote([])}>Cancelar carrinho</button>
            <p className="disclaimer">
              Itens de locação são cobrados conforme o período selecionado; itens de venda à vista.
              A confirmação final é feita após checagem de disponibilidade.
            </p>
          </aside>
        </div>
      )}

      {showEventModal && (
        <div className="overlay" onClick={() => setShowEventModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={saveEventInfo}>
            <button type="button" className="modal-close" onClick={() => setShowEventModal(false)}>
              <X size={15} />
            </button>
            <h2>Quando é o seu evento?</h2>
            <p className="modal-sub">
              Com as datas certas você vê preços e disponibilidade exatos — e com seu WhatsApp
              fica mais fácil te ajudarmos a fechar o pedido.
            </p>

            <div className="field-row">
              <div className="field">
                <label>Data da retirada</label>
                <input
                  placeholder="DD/MM/AAAA"
                  value={eventInfo.pickupDate}
                  onChange={(e) => setEventInfo({ ...eventInfo, pickupDate: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Hora da retirada</label>
                <select
                  value={eventInfo.pickupTime}
                  onChange={(e) => setEventInfo({ ...eventInfo, pickupTime: e.target.value })}
                >
                  <option value="">–</option>
                  <option value="08:00">08:00</option>
                  <option value="14:00">14:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Data da devolução</label>
                <input
                  placeholder="DD/MM/AAAA"
                  value={eventInfo.returnDate}
                  onChange={(e) => setEventInfo({ ...eventInfo, returnDate: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Hora da devolução</label>
                <select
                  value={eventInfo.returnTime}
                  onChange={(e) => setEventInfo({ ...eventInfo, returnTime: e.target.value })}
                >
                  <option value="">–</option>
                  <option value="08:00">08:00</option>
                  <option value="14:00">14:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Seu WhatsApp</label>
              <div className="whatsapp-row">
                <span className="whatsapp-code">🇧🇷 +55 <ChevronDownSm size={12} /></span>
                <input
                  style={{ flex: 1 }}
                  placeholder="(DD) 99999-9999"
                  value={eventInfo.whatsapp}
                  onChange={(e) => setEventInfo({ ...eventInfo, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-outline" onClick={() => setShowEventModal(false)}>
                Agora não
              </button>
              <button type="submit" className="btn-solid">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
