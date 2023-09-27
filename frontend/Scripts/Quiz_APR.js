const BASE_URL = 'https://quiz-cmb-teste-production.up.railway.app';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

socket.emit('connectAPR', ROOMID);

let perguntaAtual;

function exibirPergunta() {
  let quizLs = JSON.parse(localStorage.getItem("perguntasCompletas"));
  console.log(quizLs);

  const randomIndex = Math.floor(Math.random() * quizLs.length);
  perguntaAtual = quizLs[randomIndex];
  console.log(perguntaAtual);

  socket.emit('sendQuestion', perguntaAtual, ROOMID);

  const mainDiv = document.querySelector('#page_apr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior

  createDivQuestion(perguntaAtual.id, perguntaAtual.tema, perguntaAtual.pergunta, perguntaAtual.alternativas, perguntaAtual.imgPergunta, mainDiv);

  let perguntasUsadasLS = localStorage.getItem("perguntasUsadas");

  if (perguntasUsadasLS === null) {
    const initArray = [perguntaAtual];
    localStorage.setItem("perguntasUsadas", JSON.stringify(initArray));

    quizLs = quizLs.filter((object) => object.id !== perguntaAtual.id);
    localStorage.setItem("perguntasCompletas", JSON.stringify(quizLs));
  } else {
    const perguntasUsadasLSParsed = JSON.parse(perguntasUsadasLS);
    perguntasUsadasLSParsed.push(perguntaAtual);
    localStorage.setItem("perguntasUsadas", JSON.stringify(perguntasUsadasLSParsed));

    quizLs = quizLs.filter((object) => object.id !== perguntaAtual.id);
    localStorage.setItem("perguntasCompletas", JSON.stringify(quizLs));
  }
}

const createClassification = (classification) => {
  const schoolList = document.getElementById('schoolList');
  classification.forEach((element) => {
    const classificationDiv = document.createElement('div');
    classificationDiv.className = 'classificationDiv';
    classificationDiv.textContent = element.schoolName;
    const classificationSpan = document.createElement('span');
    classificationSpan.className = 'classificationSpan';
    classificationSpan.id = element.schoolName;
    classificationDiv.appendChild(classificationSpan);
    schoolList.appendChild(classificationDiv);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  exibirPergunta();
  const answer = document.getElementById('botaoResposta');
  const startTimerButton = document.getElementById('startTimerButton');

  socket.on('receiveQuestionTimer', (questionTime) => {
    initTimeQuestion(questionTime);
  });
  
  // Aparentemente sem uso - conferir com o time
  socket.emit('listUsers', ROOMID);

  socket.on('listUsers', (classification) => {
    createClassification(classification);
  });

  socket.on('schoolAnswered', (schoolName) => {
    const school = document.getElementById(schoolName);
    school.style.display = "block";
  });

  answer.addEventListener('click', async () => {
    window.location.href = "/pages/Answer_APR.html";
  });

  startTimerButton.addEventListener('click', () => {
    startTimerButton.disabled = true;
    answer.disabled = false;
    socket.emit('startQuestionTimer', ROOMID, (perguntaAtual.tempo / 1000));
  });
});

function createDivQuestion(id, tema, pergunta, alternativas, imagem, divAppend) {
  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const divImagem = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');

  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.className = 'textPergunta';
  textPergunta.id = id;
  divAlternativas.className = 'divAlternativas';

  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0, 1);
    textAlternativa.className = 'textAlternativa';

    divAlternativas.appendChild(textAlternativa);
  }

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);

  divPergunta.className = 'divPergunta';

  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");

  const divAlternativasImagem = document.createElement("div");
  divAlternativasImagem.className = "divAlternativasImagem";

  divAlternativasImagem.appendChild(divAlternativas);

  if (imagem !== "") {
    const imgElement = document.createElement('img');
    imgElement.src = imagem;
    imgElement.className = 'imgElement';
    divImagem.className = 'divImagem';
    divImagem.appendChild(imgElement);
    divAlternativasImagem.appendChild(divImagem);
  } else {
    divAlternativas.style.width = "100%";
  }

  divPergunta.className = 'divPergunta';
  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativasImagem);
}

function initTimeQuestion(questionTime) {
  // Busca elemento HTML para renderizar timer
  const questionTimeEle = document.getElementById('question-time');

  // Inicializa o contador com o tempo fornecido em segundos
  let remainingTime = questionTime;

  // Função para atualizar o contador na tela
  function updateTimer() {
    // Renderiza o tempo restante na tela
    questionTimeEle.textContent = remainingTime >= 10 ? remainingTime : '0' + remainingTime;

    // Reduz o tempo em 1 segundo
    remainingTime--;

    if (remainingTime <= 0) {
      // Redireciona para a página desejada quando o tempo acabar
      window.location.href = "/pages/Answer_APR.html";
    }
  }

  // Chama a função inicialmente para exibir o tempo inicial
  updateTimer();

  // Define um intervalo para atualizar o contador a cada segundo
  const timerInterval = setInterval(updateTimer, 1000);

  // Certifique-se de parar o intervalo quando o tempo acabar ou quando necessário
  if (remainingTime <= 0) {
    clearInterval(timerInterval);
  }
};
