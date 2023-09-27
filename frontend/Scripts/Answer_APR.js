const BASE_URL = 'https://quiz-cmb-teste-production.up.railway.app';
const socket = io(BASE_URL);

const ROOMID = localStorage.getItem("roomId");

const showAnswer = (question) => {
  const { id, tema, pergunta, alternativas, imgResposta, resposta, descricao } = question;
  console.log(alternativas);
  console.log(resposta);

  const divAppend = document.getElementById("page_apr");
  const divPergunta = document.createElement("div");
  const divAlternativas = document.createElement("div");
  const divImagem = document.createElement("div");
  const textTema = document.createElement("h1");
  const textPergunta = document.createElement("text");
  const textDesc = document.createElement("text");

  const textRespostaCorreta = document.createElement("text");
  textRespostaCorreta.textContent = "Alternativa correta:";
  textRespostaCorreta.className = "textRespostaCorreta";

  textTema.textContent = tema;
  textTema.className = "textTema";
  textPergunta.textContent = pergunta;
  textPergunta.className = "textPergunta";
  textPergunta.id = id;
  textDesc.textContent = descricao;
  textDesc.className = "textDesc";

  divAlternativas.classList.add("divAlternativas");

  // Encontre a alternativa correta
  const correctAlternative = alternativas.find((alternative) => alternative.slice(0, 1) === resposta);

  if (correctAlternative) {
    const textAlternativa = document.createElement("li");
    textAlternativa.id = correctAlternative.slice(0, 1);
    textAlternativa.textContent = correctAlternative;
    textAlternativa.value = correctAlternative.slice(0, 1);
    textAlternativa.className = "textAlternativa";
    textAlternativa.style.listStyleType = "none";
    textAlternativa.style.backgroundColor = "#0AABBA";
    textAlternativa.style.border = "green";
    textAlternativa.style.color = "white";
    divAlternativas.appendChild(textAlternativa);
  }

  divPergunta.appendChild(textTema);

  divPergunta.appendChild(textRespostaCorreta);

  if (correctAlternative) {
    divPergunta.appendChild(divAlternativas);
  }

  // Crie uma nova div para a descrição e a imagem
  const divDescricaoImagem = document.createElement("div");
  divDescricaoImagem.className = "divDescricaoImagem";

  textDesc.textContent = descricao;
  divDescricaoImagem.appendChild(textDesc);

  if (imgResposta !== "") {
    const imgElement = document.createElement("img");
    imgElement.src = imgResposta;
    divDescricaoImagem.appendChild(imgElement);
    textDesc.style.textAlign = "center";
  }

  divPergunta.classList.add("divPergunta");
  divAppend.appendChild(divPergunta);
};  

socket.on("sendQuiz", (question) => {
  showAnswer(question);
});

let nextButtonLink = "/pages/Quiz_APR.html";
const classificationLink = "/pages/Classification_APR.html";

const main = () => {
  socket.emit("reentryRoomAnswerAPR", ROOMID);

  const nextButton = document.getElementById("botaoAvancar");
  const classificationButton = document.getElementById("botaoClassification");

  const completedAnswers = JSON.parse(
    localStorage.getItem("perguntasCompletas")
  );

  nextButton.addEventListener("click", () => {
    if (completedAnswers.length === 0) {
      window.location.href = classificationLink;
    } else {
      window.location.href = nextButtonLink;
    }
  });

  classificationButton.addEventListener("click", () => {
    window.location.href = classificationLink;
  });
};

main();
