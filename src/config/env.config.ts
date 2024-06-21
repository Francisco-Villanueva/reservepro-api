export const EnvConfiguration = () => {
  type IEnviroments = 'development' | 'prodcution' | 'test';

  const EnviromentConfig: Record<IEnviroments, string> = {
    development: process.env.DB_dev_CONNECTION_STRING,
    prodcution: process.env.DB_prod_CONNECTION_STRING,
    test: process.env.DB_prod_CONNECTION_STRING,
  };
  return {
    server: {
      port: process.env.PORT || 3001,
      jwtsecretkey: process.env.JWTSECRETKEY,
      jwtrefreshtokenkey: process.env.JWTREFRESHTOKENKEY,
    },
    database: {
      connectionString: EnviromentConfig[process.env.NODE_ENV],
    },
  };
};
