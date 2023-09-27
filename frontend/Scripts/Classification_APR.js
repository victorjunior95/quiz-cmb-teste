const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const showClassification = (usersList) => {
  document.getElementById("loading").remove();
  const schoolList = document.getElementById('schoolList');
  usersList.sort((a, b) => b?.points - a?.points).forEach((user) => {
    const classificationDiv = document.createElement('div');
    classificationDiv.className = 'classificationDiv';
    const classificationSpan = document.createElement('span');
    classificationSpan.className = 'classificationSpan';
    classificationSpan.textContent = user.schoolName;
    classificationSpan.id = user.schoolName;
    const classificationPoints = document.createElement('span');
    classificationPoints.className = 'classificationPoints';
    classificationPoints.textContent = user.points + " Pontos";
    classificationPoints.id = user.points;
    classificationDiv.appendChild(classificationSpan);
    classificationDiv.appendChild(classificationPoints);
    schoolList.appendChild(classificationDiv);
  });
}

socket.on('receiveClassification', (usersList) => {
  showClassification(usersList);
});

socket.on('gameStarted', () => {
  window.location.href = "/pages/Quiz_USR.html";
});


let nextButtonLink = "/pages/Quiz_APR.html";
const main = () => {
  socket.emit('connectAPRClassification', ROOMID);

  const completedAnswers = JSON.parse(
    localStorage.getItem("perguntasCompletas")
  );
  
  const nextButton = document.getElementById("botaoAvancar");

  if (completedAnswers.length === 0) {
    nextButton.remove();
  }

  nextButton.addEventListener("click", () => {
    window.location.href = nextButtonLink;
  });
};

main();
