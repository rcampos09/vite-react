import { useState, useEffect, useRef } from 'react'

interface SpeedQuizGameProps {
  onScore: (points: number) => void
  onBack: () => void
}

interface QuizQuestion {
  word: string
  correctArticle: string
  options: string[]
  gender: 'masculine' | 'feminine'
  number: 'singular' | 'plural'
  hint: string
}

const questions: QuizQuestion[] = [
  { word: "mesa", correctArticle: "la", options: ["el", "la", "los", "las"], gender: "feminine", number: "singular", hint: "femenino singular" },
  { word: "perros", correctArticle: "los", options: ["el", "la", "los", "las"], gender: "masculine", number: "plural", hint: "masculino plural" },
  { word: "casa", correctArticle: "la", options: ["el", "la", "los", "las"], gender: "feminine", number: "singular", hint: "femenino singular" },
  { word: "libros", correctArticle: "los", options: ["el", "la", "los", "las"], gender: "masculine", number: "plural", hint: "masculino plural" },
  { word: "niña", correctArticle: "la", options: ["el", "la", "los", "las"], gender: "feminine", number: "singular", hint: "femenino singular" },
  { word: "gatos", correctArticle: "los", options: ["el", "la", "los", "las"], gender: "masculine", number: "plural", hint: "masculino plural" },
  { word: "escuela", correctArticle: "la", options: ["el", "la", "los", "las"], gender: "feminine", number: "singular", hint: "femenino singular" },
  { word: "coches", correctArticle: "los", options: ["el", "la", "los", "las"], gender: "masculine", number: "plural", hint: "masculino plural" },
  { word: "flores", correctArticle: "las", options: ["el", "la", "los", "las"], gender: "feminine", number: "plural", hint: "femenino plural" },
  { word: "zapato", correctArticle: "el", options: ["el", "la", "los", "las"], gender: "masculine", number: "singular", hint: "masculino singular" },
  { word: "sillas", correctArticle: "las", options: ["el", "la", "los", "las"], gender: "feminine", number: "plural", hint: "femenino plural" },
  { word: "árbol", correctArticle: "el", options: ["el", "la", "los", "las"], gender: "masculine", number: "singular", hint: "masculino singular" },
  { word: "ventanas", correctArticle: "las", options: ["el", "la", "los", "las"], gender: "feminine", number: "plural", hint: "femenino plural" },
  { word: "teléfono", correctArticle: "el", options: ["el", "la", "los", "las"], gender: "masculine", number: "singular", hint: "masculino singular" },
  { word: "manzanas", correctArticle: "las", options: ["el", "la", "los", "las"], gender: "feminine", number: "plural", hint: "femenino plural" },
  { word: "ordenador", correctArticle: "el", options: ["el", "la", "los", "las"], gender: "masculine", number: "singular", hint: "masculino singular" },
  { word: "bicicleta", correctArticle: "la", options: ["el", "la", "los", "las"], gender: "feminine", number: "singular", hint: "femenino singular" },
  { word: "niños", correctArticle: "los", options: ["el", "la", "los", "las"], gender: "masculine", number: "plural", hint: "masculino plural" },
  { word: "agua", correctArticle: "el", options: ["el", "la", "los", "las"], gender: "feminine", number: "singular", hint: "excepción: femenino que usa 'el'" },
  { word: "problema", correctArticle: "el", options: ["el", "la", "los", "las"], gender: "masculine", number: "singular", hint: "excepción: masculino terminado en 'a'" }
]

