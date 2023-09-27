const room = require('./socket.room.js');
const game = require('./socket.game.js');
// const question = require('./socket.question');
// const classification = require('./socket.classification');

const connection = (socket) => {
  // Room events
  socket.on('joinRoom', room.joinRoom(socket));

  // Game events
  socket.on('startGame', game.startGame(socket));

  socket.on('disconnect', () => {
    // Criar lógica para reestabelecer a conexão do usuário quando a página não carregar ou algo assim

    console.log('user disconnected');
  });
}

module.exports = connection;
