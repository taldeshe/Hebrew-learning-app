// ======================================
// deck.js
// Handles loading and serving vocabulary
// ======================================

class VocabularyDeck {

    constructor(words = []) {

        this.original = words;
        this.deck = [];
        this.current = 0;

        this.shuffle();

    }

    shuffle() {

        this.deck = [...this.original];

        for (let i = this.deck.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [this.deck[i], this.deck[j]] =
            [this.deck[j], this.deck[i]];

        }

        this.current = 0;

    }

    next() {

        if (this.deck.length === 0)
            return null;

        if (this.current >= this.deck.length) {

            this.shuffle();

        }

        return this.deck[this.current++];

    }

    size() {

        return this.original.length;

    }

}
