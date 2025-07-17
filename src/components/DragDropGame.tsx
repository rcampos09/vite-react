import { useState, useEffect } from 'react'

interface DragDropGameProps {
  onScore: (points: number) => void
  onBack: () => void
}

interface DragItem {
  id: string
  article: string
  type: 'definite' | 'indefinite'
}

interface DropZone {
  id: string
  noun: string
  gender: 'masculine' | 'feminine'
  number: 'singular' | 'plural'
  correctArticles: string[]
  droppedArticle?: string
}

const levels = [
  {
    articles: [
      { id: '1', article: 'el', type: 'definite' as const },
      { id: '2', article: 'la', type: 'definite' as const },
      { id: '3', article: 'un', type: 'indefinite' as const },
      { id: '4', article: 'una', type: 'indefinite' as const }
    ],
    nouns: [
      { id: 'n1', noun: 'gato', gender: 'masculine' as const, number: 'singular' as const, correctArticles: ['el', 'un'] },
      { id: 'n2', noun: 'casa', gender: 'feminine' as const, number: 'singular' as const, correctArticles: ['la', 'una'] },
      { id: 'n3', noun: 'libro', gender: 'masculine' as const, number: 'singular' as const, correctArticles: ['el', 'un'] },
      { id: 'n4', noun: 'mesa', gender: 'feminine' as const, number: 'singular' as const, correctArticles: ['la', 'una'] }
    ]
  },
  {
    articles: [
      { id: '5', article: 'los', type: 'definite' as const },
      { id: '6', article: 'las', type: 'definite' as const },
      { id: '7', article: 'unos', type: 'indefinite' as const },
      { id: '8', article: 'unas', type: 'indefinite' as const }
    ],
    nouns: [
      { id: 'n5', noun: 'perros', gender: 'masculine' as const, number: 'plural' as const, correctArticles: ['los', 'unos'] },
      { id: 'n6', noun: 'flores', gender: 'feminine' as const, number: 'plural' as const, correctArticles: ['las', 'unas'] },
      { id: 'n7', noun: 'coches', gender: 'masculine' as const, number: 'plural' as const, correctArticles: ['los', 'unos'] },
      { id: 'n8', noun: 'niñas', gender: 'feminine' as const, number: 'plural' as const, correctArticles: ['las', 'unas'] }
    ]
  }
]

function DragDropGame({ onScore, onBack }: DragDropGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [dragItems, setDragItems] = useState<DragItem[]>([])
  const [dropZones, setDropZones] = useState<DropZone[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    loadLevel(currentLevel)
  }, [currentLevel])

  const loadLevel = (levelIndex: number) => {
    const level = levels[levelIndex]
    setDragItems([...level.articles])
    setDropZones(level.nouns.map(noun => ({ ...noun, droppedArticle: undefined })))
    setFeedback("")
  }

  const handleDragStart = (articleId: string) => {
    setDraggedItem(articleId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, nounId: string) => {
    e.preventDefault()
    
    if (!draggedItem) return
    
    const article = dragItems.find(item => item.id === draggedItem)
    const noun = dropZones.find(zone => zone.id === nounId)
    
    if (!article || !noun) return

    // Check if this noun already has an article
    if (noun.droppedArticle) {
      // Return the previous article to the drag area
      const previousArticle = dragItems.find(item => item.article === noun.droppedArticle)
      if (previousArticle) {
        setDragItems(prev => [...prev.filter(item => item.id !== draggedItem), previousArticle])
      }
    }

    // Update drop zones
    setDropZones(prev => prev.map(zone => 
      zone.id === nounId 
        ? { ...zone, droppedArticle: article.article }
        : zone
    ))

    // Remove article from drag items
    setDragItems(prev => prev.filter(item => item.id !== draggedItem))
    setDraggedItem(null)
  }

  const handleArticleReturn = (nounId: string) => {
    const noun = dropZones.find(zone => zone.id === nounId)
    if (!noun || !noun.droppedArticle) return

    // Find the original article object
    const level = levels[currentLevel]
    const originalArticle = level.articles.find(art => art.article === noun.droppedArticle)
    if (!originalArticle) return

    // Return article to drag area
    setDragItems(prev => [...prev, originalArticle])
    
    // Remove from drop zone
    setDropZones(prev => prev.map(zone => 
      zone.id === nounId 
        ? { ...zone, droppedArticle: undefined }
        : zone
    ))
  }

  const checkAnswers = () => {
    let correct = 0
    let total = 0
    
    dropZones.forEach(zone => {
      if (zone.droppedArticle) {
        total++
        if (zone.correctArticles.includes(zone.droppedArticle)) {
          correct++
        }
      }
    })
    
    if (total === 0) {
      setFeedback("¡Arrastra los artículos a las palabras!")
      return
    }
    
    const score = correct * 20
    onScore(score)
    
    if (correct === dropZones.length) {
      setFeedback(`¡Perfecto! ${correct}/${dropZones.length} correctos. +${score} puntos`)
      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(prev => prev + 1)
        } else {
          setGameCompleted(true)
        }
      }, 2000)
    } else {
      setFeedback(`${correct}/${dropZones.length} correctos. +${score} puntos`)
    }
  }

  const resetLevel = () => {
    loadLevel(currentLevel)
  }

  if (gameCompleted) {
    return (
      <div className="game-completed">
        <h2>🎉 ¡Todos los niveles completados!</h2>
        <p>Has dominado los artículos definidos e indefinidos</p>
        <button onClick={onBack} className="btn btn-primary">Volver al Menú</button>
      </div>
    )
  }

  return (
    <div className="drag-drop-game">
      <div className="game-header">
        <button onClick={onBack} className="btn btn-back">← Volver</button>
        <h2>🔄 Arrastrar y Soltar</h2>
        <div className="progress">Nivel {currentLevel + 1} de {levels.length}</div>
      </div>

      <div className="instructions">
        <p>Arrastra los artículos correctos a cada palabra:</p>
      </div>

      <div className="drag-area">
        <h3>Artículos disponibles:</h3>
        <div className="drag-items">
          {dragItems.map(item => (
            <div
              key={item.id}
              className={`drag-item ${item.type}`}
              draggable
              onDragStart={() => handleDragStart(item.id)}
            >
              {item.article}
            </div>
          ))}
        </div>
      </div>

      <div className="drop-area">
        <h3>Palabras:</h3>
        <div className="drop-zones">
          {dropZones.map(zone => (
            <div
              key={zone.id}
              className={`drop-zone ${zone.droppedArticle ? 'filled' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
            >
              <div className="noun">{zone.noun}</div>
              {zone.droppedArticle && (
                <div 
                  className="dropped-article"
                  onClick={() => handleArticleReturn(zone.id)}
                  title="Clic para devolver"
                >
                  {zone.droppedArticle}
                </div>
              )}
              <div className="zone-info">
                {zone.gender} • {zone.number}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <button onClick={resetLevel} className="btn btn-secondary">🔄 Reiniciar</button>
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

export default DragDropGame