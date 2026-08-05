const gdsFile = document.getElementById("gdsFile");
const systemFile = document.getElementById("systemFile");
const compareBtn = document.getElementById("compareBtn");

let gdsLoaded = false;
let systemLoaded = false;

gdsFile.addEventListener("change", () => {

    if (gdsFile.files.length) {

        document.getElementById("gdsName").innerText =
            gdsFile.files[0].name;

        gdsLoaded = true;

        enableCompare();

    }

});

systemFile.addEventListener("change", () => {

    if (systemFile.files.length) {

        document.getElementById("systemName").innerText =
            systemFile.files[0].name;

        systemLoaded = true;

        enableCompare();

    }

});

function enableCompare(){

    compareBtn.disabled = !(gdsLoaded && systemLoaded);

}

compareBtn.addEventListener("click",()=>{

    alert("Milestone 2 will process the uploaded files.");

});

import {parseWorkbook} from "./parser.js";

import {renderTickets}
from "./ui.js";

compareBtn.addEventListener("click",async()=>{

    const result=await parseWorkbook(gdsFile.files[0]);

    document.getElementById("gdsCount").innerText=result.tickets.length;

    document.getElementById("voidCount").innerText=result.voidCount;

    renderTickets(result.tickets);

});
