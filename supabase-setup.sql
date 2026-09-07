-- ============================================
-- CarLance - Script de criação do banco Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT,
  cpf TEXT,
  email TEXT,
  celular TEXT,
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  nascimento TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Veículos
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  details TEXT,
  year TEXT,
  km INTEGER DEFAULT 0,
  price NUMERIC DEFAULT 0,
  type TEXT DEFAULT 'carro',
  icon TEXT DEFAULT '🚗',
  placa TEXT,
  cor TEXT,
  cambio TEXT,
  combustivel TEXT,
  nota TEXT,
  data_pregao TEXT,
  lote TEXT,
  cod_veiculo TEXT,
  img TEXT,
  "desc" TEXT,
  obs TEXT,
  encerramento TEXT,
  current_bid NUMERIC DEFAULT 0,
  comissao NUMERIC DEFAULT 10,
  taxa NUMERIC DEFAULT 3,
  localizacao TEXT,
  laudo TEXT,
  condicoes TEXT,
  vistoria TEXT DEFAULT '[]',
  financiamento BOOLEAN DEFAULT false,
  pago BOOLEAN DEFAULT true,
  loteado BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Lances
CREATE TABLE IF NOT EXISTS bids (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT,
  vehicle_name TEXT,
  vehicle_id BIGINT,
  value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Solicitações de Venda
CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT,
  telefone TEXT,
  email TEXT,
  veiculo TEXT,
  placa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de acesso (leitura pública, escrita autenticada)
-- Para o admin funcionar sem auth, vamos permitir tudo por enquanto
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for vehicles" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for bids" ON bids FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for sales" ON sales FOR ALL USING (true) WITH CHECK (true);
