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
    const menuClearStorage = document.querySelector("#menu_clean_storage");
    menuClearStorage.addEventListener("click", () => {
        clearStorageMenu();
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
    
}
function closeMenu() {
    document.getElementById("myNav").style.width = "0%";
}

function infoMenu(){
    clearMenuTxt();
    appendMenuTxt(`Quiz URL: ${quizzUrl}`);
    appendMenuTxt(`Local storage:`);
    for (const [key, value] of Object.entries(storage)){
        appendMenuTxt(` - ${key}: ${value}`);    
    }; 
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