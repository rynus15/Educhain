import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,  
  apiUrlAuth: 'http://localhost:8000/biblioteca/v1'
};