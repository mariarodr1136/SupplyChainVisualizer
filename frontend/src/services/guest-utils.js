export const isGuestUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return Boolean(user && user.isGuest);
  } catch (err) {
    return false;
  }
};

