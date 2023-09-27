const startGame = (socket) => (roomId) => {
  socket.to(roomId).emit('gameStarted');
}

module.exports = {
  startGame,
}