module.exports = {
    apps: [
        {
            name: "check24rf-ip",             // имя процесса в PM2
            script: "npm",                   // запускаем npm
            args: "run start:ip",            // с этими аргументами (npm run start:ip)
            cwd: "/path/to/your/project",    // рабочая директория проекта (замени на свой путь)
            output: "/var/log/check24rf-ip.log",     // куда писать стандартный вывод (stdout)
            error: "/var/log/check24rf-ip.err.log",  // куда писать ошибки (stderr)
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
