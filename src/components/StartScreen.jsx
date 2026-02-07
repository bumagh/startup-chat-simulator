import { useState } from 'react'
import useGameStore from '../store/gameStore'
import { Rocket, TrendingUp, Users, Zap, ChevronRight } from 'lucide-react'

function StartScreen() {
  const [playerName, setPlayerName] = useState('')
  const [step, setStep] = useState(0)
  const initGame = useGameStore((state) => state.initGame)

  const handleStart = () => {
    if (playerName.trim()) {
      initGame(playerName.trim())
    }
  }

  const features = [
    { icon: <Rocket className="w-8 h-8" />, title: '零成本创业', desc: '从0开始，用智慧和策略打造你的商业帝国' },
    { icon: <TrendingUp className="w-8 h-8" />, title: '真实市场数据', desc: '连接真实世界数据，体验真实创业环境' },
    { icon: <Users className="w-8 h-8" />, title: 'AI导师指导', desc: '内置AI助手，随时为你提供创业建议' },
    { icon: <Zap className="w-8 h-8" />, title: '策略模拟', desc: '运营决策影响发展，体验创业的起起伏伏' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      </div>

      <div className="glass-effect rounded-3xl p-8 max-w-4xl w-full relative z-10">
        {step === 0 ? (
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4">
                <span className="gradient-text">创业聊天室</span>
              </h1>
              <p className="text-xl text-gray-400">商业模拟器 · 零成本创业体验</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-dark-300/50 hover:bg-dark-200/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-primary-400 mb-3 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-semibold text-lg hover:from-primary-400 hover:to-primary-500 transition-all duration-300 transform hover:scale-105 pulse-glow flex items-center gap-2 mx-auto"
            >
              开始创业之旅
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="mt-6 text-gray-500 text-sm">
              💡 在这个模拟器中，你将体验从零开始创业的全过程
            </p>
          </div>
        ) : (
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
              <span className="text-4xl">🚀</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">创建你的创业者身份</h2>
            <p className="text-gray-400 mb-8">给自己取一个创业者名字吧</p>

            <div className="mb-6">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder="输入你的名字..."
                className="w-full px-6 py-4 bg-dark-300 border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(0)}
                className="flex-1 px-6 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-dark-200 transition-all"
              >
                返回
              </button>
              <button
                onClick={handleStart}
                disabled={!playerName.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-semibold hover:from-primary-400 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                进入聊天室
              </button>
            </div>

            <div className="mt-8 p-4 bg-dark-400/50 rounded-xl text-left">
              <p className="text-sm text-gray-400">
                <span className="text-primary-400 font-semibold">💡 游戏提示：</span><br />
                进入聊天室后，你可以通过与AI导师对话来学习创业知识、启动项目、查看市场数据。输入"帮助"查看所有可用命令。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartScreen
