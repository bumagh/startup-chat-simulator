import { useState, useEffect } from 'react'

// 角色定义 - 全身人物形象
const CHARACTERS = {
  mentor: {
    id: 'mentor',
    name: '创业导师 Alex',
    title: '资深创业顾问',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    emoji: '👨‍💼',
    body: (
      <svg viewBox="0 0 100 180" className="w-full h-full">
        {/* 头部 */}
        <circle cx="50" cy="25" r="20" fill="#FFE0BD" />
        {/* 头发 */}
        <path d="M30 20 Q50 5 70 20 Q70 10 50 8 Q30 10 30 20" fill="#4A3728" />
        {/* 眼睛 */}
        <circle cx="42" cy="23" r="3" fill="#333" />
        <circle cx="58" cy="23" r="3" fill="#333" />
        <circle cx="43" cy="22" r="1" fill="#FFF" />
        <circle cx="59" cy="22" r="1" fill="#FFF" />
        {/* 微笑 */}
        <path d="M42 32 Q50 38 58 32" stroke="#333" strokeWidth="2" fill="none" />
        {/* 西装身体 */}
        <path d="M30 45 L25 120 L75 120 L70 45 Q50 50 30 45" fill="#2C3E50" />
        {/* 领带 */}
        <path d="M47 48 L50 75 L53 48 Z" fill="#E74C3C" />
        {/* 衬衫领 */}
        <path d="M42 45 L50 55 L58 45" stroke="#FFF" strokeWidth="2" fill="none" />
        {/* 手臂 */}
        <path d="M25 55 L15 90 L20 92 L32 60" fill="#2C3E50" />
        <path d="M75 55 L85 90 L80 92 L68 60" fill="#2C3E50" />
        {/* 手 */}
        <circle cx="15" cy="92" r="6" fill="#FFE0BD" />
        <circle cx="85" cy="92" r="6" fill="#FFE0BD" />
        {/* 腿 */}
        <rect x="35" y="120" width="12" height="50" fill="#34495E" />
        <rect x="53" y="120" width="12" height="50" fill="#34495E" />
        {/* 鞋 */}
        <ellipse cx="41" cy="172" rx="10" ry="5" fill="#1A1A1A" />
        <ellipse cx="59" cy="172" rx="10" ry="5" fill="#1A1A1A" />
      </svg>
    ),
    greetings: [
      '嗨！准备好开始今天的创业之旅了吗？',
      '有什么我可以帮你的吗？',
      '让我们一起把你的想法变成现实！',
      '记住，每一个成功的企业都是从第一步开始的。'
    ],
    reactions: {
      success: ['太棒了！继续保持！', '这就是我说的进步！', '你做得很好！'],
      fail: ['没关系，失败是成功之母。', '让我们从中学习，继续前进。', '别灰心，调整策略再试试。'],
      encourage: ['加油！你可以的！', '相信自己，你有这个能力！', '每一步都在接近成功！']
    }
  },
  luna: {
    id: 'luna',
    name: '市场专员 Luna',
    title: '数据分析师',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    emoji: '📊',
    body: (
      <svg viewBox="0 0 100 180" className="w-full h-full">
        {/* 头部 */}
        <circle cx="50" cy="25" r="20" fill="#FFE0BD" />
        {/* 长发 */}
        <path d="M25 25 Q20 60 30 80 L35 50 Q35 30 30 20 Q50 5 70 20 Q65 30 65 50 L70 80 Q80 60 75 25 Q75 10 50 5 Q25 10 25 25" fill="#8B4513" />
        {/* 刘海 */}
        <path d="M32 18 Q40 25 48 18 M52 18 Q60 25 68 18" fill="#8B4513" />
        {/* 眼睛 - 更大更萌 */}
        <ellipse cx="42" cy="24" rx="4" ry="5" fill="#333" />
        <ellipse cx="58" cy="24" rx="4" ry="5" fill="#333" />
        <circle cx="43" cy="23" r="1.5" fill="#FFF" />
        <circle cx="59" cy="23" r="1.5" fill="#FFF" />
        {/* 腮红 */}
        <circle cx="35" cy="30" r="4" fill="#FFB6C1" opacity="0.5" />
        <circle cx="65" cy="30" r="4" fill="#FFB6C1" opacity="0.5" />
        {/* 微笑 */}
        <path d="M44 33 Q50 37 56 33" stroke="#E91E63" strokeWidth="2" fill="none" />
        {/* 职业装身体 */}
        <path d="M32 45 L28 115 L72 115 L68 45 Q50 52 32 45" fill="#9C27B0" />
        {/* 领口装饰 */}
        <circle cx="50" cy="50" r="4" fill="#FFD700" />
        {/* 手臂 */}
        <path d="M28 55 L18 85 L23 87 L35 60" fill="#9C27B0" />
        <path d="M72 55 L82 85 L77 87 L65 60" fill="#9C27B0" />
        {/* 手 - 拿着平板 */}
        <rect x="75" y="80" width="15" height="20" rx="2" fill="#333" />
        <rect x="77" y="82" width="11" height="16" fill="#4FC3F7" />
        <circle cx="20" cy="88" r="5" fill="#FFE0BD" />
        {/* 裙子 */}
        <path d="M28 115 L22 165 L78 165 L72 115" fill="#7B1FA2" />
        {/* 腿 */}
        <rect x="38" y="155" width="8" height="15" fill="#FFE0BD" />
        <rect x="54" y="155" width="8" height="15" fill="#FFE0BD" />
        {/* 高跟鞋 */}
        <path d="M35 170 L48 170 L48 175 L40 178 L35 175 Z" fill="#E91E63" />
        <path d="M52 170 L65 170 L65 175 L60 178 L52 175 Z" fill="#E91E63" />
      </svg>
    ),
    greetings: [
      '你好呀！让我用数据帮你分析市场～',
      '今天的市场动态很有意思哦！',
      '数据告诉我们很多秘密，想听吗？',
      '准备好接收最新的市场情报了吗？'
    ],
    reactions: {
      success: ['数据不会说谎，你的选择是对的！', '市场反馈很积极呢！', '这个增长率太棒了！'],
      fail: ['让我们看看数据，找出问题所在。', '别担心，数据会告诉我们下一步该怎么做。'],
      encourage: ['相信数据，相信自己！', '市场机会还有很多，加油！']
    }
  },
  customer: {
    id: 'customer',
    name: '顾客小美',
    title: '潜在客户',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    emoji: '🛍️',
    body: (
      <svg viewBox="0 0 100 180" className="w-full h-full">
        {/* 头部 */}
        <circle cx="50" cy="25" r="18" fill="#FFE0BD" />
        {/* 双马尾 */}
        <circle cx="25" cy="30" r="12" fill="#1A1A1A" />
        <circle cx="75" cy="30" r="12" fill="#1A1A1A" />
        {/* 头发 */}
        <path d="M32 15 Q50 5 68 15 Q68 25 50 20 Q32 25 32 15" fill="#1A1A1A" />
        {/* 蝴蝶结 */}
        <path d="M20 20 L25 25 L20 30 M30 20 L25 25 L30 30" stroke="#FF69B4" strokeWidth="2" fill="#FF69B4" />
        <path d="M70 20 L75 25 L70 30 M80 20 L75 25 L80 30" stroke="#FF69B4" strokeWidth="2" fill="#FF69B4" />
        {/* 眼睛 */}
        <ellipse cx="43" cy="24" rx="3" ry="4" fill="#333" />
        <ellipse cx="57" cy="24" rx="3" ry="4" fill="#333" />
        <circle cx="44" cy="23" r="1" fill="#FFF" />
        <circle cx="58" cy="23" r="1" fill="#FFF" />
        {/* 开心的嘴 */}
        <path d="M45 32 Q50 36 55 32" stroke="#FF6B6B" strokeWidth="2" fill="none" />
        {/* T恤 */}
        <path d="M32 43 L30 100 L70 100 L68 43 Q50 48 32 43" fill="#4CAF50" />
        {/* 图案 */}
        <text x="42" y="75" fontSize="16">♥</text>
        {/* 手臂 */}
        <path d="M30 50 L20 80 L25 82 L35 55" fill="#4CAF50" />
        <path d="M70 50 L80 75 L75 77 L65 55" fill="#4CAF50" />
        {/* 手 - 拿购物袋 */}
        <circle cx="22" cy="83" r="5" fill="#FFE0BD" />
        <rect x="10" y="85" width="20" height="25" rx="2" fill="#FF9800" />
        <path d="M15 85 L15 80 M25 85 L25 80" stroke="#8D6E63" strokeWidth="2" />
        <circle cx="78" cy="78" r="5" fill="#FFE0BD" />
        {/* 短裙 */}
        <path d="M30 100 L25 140 L75 140 L70 100" fill="#2196F3" />
        {/* 腿 */}
        <rect x="38" y="140" width="8" height="25" fill="#FFE0BD" />
        <rect x="54" y="140" width="8" height="25" fill="#FFE0BD" />
        {/* 运动鞋 */}
        <ellipse cx="42" cy="168" rx="10" ry="6" fill="#FFF" />
        <ellipse cx="58" cy="168" rx="10" ry="6" fill="#FFF" />
        <path d="M35 168 L49 168" stroke="#E91E63" strokeWidth="1" />
        <path d="M51 168 L65 168" stroke="#E91E63" strokeWidth="1" />
      </svg>
    ),
    greetings: [
      '哇！这个看起来不错诶～',
      '你们家还有什么新品吗？',
      '朋友推荐我来的！',
      '价格怎么样呀？'
    ],
    reactions: {
      success: ['太喜欢了！我要买！', '性价比超高！', '下次还来！'],
      fail: ['嗯...让我再考虑一下', '有点贵诶...', '我再看看别家'],
      encourage: ['期待你们的新品哦！', '加油，看好你们！']
    }
  },
  investor: {
    id: 'investor',
    name: '投资人 David',
    title: '天使投资人',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    emoji: '💰',
    body: (
      <svg viewBox="0 0 100 180" className="w-full h-full">
        {/* 头部 */}
        <circle cx="50" cy="25" r="18" fill="#FFE0BD" />
        {/* 短发 - 商务风格 */}
        <path d="M32 18 Q50 8 68 18 Q68 12 50 10 Q32 12 32 18" fill="#2C2C2C" />
        {/* 眼镜 */}
        <rect x="36" y="20" width="12" height="8" rx="2" fill="none" stroke="#333" strokeWidth="1.5" />
        <rect x="52" y="20" width="12" height="8" rx="2" fill="none" stroke="#333" strokeWidth="1.5" />
        <line x1="48" y1="24" x2="52" y2="24" stroke="#333" strokeWidth="1.5" />
        {/* 眼睛 */}
        <circle cx="42" cy="24" r="2" fill="#333" />
        <circle cx="58" cy="24" r="2" fill="#333" />
        {/* 严肃的表情 */}
        <line x1="44" y1="33" x2="56" y2="33" stroke="#333" strokeWidth="2" />
        {/* 高档西装 */}
        <path d="M30 43 L25 115 L75 115 L70 43 Q50 50 30 43" fill="#1A237E" />
        {/* 金色领带 */}
        <path d="M47 46 L50 80 L53 46 Z" fill="#FFD700" />
        {/* 口袋巾 */}
        <path d="M60 55 L65 55 L62 62 Z" fill="#FFD700" />
        {/* 手臂 */}
        <path d="M25 50 L18 85 L23 87 L32 55" fill="#1A237E" />
        <path d="M75 50 L82 85 L77 87 L68 55" fill="#1A237E" />
        {/* 手 */}
        <circle cx="20" cy="88" r="5" fill="#FFE0BD" />
        <circle cx="80" cy="88" r="5" fill="#FFE0BD" />
        {/* 公文包 */}
        <rect x="75" y="85" width="18" height="14" rx="2" fill="#8D6E63" />
        <rect x="81" y="82" width="6" height="3" fill="#8D6E63" />
        {/* 裤子 */}
        <rect x="32" y="115" width="15" height="45" fill="#0D47A1" />
        <rect x="53" y="115" width="15" height="45" fill="#0D47A1" />
        {/* 皮鞋 */}
        <ellipse cx="40" cy="162" rx="12" ry="5" fill="#1A1A1A" />
        <ellipse cx="60" cy="162" rx="12" ry="5" fill="#1A1A1A" />
      </svg>
    ),
    greetings: [
      '让我看看你们的商业计划。',
      '市场数据怎么样？',
      '你们的竞争优势是什么？',
      '说说你的盈利模式。'
    ],
    reactions: {
      success: ['不错，这个数据让我印象深刻。', '我对这个项目很感兴趣。', '我们可以谈谈投资的事。'],
      fail: ['数据还需要再漂亮一些。', '还需要更多的市场验证。', '回去再打磨一下。'],
      encourage: ['继续努力，让我看到更多可能性。', '方向是对的，加油。']
    }
  }
}

