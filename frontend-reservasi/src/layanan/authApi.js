import { panggilApi } from './koneksiApi';

export function loginInternal(dataLogin) {
  return panggilApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dataLogin),
  });
}
