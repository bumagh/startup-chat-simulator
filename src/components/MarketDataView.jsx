import { useState, useEffect } from 'react'
import useGameStore from '../store/gameStore'
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Target, Users, DollarSign, MessageCircle, BookOpen, Sparkles } from 'lucide-react'

// 市场趋势数据生成
const generateMarketTrend = (baseValue, volatility = 0.1) => {
  const change = (Math.random() - 0.5) * 2 * volatility * baseValue
  return Math.max(0, baseValue + change)
}

// 简易折线图组件
function MiniChart({ data, color = 'primary', height = 40 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const colorClasses = {
    primary: 'stroke-primary-400',
    green: 'stroke-green-400',
    red: 'stroke-red-400',
    yellow: 'stroke-yellow-400',
    blue: 'stroke-blue-400',
  }

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        className={`${colorClasses[color]} transition-all duration-500`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 市场指标卡片
function MarketIndicator({ icon: Icon, label, value, change, trend, color = 'blue' }) {
  const isPositive = change >= 0
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-3 market-card-enter`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 text-${color}-400`} />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-white">{value}</span>
        <div className={`flex items-center text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="ml-1">{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
      {trend && (
        <div className="mt-2 h-8">
          <MiniChart data={trend} color={isPositive ? 'green' : 'red'} height={32} />
        </div>
      )}
    </div>
  )
}

// 市场反应消息
function MarketReaction({ type, message, timestamp }) {
  const typeConfig = {
    positive: { icon: '📈', color: 'text-green-400', bg: 'bg-green-500/10' },
    negative: { icon: '📉', color: 'text-red-400', bg: 'bg-red-500/10' },
    neutral: { icon: '📊', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    hot: { icon: '🔥', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    trending: { icon: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  }

  const config = typeConfig[type] || typeConfig.neutral

  return (
    <div className={`${config.bg} rounded-lg p-2 flex items-start gap-2 market-reaction-enter`}>
      <span className="text-lg">{config.icon}</span>
      <div className="flex-1">
        <p className={`text-sm ${config.color}`}>{message}</p>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
    </div>
  )
}

// 营销效果展示
function MarketingEffect({ campaign, reach, conversion, roi }) {
  return (
    <div className="bg-dark-300 rounded-lg p-3 marketing-effect-enter">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{campaign}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${roi >= 100 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
          ROI {roi}%
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-bold text-blue-400">{reach}</div>
          <div className="text-xs text-gray-500">曝光</div>
        </div>
        <div>
          <div className="text-sm font-bold text-green-400">{conversion}%</div>
          <div className="text-xs text-gray-500">转化</div>
        </div>
        <div>
          <div className="text-sm font-bold text-purple-400">{Math.floor(reach * conversion / 100)}</div>
          <div className="text-xs text-gray-500">获客</div>
        </div>
      </div>
      {/* 效果条 */}
      <div className="mt-2 h-2 bg-dark-500 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(100, conversion * 10)}%` }}
        />
      </div>
    </div>
  )
}

