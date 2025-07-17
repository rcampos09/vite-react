interface GameStatsProps {
  score: number
  level: number
}

function GameStats({ score, level }: GameStatsProps) {
  return (
    <div className="game-stats">
      <div className="stat">
        <span className="stat-label">Puntos:</span>
        <span className="stat-value">{score}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Nivel:</span>
        <span className="stat-value">{level}</span>
      </div>
    </div>
  )
}

export default GameStats