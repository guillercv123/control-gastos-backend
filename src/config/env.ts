export interface AppConfig {
  serviceName: string;
  stage: string;
  region: string;
  tableName: string;
}

// Configuracion leida de variables de entorno (definidas en template.yaml).
export const config: AppConfig = {
  serviceName: process.env.SERVICE_NAME ?? 'control-gastos-backend',
  stage: process.env.STAGE ?? 'dev',
  region: process.env.AWS_REGION ?? 'us-east-1',
  tableName: process.env.TABLE_NAME ?? '', // se llenara en la Fase 1
};
