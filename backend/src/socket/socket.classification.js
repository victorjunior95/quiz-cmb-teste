const userUtils = require("../utils/users");

const listUsers = (socket) => {
  return (roomId) => {
    // Quando um cliente se conecta, envie a classificação atual
    const data = userUtils.userRead();
    const jsonData = data[roomId].users;
  
    socket.emit('listUsersResponse', jsonData);
  };
};

module.exports = {
  listUsers,
}