import app from '../server/src/index.js';

export default function handler(req, res) {
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  const apiPath = requestUrl.searchParams.get('__api_path');
  if (apiPath !== null) {
    requestUrl.searchParams.delete('__api_path');
    const route = apiPath.split('/').filter(Boolean).join('/');
    req.url = `/api/${route}${requestUrl.search}`;
  }
  return app(req, res);
}
