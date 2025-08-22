export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "https://l2-proxy2.lumigame.com/game-api",
        authUrl: "https://l2-auth2.lumigame.com/",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },

        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4000,
        hitJackpotTimeout: 200000,
        enabledApiLogs: true,
    },
    authenticateSettings: {
        url: "https://l2-auth2.lumigame.com/",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "https://l2-proxy2.lumigame.com/user",
    },
    notificationServiceSettings: {
        url: "https://l2-proxy2.lumigame.com/notification/api",
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:LmnBackend@10.10.50.12:39202,10.10.50.13:39202,10.10.50.14:39202/?replicaSet=L2ppLocal",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "https://8eb9632f2663e57c838ec83febbee14f@sentry-k8s.lumigame.com/4",
        logIdentifier: "fourguardians",
        env: "LOCAL_2",
    },

    notificationServiceSettings: {
        url: "http://l1-proxy1.lumigame.com/notification/api",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    freeSpinLiveSeconds: 300, // 1 day
    bonusLiveSeconds: 125,
    jackpotLiveSeconds: 63,
    otel: {
        system: "VG",
        enabled: true,
        endpoint: "http://10.10.50.69:4318/v1/traces",
    },
    gameManagementApiSettings: {
        BASE: "https://l2-proxy2.lumigame.com/game-management-service",
    },
    promotionApiSettings: {
        baseUrl: "https://l2-proxy2.lumigame.com/game-promotion-api/",
        timeout: 5000,
        useAuthentication: false,
    },
     trackingApiSettings: {
        baseUrl: "https://l2-proxy2.lumigame.com/user-tracking-api",
    },
};
