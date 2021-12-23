// ********************************
// opendb api 'https://opentdb.com/
// ********************************

var categoryUrl = `https://opentdb.com/api_count.php?category=9`;

const fetchCategory = (id) => {
    var url=categoryUrl.replace(/(category=)[0-9]+/g,`$1${id}`);
	console.log(url);
	return axios.get(`${url}`);
};
const printCategory = ({ data }) => {
	console.log(data);
	// for (let category of data.trivia_categories) {
	// 	categories.push(category);
	// }
	return Promise.resolve(data);
};



var appVersionUrl = `https://github.com/embii/quiz/index.html`;

const fetchVersion = (url=appVersionUrl) => {
	console.log(url);
	return axios.get(`${url}`);
};