// 市场专员卡片组件
function MarketSpecialistCard({ onCallSpecialist, isActive }) {
  return (
    <div className={`bg-gradient-to-br ${isActive ? 'from-purple-500/20 to-blue-500/20 border-purple-500/50' : 'from-dark-300 to-dark-400 border-gray-700'} border rounded-xl p-4 mb-4 transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isActive ? 'bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse' : 'bg-dark-200'}`}>
          📊
        </div>
        <div>
          <h4 className="font-bold text-white flex items-center gap-2">
            市场专员 Luna
            {isActive && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">在线</span>}
          </h4>
          <p className="text-xs text-gray-400">数据分析 · 市场研究 · 趋势预测</p>
        </div>
      </div>
      
      {!isActive ? (
        <button 
          onClick={onCallSpecialist}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          呼叫市场专员
        </button>
      ) : (
        <div className="text-xs text-gray-400 text-center">
          💡 在聊天中输入"市场教学"、"市场动态"获取指导
        </div>
      )}
    </div>
  )
}

// 数据教学卡片
function DataTutorialCard({ tip, isLearned, onLearn }) {
  return (
    <div className={`bg-dark-300 rounded-lg p-3 border ${isLearned ? 'border-green-500/30' : 'border-gray-700'} transition-all hover:border-primary-500/50`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{tip.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-white">{tip.title}</h5>
            {isLearned && <span className="text-xs text-green-400">✓ 已学</span>}
          </div>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{tip.content}</p>
        </div>
      </div>
    </div>
  )
}

// 实时动态消息
function LiveMarketMessage({ message, type }) {
  const typeStyles = {
    trend: 'border-blue-500/30 bg-blue-500/10',
    opportunity: 'border-green-500/30 bg-green-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    insight: 'border-purple-500/30 bg-purple-500/10'
  }
  
  return (
    <div className={`border rounded-lg p-2 ${typeStyles[type] || typeStyles.insight} animate-fade-in`}>
      <p className="text-xs text-gray-300">{message}</p>
    </div>
  )
}

// 市场教学技巧数据
const TUTORIAL_TIPS = [
  { id: 'trend_analysis', title: '趋势分析法', content: '观察市场增长率，>15%的赛道值得关注！', icon: '📈' },
  { id: 'competitor_research', title: '竞品分析', content: '找到竞争对手的薄弱环节就是你的机会', icon: '🔍' },
  { id: 'user_persona', title: '用户画像', content: '精准定位比广撒网效率高10倍', icon: '👥' },
  { id: 'price_strategy', title: '定价策略', content: '新手建议低于市场价10-20%切入', icon: '💰' },
]

// 主市场数据视图组件
function MarketDataView() {
  const { promotionStats, communityMetrics, gameMonth, gameYear, activeProjects, marketSpecialistActive, learnedTips, sendMessage } = useGameStore()
  const [marketData, setMarketData] = useState({
    demand: 65,
    competition: 45,
    sentiment: 72,
    growth: 8,
  })
  const [trends, setTrends] = useState({
    demand: [60, 62, 58, 65, 63, 67, 65],
    competition: [40, 42, 45, 43, 46, 44, 45],
    sentiment: [68, 70, 72, 69, 74, 71, 72],
  })
  const [marketReactions, setMarketReactions] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [liveMessages, setLiveMessages] = useState([])
  const [showTutorial, setShowTutorial] = useState(false)

  // 更新市场数据
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        demand: Math.round(generateMarketTrend(prev.demand, 0.05)),
        competition: Math.round(generateMarketTrend(prev.competition, 0.03)),
        sentiment: Math.round(generateMarketTrend(prev.sentiment, 0.04)),
        growth: Math.round((Math.random() - 0.3) * 20),
      }))

      setTrends(prev => ({
        demand: [...prev.demand.slice(1), marketData.demand],
        competition: [...prev.competition.slice(1), marketData.competition],
        sentiment: [...prev.sentiment.slice(1), marketData.sentiment],
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [marketData])

  // 生成市场反应
  useEffect(() => {
    if (promotionStats.totalReach > 0) {
      const reactions = []
      if (promotionStats.totalReach > 500) {
        reactions.push({ type: 'positive', message: '你的内容正在获得关注！', timestamp: '刚刚' })
      }
      if (communityMetrics.totalOrders > 0) {
        reactions.push({ type: 'hot', message: `已有 ${communityMetrics.totalOrders} 位顾客下单`, timestamp: '最近' })
      }
      if (marketData.sentiment > 70) {
        reactions.push({ type: 'trending', message: '市场情绪积极，适合推广', timestamp: '市场分析' })
      }
      setMarketReactions(reactions.slice(0, 3))
    }
  }, [promotionStats, communityMetrics, marketData.sentiment])

  // 生成营销活动数据
  useEffect(() => {
    if (promotionStats.totalCampaigns > 0) {
      setCampaigns([
        {
          campaign: '社交媒体推广',
          reach: promotionStats.totalReach || 0,
          conversion: Math.min(5, (communityMetrics.trust / 20)).toFixed(1),
          roi: Math.floor(100 + Math.random() * 50)
        }
      ])
    }
  }, [promotionStats, communityMetrics])

  // 生成实时市场动态消息
  useEffect(() => {
    if (marketSpecialistActive) {
      const messages = [
        { type: 'trend', message: `📈 ${['电商零售', '内容创作', '社交团购'][Math.floor(Math.random() * 3)]}行业本周增长${Math.floor(10 + Math.random() * 20)}%` },
        { type: 'opportunity', message: `💡 发现机会：${['宠物用品', '健康食品', '智能家居'][Math.floor(Math.random() * 3)]}细分市场竞争度低` },
        { type: 'insight', message: `🎯 ${Math.floor(60 + Math.random() * 30)}%的用户在${['20:00-22:00', '12:00-14:00'][Math.floor(Math.random() * 2)]}最活跃` },
      ]
      setLiveMessages(messages.slice(0, 2))
    }
  }, [marketSpecialistActive, gameMonth])

  // 呼叫市场专员
  const handleCallSpecialist = () => {
    sendMessage('市场专员')
  }

  if (activeProjects.length === 0) {
    return (
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          市场数据
        </h3>
        
        {/* 市场专员卡片 - 即使没有项目也显示 */}
        <MarketSpecialistCard 
          onCallSpecialist={handleCallSpecialist}
          isActive={marketSpecialistActive}
        />
        
        <div className="text-center text-gray-500 py-4">
          <span className="text-4xl mb-2 block">📊</span>
          启动项目后查看完整市场数据
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary-400" />
        市场数据
        <span className="ml-auto text-xs text-gray-500">{gameYear}年{gameMonth}月</span>
      </h3>

      {/* 市场专员卡片 */}
      <MarketSpecialistCard 
        onCallSpecialist={handleCallSpecialist}
        isActive={marketSpecialistActive}
      />

      {/* 实时市场动态 - 市场专员激活时显示 */}
      {marketSpecialistActive && liveMessages.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400">Luna的实时情报</span>
          </div>
          <div className="space-y-2">
            {liveMessages.map((msg, index) => (
              <LiveMarketMessage key={index} message={msg.message} type={msg.type} />
            ))}
          </div>
        </div>
      )}

      {/* 数据教学按钮 */}
      {marketSpecialistActive && (
        <div className="mb-4">
          <button 
            onClick={() => setShowTutorial(!showTutorial)}
            className="w-full py-2 bg-dark-300 hover:bg-dark-200 rounded-lg text-sm text-gray-300 flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            {showTutorial ? '收起教学' : '📚 Luna的数据分析教学'}
          </button>
          
          {showTutorial && (
            <div className="mt-3 space-y-2">
              {TUTORIAL_TIPS.map((tip) => (
                <DataTutorialCard 
                  key={tip.id} 
                  tip={tip} 
                  isLearned={learnedTips?.includes(tip.id)}
                />
              ))}
              <div className="text-xs text-center text-gray-500 mt-2">
                💡 在聊天中输入"市场教学"获取更详细的指导
              </div>
            </div>
          )}
        </div>
      )}

      {/* 市场指标 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MarketIndicator
          icon={Target}
          label="市场需求"
          value={marketData.demand}
          change={marketData.growth}
          trend={trends.demand}
          color="blue"
        />
        <MarketIndicator
          icon={Users}
          label="竞争强度"
          value={marketData.competition}
          change={-2}
          trend={trends.competition}
          color="yellow"
        />
        <MarketIndicator
          icon={Activity}
          label="市场情绪"
          value={marketData.sentiment}
          change={3}
          trend={trends.sentiment}
          color="green"
        />
        <MarketIndicator
          icon={DollarSign}
          label="你的曝光"
          value={promotionStats.totalReach || 0}
          change={promotionStats.totalReach > 0 ? 15 : 0}
          color="purple"
        />
      </div>

      {/* 市场反应 */}
      {marketReactions.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            市场反应
          </div>
          <div className="space-y-2">
            {marketReactions.map((reaction, index) => (
              <MarketReaction key={index} {...reaction} />
            ))}
          </div>
        </div>
      )}

      {/* 营销效果 */}
      {campaigns.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            营销效果
          </div>
          <div className="space-y-2">
            {campaigns.map((campaign, index) => (
              <MarketingEffect key={index} {...campaign} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketDataView
