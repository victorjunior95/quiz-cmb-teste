const room = require('./socket.room');
const game = require('./socket.game');
const question = require('./socket.question');
const classification = require('./socket.classification');

const connection = (socket) => {
  // Room events
  socket.on('createRoom', room.createRoom(socket));
  socket.on('joinRoom', room.joinRoom(socket));
  socket.on('reentryRoom', room.reentryRoom(socket));
  socket.on('connectAPR', room.connectAPR(socket));
  socket.on('reentryRoomAnswerAPR', room.reentryRoomAnswerAPR(socket));
  socket.on('connectAPRClassification', room.connectAPRClassification(socket));
  socket.on('reentryClassification', room.reentryClassification(socket));

  // Game events
  socket.on('startGame', game.startGame(socket));

  // Question events
  socket.on('sendQuestion', question.sendQuestion(socket));
  socket.on('startQuestionTimer', question.startQuestionTimer(socket));
  socket.on('answerByUser', question.answerByUser(socket));

  // Classification events
  socket.on('listUsers', classification.listUsers(socket));

  socket.on('disconnect', (socket) => {
    console.log('user disconnected');
  });
}

module.exports = connection;
