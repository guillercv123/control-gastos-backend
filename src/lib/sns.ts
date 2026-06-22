import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { config } from '../config/env';

const sns = new SNSClient({});

export const publicarAlerta = async (
  userId: string,
  mes: string,
  totalHormiga: number,
  umbral: number,
): Promise<void> => {
  const mensaje =
    `Alerta de gastos hormiga\n\n` +
    `Tus gastos hormiga de ${mes} ya suman S/ ${totalHormiga.toFixed(2)}, ` +
    `por encima de tu limite de S/ ${umbral.toFixed(2)}.\n\n` +
    `Usuario: ${userId}\n` +
    `Revisa tu resumen para ver por donde se esta yendo la plata.`;

  await sns.send(
    new PublishCommand({
      TopicArn: config.alertTopicArn,
      Subject: `Gastos hormiga sobre el limite (${mes})`, // ASCII, < 100 chars
      Message: mensaje,
    }),
  );
};
