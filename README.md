# Pop Churros

Sistema web completo para gestão de locação de mesas, cadeiras e itens para eventos, com portal do cliente, painel administrativo, orçamento, contratos, PDF e integração para WhatsApp.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- JWT
- PDFKit

## Como executar

1. Instale as dependências:
   - npm install
2. Crie o arquivo .env com base em .env.example
3. Suba o banco PostgreSQL:
   - docker-compose up -d
4. Execute as migrações Prisma:
   - npx prisma migrate dev
5. Rode o seed inicial:
   - npx prisma db seed
6. Inicie a aplicação:
   - npm run dev

## Acesso administrativo

- E-mail: topshops39@gmail.com
- Senha: 123456

## Funcionalidades entregues

- Catálogo público com categorias e busca
- Carrinho e solicitação de orçamento
- Painel administrativo com dashboard e páginas de produtos, categorias, orçamentos e configurações
- Geração de PDF para orçamento
- Banco Prisma com seed inicial
