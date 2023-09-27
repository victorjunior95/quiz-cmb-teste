const BASE_URL = 'https://quiz-cmb-teste-production.up.railway.app';
const socket = io(BASE_URL);
const { roomId } = JSON.parse(localStorage.getItem("roomData"));

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

socket.emit('reentryClassification', roomId);

socket.on('receiveClassification', (usersList) => {
  showClassification(usersList);
});

socket.on('gameStarted', () => {
  window.location.href = "/pages/Quiz_USR.html";
});
