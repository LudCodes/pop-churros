import json
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / 'pop_churros.db'


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            unit_price REAL NOT NULL,
            stock INTEGER NOT NULL,
            reserved INTEGER NOT NULL DEFAULT 0,
            image TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            cpf TEXT,
            phone TEXT,
            email TEXT,
            address TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS quotes (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            client_name TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            event_date TEXT,
            event_time TEXT,
            items TEXT NOT NULL,
            observations TEXT,
            total REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Orçamento'
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS contracts (
            id TEXT PRIMARY KEY,
            quote_id TEXT NOT NULL,
            client_name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            total REAL NOT NULL,
            content TEXT NOT NULL,
            signature TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS receipts (
            id TEXT PRIMARY KEY,
            client_name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            value REAL NOT NULL,
            payment TEXT NOT NULL,
            reference TEXT,
            content TEXT NOT NULL
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            client TEXT NOT NULL,
            delivery_date TEXT,
            pickup_date TEXT,
            value REAL NOT NULL
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    seed_default_data()


def seed_default_data():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) FROM products')
    if cur.fetchone()[0] == 0:
        products = [
            ('p1','Mesa plástica','Mesas','Mesa de plástico resistente para eventos externos.',45,24,8,'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80'),
            ('p2','Cadeira plástica','Cadeiras','Cadeira plástica confortável e leve.',18,120,40,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'),
            ('p3','Mesa de madeira','Mesas','Mesa de madeira com acabamento sofisticado.',90,10,4,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'),
            ('p4','Cadeira de madeira','Cadeiras','Cadeira de madeira estilo rústico.',55,8,2,'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80'),
            ('p5','Capa para cadeira','Acessórios','Capa elegante para compor a decoração.',12,60,18,'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80'),
            ('p6','Toalha de mesa','Acessórios','Toalha de mesa em tecido premium.',22,35,12,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'),
            ('p7','Tenda','Estruturas','Tenda para espaços ao ar livre.',260,5,2,'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80'),
            ('p8','Pula-pula','Diversão','Estrutura inflável para crianças.',180,3,1,'https://images.unsplash.com/photo-1532330393533-5f7d0b20f8b6?auto=format&fit=crop&w=900&q=80'),
            ('p9','Máquina de algodão doce','Diversão','Máquina para servir algodão doce.',140,4,1,'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'),
            ('p10','Máquina de pipoca','Diversão','Máquina para servir pipoca fresca.',130,4,2,'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'),
        ]
        cur.executemany('INSERT INTO products VALUES (?,?,?,?,?,?,?,?)', products)
    cur.execute('SELECT COUNT(*) FROM settings')
    if cur.fetchone()[0] == 0:
        cur.execute("INSERT INTO settings VALUES ('admin_email', 'admin@popchurros.com')")
        cur.execute("INSERT INTO settings VALUES ('admin_password', '123456')")
        cur.execute("INSERT INTO settings VALUES ('contract_template', 'Contrato de Locação\nA empresa Pop Churros compromete-se a fornecer os itens descritos para o cliente {{cliente}}, CPF {{cpf}}, para utilização no evento realizado em {{data_evento}}. Valor total do contrato: R$ {{valor_total}}.')")
    conn.commit()
    conn.close()


def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path == '/api/products':
            self.send_json(get_products())
        elif path == '/api/clients':
            self.send_json(get_clients())
        elif path == '/api/quotes':
            self.send_json(get_quotes())
        elif path == '/api/contracts':
            self.send_json(get_contracts())
        elif path == '/api/receipts':
            self.send_json(get_receipts())
        elif path == '/api/events':
            self.send_json(get_events())
        elif path == '/api/settings':
            self.send_json(get_settings())
        else:
            self.serve_static(path)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length).decode('utf-8')
        data = json.loads(body) if body else {}
        if path == '/api/products':
            self.send_json(create_product(data))
        elif path == '/api/clients':
            self.send_json(create_client(data))
        elif path == '/api/quotes':
            self.send_json(create_quote(data))
        elif path == '/api/contracts':
            self.send_json(create_contract(data))
        elif path == '/api/receipts':
            self.send_json(create_receipt(data))
        elif path == '/api/events':
            self.send_json(create_event(data))
        elif path == '/api/settings':
            self.send_json(save_settings(data))
        else:
            self.send_error(404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length).decode('utf-8')
        data = json.loads(body) if body else {}
        if path.startswith('/api/products/'):
            self.send_json(update_product(path.split('/')[-1], data))
        elif path.startswith('/api/clients/'):
            self.send_json(update_client(path.split('/')[-1], data))
        elif path.startswith('/api/quotes/'):
            self.send_json(update_quote(path.split('/')[-1], data))
        else:
            self.send_error(404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path.startswith('/api/products/'):
            self.send_json(delete_product(path.split('/')[-1]))
        elif path.startswith('/api/clients/'):
            self.send_json(delete_client(path.split('/')[-1]))
        elif path.startswith('/api/quotes/'):
            self.send_json(delete_quote(path.split('/')[-1]))
        else:
            self.send_error(404)

    def serve_static(self, path):
        if path in ('/', ''):
            path = '/index.html'
        file_path = ROOT / path.lstrip('/')
        if file_path.exists() and file_path.is_file():
            content_type = 'text/html' if file_path.suffix == '.html' else 'application/javascript' if file_path.suffix == '.js' else 'text/css'
            data = file_path.read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_error(404)

    def send_json(self, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def get_products():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT * FROM products ORDER BY name').fetchall()
    conn.close()
    return rows


def get_clients():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT * FROM clients ORDER BY name').fetchall()
    conn.close()
    return rows


def get_quotes():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT * FROM quotes ORDER BY created_at DESC').fetchall()
    conn.close()
    return rows


def get_contracts():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT * FROM contracts ORDER BY created_at DESC').fetchall()
    conn.close()
    return rows


def get_receipts():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT * FROM receipts ORDER BY created_at DESC').fetchall()
    conn.close()
    return rows


def get_events():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT * FROM events ORDER BY delivery_date').fetchall()
    conn.close()
    return rows


def get_settings():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    rows = conn.execute('SELECT key, value FROM settings').fetchall()
    conn.close()
    return {row['key']: row['value'] for row in rows}


def create_product(data):
    conn = sqlite3.connect(DB_PATH)
    product_id = data.get('id') or f"p{int(__import__('time').time())}"
    conn.execute('INSERT INTO products VALUES (?,?,?,?,?,?,?,?)', (product_id, data['name'], data['category'], data.get('description',''), float(data.get('unitPrice',0)), int(data.get('stock',0)), int(data.get('reserved',0)), data.get('image','')))
    conn.commit()
    conn.close()
    return {'ok': True, 'id': product_id}


def create_client(data):
    conn = sqlite3.connect(DB_PATH)
    client_id = data.get('id') or f"c{int(__import__('time').time())}"
    conn.execute('INSERT INTO clients VALUES (?,?,?,?,?,?)', (client_id, data['name'], data.get('cpf',''), data.get('phone',''), data.get('email',''), data.get('address','')))
    conn.commit()
    conn.close()
    return {'ok': True, 'id': client_id}


def create_quote(data):
    conn = sqlite3.connect(DB_PATH)
    quote_id = data.get('id') or f"Q-{int(__import__('time').time())}"
    items_json = json.dumps(data.get('items', []))
    conn.execute('INSERT INTO quotes VALUES (?,?,?,?,?,?,?,?,?,?,?)', (quote_id, data.get('createdAt') or __import__('datetime').datetime.now().strftime('%Y-%m-%d'), data.get('clientName',''), data.get('phone',''), data.get('address',''), data.get('eventDate',''), data.get('eventTime',''), items_json, data.get('observations',''), float(data.get('total',0)), data.get('status','Orçamento')))
    conn.commit()
    conn.close()
    return {'ok': True, 'id': quote_id}


def create_contract(data):
    conn = sqlite3.connect(DB_PATH)
    contract_id = data.get('id') or f"C-{int(__import__('time').time())}"
    conn.execute('INSERT INTO contracts VALUES (?,?,?,?,?,?,?)', (contract_id, data.get('quoteId',''), data.get('clientName',''), data.get('createdAt') or __import__('datetime').datetime.now().strftime('%Y-%m-%d'), float(data.get('total',0)), data.get('content',''), data.get('signature','')))
    conn.commit()
    conn.close()
    return {'ok': True, 'id': contract_id}


def create_receipt(data):
    conn = sqlite3.connect(DB_PATH)
    receipt_id = data.get('id') or f"R-{int(__import__('time').time())}"
    conn.execute('INSERT INTO receipts VALUES (?,?,?,?,?,?,?)', (receipt_id, data.get('clientName',''), data.get('createdAt') or __import__('datetime').datetime.now().strftime('%Y-%m-%d'), float(data.get('value',0)), data.get('payment',''), data.get('reference',''), data.get('content','')))
    conn.commit()
    conn.close()
    return {'ok': True, 'id': receipt_id}


def create_event(data):
    conn = sqlite3.connect(DB_PATH)
    event_id = data.get('id') or f"e{int(__import__('time').time())}"
    conn.execute('INSERT INTO events VALUES (?,?,?,?,?,?)', (event_id, data.get('title',''), data.get('client',''), data.get('deliveryDate',''), data.get('pickupDate',''), float(data.get('value',0))))
    conn.commit()
    conn.close()
    return {'ok': True, 'id': event_id}


def save_settings(data):
    conn = sqlite3.connect(DB_PATH)
    for key, value in data.items():
        conn.execute('INSERT OR REPLACE INTO settings VALUES (?, ?)', (key, value))
    conn.commit()
    conn.close()
    return {'ok': True}


def update_product(product_id, data):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('UPDATE products SET name=?, category=?, description=?, unit_price=?, stock=?, reserved=?, image=? WHERE id=?', (data['name'], data['category'], data.get('description',''), float(data.get('unitPrice',0)), int(data.get('stock',0)), int(data.get('reserved',0)), data.get('image',''), product_id))
    conn.commit()
    conn.close()
    return {'ok': True}


def update_client(client_id, data):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('UPDATE clients SET name=?, cpf=?, phone=?, email=?, address=? WHERE id=?', (data['name'], data.get('cpf',''), data.get('phone',''), data.get('email',''), data.get('address',''), client_id))
    conn.commit()
    conn.close()
    return {'ok': True}


def update_quote(quote_id, data):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('UPDATE quotes SET items=?, observations=?, total=?, status=? WHERE id=?', (json.dumps(data.get('items', [])), data.get('observations',''), float(data.get('total',0)), data.get('status','Orçamento'), quote_id))
    conn.commit()
    conn.close()
    return {'ok': True}


def delete_product(product_id):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('DELETE FROM products WHERE id=?', (product_id,))
    conn.commit()
    conn.close()
    return {'ok': True}


def delete_client(client_id):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('DELETE FROM clients WHERE id=?', (client_id,))
    conn.commit()
    conn.close()
    return {'ok': True}


def delete_quote(quote_id):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('DELETE FROM quotes WHERE id=?', (quote_id,))
    conn.commit()
    conn.close()
    return {'ok': True}


if __name__ == '__main__':
    init_db()
    server = ThreadingHTTPServer(('0.0.0.0', 8000), Handler)
    print('Servidor Pop Churros rodando em http://127.0.0.1:8000')
    server.serve_forever()
