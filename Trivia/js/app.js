let btnIniciarJuego = document.querySelector("#iniciarJuego");
let selectCategoria = document.querySelector("#categoria");
let selectDificultad = document.querySelector("#dificultad");
let selectTipo = document.querySelector("#tipo");
let contenedor = document.querySelector(".contenedor");
const btnEnviar = document.querySelector("#btnEnviar");
const quizOptions = document.querySelector(".quiz-options");
let numPregunta = 0;
let correct_answer;
let numCorectas = 0;
let objetos;

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  $("#staticBackdrop").modal("show");
  consultarCategoria();
  cargarEventListeners();
}

async function consultarCategoria() {
  const APIUrl = "https://opentdb.com/api_category.php";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  llenarCategoria(data.trivia_categories);
}

function llenarCategoria(data) {
  for (i = 0; i < data.length; i++) {
    const option = document.createElement("option");
    option.value = data[i].id;
    option.text = data[i].name;
    selectCategoria.appendChild(option);
  }
}

function cargarEventListeners() {
  btnIniciarJuego.addEventListener("click", iniciarJuego);
  btnEnviar.addEventListener("click", revisarRespuesta);
}

function iniciarJuego() {
  let c = "";
  let d = "";
  let t = "";

  if (selectCategoria.value !== "any") {
    c = "&category=" + selectCategoria.value;
  }
  if (selectDificultad.value !== "any") {
    d = "&difficulty=" + selectDificultad.value;
  }
  if (selectTipo.value !== "any") {
    t = "&type=" + selectTipo.value;
  }
  let url = c + d + t;
  consultarPreguntas(url);
  $("#staticBackdrop").modal("hide");
}

async function consultarPreguntas(url) {
  const APIUrl = `https://opentdb.com/api.php?amount=10` + url;
  const result = await fetch(`${APIUrl}`);
  const datos = await result.json();
  objetos = datos.results;

  if (datos.response_code == 1) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un error intenta de nuevo",
    });
  }

  mostrarPreguntas();
}

function mostrarPreguntas() {
  console.log(objetos[numPregunta].correct_answer);
  quizOptions.innerHTML = "";
  const question = document.querySelector("#question");
  const category = document.querySelector("#category");

  question.textContent = objetos[numPregunta].question;
  category.textContent = objetos[numPregunta].category;
  correct_answer = objetos[numPregunta].correct_answer;
  let answers = [...objetos[numPregunta].incorrect_answers, correct_answer];

  for (i = 0; i < answers.length; i++) {
    const option = document.createElement("li");
    option.textContent = `${answers[i]}`;

    quizOptions.appendChild(option);
  }

  selectOption();
}

function selectOption() {
  quizOptions.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (quizOptions.querySelector(".selected")) {
        const activeOption = quizOptions.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

function revisarRespuesta() {
  if (quizOptions.querySelector(".selected")) {
    let selectedAnswer = quizOptions.querySelector(".selected").textContent;
    if (correct_answer === selectedAnswer) {
      numCorectas++;
    }
    numPregunta = numPregunta + 1;
    if (numPregunta < objetos.length) {
      mostrarPreguntas();
    } else {
      mostrarResultado();
    }
  } else {
    Swal.fire({
      icon: "warning",
      text: "¡Por favor seleccione una opción!",
    });
  }
}

function mostrarResultado() {
 
  if (numCorectas >= 7) {
    Swal.fire({
      title: `Tuvistes ${numCorectas} correctas`,
      imageUrl: "https://st2.depositphotos.com/1031343/6464/v/950/depositphotos_64642925-stock-illustration-approved-stamp.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload()
      }
    })
  } else {
    Swal.fire({
      title: `Tuvistes ${numCorectas} correctas`,
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F3.bp.blogspot.com%2F-2h0f4G60_N8%2FUEkxDqTIj9I%2FAAAAAAAAAL0%2FYhB9paROG9g%2Fs1600%2FAPROB.jpg&f=1&nofb=1&ipt=1cddea25d8f49a922231bd4ffd9dfc36d6dacfa904eabf3cea19e0a50e5715b7&ipo=images",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload()
      }
    })
  }
}
