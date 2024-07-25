export const EnvConfiguration = () => {
  return {
    server: {
      port: process.env.PORT || 3001,
      jwtsecretkey: process.env.JWTSECRETKEY,
      jwtrefreshtokenkey: process.env.JWTREFRESHTOKENKEY,
    },
    database: {
      connectionString: process.env.DB_CONNECTION_STRING,
    },
  };
};
