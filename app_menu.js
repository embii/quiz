function initializeMenu() {
    const menuMain = document.querySelector("#menu_main");
    menuMain.addEventListener("click", () => {
        openMenu();
    })
    const menuClose = document.querySelector("#menu_close");
    menuClose.addEventListener("click", () => {
        closeMenu();
    })
    const menuInfo = document.querySelector("#menu_info");
    menuInfo.addEventListener("click", () => {
        infoMenu();
    })
    const menuCategories = document.querySelector("#menu_quiz_categories");
    menuCategories.addEventListener("click", () => {
        categoriesMenu();
    })
    const menuClearStorage = document.querySelector("#menu_clean_storage");
    menuClearStorage.addEventListener("click", () => {
        clearStorageMenu();
    })
    const menuUpdateURL = document.querySelector("#menu_update_url");
    menuUpdateURL.addEventListener("click", () => {
        updateURLMenu();
    })
};

function appendMenuTxt(txt=""){
    const content = document.querySelector("#menu_txt");
    const txtDsp = document.createElement('p');
    txtDsp.innerHTML=txt;
    content.appendChild(txtDsp);
}


function clearMenuTxt(){
    const content = document.querySelector("#menu_txt");
    content.innerHTML="";
}

function openMenu() {
    clearMenuTxt();
    const menuClose = document.querySelector("#menu_close");
    menuClose.focus();
    document.getElementById("myNav").style.width = "100%";
    checkNewVersion();
}
function closeMenu() {
    document.getElementById("myNav").style.width = "0%";
}

function infoMenu(){
    clearMenuTxt();
    appendMenuTxt(`Quiz URL: ${quizzUrl}`);
    appendMenuTxt(`Local storage:`);
    for (const [key, value] of Object.entries(storage)){
        appendMenuTxt(` - ${key}: "${value}"`);    
    };     
    checkNewVersion();
}

function categoriesMenu(){
    clearMenuTxt();
    appendMenuTxt(`<h1>Quiz categories.</h1> Select one category from the list below for future quiz or `);
	fetchCategories()
    .then(printCategories)
    .then(showCategories)
    .catch((err) => {
        console.log('ERROR when fetching categories!', err);
    });
}

function showCategories(){
    console.log(categories);
    // appendAllCategoriesButton();
    appendCategoryButton("", "ANY CATEGORY");    
    categories.forEach(category => {
        fetchCategory(category.id)
        .then(printCategory)
        .then((cat)=>{
            appendMenuTxt(`- Category "${category.id}": "${category.name}" contains ${cat.category_question_count.total_question_count} questions`);    
            appendCategoryButton(category.id, category.name);    
        })
    })  
} 

function appendCategoryButton(category_id, category_name){
    const content = document.querySelector("#menu_txt");
    const menuElement = document.createElement('button');
    menuElement.type = "button";
    if (category_id){
        menuElement.innerHTML = `use "${category_name}"` ;
    } else{
        menuElement.innerHTML = `use ${category_name}`;
    }
    menuElement.addEventListener("click", (event) => {
        console.log(event.target);
        console.log(` CLICKED id: "${category_id}" name: "${category_name}"`);    
        setCategoryInUrl(category_id);
    })
    content.lastChild.appendChild(menuElement);
}

function setCategoryInUrl(category_id="?"){
    // console.log(quizzUrl);
    // var newUrl="";
    const re = /category=/g;
    var newUrl=quizzUrl.replace(/(category=)[0-9]*/g,`$1${category_id}`);
    if (!newUrl.match(/category=/g)){
        // console.log("appending");
        newUrl=`${quizzUrl}&category=${category_id}`;
    }
    saveURL(newUrl);
    // console.log(quizzUrl);
}


function updateURLMenu(){
    clearMenuTxt();
    appendMenuTxt(`Currently used quiz URL: ${quizzUrl}`);
    appendMenuTxt(`New quiz URL:`);
    
    // form
    const content = document.querySelector("#menu_txt");
    const inputTxt = document.createElement('input');
    inputTxt.type = "url";
    inputTxt.value = quizzUrl;
    inputTxt.style = "width:100%"
    inputTxt.focus();
    content.appendChild(inputTxt);

    // save button
    const inputButton = document.createElement('button');
    inputButton.type = "button";
    inputButton.innerHTML = "Save URL";
    inputButton.focus();
    inputButton.addEventListener("click", () => {
        saveURL(inputTxt.value);
    })
    content.appendChild(inputButton);
    appendMenuTxt(`Modify values of optional parameters after "?"`)
    appendMenuTxt(`- Value is separated by "="`)
    appendMenuTxt(`- Parameter is separated by "&"`)
    appendMenuTxt(`- Value of parameter "amount" is from "1" to "50"`);
    appendMenuTxt(`- Value of parameter "category" is any id from list of categories - see menu "Quiz categories"`);
    appendMenuTxt(`- Value of parameter of paarmeter dificulty is: "easy", "medium" or "hard"`);
    appendMenuTxt(`Sample URL: https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple`);
    appendMenuTxt(`For more details check https://opentdb.com/`);
}

function saveURL(url){
    console.log(url);
    quizzUrl=url;
    if(storage){
        storage.setItem("QUIZ_URL",quizzUrl);
        appendMenuTxt(`Quiz URL saved.`);
    }else{
        appendMenuTxt(`Local storage is not available in this browser.`);
        appendMenuTxt(`Quiz URL changed teporarily.`);
    }
}


function clearStorageMenu(){
    clearMenuTxt();
    if(storage){
		storage.clear();
        appendMenuTxt(`Local storage cleared.`);
	}else{
        appendMenuTxt(`Local storage is not available in this browser.`);
    }
}