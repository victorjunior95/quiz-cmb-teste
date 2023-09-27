const userUtils = require('../utils/users');

const createRoom = (socket) => (room) => {
  userUtils.userWriteNewData(room, { users: [], answered: [] });
  socket.join(room);
}

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

const connectAPR = (socket) => (roomId) => {
  socket.join(roomId);
}

// Emitida pela Quiz_USR
const reentryRoom = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  socket.join(roomId);
  socket.emit('sendQuiz', room.atualQuestion);
}

const reentryRoomAnswerAPR = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  socket.join(roomId);
  socket.emit('sendQuiz', room.atualQuestion);
  socket.broadcast.to(roomId).emit('getAnswer');
}

const reentryClassification = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  const classification = room.users.sort((a, b) => b.points - a.points);

  socket.join(roomId);
  socket.emit('receiveClassification', classification);
  socket.broadcast.to(roomId).emit('getAnswer');
}

const connectAPRClassification = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  socket.join(roomId);

  const classification = room.users.sort((a, b) => b.points - a.points);

  socket.broadcast.to(roomId).emit('getClassification');
  socket.emit('receiveClassification', classification);
}

module.exports = {
  createRoom,
  joinRoom,
  connectAPR,
  reentryRoom,
  reentryRoomAnswerAPR,
  reentryClassification,
  connectAPRClassification,
}
