// global vars
const redactForm = document.querySelector("form");
const modal = document.querySelector(".modal");
const preLoader = document.querySelector(".loader");
let redactOutput = "";
let matchedWords = 0;
let scannedWords = 0;
let scrambledChars = 0;
let timeTaken = 0;

// adding event to the form
redactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const redactText = redactForm.querySelector("#user-text").value;
  const redactWords = redactForm.querySelector("#redact-word").value;
  const redactSymbol = redactForm.querySelector("#redact-char").value;
  const errorInfo = redactForm.querySelector(".error");
  if (redactText === "") {
    errorInfo.textContent = "The text to scan is required";
    errorInfo.style.display = "block";
  } else if (redactWords === "") {
    errorInfo.textContent = "The word/s to redact is required";
    errorInfo.style.display = "block";
  } else {
    preLoader.style.display = "block";
    setTimeout(() => {
      redact(redactText, redactWords, redactSymbol);
      handleRedactOutput();
      preLoader.style.display = "none";
    }, 0);
    redactOutput = "";
    matchedWords = 0;
    scannedWords = 0;
    scrambledChars = 0;
    timeTaken = 0;
  }
  setTimeout(function () {
    errorInfo.textContent = "";
    errorInfo.style.display = "none";
  }, 9000);
});

/**
 * redacts a word/s from a series of text input
 * @param {string} text the original text to search through
 * @param {string} words the word to redact
 * @param {string} symbol the redact style
 */
function redact(texts, words, symbol) {
  const startTime = performance.now();
  const wordsArr = words.split(" ");
  const textArr = texts.split(" ");
  scannedWords = textArr.length;
  for (const word of wordsArr) {
    let i = 0;
    for (const text of textArr) {
      if (text.toLowerCase() === word.toLowerCase()) {
        matchedWords++;
        textArr[i] = symbol.padEnd(word.length, symbol);
        scrambledChars += textArr[i].length;
      }
      i++;
    }
  }
  redactOutput = textArr.join(" ");
  const endTime = performance.now();
  timeTaken = (endTime - startTime) / 1000;

  modal.innerHTML = `
  <div class="stats">
    <span class="material-symbols-outlined close">close</span>
      <h3>Redact Stats</h3>
      <div class="redacted-text">
      <p>
        <span class="material-symbols-outlined">
          description
        </span>
        Redacted Text
      </p>
       <div class="text"> ${redactOutput}</div>
      <span class="material-symbols-outlined copy">
        content_copy
      </span>
      <span class="tooltip">
        copied! 👌
          <span class="material-symbols-outlined">
            arrow_drop_down
          </span>
      </span>
      </div>
      <div class="stat-data">
      <span class="material-symbols-outlined">document_scanner</span>
        <span>Scanned Words:   ${scannedWords}</span> 
      </div>
      <div class="stat-data">
         <span class="material-symbols-outlined">
        match_word</span>
        <span>Matched Words:   ${matchedWords}</span> 
      </div>
      <div class="stat-data">
        <span class="material-symbols-outlined">
        abc
        </span>
        <span>Redacted Characters:   ${scrambledChars}</span> 
      </div>
      <div class="stat-data">
        <span class="material-symbols-outlined">
           hourglass_bottom
        </span>
        <span>Time Taken:   ${timeTaken.toFixed(3)}secs.</span> 
      </div>
  </div>`;
}

/**
 * handles the redacted text output
 */

function handleRedactOutput() {
  const closeBtn = modal.querySelector(".close");
  const copyBtn = modal.querySelector(".copy");
  const redactText = modal.querySelector(".redacted-text .text");
  const tooltip = modal.querySelector(".tooltip");
  modal.style.top = 0;
  closeBtn.addEventListener("click", () => {
    modal.style.top = "-1000";
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(redactText.textContent);
    copyBtn.style.backgroundColor = "#ebf3fb";
    copyBtn.style.top = "21px";
    copyBtn.style.right = "17px";
    tooltip.style.display = "block";

    setTimeout(() => {
      copyBtn.style.backgroundColor = "#ebf3fb96";
      copyBtn.style.top = "0";
      copyBtn.style.right = "13px";
      tooltip.style.display = "none";
    }, 1500);
  });
}
