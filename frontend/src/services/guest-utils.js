export const isGuestUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return Boolean(user && user.isGuest);
  } catch {
    return false;
  }
};

// Resolve with local guest data when a guest session is active, otherwise hit the API.
// Guest results are wrapped in { data } to match the axios response shape callers expect.
export const guestOr = (guestFn, apiFn) =>
  isGuestUser() ? Promise.resolve({ data: guestFn() }) : apiFn();
