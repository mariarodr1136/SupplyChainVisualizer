import { describe, it, expect, beforeEach } from 'vitest';
import { isGuestUser, guestOr } from '../guest-utils';

describe('isGuestUser', () => {
  beforeEach(() => localStorage.clear());

  it('returns false when no user is stored', () => {
    expect(isGuestUser()).toBe(false);
  });

  it('returns false for a regular logged-in user', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'maria', token: 'abc' }));
    expect(isGuestUser()).toBe(false);
  });

  it('returns true for a guest user', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
    expect(isGuestUser()).toBe(true);
  });

  it('returns false when stored user is corrupt JSON', () => {
    localStorage.setItem('user', '{not json');
    expect(isGuestUser()).toBe(false);
  });
});

describe('guestOr', () => {
  beforeEach(() => localStorage.clear());

  it('resolves guest data wrapped in an axios-like { data } shape for guests', async () => {
    localStorage.setItem('user', JSON.stringify({ isGuest: true }));
    const result = await guestOr(
      () => [{ id: 1 }],
      () => {
        throw new Error('API must not be called in guest mode');
      }
    );
    expect(result).toEqual({ data: [{ id: 1 }] });
  });

  it('calls the API function for non-guest users', async () => {
    localStorage.setItem('user', JSON.stringify({ username: 'maria' }));
    const result = await guestOr(
      () => {
        throw new Error('guest data must not be used for logged-in users');
      },
      () => Promise.resolve({ data: 'from-api', status: 200 })
    );
    expect(result).toEqual({ data: 'from-api', status: 200 });
  });
});
