# 🚀 ETCD Manager (Next.js + ETCD 3)

Uma UI para administrar chaves/valores do ETCD 3.5.x, com frontend Next.js (App Router) e BFF integrado (API routes) usando `etcd3`.

## ✨ Principais features
- CRUD de chaves ETCD (listar, criar/editar, deletar) com React Query.
- Detecção de JSON, cópia rápida de chave/valor, drawer amplo para edição.
- Integração direta com ETCD 3 via API interna do Next.
- Pronto para contêiner (Dockerfile + docker-compose).

## 🧰 Stack
- Next.js 15 (App Router) + TypeScript
- React Query + shadcn/ui + Tailwind CSS
- ETCD v3 (cliente `etcd3` gRPC)

## 🔧 Variáveis de ambiente
- `ETCD_ENDPOINT` (ou `ETCD_ENDPOINTS`): endpoint do ETCD. Ex.: `http://nemesis-etcd:2379`
- `ETCD_CERT`, `ETCD_KEY`, `ETCD_CA` (opcionais): conteúdo PEM **ou** caminho do arquivo (para mTLS).
- `ETCD_USERNAME`, `ETCD_PASSWORD` (opcionais): credenciais RBAC.
- `NEXT_PUBLIC_ETCD_ENDPOINT` (opcional): texto exibido no header (ex.: `nemesis-etcd:2379`).
- `NEXT_PUBLIC_API_BASE` (opcional): base URL para o frontend chamar a API (deixe vazio quando o front roda junto).

## ▶️ Rodando localmente (dev)
```bash
# instalar deps
yarn install

# subir em dev (porta 3000 padrão do Next)
ETCD_ENDPOINT=http://127.0.0.1:2379 yarn dev
```
Acesse http://localhost:3000 (ou a porta escolhida). O front chama `/api/kv`, que fala com o ETCD via `ETCD_ENDPOINT`.

## 🐳 Docker
### Build & run direto
```bash
docker build -t etcd-manager .
docker run --rm -p 9100:3000 \
  -e ETCD_ENDPOINT=http://nemesis-etcd:2379 \
  -e NEXT_PUBLIC_ETCD_ENDPOINT=nemesis-etcd:2379 \
  --network nemesis-starter_nemesis \
  etcd-manager
```
- O contêiner ouve em 3000; mapeamos para 9100 no host.
- A rede externa `nemesis-starter_nemesis` já contém o ETCD com nome `nemesis-etcd`.

### docker-compose
```bash
docker-compose up --build
```
- Porta host: `9100` → container `3000`.
- Usa rede externa `nemesis-starter_nemesis`.
- ETCD esperado em `nemesis-etcd:2379` (ajuste variáveis se diferente).

## 📂 Estrutura rápida
- `src/app` — App Router, layout, páginas e API routes (`/api/kv`).
- `src/lib/etcd.ts` — cliente ETCD (gRPC) configurado via env.
- `src/lib/api.ts` — chamadas do front para as rotas internas.
- `src/components` — UI (header, toolbar, tabela, drawer, dialogs).

## ✅ Checklist antes de subir
- ETCD acessível a partir do backend (host/porta/rede corretos).
- Certs/usuário definidos se o cluster exigir TLS ou RBAC.
- Porta 9100 liberada no host.

Boas administrações! 🎉
