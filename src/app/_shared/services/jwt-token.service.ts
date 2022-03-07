import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  private ROLE       = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  private EXPIRATION = 'exp';

  getRoleFromToken(token: string) {

    const payload = this.parseToken(token);

    return payload[this.ROLE];
  }

  getExpirationFromToken(token: string) {

    const payload = this.parseToken(token);
    return payload[this.EXPIRATION];
  }

  private parseToken(token) {

    const base64Url   = token.split('.')[1];
    const base64      = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64)
                                             .split('')
                                             .map(c => `%${('00' + c.charCodeAt(0)
                                               .toString(16)).slice(-2)}`)
                                             .join(''));

    return JSON.parse(jsonPayload);
  }
}
