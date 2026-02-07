import { useState, useEffect } from 'react'
import useGameStore from '../store/gameStore'
import { Brain, Target, TrendingUp, Shield, Zap, Lightbulb, Award, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// 策略思维框架
const STRATEGY_FRAMEWORKS = {
  swot: {
    name: 'SWOT分析',
    icon: '🎯',
    description: '分析优势、劣势、机会、威胁',
    tips: ['识别你的核心优势', '承认并改进劣势', '抓住市场机会', '预防潜在威胁']
  },
  porter: {
    name: '波特五力',
    icon: '⚔️',
    description: '分析竞争环境的五个维度',
    tips: ['评估竞争对手实力', '考虑替代品威胁', '了解供应商议价能力', '分析客户议价能力', '注意新进入者']
  },
  lean: {
    name: '精益创业',
    icon: '🔄',
    description: '快速试错、快速迭代',
    tips: ['先做MVP测试市场', '收集用户反馈', '快速调整方向', '避免过度投入未验证想法']
  },
  growth: {
    name: '增长黑客',
    icon: '📈',
    description: '数据驱动的增长策略',
    tips: ['关注核心指标', '设计病毒传播机制', 'A/B测试优化转化', '建立用户留存体系']
  }
}

// 策略提示库
const STRATEGY_TIPS = {
  market_research: [
    { tip: '市场调研是降低风险的最佳投资', principle: '信息不对称', icon: '🔍' },
    { tip: '了解竞争对手的弱点比知道他们的优势更重要', principle: '差异化定位', icon: '🎯' },
    { tip: '细分市场能让小玩家在大市场中生存', principle: '聚焦策略', icon: '🔬' },
  ],
  promotion_prep: [
    { tip: '内容质量决定传播上限，渠道决定传播下限', principle: '内容为王', icon: '✨' },
    { tip: '免费渠道需要时间，付费渠道需要金钱，选择你的优势', principle: '资源配置', icon: '⚖️' },
    { tip: '建立个人品牌是长期复利最高的投资', principle: '品牌溢价', icon: '👤' },
  ],
  promotion_exec: [
    { tip: '不要在所有平台都发力，集中火力打透一个', principle: '集中原则', icon: '🎯' },
    { tip: '追热点能带来流量，但原创能带来粉丝', principle: '内容策略', icon: '🔥' },
    { tip: '转化率比曝光量更重要', principle: '效率优先', icon: '📊' },
  ],
  community_ops: [
    { tip: '100个铁粉比10000个路人更有价值', principle: '用户质量', icon: '💎' },
    { tip: '用户的问题就是你的产品机会', principle: '需求洞察', icon: '💡' },
    { tip: '口碑传播的成本是付费获客的1/10', principle: '裂变增长', icon: '🌱' },
  ],
  conversion: [
    { tip: '定价是策略，不仅仅是成本加成', principle: '价值定价', icon: '💰' },
    { tip: '降低决策门槛比打折更有效', principle: '转化优化', icon: '🚪' },
    { tip: '复购率决定生意的可持续性', principle: '用户生命周期', icon: '♻️' },
  ]
}

// 决策分析数据
const DECISION_ANALYSIS = {
  low_risk_low_reward: { label: '稳健型', color: 'blue', description: '风险低、回报稳定，适合资源有限时' },
  high_risk_high_reward: { label: '激进型', color: 'red', description: '风险高、潜在回报大，需要足够资源支撑' },
  balanced: { label: '平衡型', color: 'green', description: '风险收益平衡，适合大多数情况' },
}

// 竞争者数据
const COMPETITORS = [
  { id: 1, name: '老王工作室', emoji: '👨‍💼', strength: 75, strategy: '低价策略', threat: 'medium' },
  { id: 2, name: '小红创业', emoji: '👩‍💻', strength: 60, strategy: '内容营销', threat: 'low' },
  { id: 3, name: '大厂出来的', emoji: '🏢', strength: 85, strategy: '资源碾压', threat: 'high' },
  { id: 4, name: '网红转型', emoji: '📱', strength: 70, strategy: '流量变现', threat: 'medium' },
]

// 策略评分组件
function StrategyScore({ score, label }) {
  const getColor = (s) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${getColor(score)}`}>{score}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

// 决策卡片组件
function DecisionCard({ choice, analysis, isRecommended }) {
  return (
    <div className={`p-3 rounded-lg border ${isRecommended ? 'border-green-500/50 bg-green-500/10' : 'border-gray-700 bg-dark-300'} decision-card-enter`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{choice.icon}</span>
          <span className="font-medium text-white">{choice.name}</span>
        </div>
        {isRecommended && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 推荐
          </span>
        )}
      </div>
      
      {/* 风险收益分析 */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="flex items-center gap-1 text-xs">
          <Shield className="w-3 h-3 text-blue-400" />
          <span className="text-gray-400">风险:</span>
          <span className={analysis.risk === 'low' ? 'text-green-400' : analysis.risk === 'high' ? 'text-red-400' : 'text-yellow-400'}>
            {analysis.risk === 'low' ? '低' : analysis.risk === 'high' ? '高' : '中'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span className="text-gray-400">收益:</span>
          <span className={analysis.reward === 'high' ? 'text-green-400' : analysis.reward === 'low' ? 'text-red-400' : 'text-yellow-400'}>
            {analysis.reward === 'high' ? '高' : analysis.reward === 'low' ? '低' : '中'}
          </span>
        </div>
      </div>
      
      {/* 策略洞察 */}
      <div className="text-xs text-gray-400 bg-dark-400 rounded p-2">
        💡 {analysis.insight}
      </div>
    </div>
  )
}

// 竞争者卡片
function CompetitorCard({ competitor }) {
  const threatColors = {
    low: 'border-green-500/30 bg-green-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    high: 'border-red-500/30 bg-red-500/5',
  }

  return (
    <div className={`p-2 rounded-lg border ${threatColors[competitor.threat]} competitor-card-enter`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{competitor.emoji}</span>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{competitor.name}</div>
          <div className="text-xs text-gray-500">{competitor.strategy}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary-400">{competitor.strength}</div>
          <div className="text-xs text-gray-500">实力</div>
        </div>
      </div>
    </div>
  )
}

// 策略成就徽章
function StrategyBadge({ badge }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 badge-enter">
      <span className="text-2xl">{badge.icon}</span>
      <div>
        <div className="text-sm font-medium text-yellow-400">{badge.name}</div>
        <div className="text-xs text-gray-400">{badge.description}</div>
      </div>
    </div>
  )
}

// 主策略面板组件
function StrategyPanel() {
  const { currentTask, currentPhase, completedTasks, player, activeProjects } = useGameStore()
  const [activeFramework, setActiveFramework] = useState('swot')
  const [strategyScore, setStrategyScore] = useState({ risk: 65, growth: 70, efficiency: 60 })
  const [earnedBadges, setEarnedBadges] = useState([])

  // 获取当前阶段的策略提示
  const phaseKeys = ['', 'market_research', 'promotion_prep', 'promotion_exec', 'community_ops', 'conversion']
  const currentPhaseTips = STRATEGY_TIPS[phaseKeys[currentPhase]] || STRATEGY_TIPS.market_research

  // 分析当前选择
  const analyzeChoices = () => {
    if (!currentTask?.choices) return []
    
    return currentTask.choices.map(choice => {
      const hasHighCost = (choice.cost?.cash || 0) > 100 || (choice.cost?.energy || 0) > 12
      const hasHighReward = (choice.reward?.reach || 0) > 300 || (choice.reward?.orders || 0) > 2
      const successRate = choice.successRate || 1
      
      let risk = 'medium'
      let reward = 'medium'
      let insight = ''
      
      if (hasHighCost && successRate < 0.7) {
        risk = 'high'
        insight = '高投入策略，需要评估资源承受能力'
      } else if (!hasHighCost && successRate >= 0.8) {
        risk = 'low'
        insight = '稳健选择，适合积累阶段'
      }
      
      if (hasHighReward) {
        reward = 'high'
        if (!insight) insight = '潜在回报大，值得尝试'
      } else {
        reward = 'low'
        if (!insight) insight = '回报有限，但风险可控'
      }
      
      return { choice, analysis: { risk, reward, insight }, isRecommended: risk === 'low' && reward !== 'low' }
    })
  }

  // 计算策略得分
  useEffect(() => {
    const successfulTasks = completedTasks.filter(t => t.success).length
    const totalTasks = completedTasks.length
    const successRate = totalTasks > 0 ? (successfulTasks / totalTasks) * 100 : 50
    
    setStrategyScore({
      risk: Math.floor(70 + (successRate - 50) * 0.5),
      growth: Math.floor(60 + player.experience / 10),
      efficiency: Math.floor(55 + successRate * 0.3)
    })

    // 检查成就
    const badges = []
    if (successfulTasks >= 5) {
      badges.push({ icon: '🎯', name: '策略新手', description: '完成5个成功决策' })
    }
    if (successRate >= 80 && totalTasks >= 3) {
      badges.push({ icon: '🧠', name: '明智决策者', description: '保持80%+成功率' })
    }
    if (player.skills.marketing >= 30) {
      badges.push({ icon: '📈', name: '营销思维', description: '营销技能达到30' })
    }
    setEarnedBadges(badges)
  }, [completedTasks, player])

  const analyzedChoices = analyzeChoices()

  if (activeProjects.length === 0) {
    return (
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-400" />
          策略思维
        </h3>
        <div className="text-center text-gray-500 py-8">
          <span className="text-4xl mb-2 block">🧠</span>
          启动项目后学习策略思维
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 策略得分 */}
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-400" />
          策略思维评分
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <StrategyScore score={strategyScore.risk} label="风险管理" />
          <StrategyScore score={strategyScore.growth} label="增长思维" />
          <StrategyScore score={strategyScore.efficiency} label="效率意识" />
        </div>
      </div>

      {/* 当前决策分析 */}
      {currentTask && analyzedChoices.length > 0 && (
        <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-yellow-400" />
            决策分析：{currentTask.name}
          </h3>
          <div className="space-y-2">
            {analyzedChoices.map((item, index) => (
              <DecisionCard key={index} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* 策略提示 */}
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          策略洞察
        </h3>
        <div className="space-y-2">
          {currentPhaseTips.map((item, index) => (
            <div key={index} className="p-2 bg-dark-300 rounded-lg strategy-tip-enter" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start gap-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm text-gray-300">{item.tip}</p>
                  <span className="text-xs text-primary-400">#{item.principle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 策略框架 */}
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          策略框架
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {Object.entries(STRATEGY_FRAMEWORKS).map(([key, framework]) => (
            <button
              key={key}
              onClick={() => setActiveFramework(key)}
              className={`p-2 rounded-lg text-left transition-all ${
                activeFramework === key
                  ? 'bg-primary-500/20 border border-primary-500/50'
                  : 'bg-dark-300 border border-transparent hover:border-gray-700'
              }`}
            >
              <span className="text-lg">{framework.icon}</span>
              <div className="text-xs font-medium text-white mt-1">{framework.name}</div>
            </button>
          ))}
        </div>
        <div className="bg-dark-300 rounded-lg p-3">
          <div className="text-sm text-gray-300 mb-2">{STRATEGY_FRAMEWORKS[activeFramework].description}</div>
          <ul className="space-y-1">
            {STRATEGY_FRAMEWORKS[activeFramework].tips.map((tip, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 竞争分析 */}
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          竞争者动态
        </h3>
        <div className="space-y-2">
          {COMPETITORS.slice(0, 3).map(competitor => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
      </div>

      {/* 策略成就 */}
      {earnedBadges.length > 0 && (
        <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            策略成就
          </h3>
          <div className="space-y-2">
            {earnedBadges.map((badge, index) => (
              <StrategyBadge key={index} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StrategyPanel
