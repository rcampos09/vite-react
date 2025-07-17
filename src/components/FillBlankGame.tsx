import { useState } from 'react'

interface FillBlankGameProps {
  onScore: (points: number) => void
  onBack: () => void
}

interface Exercise {
  sentence: string
  blanks: { position: number; answer: string; type: 'definite' | 'indefinite' }[]
  explanation: string
}

const exercises: Exercise[] = [
  {
    sentence: "__ gato juega con __ pelota roja",
    blanks: [
      { position: 0, answer: "El", type: "definite" },
      { position: 1, answer: "la", type: "definite" }
    ],
    explanation: "Usamos 'El' para gato (masculino) y 'la' para pelota (femenino)."
  },
  {
    sentence: "Necesito __ libro y __ lápiz para estudiar",
    blanks: [
      { position: 0, answer: "un", type: "indefinite" },
      { position: 1, answer: "un", type: "indefinite" }
    ],
    explanation: "Usamos 'un' porque no especificamos qué libro o lápiz en particular."
  },
  {
    sentence: "__ niñas están jugando en __ parque",
    blanks: [
      { position: 0, answer: "Las", type: "definite" },
      { position: 1, answer: "el", type: "definite" }
    ],
    explanation: "Usamos 'Las' para niñas (femenino plural) y 'el' para parque (masculino)."
  },
  {
    sentence: "Vi __ mariposa cerca de __ flores",
    blanks: [
      { position: 0, answer: "una", type: "indefinite" },
      { position: 1, answer: "unas", type: "indefinite" }
    ],
    explanation: "Usamos 'una' y 'unas' porque no especificamos cuáles exactamente."
  },
  {
    sentence: "__ estudiante tiene __ problema con __ tarea",
    blanks: [
      { position: 0, answer: "El", type: "definite" },
      { position: 1, answer: "un", type: "indefinite" },
      { position: 2, answer: "la", type: "definite" }
    ],
    explanation: "Combinamos definidos e indefinidos según el contexto."
  }
]

const articles = {
  definite: ["el", "la", "los", "las", "El", "La", "Los", "Las"],
  indefinite: ["un", "una", "unos", "unas", "Un", "Una", "Unos", "Unas"]
}

function FillBlankGame({ onScore, onBack }: FillBlankGameProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  const exercise = exercises[currentExercise]

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[index] = value
    setUserAnswers(newAnswers)
  }

  const checkAnswers = () => {
    let correctCount = 0
    exercise.blanks.forEach((blank, index) => {
      if (userAnswers[index]?.toLowerCase() === blank.answer.toLowerCase()) {
        correctCount++
      }
    })
    
    const points = correctCount * 10
    setScore(prev => prev + points)
    onScore(points)
    setShowFeedback(true)

    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        nextExercise()
      } else {
        setGameCompleted(true)
      }
    }, 3000)
  }

  const nextExercise = () => {
    setCurrentExercise(prev => prev + 1)
    setUserAnswers([])
    setShowFeedback(false)
  }

  const resetExercise = () => {
    setUserAnswers([])
    setShowFeedback(false)
  }

  const renderSentence = () => {
    const parts = exercise.sentence.split('__')
    const result = []
    
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>)
      
      if (i < parts.length - 1) {
        const blankIndex = i
        const blank = exercise.blanks[blankIndex]
        
        result.push(
          <input
            key={`blank-${i}`}
            type="text"
            className={`blank-input ${showFeedback ? (
              userAnswers[blankIndex]?.toLowerCase() === blank.answer.toLowerCase() 
                ? 'correct' 
                : 'incorrect'
            ) : ''}`}
            value={showFeedback ? blank.answer : (userAnswers[blankIndex] || '')}
            onChange={(e) => handleInputChange(blankIndex, e.target.value)}
            disabled={showFeedback}
            placeholder="___"
            autoComplete="off"
          />
        )
      }
    }
    
    return result
  }

  if (gameCompleted) {
    return (
      <div className="game-completed">
        <h2>🎉 ¡Excelente trabajo!</h2>
        <div className="final-score">
          <p>Puntuación total: {score} puntos</p>
          <p>Has completado todos los ejercicios</p>
        </div>
        <button onClick={onBack} className="btn btn-primary">Volver al Menú</button>
      </div>
    )
  }

  return (
    <div className="fill-blank-game">
      <div className="game-header">
        <button onClick={onBack} className="btn btn-back">← Volver</button>
        <h2>📝 Llenar Espacios</h2>
        <div className="progress">Ejercicio {currentExercise + 1} de {exercises.length}</div>
      </div>

      <div className="exercise-container">
        <div className="sentence-display">
          {renderSentence()}
        </div>

        <div className="articles-help">
          <div className="help-section">
            <h4>Artículos Definidos:</h4>
            <div className="articles-list definite">
              {articles.definite.slice(0, 4).map(article => (
                <span key={article} className="article-chip">{article}</span>
              ))}
            </div>
          </div>
          <div className="help-section">
            <h4>Artículos Indefinidos:</h4>
            <div className="articles-list indefinite">
              {articles.indefinite.slice(0, 4).map(article => (
                <span key={article} className="article-chip">{article}</span>
              ))}
            </div>
          </div>
        </div>

        {!showFeedback && (
          <div className="game-controls">
            <button onClick={resetExercise} className="btn btn-secondary">🔄 Limpiar</button>
            <button 
              onClick={checkAnswers} 
              className="btn btn-primary"
              disabled={userAnswers.length !== exercise.blanks.length || userAnswers.some(answer => !answer.trim())}
            >
              ✅ Verificar
            </button>
          </div>
        )}

        {showFeedback && (
          <div className="feedback success">
            <h3>Respuestas:</h3>
            <p><strong>Explicación:</strong> {exercise.explanation}</p>
            {currentExercise < exercises.length - 1 ? (
              <p>Siguiente ejercicio en 3 segundos...</p>
            ) : (
              <p>¡Has completado todos los ejercicios!</p>
            )}
          </div>
        )}
      </div>

      <div className="score-display">
        Puntuación: {score} puntos
      </div>
    </div>
  )
}

export default FillBlankGame