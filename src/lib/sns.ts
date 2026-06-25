import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { config } from '../config/env';

const sns = new SNSClient({});

// Envia un mensaje cualquiera al topico (Subject debe ser ASCII y < 100 chars).
export const publicarMensaje = async (subject: string, message: string): Promise<void> => {
    await sns.send(new PublishCommand({ TopicArn: config.alertTopicArn, Subject: subject, Message: message }));
};

export const publicarAlerta = async (
    userId: string, mes: string, totalHormiga: number, umbral: number,
): Promise<void> => {
    const mensaje =
        `Alerta de gastos hormiga\n\n` +
        `Tus gastos hormiga de ${mes} ya suman S/ ${totalHormiga.toFixed(2)}, ` +
        `por encima de tu limite de S/ ${umbral.toFixed(2)}.\n\n` +
        `Usuario: ${userId}\nRevisa tu resumen para ver por donde se esta yendo la plata.`;
    await publicarMensaje(`Gastos hormiga sobre el limite (${mes})`, mensaje);
};