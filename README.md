# Control de Gastos — Backend Node.js + TypeScript sobre AWS

Backend serverless para registrar y analizar **gastos hormiga** (Yape, Plin, efectivo, retiros).
La estrella es el backend **Node.js / TypeScript**; AWS es la plataforma; **Angular** es el frontend (fase posterior).

## Arquitectura objetivo
Cognito · API Gateway (HTTP API) · AWS Lambda (Node.js/TS) · DynamoDB (+ Streams) · S3 · CloudFront · SQS · SNS · EventBridge Scheduler. Todo en servicios *always-free* (~$0/mes).

## Requisitos
- Node.js 20+        ->  node -v
- AWS CLI v2         ->  aws --version  /  aws sts get-caller-identity
- AWS SAM CLI        ->  sam --version
- Cuenta AWS (region recomendada: us-east-1)

## Estructura
    src/
      handlers/      # entradas Lambda (delgadas)
      services/      # logica de negocio
      repositories/  # acceso a datos (DynamoDB, SDK v3)
      lib/           # utilidades compartidas (respuestas, logger)
      config/        # configuracion / variables de entorno
    template.yaml    # infraestructura (AWS SAM, build con esbuild)
    tsconfig.json    # configuracion de TypeScript

## TypeScript
SAM transpila el TS automaticamente con **esbuild** (ver `Metadata.BuildMethod` en template.yaml).
No necesitas compilar a mano: `sam build` hace el bundling. Para revisar tipos sin desplegar:

    npm install
    npm run typecheck

## Desplegar (Fase 0)
    npm install          # instala esbuild + tipos (lo usa sam build)
    sam build            # transpila TS -> JS y empaqueta
    sam deploy --guided  # primera vez

Toma la URL de la salida HealthUrl y pruebala:
    curl https://XXXX.execute-api.us-east-1.amazonaws.com/health

## Roadmap
- [x] Fase 0: setup + health check (TypeScript)
- [ ] Fase 1: modelo DynamoDB + POST/GET /gastos
- [ ] Fase 2: CRUD + Cognito
- [ ] Fase 3: logica (reglas, resumen hormiga)
- [ ] Fase 4: event-driven (SQS, Streams, EventBridge, SNS)
- [ ] Fase 5: frontend Angular
- [ ] Fase 6: OCR (Tesseract.js)
- [ ] Fase 7: CI/CD + docs
