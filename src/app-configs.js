export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "https://l1-proxy1.lumigame.com/game-api",
        authUrl: "https://l1-auth1.lumigame.com",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4000,
        hitJackpotTimeout: 200000,
        enableApiLogs: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:LmnBackend@10.10.50.12:39101,10.10.50.13:39101,10.10.50.14:39101/?replicaSet=L1pLocal",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "https://8eb9632f2663e57c838ec83febbee14f@sentry-k8s.lumigame.com/4",
        logIdentifier: "fourguardians",
        env: "DEV",
    },
    authenticateSettings: {
        url: "https://l1-auth1.lumigame.com",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://l1-proxy1.lumigame.com/user",
    },
    notificationServiceSettings: {
        url: "http://l1-proxy1.lumigame.com/notification/api",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    freeSpinLiveSeconds: 86400, // 1 day
    bonusLiveSeconds: 125,
    jackpotLiveSeconds: 63,
    otel: {
        system: "DEV",
        enabled: false,
        endpoint: "http://10.10.50.69:14268/api/traces",
    },
    gameManagementApiSettings: {
        BASE: "https://l1-proxy1.lumigame.com/game-management-service",
    },
    trackingApiSettings: {
        baseUrl: "https://l1-proxy1.lumigame.com/user-tracking-api",
    },
};
