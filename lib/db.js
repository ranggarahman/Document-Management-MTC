// import sql from 'mssql';

// const dbConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT, 10),
//   options: {
//     encrypt: true, // For Azure SQL or other cloud providers
//     trustServerCertificate: true, // Change to false for production if you have a trusted certificate
//   },
// };

// // A global variable to hold the connection pool.
// // This helps in reusing the connection across serverless function invocations.
// let poolPromise = null;

// const getPool = async () => {
//   if (!poolPromise) {
//     console.log('Creating new MSSQL connection pool...');
//     poolPromise = sql.connect(dbConfig).catch(err => {
//       // If connection fails, reset the promise so we can try again on the next request.
//       poolPromise = null;
//       console.error('Database connection failed:', err);
//       throw err;
//     });
//   } else {
//     console.log('Reusing existing MSSQL connection pool.');
//   }
//   return poolPromise;
// };

// export { getPool, sql };