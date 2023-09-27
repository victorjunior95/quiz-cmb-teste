const BASE_URL = 'https://quiz-cmb-teste-production.up.railway.app';
const ROOMID = localStorage.getItem("roomId");

fetch(`${BASE_URL}/quiz`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem("perguntasCompletas", JSON.stringify(data));
    window.location.href = "/pages/Quiz_APR.html";
  })
  .catch(error => {
    console.error('Erro na solicitação:', error);
  });
