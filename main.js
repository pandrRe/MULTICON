var pageCourse = "";
var nextButton = '<button class="submitbtn" onclick="questionNext()"><span class="glyphicon glyphicon-menu-right"></span></button>'

//Funções de navegação

function gotoClassroom(course, level)
{
	sessionStorage.setItem("currentCourse", course);
	sessionStorage.setItem("currentLevel", level)

	window.open("classroom.html", "_self")
}

function displayQuestion()
{
	currentQuestion = questionQueue[0];
	currentPrompt.style.color = "purple";
	currentPrompt.innerHTML = currentQuestion.prompt;
	var i;
	if (currentQuestion.img_number > 1) {
		for (i = 0; i < 3; i++) {
			questionDisplay[i].src = currentQuestion.imgs[i];
			questionDisplay[i].style.display = "inline";
		}
	}
	else {
		questionDisplay[1].src = currentQuestion.imgs[0];
		questionDisplay[0].style.display = "none";
		questionDisplay[2].style.display = "none";
	}
	for (i = 1; i <= 4; i++) {
		var docID = "txt-" + i.toString();
		document.getElementById(docID).innerHTML = currentQuestion.answers[i - 1];
	}
}

function setupClass() //Configura a aula ao entrar em classroom.html
{
	pageCourse = sessionStorage.getItem("currentCourse");
	currentLevel = sessionStorage.getItem("currentLevel");
	currentPrompt = document.getElementById("pergunta");
	questionDisplay = [
		document.getElementById("qstdisplay0"),
		document.getElementById("qstdisplay1"), 
		document.getElementById("qstdisplay2")
	];

	//Construção do objeto pergunta/Question

	var requestFile = "https://raw.githubusercontent.com/pandrRe/prototipo/master/json/" + pageCourse + "/level" + currentLevel + ".json";
	var request = new XMLHttpRequest(); 
	request.open("GET", requestFile);
	request.responseType = "json";
	request.send();
	request.onload = function() {
		LevelObj = request.response;
		questionQueue = LevelObj.questions;
		displayQuestion();
	}

}

function setPageCourse(currentPage) //Dá valor a variável pageCourse ao entrar na página do curso.
{
	pageCourse = currentPage;
}

function pageBack() //Volta à página do curso a partir de classroom.html.
{
	if (confirm("Você tem certeza que quer voltar?"))
	{
		if (pageCourse == "libras")
		{
			window.open("libras.html", "_self");
		}
		else
		{
			window.open("braille.html", "_self");
		}
	}
}

//Ativa o botão clicado.
function activeButton(button)
{
	currentActive = document.getElementsByClassName("active");
	if (currentActive[0] != null) {
		currentActive[0].className = currentActive[0].className.replace(" active", "");
	}
	document.getElementById("txt-" + button.toString()).className += " active";
}

function checkActiveButton()
{
	if (currentActive[0] == null) {
		return;
	}
	else {
		var splitBtnText = currentActive[0].id.split('-');
		return splitBtnText[1];
	}
	
}

function questionSubmit()
{
	var submitedAnswer = checkActiveButton();
	if (submitedAnswer == null) {
		alert("Por favor insira uma resposta.");
		return;
	}
	else {
		if (submitedAnswer - 1 == currentQuestion.answer_key) {
			questionResult(true);
		}
		else {
			questionResult(false);
		}
	}
}

function questionResult(right)
{
	if (right){
		currentPrompt.style.color = "green";
		currentPrompt.innerHTML = "Você acertou! " + nextButton;
	}
	else {
		currentPrompt.style.color = "red";
		currentPrompt.innerHTML = "Você errou... A resposta certa era " + currentQuestion.answers[currentQuestion.answer_key] + ". " + nextButton;
		questionQueue.push(currentQuestion);
	}
	toggleDisable(true);
	questionQueue.shift();
}

function questionNext()
{
	if (!questionQueue.length) {
		alert("Parabéns! Você concluiu o nível " + currentLevel + " de " + pageCourse + "!");
		window.open(pageCourse + ".html", "_self")
	}
	else {
		displayQuestion();
		currentActive[0].className = currentActive[0].className.replace(" active", "");
		toggleDisable(false);
	}
}

function toggleDisable(mode)
{
	var btns = document.getElementsByClassName("levels");
	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = mode;
	}
}