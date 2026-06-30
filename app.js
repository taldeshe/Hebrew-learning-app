// =====================================================
// Hebrew Commute
// Version 0.1
// =====================================================

// ----------------------------
// Temporary Vocabulary
// ----------------------------

const vocabulary = [
    { hebrew: "שלום", english: "peace" },
    { hebrew: "בית", english: "house" },
    { hebrew: "מים", english: "water" },
    { hebrew: "ילד", english: "child" },
    { hebrew: "אוכל", english: "food" },
    { hebrew: "ספר", english: "book" },
    { hebrew: "אמא", english: "mother" },
    { hebrew: "אבא", english: "father" }
];

// ----------------------------
// UI Elements
// ----------------------------

const directionSelect = document.getElementById("direction");
const orderSelect = document.getElementById("playbackOrder");
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

let shuffledWords = [];
let currentIndex = 0;

// ----------------------------
// Utility Functions
// ----------------------------

thinkingSlider.addEventListener("input", () => {
    thinkingValue.textContent = `${thinkingSlider.value} seconds`;
});

function sleep(ms) {
    return new Promise(resolve => {
        timeoutId = setTimeout(resolve, ms);
    });
}

function speak(text, lang = "en-US") {

    return new Promise(resolve => {

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = lang;

        utterance.rate = 0.9;

        utterance.onend = resolve;

        speechSynthesis.speak(utterance);

    });

}

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function getNextWord() {

    if (orderSelect.value === "random") {

        return vocabulary[Math.floor(Math.random() * vocabulary.length)];

    }

    if (currentIndex >= shuffledWords.length) {
        currentIndex = 0;
    }

    return shuffledWords[currentIndex++];
}

// ----------------------------
// Playback Loop
// ----------------------------

async function playLoop() {

    while (running) {

        while (paused && running) {
            await sleep(250);
        }

        if (!running) break;

        const word = getNextWord();

        const direction = directionSelect.value;

        let prompt;
        let answer;
        let promptLanguage;
        let answerLanguage;

        if (direction === "he-en") {

            prompt = word.hebrew;
            answer = word.english;

            promptLanguage = "he-IL";
            answerLanguage = "en-US";

        }
        else if (direction === "en-he") {

            prompt = word.english;
            answer = word.hebrew;

            promptLanguage = "en-US";
            answerLanguage = "he-IL";

        }
        else {

            const flip = Math.random() < 0.5;

            if (flip) {

                prompt = word.hebrew;
                answer = word.english;

                promptLanguage = "he-IL";
                answerLanguage = "en-US";

            } else {

                prompt = word.english;
                answer = word.hebrew;

                promptLanguage = "en-US";
                answerLanguage = "he-IL";

            }

        }

        currentWord.textContent = prompt;

        await speak(prompt, promptLanguage);

        await sleep(Number(thinkingSlider.value) * 1000);

        if (!running) break;

        currentWord.textContent = answer;

        await speak(answer, answerLanguage);

        await sleep(2000);

    }

    currentWord.textContent = "Ready";
}

// ----------------------------
// Buttons
// ----------------------------

startButton.addEventListener("click", () => {

    if (running) return;

    running = true;
    paused = false;

    shuffledWords = shuffle(vocabulary);
    currentIndex = 0;

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

    speechSynthesis.cancel();

    startButton.disabled = false;
    pauseButton.disabled = true;
    stopButton.disabled = true;

    pauseButton.textContent = "Pause";

});