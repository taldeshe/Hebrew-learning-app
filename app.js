// =====================================================
// Hebrew Commute
// app.js
// =====================================================

// ----------------------------
// Vocabulary
// ----------------------------

let deck = null;

// ----------------------------
// UI
// ----------------------------

const directionSelect = document.getElementById("direction");
const thinkingSlider = document.getElementById("thinkingTime");
const thinkingValue = document.getElementById("thinkingValue");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

const currentWord = document.getElementById("currentWord");

// ----------------------------
// State
// ----------------------------

let running = false;
let paused = false;
let timeoutId = null;

// ----------------------------
// Load vocabulary
// ----------------------------

async function loadVocabulary() {

    const response = await fetch("data/common500.json");

    if (!response.ok) {
        alert("Couldn't load vocabulary.");
        return;
    }

    const words = await response.json();

    deck = new VocabularyDeck(words);

    console.log(`Loaded ${deck.size()} words.`);
}

// ----------------------------
// Helpers
// ----------------------------

thinkingSlider.addEventListener("input", () => {
    thinkingValue.textContent = `${thinkingSlider.value} seconds`;
});

function sleep(ms) {
    return new Promise(resolve => {
        timeoutId = setTimeout(resolve, ms);
    });
}

// ----------------------------
// Playback
// ----------------------------

async function playLoop() {

    while (running) {

        while (paused && running) {
            await sleep(250);
        }

        if (!running) break;

        const word = deck.next();

        if (!word) break;

        let prompt;
        let answer;
        let promptLang;
        let answerLang;

        switch (directionSelect.value) {

            case "en-he":

                prompt = word.english;
                answer = word.hebrew;

                promptLang = "en";
                answerLang = "he";

                break;

            case "mixed":

                if (Math.random() < 0.5) {

                    prompt = word.hebrew;
                    answer = word.english;

                    promptLang = "he";
                    answerLang = "en";

                } else {

                    prompt = word.english;
                    answer = word.hebrew;

                    promptLang = "en";
                    answerLang = "he";

                }

                break;

            default:

                prompt = word.hebrew;
                answer = word.english;

                promptLang = "he";
                answerLang = "en";
        }

        currentWord.textContent = prompt;

        await player.speak(prompt, promptLang);

        await sleep(Number(thinkingSlider.value) * 1000);

        if (!running) break;

        currentWord.textContent = answer;

        await player.speak(answer, answerLang);

        await sleep(1500);

    }

    currentWord.textContent = "Ready";
}

// ----------------------------
// Buttons
// ----------------------------

startButton.addEventListener("click", async () => {

    if (running) return;

    if (!deck) {
        await loadVocabulary();
    }

    running = true;
    paused = false;

    startButton.disabled = true;
    pauseButton.disabled = false;
    stopButton.disabled = false;

    playLoop();

});

pauseButton.addEventListener("click", () => {

    paused = !paused;

    pauseButton.textContent = paused ? "Resume" : "Pause";

});

stopButton.addEventListener("click", () => {

    running = false;
    paused = false;

    clearTimeout(timeoutId);

    player.stop();

    startButton.disabled = false;
    pauseButton.disabled = true;
    stopButton.disabled = true;

    pauseButton.textContent = "Pause";

    currentWord.textContent = "Ready";

});