# Sandbox OA API (V1)

> **Aviso legal:** este projeto é **source-available** sob PolyForm Noncommercial 1.0.0 e **não é open source aprovado pela OSI**.

## Arquitetura

Projeto NestJS em TypeScript com organização em camadas:

- `src/modules/*` (API e casos de uso por contexto)
- `src/domain`, `src/application`, `src/infrastructure`, `src/contracts`, `src/shared`
- Prisma + SQLite para índice transacional
- Artefatos completos em filesystem (`/data/executions/...`)

## Fluxo V1

1. Cadastro de repositório/componente.
2. Descoberta de variáveis (`.env*`), mapeamento e render de `.env.generated`.
3. Validação de receita YAML via JSON Schema.
4. Planejamento/provisionamento de infra (LocalStack provider V1).
5. Execução em runtime Node com isolamento por processo, timeout, captura stdout/stderr, duração e memória estimada.
6. Bridge interno SNS->SQS (abstração por `MessagePublisher`) e poller de execução.
7. Persistência híbrida:
   - índice no SQLite (Prisma)
   - artefatos em `/data/executions/<componentId>/<yyyy>/<mm>/<dd>/<runId>.json`

## Limitações V1

- Integrações AWS/LocalStack em modo adapter stub para evolução incremental.
- Git provider ainda sem clone real com credenciais.
- Runtime executa entrypoint Node localmente (não sandbox kernel-level).

## Segurança

- Receita validada por JSON Schema antes de executar.
- Timeout obrigatório no runtime.
- Separação entre metadados (SQLite) e artefatos (filesystem) para auditoria.

## Docker Compose (exemplo)

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    volumes:
      - ./data:/data
  db:
    image: nouchka/sqlite3
```

## Como rodar

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Swagger/OpenAPI: `GET /openapi`
