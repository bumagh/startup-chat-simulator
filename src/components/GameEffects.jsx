import { useState, useEffect, useCallback } from 'react'
import useGameStore from '../store/gameStore'
import { Trophy, Zap, Gift, AlertTriangle, TrendingUp, Star, Coins, Sparkles } from 'lucide-react'

// 成就解锁弹窗
function AchievementPopup({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 achievement-unlock">
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-xl p-4 shadow-2xl backdrop-blur-sm min-w-[300px]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg badge-3d-rotate">
            {achievement.icon || '🏆'}
          </div>
          <div className="flex-1">
            <div className="text-yellow-400 text-xs font-bold mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              成就解锁！
            </div>
            <div className="text-white font-bold">{achievement.name}</div>
            <div className="text-gray-400 text-xs">{achievement.description}</div>
          </div>
        </div>
        {achievement.reward && (
          <div className="mt-3 pt-3 border-t border-yellow-500/30 text-center">
            <span className="text-yellow-400 text-sm">🎁 奖励：{achievement.reward}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// 随机事件弹窗
function RandomEventPopup({ event, onChoice }) {
  const isUrgent = event.type === 'crisis'
  const isOpportunity = event.type === 'opportunity'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`event-appear max-w-md w-full mx-4 rounded-2xl p-6 border-2 ${
        isUrgent ? 'bg-gradient-to-br from-red-900/90 to-dark-400 border-red-500 urgent-flash' :
        isOpportunity ? 'bg-gradient-to-br from-green-900/90 to-dark-400 border-green-500 opportunity-glow' :
        'bg-gradient-to-br from-blue-900/90 to-dark-400 border-blue-500'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            isUrgent ? 'bg-red-500/30' : isOpportunity ? 'bg-green-500/30' : 'bg-blue-500/30'
          } heartbeat`}>
            {event.icon || (isUrgent ? '⚠️' : isOpportunity ? '💎' : '📢')}
          </div>
          <div>
            <div className={`text-xs font-bold ${
              isUrgent ? 'text-red-400' : isOpportunity ? 'text-green-400' : 'text-blue-400'
            }`}>
              {isUrgent ? '🚨 紧急事件' : isOpportunity ? '✨ 机会来临' : '📰 市场动态'}
            </div>
            <div className="text-white font-bold text-lg">{event.title}</div>
          </div>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">{event.description}</p>

        {event.choices && (
          <div className="space-y-2">
            {event.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onChoice(choice)}
                className={`w-full p-3 rounded-lg text-left transition-all choice-card border ${
                  choice.recommended 
                    ? 'border-yellow-500/50 bg-yellow-500/10 rainbow-border' 
                    : 'border-gray-700 bg-dark-300 hover:border-primary-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{choice.text}</span>
                  {choice.recommended && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full recommend-bounce">
                      推荐
                    </span>
                  )}
                </div>
                {choice.effect && (
                  <div className="text-xs text-gray-500 mt-1">{choice.effect}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 浮动奖励提示
function FloatingReward({ type, amount, position }) {
  const icons = {
    cash: '💰',
    exp: '⭐',
    skill: '📈',
    reputation: '👑'
  }
  const colors = {
    cash: 'text-yellow-400',
    exp: 'text-purple-400',
    skill: 'text-blue-400',
    reputation: 'text-orange-400'
  }

  return (
    <div 
      className={`fixed ${colors[type]} font-bold text-lg float-up pointer-events-none z-40`}
      style={{ left: position?.x || '50%', top: position?.y || '50%' }}
    >
      {icons[type]} +{amount}
    </div>
  )
}

// 金币粒子效果
function CoinParticles({ count = 8, origin }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    tx: (Math.random() - 0.5) * 100,
    ty: -30 - Math.random() * 50,
    delay: Math.random() * 0.2
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute text-2xl coin-particle"
          style={{
            left: origin?.x || '50%',
            top: origin?.y || '50%',
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`
          }}
        >
          💰
        </div>
      ))}
    </div>
  )
}

// 连击计数器
function ComboCounter({ count }) {
  if (count < 2) return null

  return (
    <div className="fixed top-1/4 right-8 z-40 combo-effect">
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-white text-2xl font-black">{count}x</div>
          <div className="text-orange-200 text-xs">连击!</div>
        </div>
      </div>
    </div>
  )
}