function SpeedQuizGame({ onScore, onBack }: SpeedQuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isGameActive, setIsGameActive] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [questionsPool, setQuestionsPool] = useState<QuizQuestion[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  const startGame = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setQuestionsPool(shuffled)
    setCurrentQuestion(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTotalQuestions(0)
    setTimeLeft(10)
    setIsGameActive(true)
    setGameCompleted(false)
    setShowFeedback(false)
    setSelectedAnswer(null)
    startTimer()
  }

  const startTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
    }
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTimeUp = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
    }
    setIsGameActive(false)
    setGameCompleted(true)
    if (streak > bestStreak) {
      setBestStreak(streak)
    }
  }

  const handleAnswerClick = (answer: string) => {
    if (!isGameActive || showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    const isCorrect = answer === questionsPool[currentQuestion].correctArticle
    
    if (isCorrect) {
      const points = 10 + (streak * 2) // Bonus por racha
      setScore(prev => prev + points)
      onScore(points)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setTotalQuestions(prev => prev + 1)

    setTimeout(() => {
      if (currentQuestion + 1 < questionsPool.length) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setTimeLeft(10)
        startTimer()
      } else {
        // Reiniciar con nuevas preguntas
        const shuffled = [...questions].sort(() => Math.random() - 0.5)
        setQuestionsPool(shuffled)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setTimeLeft(10)
        startTimer()
      }
    }, 1500)
  }

  const getStreakColor = () => {
    if (streak >= 10) return '#10b981' // Verde
    if (streak >= 5) return '#f59e0b'  // Amarillo
    return '#6b7280' // Gris
  }

  if (!isGameActive && !gameCompleted) {
    return (
      <div className="speed-quiz-start">
        <div className="game-header">
          <button onClick={onBack} className="btn btn-back">← Volver</button>
          <h2>⚡ Quiz Rápido</h2>
          <div></div>
        </div>

        <div className="start-screen">
          <div className="game-icon">⚡</div>
          <h3>¡Demuestra tu velocidad!</h3>
          <div className="game-rules">
            <p>📋 <strong>Reglas:</strong></p>
            <ul>
              <li>Tienes 10 segundos por pregunta</li>
              <li>Responde el mayor número de preguntas</li>
              <li>¡Mantén la racha para puntos extra!</li>
              <li>+10 puntos base + bonus por racha</li>
            </ul>
          </div>
          <button onClick={startGame} className="btn btn-primary btn-large">
            🚀 ¡Empezar Quiz!
          </button>
        </div>
      </div>
    )
  }

  if (gameCompleted) {
    return (
      <div className="game-completed">
        <h2>⚡ ¡Tiempo Agotado!</h2>
        <div className="final-score">
          <p>Puntuación final: {score} puntos</p>
          <p>Preguntas respondidas: {totalQuestions}</p>
          <p>Mejor racha: {bestStreak} seguidas</p>
          {bestStreak >= 10 && <p className="achievement">🏆 ¡Maestro de la velocidad!</p>}
          {bestStreak >= 5 && bestStreak < 10 && <p className="achievement">⭐ ¡Excelente racha!</p>}
        </div>
        <div className="game-controls">
          <button onClick={startGame} className="btn btn-secondary">🔄 Jugar de Nuevo</button>
          <button onClick={onBack} className="btn btn-primary">← Volver al Menú</button>
        </div>
      </div>
    )
  }

  const question = questionsPool[currentQuestion]

  return (
    <div className="speed-quiz-game">
      <div className="game-header">
        <button onClick={onBack} className="btn btn-back">← Volver</button>
        <h2>⚡ Quiz Rápido</h2>
        <div className="game-stats-speed">
          <span>Puntos: {score}</span>
          <span style={{ color: getStreakColor() }}>🔥 {streak}</span>
        </div>
      </div>

      <div className="timer-container">
        <div className="timer-bar">
          <div 
            className="timer-fill" 
            style={{ 
              width: `${(timeLeft / 10) * 100}%`,
              backgroundColor: timeLeft <= 3 ? '#ef4444' : timeLeft <= 6 ? '#f59e0b' : '#10b981'
            }}
          ></div>
        </div>
        <div className="timer-text">{timeLeft}s</div>
      </div>

      <div className="question-card">
        <div className="word-display">
          <span className="word-label">Escoge el artículo para:</span>
          <span className="target-word">{question.word}</span>
          <div className="word-hint">({question.hint})</div>
        </div>

        <div className="speed-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`speed-option ${selectedAnswer === option ? 
                (option === question.correctArticle ? 'correct' : 'incorrect') : ''}`}
              onClick={() => handleAnswerClick(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`quick-feedback ${selectedAnswer === question.correctArticle ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === question.correctArticle ? (
              <span>✅ ¡Correcto! +{10 + (streak * 2)} puntos</span>
            ) : (
              <span>❌ Era: {question.correctArticle}</span>
            )}
          </div>
        )}
      </div>

      <div className="progress-info">
        <span>Pregunta {totalQuestions + 1}</span>
        <span>Mejor racha: {Math.max(streak, bestStreak)}</span>
      </div>
    </div>
  )
}

export default SpeedQuizGame