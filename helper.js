// ********************************
// JSON fetch and update 
// ********************************

// const quizzUrl='https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';
// const quizzUrl = `https://opentdb.com/api.php?amount=10&type=multiple&category=30`;
// const jsonUrl = `https://api.npoint.io/5b8ad8acbb38240f1b8d/`;
// https://api.npoint.io/51cce5c07574862a8c9a

// 1e37f8aa-5dd8-11ec-b95c-0242ac110002
// https://extendsclass.com/jsonstorage/aa383f6a30d3
// https://json.extendsclass.com/bin/aa383f6a30d3


const getJson = (url = 'https://json.extendsclass.com/bin/aa383f6a30d3') => {
	console.log(url);

	return axios.get(`${url}`);
};
const printJson = ({ data }) => {
	console.log(data);
	if (data) {
		return Promise.resolve(data);
	} else {
		return Promise.reject(data);
	}
};

function fetchJson() {
	getJson()
		.then(printJson)
		.catch((err) => {
			console.log('ERROR when fetching json!', err);
		});
}
fetchJson();


async function postJson(url = 'https://json.extendsclass.com/bin/aa383f6a30d3') {

	let payload =
	{
		"quiz_token": "b",
		"max_score": "21"
	};

	let res = await axios.put(url, payload);

	let data = res.data;
	console.log(data);
}

// postJson();