// 每日签到弹窗
function DailyCheckInPopup({ day, reward, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bounce-in bg-gradient-to-br from-purple-900/90 to-dark-400 rounded-2xl p-6 border-2 border-purple-500 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-4xl level-up-glow">
            🎁
          </div>
          <h3 className="text-white text-xl font-bold mb-2">每日签到</h3>
          <p className="text-purple-300 mb-4">连续签到第 {day} 天</p>
          
          <div className="bg-dark-300 rounded-lg p-4 mb-4">
            <div className="text-gray-400 text-sm mb-2">今日奖励</div>
            <div className="flex items-center justify-center gap-4">
              {reward.cash && (
                <div className="text-yellow-400 font-bold">💰 +{reward.cash}</div>
              )}
              {reward.exp && (
                <div className="text-purple-400 font-bold">⭐ +{reward.exp}</div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg text-white font-bold transition-all shine-effect"
          >
            领取奖励
          </button>
        </div>
      </div>
    </div>
  )
}

// 升级弹窗
function LevelUpPopup({ level, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bounce-in text-center">
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center level-up-glow">
            <div className="text-white">
              <div className="text-5xl font-black">{level}</div>
              <div className="text-sm">LEVEL</div>
            </div>
          </div>
          <div className="absolute -top-2 -left-2 text-4xl star-burst">⭐</div>
          <div className="absolute -top-2 -right-2 text-4xl star-burst" style={{animationDelay: '0.1s'}}>⭐</div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-4xl star-burst" style={{animationDelay: '0.2s'}}>⭐</div>
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
          升级了！
        </h2>
        <p className="text-gray-400">你的创业技能更上一层楼</p>
      </div>
    </div>
  )
}

// 提示气泡
function TooltipBubble({ text, position, type = 'info' }) {
  const colors = {
    info: 'bg-blue-500/90 border-blue-400',
    success: 'bg-green-500/90 border-green-400',
    warning: 'bg-yellow-500/90 border-yellow-400',
    error: 'bg-red-500/90 border-red-400'
  }

  return (
    <div 
      className={`fixed ${colors[type]} text-white text-sm px-3 py-2 rounded-lg border shadow-lg z-40 bounce-in`}
      style={{ left: position?.x, top: position?.y }}
    >
      {text}
      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${colors[type].split(' ')[0]}`} />
    </div>
  )
}

// 进度里程碑
function MilestoneReached({ milestone, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 achievement-unlock">
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500 rounded-xl p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-cyan-400 text-xs font-bold">🎯 里程碑达成</div>
            <div className="text-white font-medium">{milestone}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 主游戏效果管理器
export default function GameEffects() {
  const { player, unlockedAchievements, gameMonth } = useGameStore()
  const [effects, setEffects] = useState({
    achievement: null,
    event: null,
    floatingRewards: [],
    coinParticles: null,
    combo: 0,
    dailyCheckIn: null,
    levelUp: null,
    milestone: null
  })

  // 监听成就解锁
  useEffect(() => {
    if (unlockedAchievements?.length > 0) {
      const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1]
      if (latestAchievement && !effects.achievement) {
        setEffects(prev => ({ ...prev, achievement: latestAchievement }))
      }
    }
  }, [unlockedAchievements])

  // 添加浮动奖励
  const addFloatingReward = useCallback((type, amount) => {
    const id = Date.now()
    const position = {
      x: `${40 + Math.random() * 20}%`,
      y: `${30 + Math.random() * 20}%`
    }
    setEffects(prev => ({
      ...prev,
      floatingRewards: [...prev.floatingRewards, { id, type, amount, position }]
    }))
    setTimeout(() => {
      setEffects(prev => ({
        ...prev,
        floatingRewards: prev.floatingRewards.filter(r => r.id !== id)
      }))
    }, 1500)
  }, [])

  // 显示金币粒子
  const showCoinParticles = useCallback((origin) => {
    setEffects(prev => ({ ...prev, coinParticles: { origin } }))
    setTimeout(() => {
      setEffects(prev => ({ ...prev, coinParticles: null }))
    }, 1000)
  }, [])

  // 关闭成就弹窗
  const closeAchievement = useCallback(() => {
    setEffects(prev => ({ ...prev, achievement: null }))
  }, [])

  // 处理事件选择
  const handleEventChoice = useCallback((choice) => {
    setEffects(prev => ({ ...prev, event: null }))
    // 可以在这里处理选择的结果
  }, [])

  // 关闭升级弹窗
  const closeLevelUp = useCallback(() => {
    setEffects(prev => ({ ...prev, levelUp: null }))
  }, [])

  // 关闭里程碑
  const closeMilestone = useCallback(() => {
    setEffects(prev => ({ ...prev, milestone: null }))
  }, [])

  // 关闭签到
  const closeDailyCheckIn = useCallback(() => {
    setEffects(prev => ({ ...prev, dailyCheckIn: null }))
  }, [])

  return (
    <>
      {/* 成就弹窗 */}
      {effects.achievement && (
        <AchievementPopup 
          achievement={effects.achievement} 
          onClose={closeAchievement} 
        />
      )}

      {/* 随机事件弹窗 */}
      {effects.event && (
        <RandomEventPopup 
          event={effects.event} 
          onChoice={handleEventChoice} 
        />
      )}

      {/* 浮动奖励 */}
      {effects.floatingRewards.map(reward => (
        <FloatingReward key={reward.id} {...reward} />
      ))}

      {/* 金币粒子 */}
      {effects.coinParticles && (
        <CoinParticles origin={effects.coinParticles.origin} />
      )}

      {/* 连击计数 */}
      {effects.combo > 1 && <ComboCounter count={effects.combo} />}

      {/* 每日签到 */}
      {effects.dailyCheckIn && (
        <DailyCheckInPopup 
          day={effects.dailyCheckIn.day}
          reward={effects.dailyCheckIn.reward}
          onClose={closeDailyCheckIn}
        />
      )}

      {/* 升级弹窗 */}
      {effects.levelUp && (
        <LevelUpPopup 
          level={effects.levelUp} 
          onClose={closeLevelUp} 
        />
      )}

      {/* 里程碑 */}
      {effects.milestone && (
        <MilestoneReached 
          milestone={effects.milestone} 
          onClose={closeMilestone} 
        />
      )}
    </>
  )
}

// 导出工具函数供其他组件使用
export { AchievementPopup, RandomEventPopup, FloatingReward, CoinParticles, ComboCounter, LevelUpPopup, MilestoneReached }
