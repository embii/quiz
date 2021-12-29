// ********************************
// Quizz - using opendb api 'https://opentdb.com/
// ********************************

var questions = [];
var score = 0;
var questionNr = 0;

const dlyScore = 1;
const dlyLoad = 1;
var categories = [];

const allDsp = document.querySelector("#all");
const qaDsp = document.querySelector("#qa");
const questionDsp = document.querySelector("#question p");
const answersDsp = document.querySelector("#answers");
const scoreDsp = document.querySelector("#score");
const categoryDsp = document.querySelector("#category p");
const questionNrDsp = document.querySelector("#question_number");
const footDsp = document.querySelector("#foot");
var storage = null;
var apiToken = null;
var appVersion = null;
var randomCategory = 0;
var newVersion = 0;
var badSound=null;

// const quizzUrl='https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';
// const quizzUrl = `https://opentdb.com/api.php?amount=10&type=multiple&category=30`;
var quizzUrl = `https://opentdb.com/api.php?amount=10&type=multiple`;
const readmeUrl=`https://github.com/embii/quiz/blob/main/README.md`;
var maxScore = null;

const fetchApiToken = (url = 'https://opentdb.com/api_token.php?command=request') => {
	console.log(url);
	return axios.get(url);
};

const fetchNextQuizz = (url = quizzUrl) => {
	console.log(url);
	if (apiToken == null && storage != null) {
		fetchApiToken()
			.then(({ data }) => {
				console.log(data);
				if (data.response_code == 0) {
					apiToken = data.token;
					storage.setItem('API_TOKEN', apiToken);
					console.log(`Fetched API Token: ${apiToken}`);
					return Promise.resolve(data.token);
				} else {
					return Promise.reject(data);
				}
			})
			.catch((err) => {
				console.log('ERROR when fetching API token!', err);
			});
	};
	console.log(`API Token: ${apiToken}`);
	// return axios.get(`${url}&token=${apiToken}`);
	return axios.get(`${url}`);
};
const printQuizz = ({ data }) => {
	questions = [];
	console.log(data);
	if (data.response_code == 0) {
		for (let question of data.results) {
			questions.push(question);
		}
		return Promise.resolve(data.next);
	} else {
		return Promise.reject(data);
	}
};

const fetchCategories = (url = 'https://opentdb.com/api_category.php') => {
	console.log(url);
	return axios.get(`${url}`);
};
const printCategories = ({ data }) => {
	categories = [];
	console.log(data);
	for (let category of data.trivia_categories) {
		categories.push(category);
	}
	return Promise.resolve(categories);
};

async function randomizeCategory() {
	if (!categories || categories.length==0){
		console.log("fetching categories");
		await fetchCategories()
        .then(printCategories)
        .catch((err) => {
            console.log('ERROR when fetching categories!', err);
        });
	}
	if (categories  && categories.length>0){
		console.log(categories);

		const randomCategory = categories[Math.floor(Math.random() * categories.length)].id; 
		setCategoryInUrl(randomCategory);
		console.log(`random category set to: ${randomCategory}`);
	}else{
	       console.log('ERROR no categories!');
        };
}

function playSound(file = 'res\\button-11.mp3') {
	if (badSound && typeof(badSound)=="object"){
		badSound.pause();
		badSound=null;
	};
	const audio = new Audio(file);
	audio.autoplay = "true";
	// audio.muted="false";
	audio.play();
	return audio;
};

const putQuestion = (question) => {
	console.log(question);
	const allAnswers = [];
	questionNr++;
	questionNrDsp.innerHTML = questionNr;
	scoreDsp.innerHTML = score;
	answersDsp.innerHTML = '';
	questionDsp.innerHTML = question.question;
	footDsp.innerHTML = '';
	categoryDsp.innerHTML = `Category: "${question.category}" Difficulty: ${question.difficulty}`;
	allAnswers.push(...question.incorrect_answers);
	allAnswers.push(question.correct_answer);

	shuffleAnswers(allAnswers).forEach((answer, idx) => {
		var answerBtn = document.createElement('button');
		answerBtn.type = 'button';
		answerBtn.id = `answer${idx}`;
		answerBtn.classList.add("new_answer");
		answerBtn.addEventListener("focus", function (event) {
			playSound();
		})

		answerBtn.addEventListener("mouseenter", function (event) {
			event.target.focus();
		})
		answerBtn.addEventListener("click", function (event) {
			playSound('res\\Button-click-sound.mp3');
			checkAnswer(question, event.target);
		});
		// answerBtn.style.animation="anim_hickup 1s ease infinite";
		// answerBtn.style.animationDelay="1s";

		answersDsp.appendChild(answerBtn);
		answerBtn.innerHTML = answer;
	})
};

async function checkAnswer(question, btn) {
	disableAnswers();
	let haveCorrect = 0;
	const buttons = answersDsp.querySelectorAll('button[type="button"]');
	btn.classList.add("clicked");
	btn.classList.remove("new_answer");
	for (let button of buttons) {
		console.log(button.value);
		if (he.decode(question.correct_answer.trim()) === button.innerText.trim()) {
			haveCorrect++;
			button.classList.add("correct");
			button.classList.remove("new_answer");
			console.log(button);
		}
	}
	if (haveCorrect < 1) {
		console.log("ERROR: Corresct answer not available!?");
	}
	if (he.decode(question.correct_answer).trim() === btn.innerText.trim()) {
		score++;
		playSound('res\\Quiz-correct-sound-with-applause.mp3');
		playSound("res\\ho-ho-ho.wav");
		fireworksInitiate();
	} else {
		btn.classList.add("wrong");
		playSound('res\\Fail-trombone.mp3');

	}
	console.log(score);
	scoreDsp.innerHTML = score;
	afterAnswer();
};

