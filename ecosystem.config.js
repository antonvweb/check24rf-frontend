module.exports = {
    apps: [
        {
            name: "check24rf-domain",             // имя процесса в PM2
            script: "npm",                   // запускаем npm
            args: "run start:domain",            // с этими аргументами (npm run start:ip)
            cwd: __dirname,                      // рабочая директория проекта (текущая папка)
            output: "./logs/pm2-out.log",        // куда писать стандартный вывод (stdout)
            error: "./logs/pm2-error.log",       // куда писать ошибки (stderr)
            merge_logs: true,                // объединять ли stdout и stderr в один поток (можно true/false)
            autorestart: true,               // автоматически перезапускать при падениях
            watch: false,                   // если true — PM2 будет следить за изменениями файлов и перезапускать
            max_restarts: 10,               // максимальное число рестартов в течение 1 минуты
            env: {
                NODE_ENV: "production"         // переменные окружения, которые будут доступны в процессе
            }
        }
    ]
};