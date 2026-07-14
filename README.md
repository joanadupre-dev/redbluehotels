# RedBlue Hotels

Site institucional + painel admin para cadastro de hotéis. Feito com
Next.js, Prisma (Postgres) e Tailwind CSS — pronto para rodar 100%
gratuito em Vercel + Neon + Cloudinary.

## O que tem pronto

- **Site público**: Home (hero, cobertura, carrossel de destaques, como
  funciona, formulário de tarifa corporativa) e Hotéis (intro para SEO,
  filtro por cidade/categoria/estrelas, grid, seção de Instalações e CTA
  final) — só 2 páginas, além da página de cada hotel.
- **Botão de WhatsApp** flutuante em todas as páginas, com mensagem
  pré-preenchida.
- **Cores da marca**: paleta extraída da logo real (azul `#244F9D` e
  vermelho `#BF342F`).
- **Formulário de orçamento**: aparece na Home e na página de cada hotel.
  Cada envio fica salvo no banco (tabela `Orcamento`).
- **Painel admin** (`/admin`): login único da agência, lista de hotéis
  cadastrados, cadastrar/editar/excluir hotel, upload de fotos (via
  Cloudinary), categoria (Praia/Serra/Cidade/Campo), perfil corporativo
  (sala de eventos, traslado), destaque no carrossel e status
  publicado/rascunho.
- **Preencher automaticamente a partir de uma URL** (só no cadastro de
  hotel novo): cola o link do site do hotel e o sistema tenta extrair
  nome, descrição, endereço, cidade/estado e foto principal — gratuito,
  sem usar IA, lendo dados estruturados (schema.org) e meta tags Open
  Graph da página. Sempre precisa conferir/ajustar antes de salvar, já
  que a extração não é perfeita.
- **Conteúdo do site editável** (`/admin/conteudo`): textos da Home
  (hero, cobertura, como funciona, formulário) e da página Hotéis (intro
  de SEO), telefone/e-mail e frase do rodapé — tudo editável sem mexer
  em código.

## Colocando no ar de graça (Vercel + Neon + Cloudinary)

### 1. Banco de dados — Neon (gratuito)
1. Crie conta em [neon.tech](https://neon.tech)
2. Crie um projeto novo (ex: `redblue-hotels`)
3. Copie a **connection string** que ele mostrar (algo como
   `postgresql://usuario:senha@ep-xxxx.neon.tech/neondb?sslmode=require`)

### 2. Fotos — Cloudinary (gratuito)
1. Crie conta em [cloudinary.com](https://cloudinary.com)
2. No Dashboard, copie: **Cloud Name**, **API Key** e **API Secret**

### 3. Código no GitHub
```bash
git init
git add .
git commit -m "Site inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/redblue-hotels.git
git push -u origin main
```

### 4. Deploy — Vercel (gratuito)
1. Crie conta em [vercel.com](https://vercel.com) (pode logar com GitHub)
2. **Add New → Project** → selecione o repositório `redblue-hotels`
3. Em **Environment Variables**, adicione:
   ```
   DATABASE_URL=<connection string do Neon>
   ADMIN_EMAIL=seuemail@redbluehotels.com.br
   ADMIN_PASSWORD=uma-senha-forte-aqui
   JWT_SECRET=uma-string-aleatoria-bem-grande
   CLOUDINARY_CLOUD_NAME=<do Cloudinary>
   CLOUDINARY_API_KEY=<do Cloudinary>
   CLOUDINARY_API_SECRET=<do Cloudinary>
   ```
4. Clique em **Deploy**

### 5. Criar as tabelas no banco (uma única vez)
No seu computador, com o `.env` local preenchido com a `DATABASE_URL` do
Neon:
```bash
npm install
npx prisma db push
npm run db:seed   # opcional: cria 2 hotéis de exemplo
```

Pronto — o site já está no ar na URL que a Vercel deu (algo como
`redblue-hotels.vercel.app`). Teste o `/admin` nela antes de apontar o
domínio.

### 6. Apontar o domínio redbluehotels.com.br
- Na Vercel: **Settings → Domains** → adicione `redbluehotels.com.br`
- Ela mostra os registros (A ou CNAME) pra configurar no painel do seu
  domínio (Registro.br, GoDaddy etc.)
- A propagação leva de alguns minutos até 24h

Tudo isso fica dentro do plano gratuito da Vercel, Neon e Cloudinary
enquanto o volume de uso for de um site institucional normal (não é
esperado pagar nada pra manter isso no ar).

## Como rodar localmente (pra testar antes de publicar)

```bash
npm install
cp .env.example .env
# preencha DATABASE_URL (Neon), ADMIN_EMAIL/PASSWORD, JWT_SECRET e as
# variáveis do Cloudinary no .env
npm run db:push
npm run db:seed   # opcional
npm run dev
```

Acesse http://localhost:3000 para o site e http://localhost:3000/admin
para o painel.

## Como cadastrar um hotel (fluxo do dia a dia)

1. Entrar em `/admin` com o login da agência.
2. Clicar em **"+ Novo hotel"**.
3. Preencher nome, cidade, UF, estrelas, endereço, descrição.
4. Adicionar comodidades (Wi-Fi, piscina, etc.) uma por uma.
5. Enviar as fotos do hotel.
6. Marcar "Publicado" para o hotel aparecer no site (ou deixar como
   rascunho para revisar depois).
7. Salvar — o hotel já aparece em `/hoteis` e ganha sua própria página em
   `/hoteis/nome-do-hotel` automaticamente. Não precisa mexer em código.

## Estrutura do projeto

```
src/
  app/                  páginas (App Router do Next.js)
    admin/               painel administrativo
    api/                 rotas de API (hotéis, upload, login, orçamento)
    hoteis/[slug]/       página de cada hotel
  components/            componentes reutilizáveis (formulários, cards)
  lib/                   conexão com banco e autenticação
prisma/
  schema.prisma          modelo do banco (Hotel, Orcamento)
  seed.js                dados de exemplo
```

## Senha do painel

- A senha **inicial** vem de `ADMIN_PASSWORD` no `.env`.
- A Simone pode trocar a senha a qualquer momento no painel, em
  **Trocar senha** (`/admin/senha`). A partir daí, vale a nova senha
  (guardada com segurança no banco, como hash — nunca em texto puro).

### Esqueci a senha

Se a senha for esquecida, dá para "resetar" para a senha do `.env`:
1. Acesse o banco no painel do Neon (aba **SQL Editor**).
2. Rode: `DELETE FROM "AdminConfig";`
3. Pronto — o login volta a aceitar a senha do `ADMIN_PASSWORD` do `.env`,
   e a Simone pode definir uma nova senha pelo painel novamente.

## Próximos passos sugeridos

- Notificação automática (e-mail ou WhatsApp) quando um orçamento é
  enviado — hoje ele só fica salvo no banco.
- Paginação na listagem de hotéis quando passar de ~20 cadastrados.
- Múltiplos usuários admin (hoje é um único login fixo).
