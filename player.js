// =====================================
// player.js
// Handles all speech playback
// =====================================

class AudioPlayer {

    constructor() {
        this.voice = null;
        this.rate = 0.9;

        this.loadVoice();
    }

    loadVoice() {

        const voices = speechSynthesis.getVoices();

        // Prefer Hebrew voice if available
        this.hebrewVoice =
            voices.find(v => v.lang.startsWith("he")) || null;

        // Prefer English voice
        this.englishVoice =
            voices.find(v => v.lang.startsWith("en")) || null;
    }

    async speak(text, language) {

        return new Promise(resolve => {

            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.rate = this.rate;

            if (language === "he") {

                utterance.lang = "he-IL";

                if (this.hebrewVoice)
                    utterance.voice = this.hebrewVoice;

            }
            else {

                utterance.lang = "en-US";

                if (this.englishVoice)
                    utterance.voice = this.englishVoice;

            }

            utterance.onend = resolve;

            speechSynthesis.speak(utterance);

        });

    }

    stop() {

        speechSynthesis.cancel();

    }

}

// Create one global player
const player = new AudioPlayer();

// Some browsers load voices later
speechSynthesis.onvoiceschanged = () => {
    player.loadVoice();
};