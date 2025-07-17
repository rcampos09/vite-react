import { useState } from 'react'
import './App.css'
import GameMenu from './components/GameMenu'
import TextHighlightGame from './components/TextHighlightGame'
import MultipleChoiceGame from './components/MultipleChoiceGame'
import DragDropGame from './components/DragDropGame'
import GameStats from './components/GameStats'

export type GameType = 'menu' | 'highlight' | 'multiple-choice' | 'drag-drop'

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu')
  const [totalScore, setTotalScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [achievements, setAchievements] = useState<string[]>([])

  const addScore = (points: number) => {
    setTotalScore(prev => prev + points)
    
    const newLevel = Math.floor((totalScore + points) / 100) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      addAchievement(`¡Nivel ${newLevel} alcanzado!`)
    }
  }

  const addAchievement = (achievement: string) => {
    setAchievements(prev => [...prev, achievement])
  }

  const renderGame = () => {
    switch (currentGame) {
      case 'highlight':
        return <TextHighlightGame onScore={addScore} onBack={() => setCurrentGame('menu')} />
      case 'multiple-choice':
        return <MultipleChoiceGame onScore={addScore} onBack={() => setCurrentGame('menu')} />
      case 'drag-drop':
        return <DragDropGame onScore={addScore} onBack={() => setCurrentGame('menu')} />
      default:
        return <GameMenu onSelectGame={setCurrentGame} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Aprendiendo Artículos</h1>
        <GameStats score={totalScore} level={level} />
      </header>
      
      <main className="app-main">
        {renderGame()}
      </main>

      {achievements.length > 0 && (
        <div className="achievements-popup">
          <div className="achievement">
            <span>🏆 {achievements[achievements.length - 1]}</span>
            <button onClick={() => setAchievements(prev => prev.slice(0, -1))}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
