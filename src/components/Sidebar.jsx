import useGameStore, { ACHIEVEMENTS } from '../store/gameStore'
import { 
  Wallet, 
  Star, 
  Zap, 
  TrendingUp, 
  Briefcase, 
  BarChart3,
  Calendar,
  Award,
  Target,
  Settings,
  Trophy,
  BookOpen,
  Swords,
  Users
} from 'lucide-react'

function Sidebar({ onShowMarket, showMarket }) {
  const { 
    player, 
    activeProjects, 
    gameMonth, 
    gameYear, 
    marketCondition, 
    activeEvents,
    unlockedAchievements,
    activeTraining,
    completedChallenges,
    totalInvestment,
    equityGiven,
    employees,
    totalDebt,
    loans,
    pendingCrisis,
    crisisHandled
  } = useGameStore()

  const getSkillLevel = (value) => {
    if (value < 30) return '新手'
    if (value < 50) return '入门'
    if (value < 70) return '熟练'
    if (value < 90) return '专家'
    return '大师'
  }

  const skills = [
    { name: '营销', value: player.skills.marketing, color: 'bg-pink-500' },
    { name: '技术', value: player.skills.technology, color: 'bg-blue-500' },
    { name: '管理', value: player.skills.management, color: 'bg-green-500' },
    { name: '创意', value: player.skills.creativity, color: 'bg-purple-500' },
    { name: '人脉', value: player.skills.networking, color: 'bg-yellow-500' },
  ]

  return (
    <aside className="w-80 h-screen bg-dark-300/80 border-r border-gray-800 flex flex-col overflow-hidden">
      {/* 玩家信息 */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl pulse-glow">
            🧑‍💼
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{player.name}</h3>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-400">Lv.{player.level} 创业者</span>
            </div>
          </div>
        </div>

        {/* 经验条 */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>经验值</span>
            <span>{player.experience % 100}/100</span>
          </div>
          <div className="h-2 bg-dark-400 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${player.experience % 100}%` }}
            />
          </div>
        </div>

        {/* 核心数据 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-dark-400/50 rounded-lg p-2 text-center">
            <Wallet className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">资金</p>
            <p className="text-sm font-bold text-white">¥{player.cash.toLocaleString()}</p>
          </div>
          <div className="bg-dark-400/50 rounded-lg p-2 text-center">
            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">声誉</p>
            <p className="text-sm font-bold text-white">{player.reputation}</p>
          </div>
          <div className="bg-dark-400/50 rounded-lg p-2 text-center">
            <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">精力</p>
            <p className="text-sm font-bold text-white">{player.energy}</p>
          </div>
        </div>
      </div>

      {/* 游戏时间 */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-gray-400">游戏时间</span>
        </div>
        <p className="text-xl font-bold text-white">{gameYear}年{gameMonth}月</p>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${marketCondition >= 1 ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm text-gray-400">
            市场状况: {marketCondition >= 1 ? '良好' : '一般'}
          </span>
        </div>
      </div>

      {/* 技能面板 */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-gray-400">技能值</span>
        </div>
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{skill.name}</span>
                <span className="text-gray-500">{skill.value} · {getSkillLevel(skill.value)}</span>
              </div>
              <div className="h-1.5 bg-dark-400 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${skill.color} transition-all duration-500`}
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 当前项目 */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-gray-400">运营中项目</span>
          <span className="ml-auto bg-primary-600 text-xs px-2 py-0.5 rounded-full">
            {activeProjects.length}
          </span>
        </div>
        
        {activeProjects.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无项目</p>
            <p className="text-xs mt-1">在聊天室输入"查看项目"开始</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-dark-400/50 rounded-lg p-3 hover:bg-dark-400/70 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{project.icon}</span>
                  <span className="font-medium text-white text-sm">{project.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">进度</span>
                    <span className="text-primary-400">{Math.floor(project.progress)}%</span>
                  </div>
                  <div className="h-1 bg-dark-500 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-gray-500">本月收入</span>
                  <span className="text-green-400">¥{project.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 成就与进度 */}
      <div className="p-4 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-dark-400/50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <Trophy className="w-3 h-3" />
              <span>成就</span>
            </div>
            <p className="text-sm font-bold text-yellow-400">
              {unlockedAchievements.length}/{ACHIEVEMENTS.length}
            </p>
          </div>
          <div className="bg-dark-400/50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <Swords className="w-3 h-3" />
              <span>挑战</span>
            </div>
            <p className="text-sm font-bold text-purple-400">
              {completedChallenges}次
            </p>
          </div>
        </div>
        
        {/* 培训进度 */}
        {activeTraining && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-blue-400 mb-1">
              <BookOpen className="w-3 h-3" />
              <span>学习中</span>
            </div>
            <p className="text-sm text-white">{activeTraining.name}</p>
            <p className="text-xs text-gray-400">剩余 {activeTraining.remainingMonths} 个月</p>
          </div>
        )}
        
        {/* 融资情况 */}
        {totalInvestment > 0 && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
              <Users className="w-3 h-3" />
              <span>已获融资</span>
            </div>
            <p className="text-sm text-white">¥{totalInvestment.toLocaleString()}</p>
            <p className="text-xs text-gray-400">出让股权 {equityGiven}%</p>
          </div>
        )}
        
        {/* 团队信息 */}
        {employees.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-purple-400 mb-1">
              <Users className="w-3 h-3" />
              <span>我的团队</span>
            </div>
            <p className="text-sm text-white">{employees.length}/5人</p>
            <p className="text-xs text-gray-400">月薪支出 ¥{employees.reduce((s, e) => s + e.salary, 0).toLocaleString()}</p>
          </div>
        )}
        
        {/* 负债信息 */}
        {totalDebt > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-red-400 mb-1">
              <Wallet className="w-3 h-3" />
              <span>贷款负债</span>
            </div>
            <p className="text-sm text-white">¥{totalDebt.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{loans.length}笔贷款</p>
          </div>
        )}
        
        {/* 危机警告 */}
        {pendingCrisis && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2 mb-3 animate-pulse">
            <div className="flex items-center gap-2 text-xs text-orange-400 mb-1">
              <Swords className="w-3 h-3" />
              <span>紧急危机！</span>
            </div>
            <p className="text-sm text-white">{pendingCrisis.name}</p>
            <p className="text-xs text-gray-400">请在聊天室输入1/2/3做决策</p>
          </div>
        )}
      </div>

      {/* 市场事件 */}
      {activeEvents.length > 0 && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">市场动态</span>
          </div>
          {activeEvents.map((event) => (
            <div key={event.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
              <p className="text-yellow-400 font-medium">{event.name}</p>
              <p className="text-gray-400 mt-1">{event.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 底部按钮 */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onShowMarket}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
            showMarket 
              ? 'bg-primary-600 text-white' 
              : 'bg-dark-400 text-gray-300 hover:bg-dark-300'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>市场数据中心</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
