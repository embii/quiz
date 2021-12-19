function initializeMenu() {
    const menuMain = document.querySelector("#menu_main");
    menuMain.addEventListener("click", () => {
        console.log("menu_main");
        openMenu();
    })
    const menuInfo = document.querySelector("#menu_info");
    menuInfo.addEventListener("click", () => {
        console.log("menu_info");
        const content = document.querySelector("#menu_info_content");
        var txt = document.createElement('p');
        maxScore=storage.getItem(`MAX_SCORE`);
        txt.innerHTML=`Max. score: ${maxScore}`;
        content.appendChild(txt);
        var txt = document.createElement('p');
        apiToken=storage.getItem(`apiToken`);
        txt.innerHTML=`API Token: ${apiToken}`;
        content.appendChild(txt);

    })
};

function openMenu() {
    document.getElementById("myNav").style.width = "100%";
}
function closeMenu() {
    document.getElementById("myNav").style.width = "0%";
}
function showTechInfo() {
}

