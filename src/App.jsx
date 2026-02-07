import { useState, useEffect } from 'react'
import useGameStore from './store/gameStore'
import ChatRoom from './components/ChatRoom'
import Sidebar from './components/Sidebar'
import StartScreen from './components/StartScreen'
import MarketPanel from './components/MarketPanel'
import CustomerPanel from './components/CustomerPanel'
import MarketDataView from './components/MarketDataView'
import StrategyPanel from './components/StrategyPanel'
import GameEffects from './components/GameEffects'

function App() {
  const { gameStarted, activeProjects, player } = useGameStore()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [prevLevel, setPrevLevel] = useState(null)

  // 检测等级提升
  useEffect(() => {
    const currentLevel = Math.floor(player?.experience / 100) + 1
    if (prevLevel !== null && currentLevel > prevLevel) {
      setShowLevelUp(currentLevel)
      setTimeout(() => setShowLevelUp(false), 3000)
    }
    setPrevLevel(currentLevel)
  }, [player?.experience])
  const [showMarket, setShowMarket] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState('strategy') // 'strategy' | 'customer' | 'market'

  if (!gameStarted) {
    return <StartScreen />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 游戏特效层 */}
      <GameEffects />
      
      <Sidebar onShowMarket={() => setShowMarket(!showMarket)} showMarket={showMarket} />
      <main className="flex-1 flex">
        <ChatRoom />
        {showMarket && <MarketPanel onClose={() => setShowMarket(false)} />}
      </main>
      
      {/* 右侧游戏面板 */}
      <aside className="w-80 bg-dark-500 border-l border-gray-800 flex flex-col overflow-hidden">
        {/* 标签切换 */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setRightPanelTab('strategy')}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              rightPanelTab === 'strategy'
                ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            🧠 策略
          </button>
          <button
            onClick={() => setRightPanelTab('customer')}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              rightPanelTab === 'customer'
                ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            👥 顾客
          </button>
          <button
            onClick={() => setRightPanelTab('market')}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              rightPanelTab === 'market'
                ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            📊 市场
          </button>
        </div>
        
        {/* 面板内容 */}
        <div className="flex-1 overflow-y-auto p-3">
          {rightPanelTab === 'strategy' ? (
            <StrategyPanel />
          ) : rightPanelTab === 'customer' ? (
            <CustomerPanel />
          ) : (
            <MarketDataView />
          )}
        </div>
      </aside>
    </div>
  )
}

export default App
