module.exports = {
    database: {
        connectionLimit: 10,
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'root128',
        database: process.env.DATABASE_NAME || 'AppointmentSys'
    },
    port: process.env.PORT || 8080
};