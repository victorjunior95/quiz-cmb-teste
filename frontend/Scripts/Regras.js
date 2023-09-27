const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);

const main = () => {
  startGame()
}

const startGame = () => {
  const startButton = document.getElementById('comecarQuiz');
  startButton.addEventListener('click', () => {
    window.location.href = "/pages/LoadingInitial_APR.html";
  });
}

window.onload = main;
