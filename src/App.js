import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame'
import HighScoreInput from './HighScoreInput'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
    /**
     * Cards : la liste des cards
     * currentPair : est un tableau représentant la paire en cours de sélection par la joueuse. À     vide, aucune sélection en cours. Un élément signifie qu’une première carte a été retournée. Deux éléments signifient qu’on a retourné une seconde carte, ce qui déclenchera une analyse de la paire et l’avancée éventuelle de la partie
     * guesses : est le nombre de tentatives de la partie en cours (nombre de paires tentées, pas nombre de clics)
     * matchedCardIndices  liste les positions des cartes appartenant aux paires déjà réussies, et donc visibles de façon permanente.
     */
    state = {
        cards: this.generateCards(),
        currentPair: [],
        guesses: 0,
        HallOfFame: null,
        matchedCardIndices: []
    }

    displayHallOfFame = HallOfFame => {
        this.setState({ HallOfFame });
    }

    generateCards() {
        const result = []
        const size = SIDE * SIDE
        const candidates = shuffle(SYMBOLS)
        while (result.length < size) {
            const card = candidates.pop()
            result.push(card, card)
        }
        return shuffle(result)
    }

    //Cette syntaxe permet de garantir le this dans cette methode
    handleCardClick = index => {
        const { currentPair } = this.state

        if (currentPair.length === 2) {
            return
        }

        if (currentPair.length === 0) {
            this.setState({ currentPair: [index] })
            return
        }

        this.handleNewPairClosedBy(index)
    }

    handleNewPairClosedBy(index) {
        const { cards, currentPair, guesses, matchedCardIndices } = this.state

        const newPair = [currentPair[0], index]
        const newGuesses = guesses + 1
        const matched = cards[newPair[0]] === cards[newPair[1]]
        this.setState({ currentPair: newPair, guesses: newGuesses })
        if (matched) {
            this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
        }
        setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
    }


    getFeedbackForCard(index) {
        const { currentPair, matchedCardIndices } = this.state
        const indexMatched = matchedCardIndices.includes(index)

        if (currentPair.length < 2) {
            return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
        }

        if (currentPair.includes(index)) {
            return indexMatched ? 'justMatched' : 'justMismatched'
        }

        return indexMatched ? 'visible' : 'hidden'
    }


    render() {
        const { cards, guesses, matchedCardIndices, HallOfFame } = this.state

        //Lorsque toutes les cartes ont étés retournées
        const won = matchedCardIndices.length === 4//cards.length

        return ( 
            <div className="memory">
                <GuessCount guesses={guesses} />
                {cards.map((card, index) => (
                    <Card
                        card={card}
                        feedback={this.getFeedbackForCard(index)}
                        index={index}
                        key={index}
                        onClick={this.handleCardClick}
                    />
                ))}
                {won && (HallOfFame ? (
                    <HallOfFame 
                        entries={HallOfFame} />
                ) : (
                    <HighScoreInput
                        guesses={guesses}
                        onStored={this.displayHallOfFame}  />
                ))}
            </div>
        )
    }
}

export default App