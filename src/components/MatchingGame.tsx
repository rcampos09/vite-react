import { useState, useEffect } from 'react'

interface MatchingGameProps {
  onScore: (points: number) => void
  onBack: () => void
}

interface Card {
  id: number
  content: string
  type: 'article' | 'noun'
  articleType?: 'definite' | 'indefinite'
  gender?: 'masculine' | 'feminine'
  number?: 'singular' | 'plural'
  isFlipped: boolean
  isMatched: boolean
}

const pairs = [
  { article: 'el', noun: 'perro', type: 'definite', gender: 'masculine', number: 'singular' },
  { article: 'la', noun: 'casa', type: 'definite', gender: 'feminine', number: 'singular' },
  { article: 'los', noun: 'gatos', type: 'definite', gender: 'masculine', number: 'plural' },
  { article: 'las', noun: 'flores', type: 'definite', gender: 'feminine', number: 'plural' },
  { article: 'un', noun: 'libro', type: 'indefinite', gender: 'masculine', number: 'singular' },
  { article: 'una', noun: 'mesa', type: 'indefinite', gender: 'feminine', number: 'singular' },
  { article: 'unos', noun: 'niños', type: 'indefinite', gender: 'masculine', number: 'plural' },
  { article: 'unas', noun: 'niñas', type: 'indefinite', gender: 'feminine', number: 'plural' }
]

function MatchingGame({ onScore, onBack }: MatchingGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const gameCards: Card[] = []
    let id = 0

    pairs.forEach(pair => {
      // Artículo
      gameCards.push({
        id: id++,
        content: pair.article,
        type: 'article',
        articleType: pair.type as 'definite' | 'indefinite',
        gender: pair.gender as 'masculine' | 'feminine',
        number: pair.number as 'singular' | 'plural',
        isFlipped: false,
        isMatched: false
      })

      // Sustantivo
      gameCards.push({
        id: id++,
        content: pair.noun,
        type: 'noun',
        gender: pair.gender as 'masculine' | 'feminine',
        number: pair.number as 'singular' | 'plural',
        isFlipped: false,
        isMatched: false
      })
    })

    // Mezclar las cartas
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }

  const handleCardClick = (cardId: number) => {
    if (selectedCards.length === 2 || 
        selectedCards.includes(cardId) || 
        cards.find(c => c.id === cardId)?.isMatched) {
      return
    }

    const newSelectedCards = [...selectedCards, cardId]
    setSelectedCards(newSelectedCards)

    // Voltear la carta
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ))

    if (newSelectedCards.length === 2) {
      setAttempts(prev => prev + 1)
      checkMatch(newSelectedCards)
    }
  }

  const checkMatch = (selectedCardIds: number[]) => {
    const [card1, card2] = selectedCardIds.map(id => 
      cards.find(card => card.id === id)!
    )

    const isMatch = 
      card1.type !== card2.type && // Uno debe ser artículo y otro sustantivo
      card1.gender === card2.gender && 
      card1.number === card2.number &&
      ((card1.type === 'article' && card1.articleType) || 
       (card2.type === 'article' && card2.articleType))

    setTimeout(() => {
      if (isMatch) {
        // Es una coincidencia
        setCards(prev => prev.map(card => 
          selectedCardIds.includes(card.id) 
            ? { ...card, isMatched: true } 
            : card
        ))
        setMatches(prev => prev + 1)
        onScore(20)

        if (matches + 1 === pairs.length) {
          setGameCompleted(true)
        }
      } else {
        // No es coincidencia - voltear las cartas
        setCards(prev => prev.map(card => 
          selectedCardIds.includes(card.id) 
            ? { ...card, isFlipped: false } 
            : card
        ))
      }
      setSelectedCards([])
    }, 1000)
  }

  const resetGame = () => {
    setMatches(0)
    setAttempts(0)
    setGameCompleted(false)
    setSelectedCards([])
    setShowHint(false)
    initializeGame()
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  if (gameCompleted) {
    const percentage = Math.round((matches / attempts) * 100)
    return (
      <div className="game-completed">
        <h2>🎉 ¡Felicitaciones!</h2>
        <div className="final-score">
          <p>Parejas encontradas: {matches}/{pairs.length}</p>
          <p>Intentos: {attempts}</p>
          <p>Eficiencia: {percentage}%</p>
          <p>Puntuación: {matches * 20} puntos</p>
        </div>
        <div className="game-controls">
          <button onClick={resetGame} className="btn btn-secondary">🔄 Jugar de Nuevo</button>
          <button onClick={onBack} className="btn btn-primary">← Volver al Menú</button>
        </div>
      </div>
    )
  }

  return (
    <div className="matching-game">
      <div className="game-header">
        <button onClick={onBack} className="btn btn-back">← Volver</button>
        <h2>🃏 Emparejamiento</h2>
        <div className="game-stats-inline">
          <span>Parejas: {matches}/{pairs.length}</span>
          <span>Intentos: {attempts}</span>
        </div>
      </div>

      <div className="game-info">
        <p>Encuentra las parejas correctas entre artículos y sustantivos</p>
        <button onClick={toggleHint} className="btn btn-secondary btn-small">
          {showHint ? '🙈 Ocultar Ayuda' : '💡 Mostrar Ayuda'}
        </button>
      </div>

      {showHint && (
        <div className="hint-panel">
          <h4>💡 Pistas:</h4>
          <ul>
            <li><strong>Masculino singular:</strong> el / un + sustantivo</li>
            <li><strong>Femenino singular:</strong> la / una + sustantivo</li>
            <li><strong>Masculino plural:</strong> los / unos + sustantivos</li>
            <li><strong>Femenino plural:</strong> las / unas + sustantivos</li>
          </ul>
        </div>
      )}

      <div className="cards-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} 
                       ${card.isMatched ? 'matched' : ''} 
                       ${card.type === 'article' ? 'article-card' : 'noun-card'}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-content">
              {card.isFlipped || card.isMatched ? (
                <span className="card-text">{card.content}</span>
              ) : (
                <span className="card-back">🎴</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="score-display">
        Puntuación: {matches * 20} puntos
      </div>
    </div>
  )
}

export default MatchingGame