import winston from "winston";

const consoleFormat = winston.format.combine( // هنا بنحدد شكل اللوج اللي هيظهر في الكونسول
  winston.format.colorize({ all: true }), // هنا بنلون اللوج حسب نوعه (error, info, debug)
  winston.format.timestamp({ format: "HH:mm:ss" }), // هنا بنضيف توقيت لكل لوج

  winston.format.printf(({ timestamp, level, message, ...meta }) => { // هنا بنحدد شكل اللوج اللي هيظهر في الكونسول
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] : ${level} : ${message}${metaStr}`;
  })
);

const fileFormat = winston.format.combine( // هنا بنحدد شكل اللوج اللي هيظهر في الملفات
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = winston.createLogger({ // هنا بننشئ اللوجر ونحدد مستواه (info في الإنتاج و debug في التطوير) والوسائل اللي هيستخدمها (كونسول وملفات)
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [ // هنا بنحدد الوسائل اللي هيستخدمها اللوجر (كونسول وملفات)
    new winston.transports.Console({ format: consoleFormat }), // هنا بنضيف وسيلة الكونسول ونحدد شكل اللوج اللي هيظهر فيه
    new winston.transports.File({ // هنا بنضيف وسيلة الملف ونحدد اسم الملف وشكل اللوج اللي هيظهر فيه
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
    }),
    new winston.transports.File({ // هنا بنضيف وسيلة الملف ونحدد اسم الملف وشكل اللوج اللي هيظهر فيه
      filename: "logs/combined.log",
      format: fileFormat,
    }),
  ],
});
