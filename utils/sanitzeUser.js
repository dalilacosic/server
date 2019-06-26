// Function for restriction of user info
module.exports = (user) => {
  return user.map(x => ({
    user: { username: x.username, id: x._id },
    coords:{
      longitude: x.longitude,
      latitude: x.latitude }
  }));
};