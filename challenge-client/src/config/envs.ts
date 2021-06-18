export interface IAppConfig {
  apiUrl: string;
}

export default (): IAppConfig => ({
  apiUrl:
    process.env.REACT_APP_API_URL || 'https://conduit.productionready.io/api',
});
