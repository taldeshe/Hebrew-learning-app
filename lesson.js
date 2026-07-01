// ======================================
// lesson.js
// Builds today's commute lesson
// ======================================

class LessonBuilder {

    constructor(words) {

        this.words = words;

        this.NEW_WORDS = 15;
        this.NEW_REPEATS = 8;

    }

    build(startIndex = 0) {

        const lessonWords =
            this.words.slice(startIndex, startIndex + this.NEW_WORDS);

        let playlist = [];

        // Repeat each new word 8 times
        for (let repeat = 0; repeat < this.NEW_REPEATS; repeat++) {

            const shuffled = [...lessonWords];

            for (let i = shuffled.length - 1; i > 0; i--) {

                const j = Math.floor(Math.random() * (i + 1));

                [shuffled[i], shuffled[j]] =
                [shuffled[j], shuffled[i]];

            }

            playlist.push(...shuffled);

        }

        return {

            playlist,

            nextStartIndex:
                startIndex + this.NEW_WORDS

        };

    }

}