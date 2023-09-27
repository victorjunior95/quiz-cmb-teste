const BASE_URL = 'https://quiz-cmb-teste-production.up.railway.app';
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
