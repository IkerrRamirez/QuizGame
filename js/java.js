
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector(".main");
  let btn = null;
  let resetButton = null;
  let nextButton = null;
  const container = document.querySelector(".container");
  let score = 0;
  let cont = 0;
  let allQuestions;
  const correctAnswers = [];



  async function startQuiz() {
    if(resetButton) {
      resetButton.remove();
    }
    if(nextButton) {
      nextButton.remove();
    }
    btn = document.createElement('button');
    main.appendChild(btn);
    btn.classList.add('btn');
    btn.textContent = 'Check';
    btn.addEventListener("click", checkAnswer);
    allQuestions = await loadData();
    saveCorrectAnswers();
    const numQuestions = allQuestions.length;
    const questionConstructor = createQuestionConstructor();
    const usedIndex = [];


    for (let i = 0; i < 2; i++) {
      let randomNum;

      do {
        randomNum = getRandomNum(numQuestions);
      } while (usedIndex.includes(randomNum));

      usedIndex.push(randomNum);
      const questionContainer = createQuestionContainer();
      questionConstructor.appendChild(questionContainer);
      container.appendChild(questionConstructor);
      showQuestion(randomNum, allQuestions, questionContainer);
    }
  }

  function saveCorrectAnswers() {
    for (let i = 0; i < allQuestions.length; i++) {
      correctAnswers.push(allQuestions[i].answer);
    }
  }

  function getRandomNum(numQuestions) {
    return Math.floor(Math.random() * numQuestions);
  }

  async function loadData() {
    try {
      const resp = await fetch("./preguntas.json");
      const data = await resp.json();
      const allQuestions = data.preguntas;
      return allQuestions;
    } catch (error) {
      console.log("El fetch no está funcionando");
    }
  }

  function createQuestionContainer() {
    const container = document.createElement("div");
    container.classList.add("question-container");
    return container;
  }

  function createQuestionConstructor() {
    const questionConstructor = document.createElement("div");
    questionConstructor.classList.add("question-constructor");
    return questionConstructor;
  }

  function showQuestion(index, allQuestions, container) {
    const question = allQuestions[index];
    const pContainer = document.createElement("p");
    pContainer.classList.add("texto");
    pContainer.innerText = question.pregunta;
    container.appendChild(pContainer);

    const respuestas = question.respuestas;
    cont++;
    answerConstructor(respuestas, container);
  }

  function answerConstructor(respuestas, container) {
    const groupName = `group-${Math.random().toString(36).substr(2, 9)}`;
    const answersContainer = document.createElement("div");
    answersContainer.classList.add("answersContainer");
    for (let i = 0; i < respuestas.length; i++) {
      const div = document.createElement("div");
      const input = document.createElement("input");
      const button = document.createElement("button");
      const label = document.createElement("label");

      const inputId = `input-${respuestas[i].texto}`;
      const labelFor = inputId;

      button.classList.add("btn-question");

      input.type = "radio";
      input.id = inputId;
      button.textContent = respuestas[i].texto;
      input.name = groupName;
      label.textContent = respuestas[i].texto;
      label.htmlFor = labelFor;
      div.appendChild(button);
      answersContainer.appendChild(div);
      container.appendChild(answersContainer);

      button.addEventListener("click", () => {
        const buttons = container.querySelectorAll(".btn-question");
        buttons.forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");
      });
    }
  }

  function resetQuizGame() {
    const questionConstructor = document.querySelector(".question-constructor");
    questionConstructor.remove();
    cont = 0;

    startQuiz();
  }

  function checkAnswer() {
    const btnQuestion = document.querySelectorAll(".btn-question");
    let correctCount = 0;

    btnQuestion.forEach((button) => {
      button.disabled = true;
      const activeButton = button.classList.contains("active");
      if (activeButton) {
        respuestaSeleccionada = button.textContent;
        console.log(respuestaSeleccionada);
        if (correctAnswers.includes(respuestaSeleccionada)) {
          correctCount++;
          button.style.backgroundColor = "green";
          button.style.color = "black";
        } else {
          button.style.backgroundColor = "red";
          button.style.color = "white";
        }
      }
    });

    if(cont === 4) {
      resetButton = document.createElement("button");
      resetButton.classList.add("btn");
      resetButton.classList.add("reset");
      resetButton.textContent = "Reiniciar";
      resetButton.addEventListener("click", resetQuizGame);
      btn.remove();
      main.appendChild(resetButton);
      console.log('Has ganado');
    } else if (correctCount >= 2) {
      btn.remove();
      nextButton = document.createElement("button");
      nextButton.classList.add("btn");
      nextButton.classList.add("next");
      nextButton.textContent = "Next";
      nextButton.addEventListener("click", nextQuestion);
      main.appendChild(nextButton);
      
    } else {
      resetButton = document.createElement("button");
      resetButton.classList.add("btn");
      resetButton.classList.add("reset");
      resetButton.textContent = "Reiniciar";
      resetButton.addEventListener("click", resetQuizGame);
      btn.remove();
      main.appendChild(resetButton);

      btnQuestion.forEach((button) => {
        button.disabled = false;
      });
      console.log("No has acertado las respuestas");
    }
  }

  function nextQuestion() {
    const questionConstructor = document.querySelector(".question-constructor");
    questionConstructor.remove();
    startQuiz();
  }

  function deleteQuestion() {}

  startQuiz();
});
