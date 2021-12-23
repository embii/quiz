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

// var appVersionUrl = `https://embii.github.io/quiz/index.html`;
var appVersionUrl = `https://embii.github.io/quiz/dist/version.json?timestamp=${new Date().getTime()}`;
const fetchVersion = (url=appVersionUrl) => {
	console.log(url);
	return axios.get(`${url}`,
    {
      // query URL without using browser cache
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
};
const initiateVersion=() =>{
    fetchVersion()
    .then(({data})=>{
        console.log(data);
        appVersion = data.hash;
        storage.setItem("VERSION",appVersion);
    })
    .catch((err) => {
        console.log('ERROR when fetching app version!', err);
    });
} 
const checkNewVersion=() =>{
    fetchVersion()
    .then(({data})=>{
        console.log(data);
        const remoteVersion = data.hash;
        if (appVersion != remoteVersion) {
            appendMenuTxt(`New version is available. Please reload. &#x2757; &#x1F60A; `);
            document.querySelector("#menu_main").classList.add("is_new_version");
            document.querySelector("#menu_info").classList.add("is_new_version");
        }
    })
    .catch((err) => {
        console.log('ERROR when fetching app version!', err);
    });
} 
