const app = document.getElementById('app');

const API_BASE = '/api';
const DEFAULT_STATE = {
  loggedIn: false,
  mode: 'public',
  currentView: 'dashboard',
  publicView: 'home',
  sidebarCollapsed: false,
  theme: 'dark',
  showLogin: false,
  settings: {
    adminEmail: 'admin@popchurros.com',
    adminPassword: '123456',
    contractTemplate: 'Contrato de Locação\nA empresa Pop Churros compromete-se a fornecer os itens descritos para o cliente {{cliente}}, CPF {{cpf}}, para utilização no evento realizado em {{data_evento}}. Valor total do contrato: R$ {{valor_total}}.'
  },
  products: [
    { id: 'p1', name: 'Mesa plástica', category: 'Mesas', description: 'Mesa de plástico resistente para eventos externos.', unitPrice: 45, stock: 24, reserved: 8, image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80' },
    { id: 'p2', name: 'Cadeira plástica', category: 'Cadeiras', description: 'Cadeira plástica confortável e leve.', unitPrice: 18, stock: 120, reserved: 40, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { id: 'p3', name: 'Mesa de madeira', category: 'Mesas', description: 'Mesa de madeira com acabamento sofisticado.', unitPrice: 90, stock: 10, reserved: 4, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
    { id: 'p4', name: 'Cadeira de madeira', category: 'Cadeiras', description: 'Cadeira de madeira estilo rústico.', unitPrice: 55, stock: 8, reserved: 2, image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80' },
    { id: 'p5', name: 'Capa para cadeira', category: 'Acessórios', description: 'Capa elegante para compor a decoração.', unitPrice: 12, stock: 60, reserved: 18, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80' },
    { id: 'p6', name: 'Toalha de mesa', category: 'Acessórios', description: 'Toalha de mesa em tecido premium.', unitPrice: 22, stock: 35, reserved: 12, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80' },
    { id: 'p7', name: 'Tenda', category: 'Estruturas', description: 'Tenda para espaços ao ar livre.', unitPrice: 260, stock: 5, reserved: 2, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80' },
    { id: 'p8', name: 'Pula-pula', category: 'Diversão', description: 'Estrutura inflável para crianças.', unitPrice: 180, stock: 3, reserved: 1, image: 'https://images.unsplash.com/photo-1532330393533-5f7d0b20f8b6?auto=format&fit=crop&w=900&q=80' },
    { id: 'p9', name: 'Máquina de algodão doce', category: 'Diversão', description: 'Máquina para servir algodão doce.', unitPrice: 140, stock: 4, reserved: 1, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80' },
    { id: 'p10', name: 'Máquina de pipoca', category: 'Diversão', description: 'Máquina para servir pipoca fresca.', unitPrice: 130, stock: 4, reserved: 2, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80' }
  ],
  clients: [
    { id: 'c1', name: 'Maria Silva', cpf: '123.456.789-00', phone: '(11) 99999-0001', email: 'maria@teste.com', address: 'Rua das Flores, 120 - São Paulo' },
    { id: 'c2', name: 'João Pereira', cpf: '987.654.321-00', phone: '(11) 98888-0002', email: 'joao@teste.com', address: 'Av. Paulista, 1000 - São Paulo' }
  ],
  quotes: [
    { id: 'Q-001', createdAt: '2026-07-01', clientName: 'Maria Silva', phone: '(11) 99999-0001', address: 'Rua das Flores, 120 - São Paulo', eventDate: '2026-08-12', eventTime: '18:00', items: [{ productId: 'p1', name: 'Mesa plástica', qty: 20, unitPrice: 45 }, { productId: 'p2', name: 'Cadeira plástica', qty: 100, unitPrice: 18 }], observations: 'Evento ao ar livre.', total: 900, status: 'Orçamento' }
  ],
  contracts: [],
  receipts: [],
  events: [
    { id: 'e1', title: 'Casamento Maria', client: 'Maria Silva', deliveryDate: '2026-08-10', pickupDate: '2026-08-13', value: 900 },
    { id: 'e2', title: 'Aniversário da Joana', client: 'João Pereira', deliveryDate: '2026-07-20', pickupDate: '2026-07-21', value: 620 }
  ],
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  draftItems: [],
  clientBudgetItems: [],
  selectedQuoteId: '',
  signatureData: '',
  toast: ''
};

let state = structuredClone(DEFAULT_STATE);
let signaturePad = null;

function init() {
  if (state.theme === 'light') document.body.classList.add('light'); else document.body.classList.remove('light');
  loadFromApi();
  render();
  bindEvents();
}

async function loadFromApi() {
  try {
    const [productsRes, clientsRes, quotesRes, contractsRes, receiptsRes, eventsRes, settingsRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/clients`),
      fetch(`${API_BASE}/quotes`),
      fetch(`${API_BASE}/contracts`),
      fetch(`${API_BASE}/receipts`),
      fetch(`${API_BASE}/events`),
      fetch(`${API_BASE}/settings`)
    ]);
    const [products, clients, quotes, contracts, receipts, events, settings] = await Promise.all([
      productsRes.json(),
      clientsRes.json(),
      quotesRes.json(),
      contractsRes.json(),
      receiptsRes.json(),
      eventsRes.json(),
      settingsRes.json()
    ]);
    state.products = products.map(product => ({ ...product, unitPrice: Number(product.unit_price || product.unitPrice || 0), stock: Number(product.stock || 0), reserved: Number(product.reserved || 0), image: product.image || 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80' }));
    state.clients = clients;
    state.quotes = quotes.map(quote => ({ ...quote, items: typeof quote.items === 'string' ? JSON.parse(quote.items) : quote.items || [], total: Number(quote.total || 0) }));
    state.contracts = contracts;
    state.receipts = receipts;
    state.events = events;
    state.settings = { ...state.settings, ...settings, adminEmail: settings.admin_email || state.settings.adminEmail, adminPassword: settings.admin_password || state.settings.adminPassword, contractTemplate: settings.contract_template || state.settings.contractTemplate };
    state.theme = state.theme || 'dark';
    render();
  } catch (error) {
    console.error('Erro ao carregar dados do backend', error);
  }
}

async function saveToApi(endpoint, payload) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}

function saveState() {
  localStorage.setItem('pop-churros-browser-cache', JSON.stringify(state));
}

function render() {
  app.innerHTML = `
    <div class="app-shell">
      ${state.mode === 'admin' ? renderAdminShell() : renderPublicShell()}
    </div>
    ${state.toast ? `<div class="toast">${state.toast}</div>` : ''}
    ${state.showLogin ? renderLoginModal() : ''}
  `;
  bindEvents();
  if (state.toast) {
    setTimeout(() => {
      state.toast = '';
      render();
    }, 2200);
  }
}

function renderAdminShell() {
  return `
    <aside class="sidebar ${state.sidebarCollapsed ? 'collapsed' : ''}">
      <div class="brand">
        <div class="brand-badge">P</div>
        <div class="brand-text">
          <h1>Pop Churros</h1>
          <p>Painel administrativo</p>
        </div>
      </div>
      <nav class="nav-list">${renderNavItems()}</nav>
    </aside>
    <div class="content-area">
      <header class="topbar">
        <div class="topbar-group">
          <button class="icon-btn" id="toggle-sidebar" aria-label="Recolher menu">☰</button>
          <div>
            <strong>Painel administrativo</strong><br />
            <span class="muted">Gestão completa da operação</span>
          </div>
        </div>
        <div class="topbar-group">
          <button class="secondary-btn" id="theme-toggle">${state.theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}</button>
          <button class="secondary-btn" id="logout-btn">Sair</button>
        </div>
      </header>
      <main class="main-content">${renderAdminScreen()}</main>
    </div>
  `;
}

function renderPublicShell() {
  return `
    <div class="public-shell">
      <header class="public-header">
        <div class="brand">
          <div class="brand-badge">P</div>
          <div class="brand-text">
            <h1>Pop Churros</h1>
            <p>Locação de mesas & cadeiras</p>
          </div>
        </div>
        <nav class="public-nav">
          <button class="nav-btn ${state.publicView === 'home' ? 'active' : ''}" data-public-view="home">🏠 Início</button>
          <button class="nav-btn ${state.publicView === 'catalog' ? 'active' : ''}" data-public-view="catalog">🪑 Catálogo</button>
          <button class="nav-btn ${state.publicView === 'budget' ? 'active' : ''}" data-public-view="budget">💬 Orçamento</button>
          <button class="nav-btn ${state.publicView === 'contact' ? 'active' : ''}" data-public-view="contact">📞 Contato</button>
        </nav>
        <div class="topbar-group">
          <button class="secondary-btn" data-public-action="admin-login">Painel administrativo</button>
        </div>
      </header>
      <main class="main-content public-main">${renderPublicScreen()}</main>
    </div>
    <a class="whatsapp-float" href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento" target="_blank" aria-label="WhatsApp">💬</a>
  `;
}

function renderNavItems() {
  const views = [
    ['dashboard', '📊 Dashboard'],
    ['products', '🧾 Produtos'],
    ['clients', '👤 Clientes'],
    ['quotes', '💬 Orçamentos'],
    ['contracts', '📝 Contratos'],
    ['receipts', '🧾 Recibos'],
    ['agenda', '🗓️ Agenda'],
    ['reports', '📈 Relatórios'],
    ['settings', '⚙️ Configurações']
  ];
  return views.map(([view, label]) => `<button class="nav-btn ${state.currentView === view ? 'active' : ''}" data-view="${view}">${label}</button>`).join('');
}

function renderPublicScreen() {
  const views = {
    home: renderPublicHome(),
    catalog: renderPublicCatalog(),
    budget: renderPublicBudget(),
    contact: renderPublicContact()
  };
  return views[state.publicView] || views.home;
}

function renderPublicHome() {
  return `
    <section class="hero-section">
      <div class="hero-copy">
        <span class="badge">Nova experiência em locação</span>
        <h2>Mesas, cadeiras e estrutura completa para eventos com sofisticação e praticidade.</h2>
        <p>A Pop Churros entrega soluções completas para festas, casamentos, feiras e eventos corporativos com logística organizada, produtos premium e atendimento rápido.</p>
        <div class="hero-actions">
          <button class="primary-btn" data-public-view="budget">Solicitar orçamento</button>
          <button class="secondary-btn" data-public-view="catalog">Ver catálogo</button>
        </div>
      </div>
      <div class="hero-card">
        <h3>Por que escolher a Pop Churros?</h3>
        <ul>
          <li>Atendimento rápido e personalizado.</li>
          <li>Produtos de alto padrão e higiene.</li>
          <li>Gestão simplificada com contratos e recibos.</li>
          <li>Entrega e retirada organizadas.</li>
        </ul>
      </div>
    </section>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-number">120+</div><div class="muted">Eventos atendidos</div></div>
      <div class="stat-card"><div class="stat-number">98%</div><div class="muted">Satisfação</div></div>
      <div class="stat-card"><div class="stat-number">24h</div><div class="muted">Resposta média</div></div>
      <div class="stat-card"><div class="stat-number">10+</div><div class="muted">Categorias</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Depoimentos</h3>
        <p>“A equipe foi impecável, tudo chegou no horário e deixou o evento muito elegante.”</p>
        <strong>— Camila & Eduardo</strong>
      </div>
      <div class="card">
        <h3>Contato</h3>
        <p>📍 Rua do Evento, 130 - São Paulo<br />📞 (11) 4002-0000<br />✉️ contato@popchurros.com</p>
      </div>
    </div>
  `;
}

function renderPublicCatalog() {
  return `
    <div class="card">
      <div class="section-title"><h3>Catálogo completo</h3><span class="muted">Produtos disponíveis para locação</span></div>
      <div class="product-grid">
        ${state.products.map(product => `
          <div class="product-card card">
            <div class="image"><img src="${product.image}" alt="${product.name}" /></div>
            <div class="section-title"><h4>${product.name}</h4><span class="price-badge">${formatCurrency(product.unitPrice)}/dia</span></div>
            <p class="muted">${product.description}</p>
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.stock} disponíveis</span>
            </div>
            <div class="actions" style="margin-top: 12px;"><button class="primary-btn" data-public-view="budget">Solicitar este item</button></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPublicBudget() {
  const items = state.clientBudgetItems.filter(item => item.qty > 0);
  const total = items.reduce((sum, item) => {
    const product = state.products.find(product => product.id === item.productId);
    return sum + (product ? item.qty * product.unitPrice : 0);
  }, 0);
  return `
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h3>Monte seu orçamento</h3><span class="muted">Selecione itens e envie para o WhatsApp</span></div>
        <div class="list-grid">
          ${state.products.map(product => {
            const current = state.clientBudgetItems.find(item => item.productId === product.id);
            const qty = current ? current.qty : 0;
            return `
              <div class="client-product-row">
                <div>
                  <strong>${product.name}</strong>
                  <div class="muted">${product.category} • ${formatCurrency(product.unitPrice)}</div>
                </div>
                <div class="actions">
                  <input class="client-qty-input" type="number" min="0" value="${qty}" data-id="${product.id}" style="width: 90px;" />
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="form-card">
        <div class="section-title"><h3>Dados do evento</h3></div>
        <form id="client-budget-form">
          <div class="form-row">
            <label>Nome<input name="name" required /></label>
            <label>Telefone<input name="phone" required /></label>
          </div>
          <label>Endereço<input name="address" /></label>
          <div class="form-row">
            <label>Data do evento<input type="date" name="eventDate" /></label>
            <label>Horário<input name="eventTime" /></label>
          </div>
          <label>Observações<textarea name="observations"></textarea></label>
          <div class="view-banner" style="margin-top: 12px;">Valor estimado: <strong>${formatCurrency(total)}</strong></div>
          <div class="actions" style="margin-top: 12px;"><button class="primary-btn" type="submit">Enviar orçamento pelo WhatsApp</button></div>
        </form>
      </div>
    </div>
  `;
}

function renderPublicContact() {
  return `
    <div class="grid-2">
      <div class="card">
        <h3>Fale com a Pop Churros</h3>
        <p>📍 Rua do Evento, 130 - São Paulo<br />📞 (11) 4002-0000<br />✉️ contato@popchurros.com</p>
        <p class="muted">Atendemos festas, eventos corporativos, feiras e casamentos com equipe especializada e planejamento ágil.</p>
      </div>
      <div class="card">
        <h3>Como funciona</h3>
        <ul>
          <li>Escolha os itens no catálogo ou no orçamento.</li>
          <li>Informe os dados do evento.</li>
          <li>Enviamos tudo automaticamente para o WhatsApp.</li>
        </ul>
      </div>
    </div>
  `;
}

function renderAdminScreen() {
  const sections = {
    dashboard: renderDashboard(),
    products: renderProducts(),
    clients: renderClients(),
    quotes: renderQuotes(),
    contracts: renderContracts(),
    receipts: renderReceipts(),
    agenda: renderAgenda(),
    reports: renderReports(),
    settings: renderSettings()
  };
  return sections[state.currentView] || sections.dashboard;
}

function renderDashboard() {
  const totalProducts = state.products.length;
  const totalQuotes = state.quotes.length;
  const totalContracts = state.contracts.length;
  const totalReceipts = state.receipts.length;
  const nextEvents = state.events.slice(0, 3);
  return `
    <div class="view-banner">Bem-vindo ao painel administrativo. Aqui você controla produtos, clientes, orçamentos, contratos, agenda e relatórios com uma visão completa da operação.</div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-number">${totalProducts}</div><div class="muted">Produtos cadastrados</div></div>
      <div class="stat-card"><div class="stat-number">${totalQuotes}</div><div class="muted">Orçamentos realizados</div></div>
      <div class="stat-card"><div class="stat-number">${totalContracts}</div><div class="muted">Contratos gerados</div></div>
      <div class="stat-card"><div class="stat-number">${totalReceipts}</div><div class="muted">Recibos emitidos</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h3>Próximos eventos</h3><span class="muted">Planejamento</span></div>
        <div class="list-grid">
          ${nextEvents.map(event => `<div class="list-item"><div><strong>${event.title}</strong><div class="muted">${event.client}</div></div><span class="badge">${event.deliveryDate}</span></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Resumo rápido</h3>
        <p class="muted">Acompanhe a operação com indicadores e tendência de crescimento. Os produtos com estoque baixo aparecem destacados na gestão de produtos.</p>
        <div class="report-bars">
          <div class="report-bar"><span style="width: 78%">Produtos com estoque saudável</span></div>
          <div class="report-bar"><span style="width: 62%">Orçamentos convertidos</span></div>
          <div class="report-bar"><span style="width: 85%">Atendimento no prazo</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderProducts() {
  return `
    <div class="grid-2">
      <div class="form-card">
        <div class="section-title"><h3>${state.editingProductId ? 'Editar produto' : 'Adicionar produto'}</h3></div>
        <form id="product-form">
          <div class="form-row">
            <label>Nome<input name="name" id="product-name" required /></label>
            <label>Categoria<input name="category" id="product-category" required /></label>
          </div>
          <label>Descrição<textarea name="description" id="product-description" required></textarea></label>
          <div class="form-row">
            <label>Valor<input type="number" step="0.01" name="unitPrice" id="product-price" required /></label>
            <label>Quantidade em estoque<input type="number" name="stock" id="product-stock" required /></label>
          </div>
          <label>Imagem (URL)<input name="image" id="product-image" placeholder="https://..." /></label>
          <div class="actions" style="margin-top: 10px;"><button class="primary-btn" type="submit">Salvar produto</button>${state.editingProductId ? '<button class="secondary-btn" type="button" id="cancel-edit-product">Cancelar</button>' : ''}</div>
        </form>
      </div>
      <div class="card">
        <div class="section-title"><h3>Gestão de estoque</h3><span class="muted">Produtos com estoque baixo destacam-se</span></div>
        <div class="list-grid">
          ${state.products.map(product => `
            <div class="list-item ${product.stock < 10 ? 'low-stock' : ''}">
              <div>
                <strong>${product.name}</strong>
                <div class="muted">Disponível ${product.stock} • Reservado ${product.reserved}</div>
              </div>
              <div class="actions">
                <button data-action="edit-product" data-id="${product.id}">Editar</button>
                <button data-action="delete-product" data-id="${product.id}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderClients() {
  return `
    <div class="grid-2">
      <div class="form-card">
        <div class="section-title"><h3>Cadastrar cliente</h3></div>
        <form id="client-form">
          <div class="form-row">
            <label>Nome<input name="name" id="client-name" required /></label>
            <label>CPF/CNPJ<input name="cpf" id="client-cpf" required /></label>
          </div>
          <div class="form-row">
            <label>Telefone<input name="phone" id="client-phone" required /></label>
            <label>E-mail<input name="email" id="client-email" required /></label>
          </div>
          <label>Endereço<textarea name="address" id="client-address" required></textarea></label>
          <div class="actions" style="margin-top: 10px;"><button class="primary-btn" type="submit">Salvar cliente</button></div>
        </form>
      </div>
      <div class="card">
        <div class="section-title"><h3>Clientes cadastrados</h3><input id="client-search" placeholder="Pesquisar cliente" /></div>
        <div class="list-grid" id="client-list">
          ${state.clients.map(client => `
            <div class="list-item">
              <div>
                <strong>${client.name}</strong>
                <div class="muted">${client.phone} • ${client.email}</div>
              </div>
              <div class="actions">
                <button data-action="edit-client" data-id="${client.id}">Editar</button>
                <button data-action="delete-client" data-id="${client.id}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderQuotes() {
  const quoteItems = state.draftItems.length ? state.draftItems : [];
  const total = quoteItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  return `
    <div class="grid-2">
      <div class="form-card">
        <div class="section-title"><h3>Criar orçamento</h3></div>
        <form id="quote-form">
          <div class="form-row">
            <label>Cliente<select id="quote-client"></select></label>
            <label>Telefone<input id="quote-phone" /></label>
          </div>
          <div class="form-row">
            <label>Endereço<input id="quote-address" /></label>
            <label>Data do evento<input type="date" id="quote-date" /></label>
          </div>
          <label>Horário<input id="quote-time" /></label>
          <div class="form-row">
            <label>Produto<select id="quote-product"></select></label>
            <label>Quantidade<input type="number" id="quote-qty" min="1" value="1" /></label>
          </div>
          <div class="actions" style="margin-bottom: 10px;"><button type="button" class="secondary-btn" id="add-quote-item">Adicionar item</button></div>
          <div class="list-grid" id="quote-item-list">
            ${quoteItems.map((item, index) => `<div class="list-item"><div><strong>${item.name}</strong><div class="muted">Quantidade ${item.qty}</div></div><span class="badge">${formatCurrency(item.qty * item.unitPrice)}</span></div>`).join('')}
          </div>
          <label>Observações<textarea id="quote-observations"></textarea></label>
          <div class="view-banner" style="margin-top: 12px;">Valor estimado: <strong>${formatCurrency(total)}</strong></div>
          <div class="actions" style="margin-top: 12px;"><button class="primary-btn" type="submit">Gerar orçamento</button></div>
        </form>
      </div>
      <div class="card">
        <div class="section-title"><h3>Orçamentos registrados</h3></div>
        <div class="list-grid">
          ${state.quotes.map(quote => `
            <div class="list-item">
              <div>
                <strong>${quote.id} • ${quote.clientName}</strong>
                <div class="muted">${quote.eventDate} • ${formatCurrency(quote.total)}</div>
              </div>
              <div class="actions">
                <button data-action="whatsapp-quote" data-id="${quote.id}">WhatsApp</button>
                <button data-action="convert-contract" data-id="${quote.id}">Contrato</button>
                <button data-action="convert-receipt" data-id="${quote.id}">Recibo</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderContracts() {
  return `
    <div class="grid-2">
      <div class="form-card">
        <div class="section-title"><h3>Modelo de contrato</h3></div>
        <label>Editar modelo<textarea id="contract-template">${state.settings.contractTemplate}</textarea></label>
        <div class="actions" style="margin-top: 10px;"><button class="primary-btn" id="save-contract-template">Salvar modelo</button></div>
        <div class="section-title" style="margin-top: 16px;"><h3>Gerar contrato</h3></div>
        <label>Orçamento<select id="contract-quote-select">${state.quotes.map(quote => `<option value="${quote.id}" ${quote.id === state.selectedQuoteId ? 'selected' : ''}>${quote.id} • ${quote.clientName}</option>`).join('')}</select></label>
        <div class="actions" style="margin-top: 10px;"><button class="primary-btn" id="generate-contract">Gerar contrato</button><button class="secondary-btn" id="print-contract">Imprimir</button></div>
        <div class="signature-box" style="margin-top: 12px;"><canvas id="signature-canvas"></canvas><div class="actions" style="margin-top: 10px;"><button class="secondary-btn" id="clear-signature">Limpar assinatura</button></div></div>
      </div>
      <div class="card">
        <div class="section-title"><h3>Contratos emitidos</h3></div>
        <div class="list-grid">
          ${state.contracts.length ? state.contracts.map(contract => `
            <div class="list-item">
              <div>
                <strong>${contract.id} • ${contract.clientName}</strong>
                <div class="muted">${contract.createdAt} • ${formatCurrency(contract.total)}</div>
              </div>
              <div class="actions">
                <button data-action="print-contract-item" data-id="${contract.id}">Imprimir</button>
                <button data-action="download-contract" data-id="${contract.id}">PDF</button>
              </div>
            </div>
          `).join('') : '<div class="muted">Nenhum contrato gerado ainda.</div>'}
        </div>
      </div>
    </div>
  `;
}

function renderReceipts() {
  return `
    <div class="grid-2">
      <div class="form-card">
        <div class="section-title"><h3>Emitir recibo</h3></div>
        <form id="receipt-form">
          <label>Orçamento<select id="receipt-quote-select">${state.quotes.map(quote => `<option value="${quote.id}">${quote.id} • ${quote.clientName}</option>`).join('')}</select></label>
          <div class="form-row">
            <label>Valor recebido<input type="number" step="0.01" id="receipt-value" required /></label>
            <label>Forma de pagamento<select id="receipt-payment"><option>Dinheiro</option><option>Pix</option><option>Cartão</option><option>Transferência</option></select></label>
          </div>
          <label>Data<input type="date" id="receipt-date" /></label>
          <label>Referência<textarea id="receipt-reference"></textarea></label>
          <div class="actions" style="margin-top: 10px;"><button class="primary-btn" type="submit">Gerar recibo</button></div>
        </form>
      </div>
      <div class="card">
        <div class="section-title"><h3>Recibos emitidos</h3></div>
        <div class="list-grid">
          ${state.receipts.length ? state.receipts.map(receipt => `
            <div class="list-item">
              <div>
                <strong>${receipt.id} • ${receipt.clientName}</strong>
                <div class="muted">${receipt.createdAt} • ${formatCurrency(receipt.value)}</div>
              </div>
              <div class="actions">
                <button data-action="print-receipt" data-id="${receipt.id}">Imprimir</button>
              </div>
            </div>
          `).join('') : '<div class="muted">Nenhum recibo emitido ainda.</div>'}
        </div>
      </div>
    </div>
  `;
}

function renderAgenda() {
  const date = new Date(state.calendarYear, state.calendarMonth, 1);
  const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < (firstDay + 6) % 7; i += 1) cells.push('<div></div>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayEvents = state.events.filter(event => event.deliveryDate?.includes(`${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`));
    cells.push(`<div class="calendar-day ${day === new Date().getDate() ? 'active' : ''}"><strong>${day}</strong>${dayEvents.length ? dayEvents.map(e => `<div class="muted">• ${e.title}</div>`).join('') : ''}</div>`);
  }
  return `
    <div class="card">
      <div class="calendar-header">
        <div class="section-title" style="margin: 0;"><h3>Agenda de eventos</h3></div>
        <div class="actions">
          <button class="secondary-btn" id="prev-month">←</button>
          <strong>${monthName}</strong>
          <button class="secondary-btn" id="next-month">→</button>
        </div>
      </div>
      <div class="calendar-days">
        <div class="muted">Seg</div><div class="muted">Ter</div><div class="muted">Qua</div><div class="muted">Qui</div><div class="muted">Sex</div><div class="muted">Sáb</div><div class="muted">Dom</div>
        ${cells.join('')}
      </div>
    </div>
    <div class="card">
      <div class="section-title"><h3>Lista de eventos</h3></div>
      <div class="list-grid">
        ${state.events.map(event => `
          <div class="list-item">
            <div><strong>${event.title}</strong><div class="muted">${event.client} • ${formatCurrency(event.value)}</div></div>
            <div class="muted">Entrega ${event.deliveryDate}<br />Retirada ${event.pickupDate}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReports() {
  const topProducts = state.products.slice().sort((a, b) => b.reserved - a.reserved).slice(0, 4);
  const monthlyRevenue = state.quotes.reduce((sum, q) => sum + q.total, 0);
  return `
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h3>Produtos mais alugados</h3></div>
        <div class="report-bars">
          ${topProducts.map(product => `<div class="report-bar"><span style="width: ${Math.min(100, product.reserved * 8)}%">${product.name} • ${product.reserved} reservas</span></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="section-title"><h3>Faturamento mensal</h3></div>
        <div class="stat-card"><div class="stat-number">${formatCurrency(monthlyRevenue)}</div><div class="muted">Baseado nos orçamentos registrados</div></div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h3>Orçamentos convertidos</h3></div>
        <p class="muted">${state.contracts.length} contratos gerados a partir de ${state.quotes.length} orçamentos.</p>
      </div>
      <div class="card">
        <div class="section-title"><h3>Recibos emitidos</h3></div>
        <p class="muted">${state.receipts.length} recibos emitidos para clientes e eventos.</p>
      </div>
    </div>
    <div class="actions">
      <button class="primary-btn" id="export-csv">Exportar Excel</button>
      <button class="secondary-btn" id="print-report">Exportar PDF</button>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="grid-2">
      <div class="form-card">
        <div class="section-title"><h3>Configurações de acesso</h3></div>
        <form id="settings-form">
          <label>E-mail do administrador<input id="settings-email" value="${state.settings.adminEmail}" /></label>
          <label>Senha<input id="settings-password" value="${state.settings.adminPassword}" /></label>
          <div class="actions" style="margin-top: 12px;"><button class="primary-btn" type="submit">Salvar</button></div>
        </form>
      </div>
      <div class="card">
        <div class="section-title"><h3>Preferências</h3></div>
        <label>Modo visual<select id="theme-select"><option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Escuro</option><option value="light" ${state.theme === 'light' ? 'selected' : ''}>Claro</option></select></label>
        <div class="actions" style="margin-top: 12px;"><button class="secondary-btn" id="save-theme">Aplicar</button></div>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view) {
        state.currentView = view;
        saveState();
        render();
      }
    });
  });

  document.querySelectorAll('[data-public-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-public-view');
      if (view) {
        state.publicView = view;
        saveState();
        render();
      }
    });
  });

  document.querySelectorAll('[data-public-action="admin-login"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = 'admin';
      state.showLogin = true;
      saveState();
      render();
    });
  });

  document.getElementById('toggle-sidebar')?.addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    saveState();
    render();
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light', state.theme === 'light');
    saveState();
    render();
  });

  document.getElementById('login-btn')?.addEventListener('click', () => {
    state.showLogin = true;
    render();
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    state.loggedIn = false;
    saveState();
    render();
  });

  document.querySelectorAll('.client-qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = input.getAttribute('data-id');
      const qty = Number(input.value || 0);
      const existing = state.clientBudgetItems.find(item => item.productId === id);
      if (existing) {
        existing.qty = qty;
      } else if (qty > 0) {
        state.clientBudgetItems.push({ productId: id, qty });
      }
      if (qty <= 0) {
        state.clientBudgetItems = state.clientBudgetItems.filter(item => item.productId !== id);
      }
      saveState();
      render();
    });
  });

  document.getElementById('client-budget-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    const selectedItems = state.clientBudgetItems.map(item => {
      const product = state.products.find(prod => prod.id === item.productId);
      return `${product?.name || 'Item'} - ${item.qty} unidades`;
    });
    const total = state.clientBudgetItems.reduce((sum, item) => {
      const product = state.products.find(prod => prod.id === item.productId);
      return sum + (product ? item.qty * product.unitPrice : 0);
    }, 0);
    const message = `Olá, gostaria de solicitar um orçamento:\n${selectedItems.join('\n') || 'Nenhum item selecionado'}\nNome: ${payload.name || '-'}\nTelefone: ${payload.phone || '-'}\nEndereço: ${payload.address || '-'}\nData do evento: ${payload.eventDate || '-'}\nHorário: ${payload.eventTime || '-'}\nObservações: ${payload.observations || '-'}\nValor estimado: ${formatCurrency(total)}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
    state.clientBudgetItems = [];
    saveState();
    render();
    showToast('Orçamento preparado para WhatsApp');
  });

  document.getElementById('product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    if (state.editingProductId) {
      state.products = state.products.map(product => product.id === state.editingProductId ? { ...product, ...payload, unitPrice: Number(payload.unitPrice), stock: Number(payload.stock) } : product);
      fetch(`${API_BASE}/products/${state.editingProductId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, unitPrice: Number(payload.unitPrice), stock: Number(payload.stock) }) }).catch(console.error);
      state.editingProductId = '';
    } else {
      const newProduct = { id: `p${Date.now()}`, ...payload, unitPrice: Number(payload.unitPrice), stock: Number(payload.stock), reserved: 0, image: payload.image || 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80' };
      state.products.push(newProduct);
      saveToApi('/products', newProduct).catch(console.error);
    }
    saveState();
    render();
    showToast('Produto salvo com sucesso');
  });

  document.querySelectorAll('[data-action="edit-product"]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    const product = state.products.find(item => item.id === id);
    if (!product) return;
    state.editingProductId = id;
    saveState();
    render();
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.unitPrice;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image;
  }));

  document.getElementById('cancel-edit-product')?.addEventListener('click', () => {
    state.editingProductId = '';
    saveState();
    render();
  });

  document.querySelectorAll('[data-action="delete-product"]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    if (confirm('Deseja remover este produto?')) {
      state.products = state.products.filter(item => item.id !== id);
      fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).catch(console.error);
      saveState();
      render();
      showToast('Produto removido');
    }
  }));

  document.getElementById('client-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newClient = { id: `c${Date.now()}`, ...data };
    state.clients.push(newClient);
    saveToApi('/clients', newClient).catch(console.error);
    saveState();
    render();
    showToast('Cliente cadastrado');
  });

  document.getElementById('client-search')?.addEventListener('input', (e) => {
    const query = e.currentTarget.value.toLowerCase();
    const list = document.getElementById('client-list');
    if (!list) return;
    const items = state.clients.filter(client => client.name.toLowerCase().includes(query) || client.email.toLowerCase().includes(query));
    list.innerHTML = items.map(client => `
      <div class="list-item">
        <div><strong>${client.name}</strong><div class="muted">${client.phone} • ${client.email}</div></div>
        <div class="actions"><button data-action="edit-client" data-id="${client.id}">Editar</button><button data-action="delete-client" data-id="${client.id}">Excluir</button></div>
      </div>
    `).join('');
  });

  document.querySelectorAll('[data-action="delete-client"]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    if (confirm('Deseja excluir este cliente?')) {
      state.clients = state.clients.filter(item => item.id !== id);
      fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' }).catch(console.error);
      saveState();
      render();
      showToast('Cliente removido');
    }
  }));

  const quoteClientSelect = document.getElementById('quote-client');
  if (quoteClientSelect) {
    quoteClientSelect.innerHTML = state.clients.map(client => `<option value="${client.name}">${client.name}</option>`).join('');
  }
  const quoteProductSelect = document.getElementById('quote-product');
  if (quoteProductSelect) {
    quoteProductSelect.innerHTML = state.products.map(product => `<option value="${product.id}" data-price="${product.unitPrice}">${product.name}</option>`).join('');
  }

  document.getElementById('add-quote-item')?.addEventListener('click', () => {
    const productSelect = document.getElementById('quote-product');
    const selected = state.products.find(item => item.id === productSelect.value);
    const qty = Number(document.getElementById('quote-qty').value || 1);
    if (!selected) return;
    state.draftItems.push({ productId: selected.id, name: selected.name, qty, unitPrice: selected.unitPrice });
    saveState();
    render();
  });

  document.getElementById('quote-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const quote = {
      id: `Q-${String(state.quotes.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().slice(0, 10),
      clientName: document.getElementById('quote-client').value,
      phone: document.getElementById('quote-phone').value,
      address: document.getElementById('quote-address').value,
      eventDate: document.getElementById('quote-date').value,
      eventTime: document.getElementById('quote-time').value,
      items: state.draftItems,
      observations: document.getElementById('quote-observations').value,
      total: state.draftItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
      status: 'Orçamento'
    };
    state.quotes.unshift(quote);
    saveToApi('/quotes', quote).catch(console.error);
    saveToApi('/events', { id: `e${Date.now()}`, title: `Orçamento ${quote.clientName}`, client: quote.clientName, deliveryDate: quote.eventDate, pickupDate: quote.eventDate, value: quote.total }).catch(console.error);
    state.events.unshift({ id: `e${Date.now()}`, title: `Orçamento ${quote.clientName}`, client: quote.clientName, deliveryDate: quote.eventDate, pickupDate: quote.eventDate, value: quote.total });
    state.draftItems = [];
    saveState();
    render();
    showToast('Orçamento criado');
  });

  document.querySelectorAll('[data-action="whatsapp-quote"]').forEach(btn => btn.addEventListener('click', () => {
    const quote = state.quotes.find(item => item.id === btn.getAttribute('data-id'));
    if (!quote) return;
    const text = `Olá, gostaria de solicitar um orçamento:\n${quote.items.map(item => `${item.name} - ${item.qty} unidades`).join('\n')}\nData do evento: ${quote.eventDate}\nValor estimado: ${formatCurrency(quote.total)}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(text)}`, '_blank');
  }));

  document.querySelectorAll('[data-action="convert-contract"]').forEach(btn => btn.addEventListener('click', () => {
    const quote = state.quotes.find(item => item.id === btn.getAttribute('data-id'));
    if (!quote) return;
    state.selectedQuoteId = quote.id;
    state.currentView = 'contracts';
    saveState();
    render();
  }));

  document.querySelectorAll('[data-action="convert-receipt"]').forEach(btn => btn.addEventListener('click', () => {
    const quote = state.quotes.find(item => item.id === btn.getAttribute('data-id'));
    if (!quote) return;
    state.currentView = 'receipts';
    saveState();
    render();
  }));

  document.getElementById('save-contract-template')?.addEventListener('click', () => {
    state.settings.contractTemplate = document.getElementById('contract-template').value;
    saveState();
    showToast('Modelo salvo');
  });

  document.getElementById('generate-contract')?.addEventListener('click', () => {
    const quote = state.quotes.find(item => item.id === document.getElementById('contract-quote-select').value);
    if (!quote) return;
    const contract = {
      id: `C-${String(state.contracts.length + 1).padStart(3, '0')}`,
      quoteId: quote.id,
      clientName: quote.clientName,
      createdAt: new Date().toISOString().slice(0, 10),
      total: quote.total,
      content: state.settings.contractTemplate.replace('{{cliente}}', quote.clientName).replace('{{cpf}}', '000.000.000-00').replace('{{telefone}}', quote.phone || '(11) 00000-0000').replace('{{endereco}}', quote.address || 'Endereço informado').replace('{{data_evento}}', quote.eventDate).replace('{{itens}}', quote.items.map(item => `${item.name} (${item.qty})`).join(', ')).replace('{{valor_total}}', formatCurrency(quote.total)),
      signature: state.signatureData || ''
    };
    state.contracts.unshift(contract);
    saveToApi('/contracts', contract).catch(console.error);
    saveState();
    render();
    showToast('Contrato gerado');
  });

  document.getElementById('print-contract')?.addEventListener('click', () => window.print());
  document.getElementById('clear-signature')?.addEventListener('click', () => {
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.signatureData = '';
  });

  document.getElementById('receipt-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const quote = state.quotes.find(item => item.id === document.getElementById('receipt-quote-select').value);
    if (!quote) return;
    const receipt = {
      id: `R-${String(state.receipts.length + 1).padStart(3, '0')}`,
      clientName: quote.clientName,
      createdAt: document.getElementById('receipt-date').value || new Date().toISOString().slice(0, 10),
      value: Number(document.getElementById('receipt-value').value),
      payment: document.getElementById('receipt-payment').value,
      reference: document.getElementById('receipt-reference').value,
      content: `Recebemos de ${quote.clientName} a importância de R$ ${formatCurrency(Number(document.getElementById('receipt-value').value))}, referente à locação de equipamentos para evento.`
    };
    state.receipts.unshift(receipt);
    saveToApi('/receipts', receipt).catch(console.error);
    saveState();
    render();
    showToast('Recibo emitido');
  });

  document.getElementById('prev-month')?.addEventListener('click', () => {
    state.calendarMonth -= 1;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear -= 1;
    }
    saveState();
    render();
  });

  document.getElementById('next-month')?.addEventListener('click', () => {
    state.calendarMonth += 1;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear += 1;
    }
    saveState();
    render();
  });

  document.getElementById('export-csv')?.addEventListener('click', () => {
    const rows = [['Tipo', 'Cliente', 'Valor']];
    state.quotes.forEach(quote => rows.push(['Orçamento', quote.clientName, quote.total]));
    state.contracts.forEach(contract => rows.push(['Contrato', contract.clientName, contract.total]));
    downloadCsv(rows, 'relatorio-pop-churros.csv');
    showToast('Arquivo exportado');
  });

  document.getElementById('print-report')?.addEventListener('click', () => window.print());

  document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.settings.adminEmail = document.getElementById('settings-email').value;
    state.settings.adminPassword = document.getElementById('settings-password').value;
    saveToApi('/settings', { admin_email: state.settings.adminEmail, admin_password: state.settings.adminPassword, contract_template: state.settings.contractTemplate }).catch(console.error);
    saveState();
    showToast('Configurações salvas');
  });

  document.getElementById('save-theme')?.addEventListener('click', () => {
    state.theme = document.getElementById('theme-select').value;
    document.body.classList.toggle('light', state.theme === 'light');
    saveState();
    render();
  });

  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (email === state.settings.adminEmail && password === state.settings.adminPassword) {
      state.loggedIn = true;
      state.mode = 'admin';
      state.showLogin = false;
      state.currentView = 'dashboard';
      saveState();
      render();
      showToast('Login realizado');
    } else {
      showToast('Credenciais inválidas');
    }
  });

  document.getElementById('close-login')?.addEventListener('click', () => {
    state.showLogin = false;
    render();
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    state.loggedIn = false;
    state.mode = 'public';
    state.publicView = 'home';
    state.showLogin = false;
    saveState();
    render();
  });

  const canvas = document.getElementById('signature-canvas');
  if (canvas) {
    const context = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 180 * 2;
    context.scale(2, 2);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#14213d';
    let drawing = false;
    const startDraw = (event) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX || event.touches?.[0]?.clientX) - rect.left;
      const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;
      context.beginPath();
      context.moveTo(x, y);
    };
    const draw = (event) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX || event.touches?.[0]?.clientX) - rect.left;
      const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;
      context.lineTo(x, y);
      context.stroke();
    };
    const stopDraw = () => {
      drawing = false;
      state.signatureData = canvas.toDataURL();
    };
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e.touches[0]); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); }, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
  }

  document.querySelectorAll('[data-action="print-contract-item"]').forEach(btn => btn.addEventListener('click', () => window.print()));
  document.querySelectorAll('[data-action="download-contract"]').forEach(btn => btn.addEventListener('click', () => {
    const contract = state.contracts.find(item => item.id === btn.getAttribute('data-id'));
    if (!contract) return;
    const blob = new Blob([contract.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }));

  document.querySelectorAll('[data-action="print-receipt"]').forEach(btn => btn.addEventListener('click', () => window.print()));
}

function renderLoginModal() {
  return `
    <div class="login-modal">
      <div class="login-card">
        <div class="section-title"><h3>Login administrativo</h3><button class="icon-btn" id="close-login">✕</button></div>
        <form id="login-form">
          <label>E-mail<input id="login-email" type="email" required /></label>
          <label>Senha<input id="login-password" type="password" required /></label>
          <div class="actions" style="margin-top: 12px;"><button class="primary-btn" type="submit">Entrar</button></div>
        </form>
      </div>
    </div>
  `;
}

function showToast(message) {
  state.toast = message;
  render();
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function downloadCsv(rows, fileName) {
  const csv = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

init();