function disableAnswers() {
	const buttons = answersDsp.querySelectorAll('button');
	for (let button of buttons) {
		button.disabled = true;
	}
};

function afterAnswer() {
	const nextBtn = document.createElement('button');
	const nextBtnIcon = document.createElement('span');
	nextBtn.type = 'button';
	nextBtn.classList.add("new_answer");
	nextBtn.addEventListener("mouseenter", function (event) {
		event.target.focus();
	})
	nextBtn.addEventListener("click", function (event) {
		playSound('res\\Button-click-sound.mp3	');
		nextQuestion();
	});
	nextBtn.innerHTML = "<span id=next_button>Continue</span>";
	nextBtnIcon.innerHTML = " &#x1F634;";
	nextBtnIcon.id = "next_icon";
	nextBtn.appendChild(nextBtnIcon);
	footDsp.appendChild(nextBtn);
	nextBtn.focus();
};
function afterQuizz() {
	checkNewVersion();
	// if (newVersion){
	// 	menuMainDsp.classList.add("is_new_version");
	// }

	
	const nextBtn = document.createElement('button');
	nextBtn.type = 'button';
	nextBtn.classList.add("new_answer");
	nextBtn.addEventListener("mouseenter", function (event) {
		event.target.focus();
	})
	nextBtn.addEventListener("click", function (event) {
		initialize();
	});
	footDsp.innerHTML = '';
	answersDsp.innerHTML = '';
	footDsp.appendChild(nextBtn);
	nextBtn.focus();
	nextBtn.innerHTML = "Start next quiz";
};

function delay(n) {
	return new Promise(function (resolve) {
		setTimeout(resolve, n * 1000);
	});
};

function sorter(a, b) {
	const order = ['easy', 'medium', 'hard'];
	return (order.indexOf(a.difficulty) - order.indexOf(b.difficulty));
}
async function runTheQuizz() {
	for (let i = 0; i < 10; i++) {
		if (questions.length < 1) {
			console.log('waiting for quiz');
			await delay(dlyScore);
		}
	}
	if (questions.length < 1) {
		// storage.removeItem('apiToken');
		console.log('no data, restart the game');
	}
	else {
		questions.sort(sorter);
		nextQuestion();
	}
};
const finalScore = () => {
	categoryDsp.innerHTML = "That was the last question.";
	questionDsp.innerHTML = "";
	var isMax = 0;
	if (storage) {

		// maxScore=storage.getItem(`MAX_SCORE_${category}`);
		maxScore = storage.getItem(`MAX_SCORE`);
		if ((maxScore == null) || (score > maxScore)) {
			isMax = 1;
			// storage.setItem(`MAX_SCORE_${category}`, score);
			storage.setItem(`MAX_SCORE`, score);
			// questionDsp.innerHTML = `This is highest score in category ${category}`;
			questionDsp.innerHTML = `This is highest score`;
		}
	}
	if (isMax == 1) {
		fireworksInitiate(5, 15, 200, 3000);
		playSound("res\\Wow-sound-effect.mp3");
	} else {
		badSound=playSound("res\\Goal-horn-sound-effect.mp3");
	}
	afterQuizz();
};

function nextQuestion() {
	if (questions.length > 0) {
		putQuestion(questions.shift());
	} else {
		finalScore();
	}
};

function shuffleAnswers(answers) {
	var m = answers.length;
	var i;
	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);
		// And swap it with the current element.
		[answers[m], answers[i]] = [answers[i], answers[m]];
	}
	return answers;
};

function initialize() {
	if (storage) {
		apiToken = storage.getItem('API_TOKEN');
	}
	score = 0;
	questionNr = 0;
	if (randomCategory){
		randomizeCategory();
	}
	fetchNextQuizz(quizzUrl)
		.then(printQuizz)
		.catch((err) => {
			console.log('ERROR when fetching quiz!', err);
			storage.removeItem('API_TOKEN');
			console.log('resetting API token');

		});
	runTheQuizz();
}

function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
}


function start() {
	const nextBtn = document.createElement('button');
	const img = document.createElement('img');
	img.src = 'res\\thinking-gif-2018-31.gif';
	nextBtn.type = 'button';
	nextBtn.classList.add("new_answer");
	nextBtn.addEventListener("mouseenter", function (event) {
		event.target.focus();
	})
	nextBtn.addEventListener("click", function (event) {
		initialize();
	});
	questionDsp.innerText = 'Are you ready?'
	footDsp.innerHTML = '';
	answersDsp.innerHTML = '';
	answersDsp.appendChild(img);
	footDsp.appendChild(nextBtn);
	nextBtn.focus();
	nextBtn.innerHTML = "YES, start the quiz";
};

// initialize();
//// code ///////////////////////

// do after load
document.addEventListener("DOMContentLoaded", function () {
	if (storageAvailable('localStorage')) {
		// Yippee! We can use localStorage awesomeness
		storage = window.localStorage;
		quizzUrl = storage.getItem("QUIZ_URL") ?? quizzUrl;
		maxScore = storage.getItem("MAX_SCORE") ?? maxScore;
		apiToken = storage.getItem("API_TOKEN") ?? apiToken;
		checkNewVersion();
		appVersion = storage.getItem("VERSION") ?? appVersion;
		randomCategory = storage.getItem("RANDOM_CATEGORY") ?? randomCategory;
	}
	else {
		alert('Too bad, no localStorage for us');
	};
	start();
	initializeMenu();
	initiateVersion();
	// prevent back
	window.history.pushState(null, null, window.location.href);
	window.onpopstate = function () {
		window.history.go(1);
	};
});
