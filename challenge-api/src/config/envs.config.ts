export default () => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    name: process.env.npm_package_name,
    port: parseInt(process.env.PORT, 10),
    database: {
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      keepConnectionAlive: isDev,
      synchronize: isDev,
    },
  };
};
