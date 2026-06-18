type Meta = Record<string, unknown>;

// En Lambda, console.* va directo a CloudWatch Logs.
export const logger = {
  info: (msg: string, meta: Meta = {}) =>
    console.log(JSON.stringify({ level: 'info', msg, ...meta })),
  warn: (msg: string, meta: Meta = {}) =>
    console.warn(JSON.stringify({ level: 'warn', msg, ...meta })),
  error: (msg: string, meta: Meta = {}) =>
    console.error(JSON.stringify({ level: 'error', msg, ...meta })),
};
