import { useState } from 'react'

interface MultipleChoiceGameProps {
  onScore: (points: number) => void
  onBack: () => void
}

interface Question {
  sentence: string
  blank: string
  options: string[]
  correct: string
  explanation: string
}

const questions: Question[] = [
  {
    sentence: "__ perro está corriendo en el parque",
    blank: "__",
    options: ["El", "La", "Un", "Una"],
    correct: "El",
    explanation: "Se usa 'El' porque 'perro' es masculino singular y ya sabemos de qué perro hablamos."
  },
  {
    sentence: "__ niña tiene __ libro nuevo",
    blank: "__",
    options: ["La", "El", "Una", "Un"],
    correct: "La",
    explanation: "Se usa 'La' porque 'niña' es femenino singular."
  },
  {
    sentence: "Necesito __ lápiz para escribir",
    blank: "__",
    options: ["un", "una", "el", "la"],
    correct: "un",
    explanation: "Se usa 'un' porque no especificamos cuál lápiz, es indefinido y masculino."
  },
  {
    sentence: "__ flores del jardín son hermosas",
    blank: "__",
    options: ["Las", "Los", "Unas", "Unos"],
    correct: "Las",
    explanation: "Se usa 'Las' porque 'flores' es femenino plural y hablamos de flores específicas."
  },
  {
    sentence: "Vi __ mariposa en __ ventana",
    blank: "__",
    options: ["una", "un", "la", "el"],
    correct: "una",
    explanation: "Se usa 'una' porque es la primera vez que mencionamos la mariposa."
  },
  {
    sentence: "__ estudiantes están en __ aula",
    blank: "__",
    options: ["Los", "Las", "Unos", "Unas"],
    correct: "Los",
    explanation: "Se usa 'Los' porque hablamos de estudiantes específicos."
  },
  {
    sentence: "Quiero __ helado de chocolate",
    blank: "__",
    options: ["un", "una", "el", "la"],
    correct: "un",
    explanation: "Se usa 'un' porque 'helado' es masculino y no especificamos cuál."
  },
  {
    sentence: "__ casa de mi abuela es grande",
    blank: "__",
    options: ["La", "El", "Una", "Un"],
    correct: "La",
    explanation: "Se usa 'La' porque sabemos específicamente de qué casa hablamos."
  }
]

function MultipleChoiceGame({ onScore, onBack }: MultipleChoiceGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  const question = questions[currentQuestion]

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    if (!selectedAnswer) return
    
    setShowFeedback(true)
    
    if (selectedAnswer === question.correct) {
      setCorrectAnswers(prev => prev + 1)
      onScore(15)
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer("")
        setShowFeedback(false)
      } else {
        setGameCompleted(true)
      }
    }, 3000)
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setShowFeedback(false)
    setCorrectAnswers(0)
    setGameCompleted(false)
  }

  if (gameCompleted) {
    const percentage = Math.round((correctAnswers / questions.length) * 100)
    return (
      <div className="game-completed">
        <h2>🎉 ¡Juego Completado!</h2>
        <div className="final-score">
          <p>Respuestas correctas: {correctAnswers}/{questions.length}</p>
          <p>Puntuación: {percentage}%</p>
          {percentage >= 80 && <p className="achievement">🏆 ¡Excelente trabajo!</p>}
          {percentage >= 60 && percentage < 80 && <p className="achievement">👍 ¡Muy bien!</p>}
          {percentage < 60 && <p className="achievement">💪 ¡Sigue practicando!</p>}
        </div>
        <div className="game-controls">
          <button onClick={restartGame} className="btn btn-secondary">🔄 Jugar de Nuevo</button>
          <button onClick={onBack} className="btn btn-primary">← Volver al Menú</button>
        </div>
      </div>
    )
  }

  return (
    <div className="multiple-choice-game">
      <div className="game-header">
        <button onClick={onBack} className="btn btn-back">← Volver</button>
        <h2>✅ Selección Múltiple</h2>
        <div className="progress">
          Pregunta {currentQuestion + 1} de {questions.length}
        </div>
      </div>

      <div className="question-container">
        <div className="question-number">Pregunta {currentQuestion + 1}</div>
        
        <div className="sentence">
          {question.sentence.split(question.blank).map((part, index) => (
            index === 0 ? (
              <span key={index}>{part}</span>
            ) : (
              <span key={index}>
                <span className="blank-space">
                  {showFeedback ? question.correct : (selectedAnswer || "___")}
                </span>
                {part}
              </span>
            )
          ))}
        </div>

        {!showFeedback && (
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {!showFeedback && (
          <button 
            onClick={submitAnswer} 
            className="btn btn-primary"
            disabled={!selectedAnswer}
          >
            Confirmar Respuesta
          </button>
        )}

        {showFeedback && (
          <div className={`feedback ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
            <div className="feedback-header">
              {selectedAnswer === question.correct ? (
                <span>✅ ¡Correcto! +15 puntos</span>
              ) : (
                <span>❌ Incorrecto. La respuesta correcta es: {question.correct}</span>
              )}
            </div>
            <div className="explanation">
              <strong>Explicación:</strong> {question.explanation}
            </div>
          </div>
        )}
      </div>

      <div className="score-display">
        Correctas: {correctAnswers}/{currentQuestion + (showFeedback ? 1 : 0)}
      </div>
    </div>
  )
}

export default MultipleChoiceGame