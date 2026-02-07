import { useState, useRef, useEffect } from 'react'
import useGameStore from '../store/gameStore'
import { Send, Sparkles, Zap, TrendingUp, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import CharacterAvatar, { CHARACTERS, CharacterDialogue } from './CharacterAvatar'

// 根据AI类型获取角色ID
const getCharacterId = (aiType, senderName) => {
  if (aiType === 'marketSpecialist' || senderName?.includes('Luna')) return 'luna'
  if (senderName?.includes('投资') || senderName?.includes('David')) return 'investor'
  if (senderName?.includes('顾客') || senderName?.includes('客户')) return 'customer'
  return 'mentor'
}

function ChatRoom() {
  const [input, setInput] = useState('')
  const [showCombo, setShowCombo] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const [lastCommandTime, setLastCommandTime] = useState(null)
  const [showCharacterPanel, setShowCharacterPanel] = useState(false)
  const [activeCharacter, setActiveCharacter] = useState(null)
  const messagesEndRef = useRef(null)
  const { messages, sendMessage, isTyping, currentAI, marketSpecialistActive } = useGameStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (input.trim()) {
      // 连击检测
      const now = Date.now()
      if (lastCommandTime && now - lastCommandTime < 3000) {
        setComboCount(prev => prev + 1)
        setShowCombo(true)
        setTimeout(() => setShowCombo(false), 1000)
      } else {
        setComboCount(1)
      }
      setLastCommandTime(now)
      
      sendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickCommands = [
    { label: '📋 项目', command: '查看项目' },
    { label: '🎯 任务', command: '任务' },
    { label: '📊 Luna', command: '市场专员', highlight: !marketSpecialistActive },
    { label: '1️⃣', command: '1' },
    { label: '2️⃣', command: '2' },
    { label: '3️⃣', command: '3' },
    { label: '4️⃣', command: '4' },
    { label: '5️⃣', command: '5' },
    { label: '6️⃣', command: '6' },
    { label: '⏭️ 下月', command: '下个月' },
    { label: '❓ 帮助', command: '帮助' },
  ]

  const renderMessage = (msg) => {
    if (msg.type === 'system') {
      return (
        <div key={msg.id} className="flex justify-center my-4 chat-bubble">
          <div className="px-4 py-2 bg-dark-300/80 rounded-full text-sm text-gray-400">
            {msg.content}
          </div>
        </div>
      )
    }

    if (msg.type === 'user') {
      return (
        <div key={msg.id} className="flex justify-end mb-4 msg-user">
          <div className="max-w-[70%]">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl rounded-br-md px-4 py-3 text-white shadow-lg shadow-primary-500/20">
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {format(new Date(msg.timestamp), 'HH:mm')}
            </p>
          </div>
        </div>
      )
    }

    if (msg.type === 'ai') {
      // 检测是否包含成功/失败关键词来添加特效
      const hasSuccess = msg.content.includes('成功') || msg.content.includes('✅')
      const hasFail = msg.content.includes('失败') || msg.content.includes('⚠️')
      const hasReward = msg.content.includes('收获') || msg.content.includes('奖励') || msg.content.includes('+')
      
      // 获取角色ID
      const characterId = getCharacterId(currentAI, msg.sender?.name)
      const character = CHARACTERS[characterId]
      
      // 判断是否是重要消息（显示全身角色）
      const isImportantMessage = msg.content.includes('**') || 
                                  msg.content.length > 200 || 
                                  hasSuccess || 
                                  hasReward ||
                                  msg.content.includes('任务') ||
                                  msg.content.includes('项目') ||
                                  msg.content.includes('Luna')
      
      return (
        <div key={msg.id} className={`mb-6 msg-ai ${hasSuccess ? 'success-flash' : ''} ${hasFail ? 'shake' : ''}`}>
          {/* 全身角色显示（重要消息时显示） */}
          {isImportantMessage ? (
            <div className="flex items-end gap-4">
              {/* 全身人物 */}
              <div className="flex-shrink-0 relative">
                <div className={`w-20 h-36 transition-transform hover:scale-105 ${hasSuccess ? 'animate-bounce' : ''}`}>
                  <CharacterAvatar characterId={characterId} size="medium" mood={hasSuccess ? 'happy' : hasFail ? 'sad' : 'normal'} />
                </div>
              </div>
              
              {/* 对话气泡 */}
              <div className="flex-1 max-w-[65%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${character?.color || 'from-primary-400 to-primary-600'}`}>
                    {msg.sender?.name || character?.name || 'AI助手'}
                  </span>
                  {character?.title && (
                    <span className="text-xs text-gray-500">{character.title}</span>
                  )}
                </div>
                <div className={`relative ${character?.bgColor || 'bg-dark-200'} ${character?.borderColor || 'border-gray-700'} border rounded-2xl rounded-bl-md px-4 py-3 shadow-lg ${hasReward ? 'reward-pop' : ''}`}>
                  {/* 对话指向三角 */}
                  <div className={`absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent ${
                    characterId === 'luna' ? 'border-r-purple-500/10' :
                    characterId === 'investor' ? 'border-r-yellow-500/10' :
                    characterId === 'customer' ? 'border-r-green-500/10' :
                    'border-r-blue-500/10'
                  }`} />
                  <div className="text-gray-200 whitespace-pre-wrap leading-relaxed msg-content">
                    {formatMessageContent(msg.content)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </p>
              </div>
            </div>
          ) : (
            /* 普通消息（小头像） */
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${character?.color || 'from-primary-400 to-primary-600'} flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}>
                {msg.sender?.avatar || character?.emoji || '🤖'}
              </div>
              <div className="max-w-[70%]">
                <p className={`text-sm mb-1 font-medium text-transparent bg-clip-text bg-gradient-to-r ${character?.color || 'from-primary-400 to-primary-600'}`}>
                  {msg.sender?.name || character?.name || 'AI助手'}
                </p>
                <div className={`bg-dark-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-lg ${hasReward ? 'reward-pop' : ''}`}>
                  <div className="text-gray-200 whitespace-pre-wrap leading-relaxed msg-content">
                    {formatMessageContent(msg.content)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </p>
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  const formatMessageContent = (content) => {
    // 简单的markdown样式处理
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-primary-300 font-semibold">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-dark-400/30">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-800 glass-effect">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-lg font-semibold text-white">创业聊天室</h2>
          <span className="text-sm text-gray-500">· AI导师在线</span>
        </div>
      </div>

      {/* 快捷命令 */}
      <div className="p-3 border-b border-gray-800/50 flex gap-2 overflow-x-auto relative">
        {quickCommands.map((cmd, index) => {
          const isNumber = /^[1-9]$/.test(cmd.command)
          const isHighlight = cmd.highlight
          return (
            <button
              key={index}
              onClick={() => sendMessage(cmd.command)}
              className={`quick-btn px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                isNumber 
                  ? 'choice-number bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow-md shadow-primary-500/30' 
                  : isHighlight
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium shadow-md shadow-purple-500/30 heartbeat'
                    : 'bg-dark-300 hover:bg-dark-200 text-gray-300'
              }`}
            >
              {cmd.label}
            </button>
          )
        })}
        
        {/* 连击显示 */}
        {showCombo && comboCount > 1 && (
          <div className="absolute -top-8 right-4 combo-effect">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              🔥 {comboCount}x 连击!
            </span>
          </div>
        )}
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(renderMessage)}
        
        {/* 打字指示器 */}
        {isTyping && (
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-dark-200 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="typing-indicator flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-800 glass-effect">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息或命令..."
              rows={1}
              className="w-full px-4 py-3 bg-dark-300 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white hover:from-primary-400 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          按 Enter 发送 · 输入"帮助"查看命令列表
        </p>
      </div>
    </div>
  )
}

export default ChatRoom
