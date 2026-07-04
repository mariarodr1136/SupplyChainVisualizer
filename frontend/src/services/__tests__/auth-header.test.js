import { describe, it, expect, beforeEach } from 'vitest';
import authHeader from '../auth-header';

describe('authHeader', () => {
  beforeEach(() => localStorage.clear());

  it('returns a Bearer header when the stored user has a token', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'maria', token: 'jwt-123' }));
    expect(authHeader()).toEqual({ Authorization: 'Bearer jwt-123' });
  });

  it('returns an empty object when no user is stored', () => {
    expect(authHeader()).toEqual({});
  });

  it('returns an empty object for a guest user without a token', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
    expect(authHeader()).toEqual({});
  });
});
