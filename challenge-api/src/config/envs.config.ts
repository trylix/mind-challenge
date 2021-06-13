export default () => ({
  name: process.env.npm_package_name,
  port: parseInt(process.env.PORT, 10),
});
