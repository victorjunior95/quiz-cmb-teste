const userUtils = require('../utils/users');

const joinRoom = (socket) => (schoolName, roomId) => {
  const rooms = userUtils.userRead();
  if(!rooms[roomId]) {
    socket.emit('roomNotExists');
    return;
  }

  const users = rooms[roomId].users;
  const user = users.find((user) => user.schoolName === schoolName);

  // Aparentemente sem uso - conferir com time
  if (user) {
    socket.emit('schoolNameExists');
    return;
  }

  // Todos os usuários já começam com 10 pontos
  users.push({ id: users.length + 1, schoolName, points: 10 });

  userUtils.userWriteNewData(roomId, { ...rooms[roomId], users });
  socket.join(roomId);
  console.log(`User ${schoolName} connected to room ${roomId}`);
  socket.to(roomId).emit('currentUser', schoolName);
  socket.to(roomId).emit('usersConnected', users);
}

module.exports = {
  joinRoom,
}
