type LogMethod = "info" | "warn" | "error" | "debug";

const write = (level: LogMethod, message: string, ...meta: unknown[]) => {
  const output = `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;

  if (level === "error") {
    console.error(output, ...meta);
    return;
  }

  if (level === "warn") {
    console.warn(output, ...meta);
    return;
  }

  if (level === "debug") {
    console.debug(output, ...meta);
    return;
  }

  console.info(output, ...meta);
};

export const logger = {
  info: (message: string, ...meta: unknown[]) =>
    write("info", message, ...meta),
  warn: (message: string, ...meta: unknown[]) =>
    write("warn", message, ...meta),
  error: (message: string, ...meta: unknown[]) =>
    write("error", message, ...meta),
  debug: (message: string, ...meta: unknown[]) =>
    write("debug", message, ...meta),
};
