const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);

const main = () => {
  // Limpa a chave que guarda o nome do usuário e o código da sala
  localStorage.removeItem("roomData");

  // Escuta o evento de loadingInitial.js > socket.game.js
  socket.on('gameStarted', () => {
    window.location.href = "/pages/Quiz_USR.html";
  });

  const sendButton = document.getElementById('sendButton');
  
  sendButton.addEventListener('click', async () => {
    // Recupera os elementos de input
    const inputElement = document.getElementById('textInput');
    const inputRoom = document.getElementById('roomIdInput');
    const inputRoomValue = inputRoom.value;
    const inputValue = inputElement.value;

    if (inputValue === "") {
      alert("Por favor, informe o nome de sua escola!");
      return;
    }

    if (inputRoomValue === "") {
      alert("Por favor, informe o código da sala!");
      return;
    }

    // Dados a serem enviados para o servidor
    const data = {
      user: inputValue,
      roomId: inputRoomValue
    };

    localStorage.setItem("roomData", JSON.stringify(data));

    // Evento para entrar na sala
    socket.emit('joinRoom', data.user, data.roomId);

    // Ativado qnd 'joinRoom' não identifica a sala com o código enviado
    socket.on('roomNotExists', () => {
      alert("Não foi possivel encontrar a sala com o código informado!");
      const sendButton = document.getElementById('sendButton');
      sendButton.style.display = "";

      const cLoaderContainer = document.getElementById('c-loader-container');
      cLoaderContainer.style.display = "none";
    });

    const sendButton = document.getElementById('sendButton');
    sendButton.style.display = "none";

    const cLoaderContainer = document.getElementById('c-loader-container');
    cLoaderContainer.style.display = "contents";
  });
};

window.onload = main;