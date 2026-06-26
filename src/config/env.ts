export interface AppConfig {
  serviceName: string;
  stage: string;
  region: string;
  tableName: string;
  alertTopicArn: string;
  umbralAlertaMensual: number;
  importBucket: string;
}

export const config: AppConfig = {
  serviceName: process.env.SERVICE_NAME ?? 'control-gastos-backend',
  stage: process.env.STAGE ?? 'dev',
  region: process.env.AWS_REGION ?? 'us-east-1',
  tableName: process.env.TABLE_NAME ?? '',
  alertTopicArn: process.env.ALERT_TOPIC_ARN ?? '',
  umbralAlertaMensual: Number(process.env.UMBRAL_ALERTA_MENSUAL ?? '100'),
  importBucket: process.env.IMPORT_BUCKET ?? '',
};