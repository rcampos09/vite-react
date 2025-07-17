import { useState, useEffect } from 'react'

interface TextHighlightGameProps {
  onScore: (points: number) => void
  onBack: () => void
}

interface WordItem {
  word: string
  isArticle: boolean
  articleType?: 'definite' | 'indefinite'
  highlighted?: 'red' | 'blue' | null
}

const sentences = [
  "El perro corre en el parque con una pelota",
  "La niña tiene un libro y unos lápices",
  "Los gatos duermen en las casas grandes",
  "Una mariposa vuela sobre los flores del jardín",
  "El maestro enseña a los estudiantes con una pizarra",
  "Las abejas hacen miel en las colmenas del bosque"
]

function TextHighlightGame({ onScore, onBack }: TextHighlightGameProps) {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [words, setWords] = useState<WordItem[]>([])
  const [selectedColor, setSelectedColor] = useState<'red' | 'blue'>('red')
  const [gameCompleted, setGameCompleted] = useState(false)
  const [feedback, setFeedback] = useState<string>("")

  useEffect(() => {
    loadSentence(currentSentence)
  }, [currentSentence])

  const loadSentence = (index: number) => {
    const sentence = sentences[index]
    const wordsArray = sentence.split(' ').map(word => {
      const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '')
      const isDefinite = ['el', 'la', 'los', 'las'].includes(cleanWord)
      const isIndefinite = ['un', 'una', 'unos', 'unas'].includes(cleanWord)
      
      return {
        word,
        isArticle: isDefinite || isIndefinite,
        articleType: isDefinite ? 'definite' as const : isIndefinite ? 'indefinite' as const : undefined,
        highlighted: null
      }
    })
    setWords(wordsArray)
    setGameCompleted(false)
    setFeedback("")
  }

  const handleWordClick = (index: number) => {
    if (!words[index].isArticle) return
    
    setWords(prev => prev.map((word, i) => 
      i === index 
        ? { ...word, highlighted: word.highlighted === selectedColor ? null : selectedColor }
        : word
    ))
  }

  const checkAnswers = () => {
    let correct = 0
    let total = 0
    
    words.forEach(word => {
      if (word.isArticle) {
        total++
        const shouldBeRed = word.articleType === 'definite'
        const shouldBeBlue = word.articleType === 'indefinite'
        
        if ((shouldBeRed && word.highlighted === 'red') || 
            (shouldBeBlue && word.highlighted === 'blue')) {
          correct++
        }
      }
    })
    
    const score = correct * 10
    onScore(score)
    
    if (correct === total) {
      setFeedback(`¡Perfecto! ${correct}/${total} correcto. +${score} puntos`)
      setTimeout(() => {
        if (currentSentence < sentences.length - 1) {
          setCurrentSentence(prev => prev + 1)
        } else {
          setGameCompleted(true)
        }
      }, 2000)
    } else {
      setFeedback(`${correct}/${total} correcto. ¡Sigue intentando!`)
    }
  }

  const resetSentence = () => {
    loadSentence(currentSentence)
  }

  if (gameCompleted) {
    return (
      <div className="game-completed">
        <h2>🎉 ¡Felicitaciones!</h2>
        <p>Has completado todas las oraciones</p>
        <button onClick={onBack} className="btn btn-primary">Volver al Menú</button>
      </div>
    )
  }

  return (
    <div className="text-highlight-game">
      <div className="game-header">
        <button onClick={onBack} className="btn btn-back">← Volver</button>
        <h2>🎨 Colorear Artículos</h2>
        <div className="progress">Oración {currentSentence + 1} de {sentences.length}</div>
      </div>


      <div className="color-selector">
        <button 
          className={`color-btn red ${selectedColor === 'red' ? 'active' : ''}`}
          onClick={() => setSelectedColor('red')}
        >
          🔴 Rojo
        </button>
        <button 
          className={`color-btn blue ${selectedColor === 'blue' ? 'active' : ''}`}
          onClick={() => setSelectedColor('blue')}
        >
          🔵 Azul
        </button>
      </div>

      <div className="sentence-container">
        <div className="sentence">
          {words.map((word, index) => (
            <span
              key={index}
              className={`word ${word.isArticle ? 'article' : ''} ${word.highlighted || ''}`}
              onClick={() => handleWordClick(index)}
            >
              {word.word}
            </span>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <button onClick={resetSentence} className="btn btn-secondary">🔄 Reiniciar</button>
        <button onClick={checkAnswers} className="btn btn-primary">✅ Verificar</button>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes('Perfecto') ? 'success' : 'info'}`}>
          {feedback}
        </div>
      )}
    </div>
  )
}

export default TextHighlightGame