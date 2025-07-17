import { GameType } from '../App'

interface GameMenuProps {
  onSelectGame: (game: GameType) => void
}

function GameMenu({ onSelectGame }: GameMenuProps) {
  return (
    <div className="game-menu">
      <h2>🎮 Elige tu juego</h2>
      <div className="menu-cards">
        <div className="menu-card" onClick={() => onSelectGame('multiple-choice')}>
          <div className="card-icon">✅</div>
          <h3>Selección Múltiple</h3>
          <p>Elige el artículo correcto</p>
        </div>
        
      </div>
      
      <div className="info-section">
        <h3>📚 ¿Qué vas a aprender?</h3>
        <div className="article-types">
          <div className="article-group">
            <h4>Artículos Definidos</h4>
            <span className="definite-articles">el, la, los, las</span>
          </div>
          <div className="article-group">
            <h4>Artículos Indefinidos</h4>
            <span className="indefinite-articles">un, una, unos, unas</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameMenu