# Control de Gastos — Backend Node.js + TypeScript sobre AWS

Backend serverless para registrar y analizar **gastos hormiga** (Yape, Plin, efectivo, retiros).
La estrella es el backend **Node.js / TypeScript**; AWS es la plataforma; **Angular** es el frontend (fase posterior).

## Arquitectura objetivo
Cognito · API Gateway (HTTP API) · AWS Lambda (Node.js/TS) · DynamoDB (+ Streams) · S3 · CloudFront · SQS · SNS · EventBridge Scheduler. Todo en servicios *always-free* (~$0/mes).

## Estructura (capas)
    src/
      handlers/      # entradas Lambda (delgadas: parsean y responden)
      services/      # logica de negocio (orquesta dominio + repositorio)
      repositories/  # acceso a datos DynamoDB (SDK v3, DocumentClient)
      domain/        # tipos del dominio + reglas (claves, flag hormiga)
      lib/           # utilidades (cliente DynamoDB, validacion, respuestas, logger, identidad)
      config/        # variables de entorno
    template.yaml    # infraestructura (AWS SAM, build con esbuild)
    tsconfig.json    # TypeScript

## Modelo de datos (tabla unica `control-gastos`)
    PK = USER#<userId>          SK = GASTO#<ulid>
    GSI1PK = USER#<userId>#<YYYY-MM>   GSI1SK = <fecha>#<ulid>   (consultas por mes)
Facturacion On-Demand (PAY_PER_REQUEST). En la Fase 1 el userId es fijo ("demo");
en la Fase 2 sera el `sub` de Cognito sin cambiar el modelo.

## Endpoints
    GET    /health                       -> estado del servicio
    POST   /gastos                       -> crea un gasto
    GET    /gastos                        -> lista gastos (mas recientes primero)
    GET    /gastos?mes=YYYY-MM            -> gastos de un mes (usa GSI1)
    GET    /gastos?categoria=&metodo=     -> filtra por categoria / metodo de pago
    GET    /gastos/{id}                  -> un gasto por id

Campos de un gasto:
    monto (number, >0), categoria (string), metodoPago (yape|plin|efectivo|tarjeta|otro),
    fecha (YYYY-MM-DD), comercio? (string), descripcion? (string)
    -> el backend agrega: id, esHormiga (monto < 20), createdAt, updatedAt

## Requisitos
- Node.js 20+   ·   AWS CLI v2   ·   AWS SAM CLI   ·   cuenta AWS (region us-east-1)

## Desplegar
    npm install          # instala esbuild, SDK v3 y ulid
    npm run typecheck    # opcional: revisa tipos
    sam build            # transpila TS -> JS (esbuild) y empaqueta
    sam deploy           # usa samconfig.toml de la Fase 0 (o: sam deploy --guided)

## Probar (ejemplo)
Crear un gasto (mas comodo desde Bruno/Postman):
    POST {GastosUrl}
    { "monto": 5.5, "categoria": "comida", "metodoPago": "yape", "fecha": "2026-06-15", "comercio": "Tambo" }

Listar el mes:
    GET {GastosUrl}?mes=2026-06

## Roadmap
- [x] Fase 0: setup + health check (TypeScript)
- [x] Fase 1: modelo DynamoDB + POST/GET /gastos
- [ ] Fase 2: CRUD completo (PUT/DELETE) + Cognito
- [ ] Fase 3: logica (reglas de categorizacion, resumen hormiga)
- [ ] Fase 4: event-driven (SQS, Streams, EventBridge, SNS)
- [ ] Fase 5: frontend Angular
- [ ] Fase 6: OCR (Tesseract.js)
- [ ] Fase 7: CI/CD + docs
