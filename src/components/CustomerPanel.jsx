import { useState, useEffect } from 'react'
import useGameStore from '../store/gameStore'
import { MessageCircle, Heart, ThumbsUp, ShoppingCart, Star, TrendingUp } from 'lucide-react'

// 顾客头像数据 - 使用emoji组合模拟上半身头像
const CUSTOMER_AVATARS = [
  { id: 1, emoji: '👩‍💼', name: '李小姐', type: 'professional', mood: 'neutral', outfit: '职业装' },
  { id: 2, emoji: '👨‍💻', name: '张先生', type: 'tech', mood: 'happy', outfit: '休闲衬衫' },
  { id: 3, emoji: '👩‍🎨', name: '王艺', type: 'creative', mood: 'excited', outfit: '文艺风' },
  { id: 4, emoji: '👨‍🍳', name: '陈师傅', type: 'service', mood: 'neutral', outfit: '工作服' },
  { id: 5, emoji: '👩‍🏫', name: '刘老师', type: 'education', mood: 'thoughtful', outfit: '正装' },
  { id: 6, emoji: '👨‍🎓', name: '小明', type: 'student', mood: 'curious', outfit: '学生装' },
  { id: 7, emoji: '👩‍⚕️', name: '赵医生', type: 'medical', mood: 'calm', outfit: '白大褂' },
  { id: 8, emoji: '👨‍💼', name: '周总', type: 'business', mood: 'serious', outfit: '西装' },
  { id: 9, emoji: '👩‍🦰', name: '小红', type: 'influencer', mood: 'happy', outfit: '时尚' },
  { id: 10, emoji: '👴', name: '老王', type: 'senior', mood: 'wise', outfit: '休闲' },
  { id: 11, emoji: '👩‍🔧', name: '孙姐', type: 'worker', mood: 'practical', outfit: '工装' },
  { id: 12, emoji: '👨‍🌾', name: '田大叔', type: 'rural', mood: 'friendly', outfit: '朴素' },
]

// 顾客反应消息
const CUSTOMER_REACTIONS = {
  positive: [
    { text: '这个产品不错，我很感兴趣！', icon: '😊' },
    { text: '价格合理，考虑入手', icon: '🤔' },
    { text: '朋友推荐来的，果然名不虚传', icon: '👍' },
    { text: '已下单，期待收货！', icon: '🛒' },
    { text: '服务态度很好，点赞', icon: '⭐' },
    { text: '质量超出预期，会回购', icon: '💯' },
  ],
  neutral: [
    { text: '看看再说吧', icon: '🙂' },
    { text: '有没有更多款式？', icon: '🤷' },
    { text: '和其他家比比价格', icon: '📊' },
    { text: '先收藏了', icon: '📌' },
  ],
  negative: [
    { text: '价格有点贵', icon: '😐' },
    { text: '物流太慢了', icon: '😤' },
    { text: '和描述有差距', icon: '😕' },
    { text: '下次再考虑吧', icon: '👋' },
  ]
}

// 顾客头像组件
function CustomerAvatar({ customer, size = 'md', showMood = true, animated = false }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl'
  }

  const moodColors = {
    happy: 'from-green-400 to-emerald-500',
    excited: 'from-yellow-400 to-orange-500',
    neutral: 'from-blue-400 to-indigo-500',
    thoughtful: 'from-purple-400 to-violet-500',
    curious: 'from-cyan-400 to-teal-500',
    calm: 'from-sky-400 to-blue-500',
    serious: 'from-gray-400 to-slate-500',
    wise: 'from-amber-400 to-yellow-500',
    practical: 'from-orange-400 to-red-500',
    friendly: 'from-pink-400 to-rose-500',
  }

  const moodEmoji = {
    happy: '😊', excited: '🤩', neutral: '😐', thoughtful: '🤔',
    curious: '🧐', calm: '😌', serious: '😠', wise: '🧓', practical: '💪', friendly: '🤗'
  }

  return (
    <div className={`relative ${animated ? 'customer-avatar-enter' : ''}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${moodColors[customer.mood] || moodColors.neutral} flex items-center justify-center shadow-lg`}>
        <span className="drop-shadow-md">{customer.emoji}</span>
      </div>
      {showMood && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-dark-400 rounded-full flex items-center justify-center text-xs border-2 border-dark-500">
          {moodEmoji[customer.mood]}
        </div>
      )}
    </div>
  )
}