// 全身角色组件
function CharacterAvatar({ characterId, size = 'medium', animated = true, mood = 'normal' }) {
  const character = CHARACTERS[characterId] || CHARACTERS.mentor
  const [isWaving, setIsWaving] = useState(false)
  
  const sizes = {
    small: 'w-16 h-28',
    medium: 'w-24 h-40',
    large: 'w-32 h-56',
    xlarge: 'w-40 h-72'
  }

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setIsWaving(true)
        setTimeout(() => setIsWaving(false), 500)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [animated])

  const moodStyles = {
    normal: '',
    happy: 'scale-105',
    sad: 'opacity-80',
    excited: 'animate-bounce'
  }

  return (
    <div className={`${sizes[size]} relative transition-transform duration-300 ${moodStyles[mood]} ${isWaving ? 'animate-pulse' : ''}`}>
      {character.body}
      {/* 名字标签 */}
      <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${character.color} text-white`}>
        {character.name.split(' ')[0]}
      </div>
    </div>
  )
}

// 角色对话气泡
function CharacterDialogue({ characterId, message, onClose, showCharacter = true }) {
  const character = CHARACTERS[characterId] || CHARACTERS.mentor
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`flex items-end gap-4 mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {showCharacter && (
        <div className="flex-shrink-0">
          <CharacterAvatar characterId={characterId} size="medium" />
        </div>
      )}
      <div className={`flex-1 max-w-md ${character.bgColor} ${character.borderColor} border rounded-2xl rounded-bl-md p-4 shadow-lg relative`}>
        {/* 对话三角 */}
        <div className={`absolute -left-2 bottom-4 w-4 h-4 ${character.bgColor} ${character.borderColor} border-l border-b transform rotate-45`} />
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{character.emoji}</span>
          <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${character.color}`}>
            {character.name}
          </span>
          <span className="text-xs text-gray-500">{character.title}</span>
        </div>
        <p className="text-gray-200 leading-relaxed">{message}</p>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

// 角色选择器
function CharacterSelector({ onSelect, currentCharacter }) {
  return (
    <div className="flex gap-3 p-3 bg-dark-300 rounded-xl">
      {Object.values(CHARACTERS).map(char => (
        <button
          key={char.id}
          onClick={() => onSelect(char.id)}
          className={`flex flex-col items-center p-2 rounded-lg transition-all ${
            currentCharacter === char.id 
              ? `bg-gradient-to-r ${char.color} text-white shadow-lg scale-105` 
              : 'bg-dark-400 hover:bg-dark-200 text-gray-400'
          }`}
        >
          <span className="text-2xl mb-1">{char.emoji}</span>
          <span className="text-xs">{char.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  )
}

// 互动角色面板
function InteractiveCharacterPanel({ characterId, onInteract }) {
  const character = CHARACTERS[characterId] || CHARACTERS.mentor
  const [currentGreeting, setCurrentGreeting] = useState(0)

  const handleClick = () => {
    setCurrentGreeting((prev) => (prev + 1) % character.greetings.length)
    if (onInteract) {
      onInteract(character.greetings[currentGreeting])
    }
  }

  return (
    <div 
      className={`relative p-4 rounded-xl ${character.bgColor} ${character.borderColor} border cursor-pointer hover:scale-102 transition-all group`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 group-hover:animate-bounce">
          <CharacterAvatar characterId={characterId} size="large" />
        </div>
        <div className="flex-1 pt-4">
          <h3 className={`font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r ${character.color}`}>
            {character.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{character.title}</p>
          <div className="bg-dark-300/80 rounded-lg p-3 relative">
            <p className="text-gray-200 text-sm">{character.greetings[currentGreeting]}</p>
            <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-dark-300/80" />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">点击与我对话 💬</p>
        </div>
      </div>
    </div>
  )
}

export default CharacterAvatar
export { CHARACTERS, CharacterDialogue, CharacterSelector, InteractiveCharacterPanel }
