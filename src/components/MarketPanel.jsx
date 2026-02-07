import { useState, useEffect } from 'react'
import useGameStore, { MARKET_DATA } from '../store/gameStore'
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  BarChart2, 
  PieChart,
  Activity,
  RefreshCw,
  ExternalLink
} from 'lucide-react'

function MarketPanel({ onClose }) {
  const { marketCondition, gameYear, gameMonth } = useGameStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [liveData, setLiveData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  // 模拟获取实时市场数据
  const fetchLiveData = async () => {
    setLoading(true)
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟实时数据（可接入真实API）
    setLiveData({
      stockIndex: {
        name: '创业板指数',
        value: (2800 + Math.random() * 200).toFixed(2),
        change: (Math.random() * 4 - 2).toFixed(2)
      },
      exchangeRate: {
        usdCny: (7.1 + Math.random() * 0.2).toFixed(4)
      },
      trends: [
        { keyword: 'AI创业', heat: Math.floor(80 + Math.random() * 20) },
        { keyword: '跨境电商', heat: Math.floor(70 + Math.random() * 25) },
        { keyword: '知识付费', heat: Math.floor(60 + Math.random() * 30) },
        { keyword: '私域流量', heat: Math.floor(50 + Math.random() * 35) },
        { keyword: '新消费', heat: Math.floor(40 + Math.random() * 40) },
      ],
      news: [
        { title: '国务院发布支持小微企业新政策', sentiment: 'positive' },
        { title: '电商平台佣金新规即将实施', sentiment: 'neutral' },
        { title: 'AI大模型开放API价格下调', sentiment: 'positive' },
        { title: '直播带货监管趋严', sentiment: 'negative' },
      ],
      timestamp: new Date()
    })
    setLoading(false)
    setShowFooter(true)
    setTimeout(() => setShowFooter(false), 4000)
  }

  useEffect(() => {
    fetchLiveData()
  }, [])

  const tabs = [
    { id: 'overview', label: '市场概览', icon: <Globe className="w-4 h-4" /> },
    { id: 'industries', label: '行业分析', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'trends', label: '热点趋势', icon: <Activity className="w-4 h-4" /> },
  ]

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <div className="w-96 h-screen bg-dark-300/95 border-l border-gray-800 flex flex-col overflow-hidden shadow-2xl animate-slide-in-right">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary-400" />
          <h2 className="font-bold text-white">市场数据中心</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveData}
            disabled={loading}
            className="p-2 hover:bg-dark-400 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-400 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-400/30'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* 实时指数 */}
            {liveData && (
              <div className="bg-dark-400/50 rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-3">📈 实时指数</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-white">
                    {liveData.stockIndex.value}
                  </span>
                  <span className={`text-sm flex items-center gap-1 ${
                    parseFloat(liveData.stockIndex.change) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(liveData.stockIndex.change) >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {liveData.stockIndex.change}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{liveData.stockIndex.name}</p>
              </div>
            )}

            {/* 市场状况 */}
            <div className="bg-dark-400/50 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-3">🎯 当前市场状况</h3>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  marketCondition >= 1.1 ? 'bg-green-500' : 
                  marketCondition >= 0.9 ? 'bg-yellow-500' : 'bg-red-500'
                } animate-pulse`} />
                <span className="text-white font-medium">
                  {marketCondition >= 1.1 ? '繁荣期' : 
                   marketCondition >= 0.9 ? '平稳期' : '低迷期'}
                </span>
                <span className="text-gray-500 text-sm">
                  系数 {marketCondition.toFixed(2)}x
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {gameYear}年{gameMonth}月 · 市场状况影响所有项目收益
              </p>
            </div>

            {/* 宏观数据 */}
            <div className="bg-dark-400/50 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-3">📊 宏观经济指标</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">消费者信心指数</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-dark-500 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500"
                        style={{ width: `${MARKET_DATA.consumerConfidence}%` }}
                      />
                    </div>
                    <span className="text-white text-sm">{MARKET_DATA.consumerConfidence}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">创业成功率</span>
                  <span className="text-white text-sm">{MARKET_DATA.startupSuccessRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">平均盈利周期</span>
                  <span className="text-white text-sm">{MARKET_DATA.averageTimeToProfit}个月</span>
                </div>
              </div>
            </div>

            {/* 最新资讯 */}
            {liveData && (
              <div className="bg-dark-400/50 rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-3">📰 市场资讯</h3>
                <div className="space-y-2">
                  {liveData.news.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-2 hover:bg-dark-500/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        item.sentiment === 'positive' ? 'bg-green-500' :
                        item.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm text-gray-300">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'industries' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">各行业市场规模与增长趋势</p>
            {MARKET_DATA.industries.map((industry, index) => (
              <div 
                key={index}
                className="bg-dark-400/50 rounded-xl p-4 hover:bg-dark-400/70 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{industry.name}</h4>
                  <span className={`flex items-center gap-1 text-sm ${
                    industry.trend === 'up' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {industry.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <span>➡️</span>
                    )}
                    {industry.growth}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">市场规模</span>
                  <span className="text-gray-300">{industry.size}</span>
                </div>
                <div className="mt-2 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      industry.growth > 25 ? 'bg-green-500' :
                      industry.growth > 15 ? 'bg-primary-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${Math.min(100, industry.growth * 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && liveData && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">当前创业热门关键词</p>
            
            {/* 热度排行 */}
            <div className="space-y-3">
              {liveData.trends.sort((a, b) => b.heat - a.heat).map((trend, index) => (
                <div 
                  key={index}
                  className="bg-dark-400/50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' : 'bg-dark-500 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-white">{trend.keyword}</span>
                    <span className="ml-auto text-sm text-primary-400">
                      🔥 {trend.heat}
                    </span>
                  </div>
                  <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                      style={{ width: `${trend.heat}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 趋势建议 */}
            <div className="bg-primary-900/30 border border-primary-500/30 rounded-xl p-4">
              <h4 className="text-primary-400 font-medium mb-2">💡 趋势洞察</h4>
              <p className="text-sm text-gray-300">
                当前 <strong>AI创业</strong> 和 <strong>跨境电商</strong> 是最热门的创业方向。
                建议关注这些领域的零成本创业机会，如AI工具代理、跨境代购等。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 底部信息 - 闪现后消失 */}
      {showFooter && (
        <div className={`p-4 border-t border-gray-800 transition-opacity duration-1000 ${
          showFooter ? 'animate-pulse opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>数据更新时间: {liveData ? liveData.timestamp.toLocaleTimeString() : '--'}</span>
            <a href="#" className="flex items-center gap-1 text-primary-400 hover:text-primary-300">
              <ExternalLink className="w-3 h-3" />
              完整报告
            </a>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default MarketPanel