// 顾客消息气泡
function CustomerMessage({ customer, message, reaction }) {
  return (
    <div className="flex gap-3 items-start customer-message-enter">
      <CustomerAvatar customer={customer} size="sm" showMood={false} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{customer.name}</span>
          <span className="text-xs text-gray-500">{customer.type === 'professional' ? '职场人士' : customer.type === 'student' ? '学生' : '顾客'}</span>
        </div>
        <div className="bg-dark-300 rounded-lg rounded-tl-none p-3 text-sm text-gray-300">
          <span className="mr-2">{reaction?.icon || '💬'}</span>
          {message || reaction?.text}
        </div>
      </div>
    </div>
  )
}

// 主顾客面板组件
function CustomerPanel() {
  const { customerChats, communityMetrics, activeProjects } = useGameStore()
  const [activeCustomers, setActiveCustomers] = useState([])
  const [recentReactions, setRecentReactions] = useState([])

  // 生成活跃顾客
  useEffect(() => {
    const count = Math.min(6, Math.floor(communityMetrics.totalMembers / 10) + 2)
    const shuffled = [...CUSTOMER_AVATARS].sort(() => Math.random() - 0.5)
    setActiveCustomers(shuffled.slice(0, count))
  }, [communityMetrics.totalMembers])

  // 模拟顾客反应
  useEffect(() => {
    if (customerChats.length > 0) {
      const latestChats = customerChats.slice(-3)
      const reactions = latestChats.map(chat => {
        const customer = CUSTOMER_AVATARS.find(c => c.name === chat.name) || 
          CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)]
        const reactionType = chat.message.includes('购买') || chat.message.includes('下单') ? 'positive' :
          chat.message.includes('咨询') ? 'neutral' : 'positive'
        const reaction = CUSTOMER_REACTIONS[reactionType][Math.floor(Math.random() * CUSTOMER_REACTIONS[reactionType].length)]
        return { customer, message: chat.message, reaction, id: chat.id || Date.now() + Math.random() }
      })
      setRecentReactions(reactions)
    }
  }, [customerChats])

  if (activeProjects.length === 0) {
    return (
      <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary-400" />
          顾客中心
        </h3>
        <div className="text-center text-gray-500 py-8">
          <span className="text-4xl mb-2 block">👥</span>
          启动项目后会有顾客出现
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 rounded-xl p-4 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-400" />
        顾客中心
        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
          {activeCustomers.length} 人在线
        </span>
      </h3>

      {/* 活跃顾客头像墙 */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">活跃顾客</div>
        <div className="flex flex-wrap gap-2">
          {activeCustomers.map((customer, index) => (
            <div key={customer.id} className="group relative" style={{ animationDelay: `${index * 0.1}s` }}>
              <CustomerAvatar customer={customer} size="sm" animated />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-200 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {customer.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 顾客满意度 */}
      <div className="mb-4 p-3 bg-dark-300 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">顾客满意度</span>
          <span className="text-lg font-bold text-yellow-400 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400" />
            {(communityMetrics.trust / 20).toFixed(1)}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`w-5 h-5 ${star <= communityMetrics.trust / 20 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* 顾客统计 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-dark-300 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-blue-400">{communityMetrics.totalMembers}</div>
          <div className="text-xs text-gray-500">总客户</div>
        </div>
        <div className="bg-dark-300 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-400">{communityMetrics.totalOrders}</div>
          <div className="text-xs text-gray-500">成交单</div>
        </div>
        <div className="bg-dark-300 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-purple-400">{communityMetrics.conversion}%</div>
          <div className="text-xs text-gray-500">转化率</div>
        </div>
      </div>

      {/* 最近顾客互动 */}
      <div>
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          最近互动
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {recentReactions.length > 0 ? (
            recentReactions.map((item, index) => (
              <CustomerMessage
                key={item.id || index}
                customer={item.customer}
                message={item.message}
                reaction={item.reaction}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-4 text-sm">
              完成任务后会有顾客反馈
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerPanel
