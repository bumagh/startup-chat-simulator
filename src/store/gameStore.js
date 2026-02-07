import { create } from 'zustand'

// 成就系统
const ACHIEVEMENTS = [
  { id: 'first_project', name: '初出茅庐', description: '启动你的第一个创业项目', icon: '🌱', reward: 500, condition: (state) => state.completedProjects.length + state.activeProjects.length >= 1 },
  { id: 'first_profit', name: '开门红', description: '首次实现项目盈利', icon: '💰', reward: 1000, condition: (state) => state.activeProjects.some(p => p.revenue > 0) },
  { id: 'multi_project', name: '多线作战', description: '同时运营3个项目', icon: '🎯', reward: 2000, condition: (state) => state.activeProjects.length >= 3 },
  { id: 'rich', name: '小有积蓄', description: '资金突破50000元', icon: '💎', reward: 3000, condition: (state) => state.player.cash >= 50000 },
  { id: 'super_rich', name: '财务自由', description: '资金突破500000元', icon: '👑', reward: 10000, condition: (state) => state.player.cash >= 500000 },
  { id: 'reputation', name: '声名鹊起', description: '声誉达到80', icon: '⭐', reward: 2000, condition: (state) => state.player.reputation >= 80 },
  { id: 'skilled', name: '技能大师', description: '任一技能达到80', icon: '🏆', reward: 3000, condition: (state) => Object.values(state.player.skills).some(s => s >= 80) },
  { id: 'survivor', name: '创业老兵', description: '游戏时间达到12个月', icon: '🎖️', reward: 5000, condition: (state) => (state.gameYear - 2026) * 12 + state.gameMonth >= 12 },
  { id: 'investor_ready', name: '投资就绪', description: '完成首次融资', icon: '🤝', reward: 5000, condition: (state) => state.totalInvestment > 0 },
  { id: 'challenge_master', name: '挑战达人', description: '完成10次挑战', icon: '🏅', reward: 3000, condition: (state) => state.completedChallenges >= 10 },
  { id: 'team_builder', name: '团队组建', description: '雇佣第一名员工', icon: '👥', reward: 1000, condition: (state) => state.employees.length >= 1 },
  { id: 'full_team', name: '精英团队', description: '雇佣满5名员工', icon: '🏢', reward: 5000, condition: (state) => state.employees.length >= 5 },
  { id: 'crisis_handler', name: '临危不乱', description: '成功处理5次危机', icon: '🛡️', reward: 3000, condition: (state) => state.crisisHandled >= 5 },
  { id: 'debt_free', name: '无债一身轻', description: '曾经贷款并全部还清', icon: '🆓', reward: 2000, condition: (state) => state.loans.length === 0 && state.totalLoansTaken > 0 },
  { id: 'score_s', name: '传奇创业者', description: '创业评分达到S级', icon: '🌟', reward: 10000, condition: (state) => (state.gameScore || 0) >= 90 },
]

// 每日任务
const DAILY_TASKS = [
  { id: 'check_market', name: '查看市场报告', description: '了解最新市场动态', reward: { cash: 100, exp: 10 }, command: '市场报告' },
  { id: 'train_skill', name: '技能培训', description: '提升一项技能', reward: { cash: 0, exp: 20 }, command: '培训' },
  { id: 'network', name: '拓展人脉', description: '参加社交活动', reward: { cash: 0, exp: 15, networking: 2 }, command: '社交' },
  { id: 'review_project', name: '项目复盘', description: '分析项目数据', reward: { cash: 200, exp: 15 }, command: '复盘' },
]

// 随机挑战
const CHALLENGES = [
  { id: 'viral_content', name: '爆款挑战', description: '创作一条爆款内容，有机会获得大量曝光', difficulty: 'easy', successRate: 0.6, reward: { cash: 2000, reputation: 5 }, penalty: { energy: -10 } },
  { id: 'pitch_investor', name: '路演挑战', description: '向投资人进行项目路演', difficulty: 'hard', successRate: 0.3, reward: { cash: 50000, reputation: 10 }, penalty: { reputation: -5 } },
  { id: 'speed_delivery', name: '极速交付', description: '在紧迫时间内完成客户订单', difficulty: 'medium', successRate: 0.5, reward: { cash: 3000, reputation: 3 }, penalty: { reputation: -3 } },
  { id: 'negotiate_deal', name: '商务谈判', description: '与大客户进行价格谈判', difficulty: 'medium', successRate: 0.45, reward: { cash: 5000, reputation: 5 }, penalty: { cash: -500 } },
  { id: 'crisis_management', name: '危机公关', description: '处理突发的负面舆情', difficulty: 'hard', successRate: 0.35, reward: { reputation: 15 }, penalty: { reputation: -10 } },
  { id: 'partnership', name: '战略合作', description: '与其他创业者建立合作关系', difficulty: 'medium', successRate: 0.5, reward: { cash: 3000, networking: 5 }, penalty: { energy: -15 } },
  { id: 'product_launch', name: '产品发布会', description: '举办线上产品发布活动', difficulty: 'hard', successRate: 0.4, reward: { cash: 10000, reputation: 8 }, penalty: { cash: -2000 } },
  { id: 'customer_feedback', name: '用户调研', description: '收集并分析用户反馈', difficulty: 'easy', successRate: 0.7, reward: { exp: 50, creativity: 3 }, penalty: { energy: -5 } },
  { id: 'group_buying_event', name: '团购爆单', description: '策划一场大型团购活动', difficulty: 'medium', successRate: 0.55, reward: { cash: 8000, reputation: 6, networking: 3 }, penalty: { energy: -20, reputation: -3 } },
  { id: 'community_growth', name: '社群裂变', description: '发起社群裂变活动，快速扩大用户群', difficulty: 'medium', successRate: 0.5, reward: { cash: 5000, networking: 8 }, penalty: { cash: -1000 } },
]

// 竞争对手
const COMPETITORS = [
  { id: 'comp1', name: '快创科技', avatar: '🏢', strength: 30, description: '一家快速成长的初创公司', specialty: 'saas' },
  { id: 'comp2', name: '内容王国', avatar: '📺', strength: 45, description: '知名自媒体MCN机构', specialty: 'content' },
  { id: 'comp3', name: '电商新势力', avatar: '🛍️', strength: 55, description: '新兴电商平台', specialty: 'dropshipping' },
  { id: 'comp4', name: '知识付费Pro', avatar: '📚', strength: 40, description: '在线教育领军企业', specialty: 'online_course' },
  { id: 'comp5', name: '自由联盟', avatar: '🤝', strength: 35, description: '自由职业者联盟', specialty: 'freelance' },
  { id: 'comp6', name: '拼团达人', avatar: '🛍️', strength: 50, description: '社交团购头部玩家，擅长社群裂变', specialty: 'group_buying' },
]

// 投资人
const INVESTORS = [
  { id: 'angel1', name: '天使投资人 李明', avatar: '👼', minReputation: 30, maxInvestment: 100000, equity: 10, description: '早期项目天使投资人' },
  { id: 'angel2', name: '创投合伙人 王芳', avatar: '💼', minReputation: 50, maxInvestment: 500000, equity: 15, description: '专注互联网赛道' },
  { id: 'vc1', name: '红杉资本 张总', avatar: '🦈', minReputation: 70, maxInvestment: 2000000, equity: 20, description: '顶级VC机构' },
  { id: 'strategic', name: '战略投资方', avatar: '🏛️', minReputation: 60, maxInvestment: 1000000, equity: 12, description: '行业巨头战略投资' },
]

// 序列号验证系统
const VALID_SERIALS = [
  'CZRZ-2026-PREMIUM-A1B2',
  'CZRZ-2026-PREMIUM-C3D4',
  'CZRZ-2026-PREMIUM-E5F6',
  'CZRZ-TEST-88888888',
  'VIP-FINANCE-2026-GOLD',
]

function validateSerial(serial) {
  return VALID_SERIALS.includes(serial.trim().toUpperCase())
}

// 高级融资方法（付费内容）
const PREMIUM_FINANCING_METHODS = [
  {
    id: 'presale_landing',
    name: '一页式销售网页预售',
    icon: '🌐',
    summary: '在产品开发前，用一个精美的单页销售网页展示产品价值，提前收取预售款验证需求并获得启动资金。',
    difficulty: 'easy',
    potential: '¥5,000 - ¥500,000',
    cases: [
      {
        name: 'Buffer（社交媒体工具）',
        description: 'Buffer创始人Joel Gascoigne在2010年仅用一个Landing Page测试需求。页面上只展示了产品概念和定价方案，用户点击付费按钮后会看到"产品还在开发中，留下邮箱"的提示。3天内收到超过100个注册，验证了市场需求后才开始开发。',
        result: '后来发展为估值超6000万美元的SaaS公司'
      },
      {
        name: 'Dropbox（云存储）',
        description: 'Drew Houston制作了一个3分钟的产品演示视频Landing Page。没有真正的产品，只有一个演示视频和注册等待列表。一夜之间从5000人增长到75000人的等待列表。',
        result: '市值曾超过120亿美元'
      },
      {
        name: '国内案例：某知识付费课程',
        description: '一位理财博主在公众号发布了一个课程预售页面，仅展示课程大纲和早鸟价格（原价299元，预售价99元），承诺一个月内交付。通过朋友圈+社群推广，3天预售了500份。',
        result: '预售收入49500元，用这笔钱制作了高质量课程'
      }
    ],
    steps: [
      '① 明确你的产品/服务核心价值主张',
      '② 用Carrd/Notion/腾讯文档制作一页式销售页（零成本）',
      '③ 包含：痛点描述→解决方案→定价→付款按钮→信任背书',
      '④ 设置早鸟价或限时优惠制造紧迫感',
      '⑤ 通过社交媒体、社群推广销售页',
      '⑥ 收集预付款后开始产品开发',
      '⑦ 若预售不达预期，全额退款（验证失败也是宝贵经验）'
    ],
    tips: [
      '关键：页面一定要有清晰的CTA（行动号召按钮）',
      '定价技巧：设置3个价格档次（基础/标准/VIP），大多数人会选中间档',
      '信任建设：加入你的个人故事、过往成绩、用户评价（哪怕是朋友的）',
      '退款承诺：无条件退款承诺能大幅提升转化率',
      '工具推荐：Carrd.co（国外）、金数据/腾讯问卷（国内）、微信收款码'
    ]
  },
  {
    id: 'crowdfunding',
    name: '众筹融资',
    icon: '🎯',
    summary: '通过众筹平台向公众展示你的创业项目或产品概念，支持者提前付款获取产品或回报，帮助你筹集启动资金。',
    difficulty: 'medium',
    potential: '¥10,000 - ¥5,000,000',
    cases: [
      {
        name: 'Pebble智能手表',
        description: '2012年在Kickstarter上众筹，目标10万美元。创始人Eric Migicovsky只有一个原型和一段视频。结果打破Kickstarter记录，28天内筹集超过1000万美元，68929名支持者。',
        result: '成功量产并发货，成为智能手表先驱'
      },
      {
        name: '三个爸爸空气净化器',
        description: '2014年在京东众筹上线，主打"为孩子设计的空气净化器"概念，目标100万元。团队拍摄了感人的产品理念视频，30天内众筹金额突破1122万元，成为当时京东众筹最高纪录。',
        result: '成功获得1000万元天使投资，产品成功上市'
      },
      {
        name: '摩点众筹桌游案例',
        description: '独立设计师在摩点网发起桌游众筹，只有设计稿和试玩视频，目标3万元。通过B站UP主推荐和桌游社群传播，最终筹集18万元，500+支持者。',
        result: '成功量产，后续在淘宝持续销售'
      }
    ],
    steps: [
      '① 选择平台：京东众筹、摩点、Kickstarter（海外）',
      '② 制作高质量项目页面：视频+图文+团队介绍+回报设计',
      '③ 设计多档回报方案（早鸟价/标准价/尊享价/团队套装）',
      '④ 上线前积累种子用户（至少100-500人的邮件列表或社群）',
      '⑤ 上线首日全力冲刺（前24小时决定成败）',
      '⑥ 持续更新项目进展，保持支持者信心',
      '⑦ 按时交付产品/回报'
    ],
    tips: [
      '黄金法则：上线前就要完成30%的筹款目标（找朋友/种子用户先支持）',
      '视频是核心：好的众筹视频能提升300%的转化率',
      '回报设计：一定要有低门槛回报（如9.9元/19.9元的支持档）',
      '社群运营：众筹期间每天更新进展，回复每条留言',
      '国内平台推荐：京东众筹（电子产品）、摩点（文创/桌游）、开始吧（生活方式）'
    ]
  },
  {
    id: 'mvp_delivery',
    name: '最小可行性产品(MVP)交付',
    icon: '🚀',
    summary: '用最少的资源和时间打造一个核心功能可用的最小版本产品，快速推向市场获取真实用户反馈和收入，用收入反哺产品迭代。',
    difficulty: 'medium',
    potential: '¥2,000 - ¥1,000,000',
    cases: [
      {
        name: 'Zappos（最大网上鞋店）',
        description: 'Nick Swinmurn的MVP极其简单：去本地鞋店拍鞋子照片，放到网站上。有人下单后，他再去鞋店买来寄给客户。没有库存，没有仓库，只有一个简单网站。用这种方式验证了"人们愿意在网上买鞋"这个假设。',
        result: '2009年被亚马逊以12亿美元收购'
      },
      {
        name: 'Airbnb（全球民宿平台）',
        description: '2007年，两位创始人因付不起房租，在设计大会期间在自家客厅放了3张充气床垫出租。网站只是一个简单的博客页面，写着"来旧金山参加设计大会？我们有3张床位，含早餐。"',
        result: '发展为估值超1000亿美元的全球平台'
      },
      {
        name: '国内案例：完美日记早期',
        description: '完美日记2017年创立初期，没有自建工厂，而是找代工厂生产少量试销款（最低起订量），先在小红书用素人测评方式推广。第一批只生产了几百支口红，通过微信社群+小红书种草测试市场反应。',
        result: '后来成为国货美妆龙头，2020年纽交所上市'
      }
    ],
    steps: [
      '① 找到你产品的ONE THING（核心价值功能是什么？）',
      '② 砍掉所有非核心功能，只保留能解决核心痛点的部分',
      '③ 用最低成本实现MVP（能手动的先手动，能用现成工具的用工具）',
      '④ 快速推给10-50个种子用户使用',
      '⑤ 收集反馈：什么好用？什么不好用？愿意付费吗？',
      '⑥ 基于反馈快速迭代（一周一个版本）',
      '⑦ 用户愿意付费 = 产品验证成功，开始规模化'
    ],
    tips: [
      'MVP不是低质量产品！核心功能必须好用，只是功能少',
      '"假装法"：像Zappos一样，前端像完整产品，后端用人工处理',
      '速度 > 完美：MVP开发周期不应超过2-4周',
      '数据驱动：关注留存率和付费率，而非用户数',
      '工具推荐：Notion做知识产品、微信小程序做轻量工具、有赞做电商MVP'
    ]
  },
  {
    id: 'customer_financing',
    name: '向客户融资',
    icon: '🤝',
    summary: '让你的大客户或核心用户成为投资者。通过预付年费、战略合作、独家授权等方式，让客户提前支付大额费用为你提供运营资金。',
    difficulty: 'hard',
    potential: '¥20,000 - ¥2,000,000',
    cases: [
      {
        name: 'Dell电脑（直销模式）',
        description: 'Michael Dell在大学宿舍创业时，发明了"按订单生产"模式。客户先付全款下单，Dell再采购零件组装。这意味着Dell永远不需要库存资金，客户的预付款就是他的运营资金。这就是经典的"负营运资本"模式。',
        result: '发展为全球最大PC制造商之一，年营收超900亿美元'
      },
      {
        name: 'Costco（好市多会员制）',
        description: 'Costco通过收取会员费获取前期资金。全球1.2亿会员每年缴纳60-120美元会员费，这笔钱就是Costco的"客户融资"。会员费收入约40亿美元/年，几乎等于其全部利润。',
        result: '全球第三大零售商，市值超2000亿美元'
      },
      {
        name: '国内案例：某SAAS创业公司',
        description: '一家做餐饮SaaS的创业公司，找到10家连锁餐饮品牌，提出"3年独家授权使用，一次性付清年费享5折优惠"。10家各付了6万元（原价每年4万），一次性收到60万元。用这笔钱完成了产品开发和团队搭建。',
        result: '第二年客户续费率95%，获得A轮融资500万'
      }
    ],
    steps: [
      '① 识别你的"超级用户"或最有价值客户',
      '② 设计对客户有吸引力的预付方案（折扣/独家权益/优先服务）',
      '③ 一对一沟通，展示你的产品路线图和愿景',
      '④ 签订正式合作协议，明确双方权益和交付时间表',
      '⑤ 按时交付承诺的产品/服务，建立深度信任',
      '⑥ 将成功案例包装，吸引更多客户以同样方式合作',
      '⑦ 用客户收入证明商业模式可行，再去找专业投资人'
    ],
    tips: [
      '客户融资的核心是"价值交换"——客户提前付费换取更好的服务/价格',
      '年费预付折扣：按年付打8折 > 按月付，很多客户会选年付',
      '大客户战略合作：让大客户成为"联合开发伙伴"，他们出钱你出技术',
      '会员制：参考Costco模式，收取年费提供专属服务',
      '最重要的一点：一定要能交付价值！客户融资建立在信任基础上'
    ]
  }
]

// 培训课程
const TRAINING_COURSES = [
  { id: 'marketing_basic', name: '营销基础课', skill: 'marketing', increase: 5, cost: 500, duration: 1, description: '学习基础营销知识' },
  { id: 'marketing_advanced', name: '高级营销策略', skill: 'marketing', increase: 10, cost: 2000, duration: 2, description: '深入学习营销策略' },
  { id: 'tech_basic', name: '技术入门', skill: 'technology', increase: 5, cost: 500, duration: 1, description: '学习基础技术知识' },
  { id: 'tech_advanced', name: '全栈开发', skill: 'technology', increase: 10, cost: 3000, duration: 2, description: '成为全栈开发者' },
  { id: 'management_basic', name: '管理基础', skill: 'management', increase: 5, cost: 500, duration: 1, description: '学习团队管理' },
  { id: 'management_advanced', name: 'MBA精华课', skill: 'management', increase: 10, cost: 5000, duration: 3, description: 'MBA核心课程' },
  { id: 'creativity_basic', name: '创意思维', skill: 'creativity', increase: 5, cost: 300, duration: 1, description: '激发创意思维' },
  { id: 'creativity_advanced', name: '设计思维', skill: 'creativity', increase: 10, cost: 2000, duration: 2, description: '系统学习设计思维' },
  { id: 'networking_basic', name: '社交技巧', skill: 'networking', increase: 5, cost: 300, duration: 1, description: '提升社交能力' },
  { id: 'networking_advanced', name: '人脉经营', skill: 'networking', increase: 10, cost: 1500, duration: 2, description: '高效经营人脉' },
]

// 随机事件（更丰富）
const RANDOM_EVENTS = [
  { id: 'lucky_client', name: '贵人相助', description: '一位大客户主动找上门！', effect: { cash: 5000, reputation: 3 }, chance: 0.1 },
  { id: 'viral_moment', name: '意外走红', description: '你的内容意外获得大量传播！', effect: { reputation: 10, cash: 2000 }, chance: 0.08 },
  { id: 'equipment_fail', name: '设备故障', description: '电脑突然坏了，需要维修...', effect: { cash: -1500, energy: -10 }, chance: 0.1 },
  { id: 'tax_refund', name: '税收优惠', description: '符合小微企业税收减免政策！', effect: { cash: 3000 }, chance: 0.12 },
  { id: 'bad_review', name: '差评危机', description: '收到一条严厉的客户差评...', effect: { reputation: -5 }, chance: 0.1 },
  { id: 'media_interview', name: '媒体采访', description: '本地媒体想采访你的创业故事！', effect: { reputation: 8, cash: 1000 }, chance: 0.06 },
  { id: 'rent_increase', name: '成本上涨', description: '各类成本悄然上涨...', effect: { cash: -2000 }, chance: 0.1 },
  { id: 'mentor_advice', name: '贵人指点', description: '一位前辈给了你宝贵建议！', effect: { exp: 100 }, chance: 0.08 },
  { id: 'health_issue', name: '健康警告', description: '连续熬夜导致身体不适...', effect: { energy: -30 }, chance: 0.12 },
  { id: 'inspiration', name: '灵感迸发', description: '突然有了绝妙的创意！', effect: { creativity: 5 }, chance: 0.1 },
  { id: 'group_referral', name: '团购裂变', description: '老用户带来大量新团员！', effect: { cash: 3000, networking: 3 }, chance: 0.08 },
  { id: 'supplier_deal', name: '供应商优惠', description: '供应商给了独家优惠价格！', effect: { cash: 2000 }, chance: 0.1 },
]

// 休息选项
const REST_OPTIONS = [
  { id: 'nap', name: '小憩一下', cost: 0, energyRecover: 15, timeText: '在沙发上休息了30分钟', icon: '😴' },
  { id: 'rest', name: '好好休息', cost: 100, energyRecover: 40, timeText: '去咖啡厅放松了一下午', icon: '☕' },
  { id: 'vacation', name: '短途度假', cost: 500, energyRecover: 80, timeText: '出去旅行了两天', icon: '🏖️' },
  { id: 'spa', name: '豪华SPA', cost: 1000, energyRecover: 100, timeText: '享受了顶级SPA服务', icon: '💆' },
]

// 银行贷款选项
const BANK_LOANS = [
  { id: 'small', name: '小额信贷', amount: 5000, interest: 0.05, term: 6, description: '低门槛小额贷款，月利率5%' },
  { id: 'medium', name: '创业贷款', amount: 20000, interest: 0.03, term: 12, description: '政府扶持创业贷款，月利率3%' },
  { id: 'large', name: '商业贷款', amount: 50000, interest: 0.04, term: 12, description: '银行商业贷款，月利率4%' },
  { id: 'huge', name: '风险贷款', amount: 100000, interest: 0.06, term: 18, description: '高额风险贷款，月利率6%' },
]

// 可雇佣员工
const AVAILABLE_EMPLOYEES = [
  { id: 'intern', name: '实习生', salary: 500, bonus: { energy: 10 }, description: '帮忙处理杂事，每月恢复精力' },
  { id: 'marketer', name: '营销助理', salary: 2000, bonus: { marketing: 1, revenueBoost: 0.1 }, description: '协助营销，提升收入10%' },
  { id: 'tech', name: '技术专员', salary: 3000, bonus: { technology: 1, progressBoost: 5 }, description: '技术支持，加速项目进度' },
  { id: 'ops', name: '运营经理', salary: 2500, bonus: { management: 1, engagement: 3 }, description: '管理运营，提升活跃度' },
  { id: 'cs', name: '客服专员', salary: 1500, bonus: { trust: 2, conversion: 1 }, description: '处理客户咨询，提升信任和转化' },
  { id: 'creative', name: '创意总监', salary: 4000, bonus: { creativity: 1, revenueBoost: 0.15 }, description: '创意策划，提升收入15%' },
]

// 危机事件（需要决策）
const CRISIS_EVENTS = [
  { id: 'supplier_crisis', name: '⚠️ 供应商危机', description: '你的主要供应商突然出了问题，货源中断！',
    choices: [
      { id: 'emergency', name: '紧急找新供应商', icon: '🔍', cost: { cash: 1000, energy: 20 }, reward: { exp: 30 }, successRate: 0.7 },
      { id: 'stockpile', name: '高价抢购库存', icon: '📦', cost: { cash: 3000 }, reward: { exp: 15, trust: 5 }, successRate: 0.9 },
      { id: 'pause', name: '暂停业务等待', icon: '⏸️', cost: { reputation: -5 }, reward: { energy: 20 }, successRate: 1.0 }
    ] },
  { id: 'price_war', name: '⚔️ 竞品价格战', description: '竞争对手大幅降价，你的客户开始流失！',
    choices: [
      { id: 'match', name: '跟进降价', icon: '💰', cost: { cash: 2000 }, reward: { members: 5, exp: 20 }, successRate: 0.8 },
      { id: 'quality', name: '主打品质差异', icon: '💎', cost: { energy: 15 }, reward: { trust: 10, reputation: 5, exp: 25 }, successRate: 0.6 },
      { id: 'innovate', name: '推出新产品', icon: '🚀', cost: { cash: 1500, energy: 20 }, reward: { exp: 40, reach: 200 }, successRate: 0.5 }
    ] },
  { id: 'viral_negative', name: '🔥 负面舆情', description: '一条关于你的负面帖子在网上疯传！',
    choices: [
      { id: 'apologize', name: '公开道歉', icon: '🙏', cost: { energy: 10 }, reward: { reputation: 5, exp: 20 }, successRate: 0.75 },
      { id: 'evidence', name: '摆事实反驳', icon: '📋', cost: { energy: 20 }, reward: { reputation: 10, trust: 10, exp: 30 }, successRate: 0.4 },
      { id: 'silence', name: '沉默等风头过', icon: '🤫', cost: { reputation: -8 }, reward: { energy: 10, exp: 10 }, successRate: 0.6 }
    ] },
  { id: 'big_client', name: '🌟 大客户来了', description: '一个大企业主动找你合作！',
    choices: [
      { id: 'all_in', name: '全力以赴拿下', icon: '💪', cost: { energy: 30 }, reward: { cash: 10000, reputation: 10, exp: 50 }, successRate: 0.5 },
      { id: 'careful', name: '谨慎准备方案', icon: '📊', cost: { energy: 20, cash: 500 }, reward: { cash: 5000, reputation: 5, exp: 30 }, successRate: 0.75 },
      { id: 'decline', name: '婉拒（实力不够）', icon: '🙅', cost: {}, reward: { exp: 10 }, successRate: 1.0 }
    ] },
  { id: 'tech_failure', name: '💥 系统故障', description: '你的网店/系统突然崩溃了！',
    choices: [
      { id: 'fix_self', name: '自己动手修', icon: '🔧', cost: { energy: 25 }, reward: { technology: 3, exp: 25 }, successRate: 0.5 },
      { id: 'hire_expert', name: '花钱请专家', icon: '👨‍💻', cost: { cash: 2000 }, reward: { exp: 15 }, successRate: 0.9 },
      { id: 'upgrade', name: '趁机升级系统', icon: '⬆️', cost: { cash: 5000, energy: 20 }, reward: { technology: 5, exp: 40, trust: 5 }, successRate: 0.7 }
    ] },
  { id: 'partnership', name: '🤝 合作邀请', description: '另一位创业者提议合作共享资源！',
    choices: [
      { id: 'accept', name: '欣然接受', icon: '🤝', cost: { energy: 10 }, reward: { cash: 3000, networking: 5, exp: 25 }, successRate: 0.65 },
      { id: 'negotiate', name: '谈更好条件', icon: '💼', cost: { energy: 15 }, reward: { cash: 5000, networking: 3, exp: 30 }, successRate: 0.45 },
      { id: 'reject', name: '独立发展', icon: '💪', cost: {}, reward: { exp: 10, creativity: 2 }, successRate: 1.0 }
    ] },
  { id: 'government_check', name: '📋 政府检查', description: '工商部门来检查你的经营资质！',
    choices: [
      { id: 'comply', name: '积极配合', icon: '✅', cost: { energy: 15, cash: 500 }, reward: { reputation: 8, exp: 20 }, successRate: 0.85 },
      { id: 'rush_fix', name: '临时补办手续', icon: '📝', cost: { energy: 20, cash: 1000 }, reward: { exp: 15 }, successRate: 0.6 },
      { id: 'ignore', name: '假装不在家', icon: '🙈', cost: { reputation: -10 }, reward: { energy: 10 }, successRate: 0.4 }
    ] },
  { id: 'talent_poach', name: '🎯 挖角风波', description: '竞争对手试图挖走你的核心员工！',
    choices: [
      { id: 'raise', name: '加薪挽留', icon: '💰', cost: { cash: 3000 }, reward: { trust: 5, exp: 15 }, successRate: 0.8 },
      { id: 'talk', name: '谈心沟通', icon: '💬', cost: { energy: 15 }, reward: { trust: 8, management: 2, exp: 20 }, successRate: 0.6 },
      { id: 'let_go', name: '放手', icon: '👋', cost: { reputation: -3 }, reward: { exp: 10 }, successRate: 1.0 }
    ] },
]

// 模拟社群成员（AI用户）
const SIMULATED_USERS = [
  { id: 'user1', name: '小王', avatar: '👨', type: 'active', interests: ['优惠', '新品'], purchaseRate: 0.3 },
  { id: 'user2', name: '丽丽', avatar: '👩', type: 'lurker', interests: ['品质', '服务'], purchaseRate: 0.15 },
  { id: 'user3', name: '老张', avatar: '👴', type: 'active', interests: ['实惠', '日用品'], purchaseRate: 0.4 },
  { id: 'user4', name: '小美', avatar: '👧', type: 'influencer', interests: ['时尚', '美妆'], purchaseRate: 0.25, followers: 500 },
  { id: 'user5', name: '大刘', avatar: '👨‍💼', type: 'skeptic', interests: ['性价比'], purchaseRate: 0.1 },
  { id: 'user6', name: '阿芳', avatar: '👩‍🦰', type: 'active', interests: ['食品', '生鲜'], purchaseRate: 0.35 },
  { id: 'user7', name: '小陈', avatar: '🧑', type: 'newbie', interests: ['优惠'], purchaseRate: 0.2 },
  { id: 'user8', name: '王姐', avatar: '👩‍🍳', type: 'loyal', interests: ['家居', '厨具'], purchaseRate: 0.5 },
]

// 运营活动类型
const OPERATION_ACTIVITIES = [
  { id: 'red_packet', name: '发红包', icon: '🧧', cost: 50, effect: { engagement: 15, retention: 5 }, description: '群内发红包活跃气氛' },
  { id: 'flash_sale', name: '限时秒杀', icon: '⚡', cost: 0, effect: { conversion: 20, engagement: 10 }, description: '发起限时优惠活动' },
  { id: 'group_game', name: '群游戏', icon: '🎮', cost: 0, effect: { engagement: 25, retention: 10 }, description: '组织互动小游戏' },
  { id: 'share_experience', name: '晒单分享', icon: '📸', cost: 0, effect: { trust: 15, conversion: 5 }, description: '邀请用户分享购买体验' },
  { id: 'new_product', name: '新品预告', icon: '🆕', cost: 0, effect: { engagement: 10, conversion: 8 }, description: '预告即将上架的新品' },
  { id: 'coupon', name: '发优惠券', icon: '🎟️', cost: 100, effect: { conversion: 25, retention: 8 }, description: '派发专属优惠券' },
  { id: 'live_qa', name: '直播答疑', icon: '📺', cost: 0, effect: { trust: 20, engagement: 15 }, description: '直播解答用户问题' },
  { id: 'referral', name: '邀请有礼', icon: '🎁', cost: 30, effect: { growth: 20, engagement: 5 }, description: '老带新奖励活动' },
]

// 推广渠道
const PROMOTION_CHANNELS = [
  { id: 'xiaohongshu', name: '小红书', icon: '📕', cost: 0, audience: 'young_female', effect: { reach: 500, conversion: 3 }, description: '发布种草笔记，吸引年轻女性用户' },
  { id: 'douyin', name: '抖音短视频', icon: '🎵', cost: 0, audience: 'general', effect: { reach: 1000, conversion: 2 }, description: '发布短视频内容，获取大量曝光' },
  { id: 'wechat_moments', name: '朋友圈', icon: '💬', cost: 0, audience: 'friends', effect: { reach: 100, conversion: 8 }, description: '发朋友圈宣传，信任度高' },
  { id: 'wechat_group', name: '微信群转发', icon: '👥', cost: 0, audience: 'community', effect: { reach: 200, conversion: 5 }, description: '在各类微信群发布信息' },
  { id: 'weibo', name: '微博', icon: '🌐', cost: 0, audience: 'general', effect: { reach: 800, conversion: 1.5 }, description: '微博话题营销' },
  { id: 'facebook', name: 'Facebook', icon: '📘', cost: 0, audience: 'overseas', effect: { reach: 600, conversion: 2.5 }, description: '海外社交媒体推广' },
  { id: 'paid_ad', name: '付费广告', icon: '💰', cost: 500, audience: 'targeted', effect: { reach: 2000, conversion: 4 }, description: '精准投放广告' },
  { id: 'kol', name: 'KOL合作', icon: '⭐', cost: 1000, audience: 'followers', effect: { reach: 5000, conversion: 3.5 }, description: '与网红/达人合作推广' },
]

// 运营任务模板 - 任务驱动的运营系统（带策略选择）
const OPERATION_TASKS = {
  // 第一阶段：市场研究
  market_research: [
    { 
      id: 'analyze_competitors', name: '竞品分析', phase: 1, 
      description: '研究市场上的竞争对手，选择你的分析策略',
      choices: [
        { id: 'deep', name: '深度分析', icon: '🔬', description: '花更多时间深入研究', cost: { energy: 15 }, reward: { exp: 30, marketing: 3 }, successRate: 0.9 },
        { id: 'quick', name: '快速扫描', icon: '⚡', description: '快速了解主要竞品', cost: { energy: 8 }, reward: { exp: 15, marketing: 1 }, successRate: 0.7 },
        { id: 'spy', name: '卧底调研', icon: '🕵️', description: '假装客户深入了解', cost: { energy: 12 }, reward: { exp: 25, marketing: 2, insight: 10 }, successRate: 0.6 }
      ]
    },
    { 
      id: 'target_audience', name: '目标用户画像', phase: 1, 
      description: '确定你的目标客户群体',
      choices: [
        { id: 'broad', name: '广撒网', icon: '🌐', description: '覆盖更多人群', cost: { energy: 10 }, reward: { exp: 15, reach: 200 }, successRate: 0.8 },
        { id: 'niche', name: '精准定位', icon: '🎯', description: '专注细分市场', cost: { energy: 12 }, reward: { exp: 25, conversion: 5 }, successRate: 0.85 },
        { id: 'test', name: 'AB测试', icon: '🧪', description: '同时测试多个人群', cost: { energy: 18 }, reward: { exp: 35, marketing: 3 }, successRate: 0.7 }
      ]
    },
    { 
      id: 'pricing_strategy', name: '定价策略', phase: 1, 
      description: '制定你的产品定价策略',
      choices: [
        { id: 'low', name: '低价引流', icon: '💰', description: '薄利多销，快速起量', cost: { energy: 8 }, reward: { members: 10, exp: 15 }, effect: { priceLevel: 'low', margin: 0.1 } },
        { id: 'mid', name: '中端定位', icon: '⚖️', description: '性价比路线', cost: { energy: 10 }, reward: { members: 5, trust: 5, exp: 20 }, effect: { priceLevel: 'mid', margin: 0.25 } },
        { id: 'premium', name: '高端精品', icon: '👑', description: '高毛利，重品质', cost: { energy: 12 }, reward: { trust: 10, exp: 25 }, effect: { priceLevel: 'high', margin: 0.4 } }
      ]
    }
  ],
  // 第二阶段：推广准备
  promotion_prep: [
    { 
      id: 'content_style', name: '内容风格', phase: 2, 
      description: '确定你的内容创作风格',
      choices: [
        { id: 'professional', name: '专业权威', icon: '📊', description: '专业知识分享', cost: { energy: 12 }, reward: { trust: 10, exp: 20 }, effect: { style: 'professional' } },
        { id: 'casual', name: '轻松有趣', icon: '😄', description: '接地气，易传播', cost: { energy: 8 }, reward: { engagement: 10, exp: 15 }, effect: { style: 'casual' } },
        { id: 'story', name: '故事情感', icon: '💝', description: '讲故事，打动人心', cost: { energy: 15 }, reward: { trust: 8, engagement: 8, exp: 25 }, effect: { style: 'story' } }
      ]
    },
    { 
      id: 'channel_select', name: '主攻渠道', phase: 2, 
      description: '选择你的主要推广渠道',
      choices: [
        { id: 'xiaohongshu', name: '小红书种草', icon: '📕', description: '图文种草，年轻女性', cost: { energy: 10 }, reward: { reach: 300, exp: 20 }, effect: { channel: 'xiaohongshu' } },
        { id: 'douyin', name: '抖音短视频', icon: '🎵', description: '视频带货，流量大', cost: { energy: 15 }, reward: { reach: 500, exp: 25 }, effect: { channel: 'douyin' } },
        { id: 'wechat', name: '微信私域', icon: '💬', description: '朋友圈+社群，信任高', cost: { energy: 8 }, reward: { trust: 10, members: 5, exp: 15 }, effect: { channel: 'wechat' } },
        { id: 'multi', name: '多渠道并行', icon: '🚀', description: '全平台覆盖', cost: { energy: 20 }, reward: { reach: 400, exp: 30 }, effect: { channel: 'multi' } }
      ]
    },
    { 
      id: 'first_campaign', name: '首次推广', phase: 2, 
      description: '发起你的第一次推广活动',
      choices: [
        { id: 'free_trial', name: '免费试用', icon: '🎁', description: '送产品换口碑', cost: { energy: 10, cash: 100 }, reward: { members: 8, trust: 5, exp: 20 }, successRate: 0.85 },
        { id: 'discount', name: '限时折扣', icon: '🏷️', description: '打折促销引流', cost: { energy: 8 }, reward: { members: 5, orders: 2, exp: 15 }, successRate: 0.75 },
        { id: 'content_only', name: '纯内容引流', icon: '✍️', description: '用优质内容吸引', cost: { energy: 12 }, reward: { reach: 200, trust: 8, exp: 25 }, successRate: 0.6 }
      ]
    }
  ],
  // 第三阶段：引流推广
  promotion_exec: [
    { 
      id: 'channel_promotion', name: '渠道推广', phase: 3, 
      description: '选择一个渠道进行推广',
      isPromotion: true,
      choices: [
        { id: 'xiaohongshu', name: '小红书种草', icon: '📕', description: '发布种草笔记，吸引年轻女性', cost: { energy: 10 }, reward: { reach: 500, members: 3, exp: 20 }, successRate: 0.75, channelId: 'xiaohongshu' },
        { id: 'douyin', name: '抖音短视频', icon: '🎵', description: '发布短视频，获取大量曝光', cost: { energy: 12 }, reward: { reach: 1000, members: 5, exp: 25 }, successRate: 0.6, channelId: 'douyin' },
        { id: 'wechat', name: '微信私域', icon: '💬', description: '朋友圈+社群，信任度高', cost: { energy: 8 }, reward: { reach: 200, trust: 10, members: 2, exp: 15 }, successRate: 0.85, channelId: 'wechat_moments' }
      ]
    },
    { 
      id: 'content_creation', name: '内容创作', phase: 3, 
      description: '今天发布什么内容？',
      choices: [
        { id: 'product', name: '产品展示', icon: '📦', description: '展示产品特点', cost: { energy: 8 }, reward: { reach: 100, interest: 10, exp: 10 } },
        { id: 'lifestyle', name: '生活分享', icon: '🌸', description: '分享使用场景', cost: { energy: 10 }, reward: { reach: 150, trust: 5, exp: 15 } },
        { id: 'hot_topic', name: '蹭热点', icon: '🔥', description: '结合热门话题', cost: { energy: 12 }, reward: { reach: 300, exp: 20 }, successRate: 0.5 }
      ]
    },
    { 
      id: 'user_acquire', name: '用户获取', phase: 3, 
      description: '如何获取新用户？',
      choices: [
        { id: 'referral', name: '老带新奖励', icon: '🤝', description: '邀请返现', cost: { energy: 10, cash: 50 }, reward: { members: 8, exp: 20 }, successRate: 0.8 },
        { id: 'community', name: '社群裂变', icon: '👥', description: '进群抽奖', cost: { energy: 12 }, reward: { members: 15, exp: 25 }, successRate: 0.65 },
        { id: 'organic', name: '自然增长', icon: '🌱', description: '靠内容慢慢积累', cost: { energy: 8 }, reward: { members: 3, trust: 5, exp: 10 }, successRate: 0.9 }
      ]
    },
    { 
      id: 'handle_inquiry', name: '客户咨询', phase: 3, 
      description: '有客户来咨询了，怎么回复？',
      isCustomerInteraction: true,
      choices: [
        { id: 'warm', name: '热情服务', icon: '😊', description: '亲切耐心解答', cost: { energy: 5 }, reward: { trust: 5, conversion: 3, exp: 10 }, successRate: 0.7 },
        { id: 'professional', name: '专业解答', icon: '👔', description: '专业详细说明', cost: { energy: 8 }, reward: { trust: 8, conversion: 5, exp: 15 }, successRate: 0.75 },
        { id: 'urgent', name: '制造紧迫', icon: '⏰', description: '限时限量催促', cost: { energy: 5 }, reward: { conversion: 8, exp: 12 }, successRate: 0.5, riskTrust: -3 }
      ]
    }
  ],
  // 第四阶段：社群运营
  community_ops: [
    { 
      id: 'group_activity', name: '群内活动', phase: 4, 
      description: '今天搞什么活动？',
      choices: [
        { id: 'redpacket', name: '发红包', icon: '🧧', description: '红包活跃气氛', cost: { energy: 5, cash: 20 }, reward: { engagement: 15, exp: 10 } },
        { id: 'quiz', name: '知识问答', icon: '❓', description: '趣味问答互动', cost: { energy: 10 }, reward: { engagement: 10, trust: 5, exp: 15 } },
        { id: 'share', name: '晒单有礼', icon: '📸', description: '鼓励分享体验', cost: { energy: 8, cash: 30 }, reward: { trust: 10, engagement: 5, exp: 20 } }
      ]
    },
    { 
      id: 'handle_complaint', name: '处理投诉', phase: 4, 
      description: '有用户不满意，怎么处理？',
      isCustomerInteraction: true,
      choices: [
        { id: 'apologize', name: '诚恳道歉', icon: '🙏', description: '道歉并补偿', cost: { energy: 8, cash: 30 }, reward: { trust: 10, exp: 15 }, successRate: 0.85 },
        { id: 'explain', name: '耐心解释', icon: '💬', description: '说明情况', cost: { energy: 10 }, reward: { trust: 5, exp: 10 }, successRate: 0.6 },
        { id: 'ignore', name: '冷处理', icon: '🙈', description: '等他自己消气', cost: { energy: 2 }, reward: { exp: 5 }, successRate: 0.3, riskTrust: -10 }
      ]
    },
    { 
      id: 'member_care', name: '会员关怀', phase: 4, 
      description: '如何维护老客户？',
      choices: [
        { id: 'exclusive', name: '专属优惠', icon: '🎫', description: '会员专享价', cost: { energy: 8, cash: 20 }, reward: { trust: 8, retention: 10, exp: 15 } },
        { id: 'birthday', name: '生日祝福', icon: '🎂', description: '发送祝福+小礼', cost: { energy: 5, cash: 10 }, reward: { trust: 5, retention: 5, exp: 10 } },
        { id: 'vip_group', name: 'VIP群', icon: '⭐', description: '建立核心用户群', cost: { energy: 12 }, reward: { trust: 10, retention: 15, exp: 20 } }
      ]
    }
  ],
  // 第五阶段：转化变现
  conversion: [
    { 
      id: 'sales_strategy', name: '销售策略', phase: 5, 
      description: '今天怎么卖货？',
      choices: [
        { id: 'soft_sell', name: '软性推荐', icon: '💭', description: '分享使用体验带货', cost: { energy: 10 }, reward: { orders: 2, trust: 5, exp: 15 }, successRate: 0.7 },
        { id: 'flash_sale', name: '限时秒杀', icon: '⚡', description: '限时限量抢购', cost: { energy: 12 }, reward: { orders: 5, exp: 20 }, successRate: 0.8 },
        { id: 'bundle', name: '组合套餐', icon: '📦', description: '打包优惠', cost: { energy: 8 }, reward: { orders: 3, cash: 100, exp: 15 }, successRate: 0.75 }
      ]
    },
    { 
      id: 'group_buy', name: '团购开团', phase: 5, 
      description: '如何组织团购？',
      choices: [
        { id: 'small', name: '3人小团', icon: '👥', description: '容易成团', cost: { energy: 8 }, reward: { orders: 3, exp: 15 }, successRate: 0.85 },
        { id: 'medium', name: '10人中团', icon: '👨‍👩‍👧‍👦', description: '价格更优惠', cost: { energy: 12 }, reward: { orders: 8, cash: 150, exp: 25 }, successRate: 0.65 },
        { id: 'large', name: '50人大团', icon: '🏢', description: '超低价，难组织', cost: { energy: 18 }, reward: { orders: 30, cash: 500, exp: 40 }, successRate: 0.35 }
      ]
    },
    { 
      id: 'expand_decide', name: '扩张决策', phase: 5, 
      description: '项目有起色了，下一步怎么走？',
      choices: [
        { id: 'stable', name: '稳扎稳打', icon: '🛡️', description: '维护现有客户', cost: { energy: 10 }, reward: { trust: 10, retention: 10, exp: 20 } },
        { id: 'expand', name: '快速扩张', icon: '🚀', description: '加大推广投入', cost: { energy: 20, cash: 200 }, reward: { members: 20, reach: 500, exp: 35 }, successRate: 0.6 },
        { id: 'diversify', name: '品类扩展', icon: '🌈', description: '增加产品种类', cost: { energy: 15, cash: 100 }, reward: { exp: 30 }, effect: { newCategory: true } }
      ]
    }
  ]
}

// 项目专属任务模板
const PROJECT_TASKS = {
  // 自媒体内容创作
  content: {
    market_research: [
      { id: 'platform_analysis', name: '平台分析', phase: 1, description: '分析各内容平台的特点和机会',
        choices: [
          { id: 'multi', name: '全平台调研', icon: '🌐', description: '了解所有主流平台', cost: { energy: 15 }, reward: { exp: 30, marketing: 3 }, successRate: 0.85 },
          { id: 'focus', name: '聚焦一个平台', icon: '🎯', description: '深入研究一个平台', cost: { energy: 10 }, reward: { exp: 20, marketing: 2 }, successRate: 0.9 },
          { id: 'trend', name: '追踪热门趋势', icon: '🔥', description: '研究当前热门内容', cost: { energy: 12 }, reward: { exp: 25, creativity: 3 }, successRate: 0.75 }
        ]
      },
      { id: 'niche_select', name: '赛道选择', phase: 1, description: '选择你的内容赛道',
        choices: [
          { id: 'entertainment', name: '娱乐搞笑', icon: '😂', description: '轻松娱乐内容', cost: { energy: 8 }, reward: { reach: 300, exp: 15 }, successRate: 0.7 },
          { id: 'knowledge', name: '知识科普', icon: '📚', description: '专业知识分享', cost: { energy: 12 }, reward: { trust: 10, exp: 25 }, successRate: 0.8 },
          { id: 'lifestyle', name: '生活方式', icon: '🌸', description: '生活分享vlog', cost: { energy: 10 }, reward: { engagement: 10, exp: 20 }, successRate: 0.75 }
        ]
      },
      { id: 'content_style', name: '内容风格', phase: 1, description: '确定你的创作风格',
        choices: [
          { id: 'serious', name: '专业严谨', icon: '🎓', description: '权威专业形象', cost: { energy: 12 }, reward: { trust: 15, exp: 25 }, successRate: 0.85 },
          { id: 'casual', name: '轻松幽默', icon: '😄', description: '亲和力强', cost: { energy: 8 }, reward: { engagement: 15, exp: 15 }, successRate: 0.8 },
          { id: 'unique', name: '独特人设', icon: '✨', description: '打造记忆点', cost: { energy: 15 }, reward: { reach: 200, creativity: 3, exp: 30 }, successRate: 0.6 }
        ]
      }
    ],
    promotion_prep: [
      { id: 'first_content', name: '首条内容', phase: 2, description: '发布你的第一条内容',
        choices: [
          { id: 'safe', name: '稳妥起步', icon: '🛡️', description: '常规内容测试水温', cost: { energy: 10 }, reward: { reach: 100, exp: 15 }, successRate: 0.85 },
          { id: 'bold', name: '大胆尝试', icon: '🚀', description: '创意内容博出圈', cost: { energy: 15 }, reward: { reach: 500, exp: 30 }, successRate: 0.4 },
          { id: 'series', name: '系列策划', icon: '📋', description: '规划系列内容', cost: { energy: 12 }, reward: { trust: 8, exp: 25 }, successRate: 0.75 }
        ]
      },
      { id: 'update_freq', name: '更新频率', phase: 2, description: '确定内容更新节奏',
        choices: [
          { id: 'daily', name: '日更', icon: '📅', description: '每天更新', cost: { energy: 20 }, reward: { reach: 300, exp: 30 }, successRate: 0.6 },
          { id: 'weekly', name: '周更', icon: '📆', description: '每周更新', cost: { energy: 10 }, reward: { reach: 150, trust: 5, exp: 20 }, successRate: 0.85 },
          { id: 'quality', name: '精品不定期', icon: '💎', description: '只发精品内容', cost: { energy: 15 }, reward: { trust: 15, exp: 25 }, successRate: 0.75 }
        ]
      },
      { id: 'monetize_plan', name: '变现规划', phase: 2, description: '规划内容变现方式',
        choices: [
          { id: 'ad', name: '广告合作', icon: '📢', description: '接品牌广告', cost: { energy: 8 }, reward: { exp: 20 }, effect: { monetize: 'ad' } },
          { id: 'product', name: '带货变现', icon: '🛒', description: '推荐产品赚佣金', cost: { energy: 10 }, reward: { exp: 20 }, effect: { monetize: 'product' } },
          { id: 'knowledge', name: '知识付费', icon: '🎓', description: '开课程卖知识', cost: { energy: 15 }, reward: { trust: 10, exp: 25 }, effect: { monetize: 'course' } }
        ]
      }
    ],
    promotion_exec: [
      { id: 'platform_promotion', name: '平台推广', phase: 3, description: '选择平台发布内容',
        isPromotion: true,
        choices: [
          { id: 'xiaohongshu', name: '小红书图文', icon: '📕', description: '发布精美图文笔记', cost: { energy: 10 }, reward: { reach: 600, members: 5, exp: 20 }, successRate: 0.75, channelId: 'xiaohongshu' },
          { id: 'douyin', name: '抖音视频', icon: '🎵', description: '发布短视频内容', cost: { energy: 15 }, reward: { reach: 1200, members: 8, exp: 28 }, successRate: 0.6, channelId: 'douyin' },
          { id: 'weibo', name: '微博话题', icon: '🌐', description: '参与热门话题', cost: { energy: 8 }, reward: { reach: 800, members: 3, exp: 15 }, successRate: 0.7, channelId: 'weibo' }
        ]
      },
      { id: 'daily_create', name: '今日创作', phase: 3, description: '今天创作什么内容？',
        choices: [
          { id: 'original', name: '原创内容', icon: '✍️', description: '完全原创', cost: { energy: 15 }, reward: { reach: 200, trust: 8, exp: 20 }, successRate: 0.7 },
          { id: 'hot', name: '蹭热点', icon: '🔥', description: '结合热门话题', cost: { energy: 10 }, reward: { reach: 400, exp: 15 }, successRate: 0.5 },
          { id: 'interact', name: '互动内容', icon: '💬', description: '引发讨论', cost: { energy: 12 }, reward: { engagement: 20, exp: 18 }, successRate: 0.65 }
        ]
      },
      { id: 'fan_interact', name: '粉丝互动', phase: 3, description: '如何与粉丝互动？',
        choices: [
          { id: 'reply', name: '认真回复', icon: '💌', description: '回复每条评论', cost: { energy: 10 }, reward: { trust: 10, engagement: 10, exp: 15 }, successRate: 0.9 },
          { id: 'live', name: '直播互动', icon: '📺', description: '开直播聊天', cost: { energy: 15 }, reward: { engagement: 20, members: 5, exp: 25 }, successRate: 0.7 },
          { id: 'event', name: '粉丝活动', icon: '🎉', description: '举办抽奖活动', cost: { energy: 8, cash: 50 }, reward: { members: 10, exp: 20 }, successRate: 0.8 }
        ]
      },
      { id: 'collab', name: '合作机会', phase: 3, description: '有合作邀请，怎么选？',
        choices: [
          { id: 'accept', name: '接受合作', icon: '🤝', description: '与品牌合作', cost: { energy: 12 }, reward: { cash: 500, exp: 25 }, successRate: 0.75 },
          { id: 'negotiate', name: '谈判条件', icon: '💼', description: '争取更好条件', cost: { energy: 15 }, reward: { cash: 1000, exp: 30 }, successRate: 0.5 },
          { id: 'decline', name: '婉拒等待', icon: '🙅', description: '等更好机会', cost: { energy: 5 }, reward: { trust: 5, exp: 10 }, successRate: 0.9 }
        ]
      }
    ],
    community_ops: [
      { id: 'fan_group', name: '粉丝群运营', phase: 4, description: '如何运营粉丝群？',
        choices: [
          { id: 'exclusive', name: '独家内容', icon: '🔒', description: '分享独家幕后', cost: { energy: 10 }, reward: { trust: 15, engagement: 10, exp: 20 } },
          { id: 'chat', name: '日常聊天', icon: '💬', description: '和粉丝闲聊', cost: { energy: 8 }, reward: { engagement: 15, exp: 15 } },
          { id: 'benefit', name: '粉丝福利', icon: '🎁', description: '发专属福利', cost: { energy: 8, cash: 30 }, reward: { members: 5, trust: 10, exp: 18 } }
        ]
      },
      { id: 'handle_hate', name: '处理黑粉', phase: 4, description: '遇到恶意评论怎么办？',
        choices: [
          { id: 'ignore', name: '无视忽略', icon: '🙈', description: '不理会', cost: { energy: 3 }, reward: { exp: 5 }, successRate: 0.7 },
          { id: 'humor', name: '幽默化解', icon: '😂', description: '用幽默回应', cost: { energy: 8 }, reward: { engagement: 10, exp: 15 }, successRate: 0.6 },
          { id: 'serious', name: '正面回应', icon: '📢', description: '认真解释', cost: { energy: 12 }, reward: { trust: 10, exp: 20 }, successRate: 0.5, riskTrust: -5 }
        ]
      },
      { id: 'content_upgrade', name: '内容升级', phase: 4, description: '如何提升内容质量？',
        choices: [
          { id: 'equipment', name: '升级设备', icon: '📷', description: '购买更好设备', cost: { energy: 5, cash: 500 }, reward: { creativity: 5, exp: 20 } },
          { id: 'learn', name: '学习技能', icon: '📖', description: '学习剪辑技巧', cost: { energy: 15 }, reward: { creativity: 8, exp: 30 } },
          { id: 'team', name: '组建团队', icon: '👥', description: '找人帮忙', cost: { energy: 10, cash: 300 }, reward: { reach: 200, exp: 25 } }
        ]
      }
    ],
    conversion: [
      { id: 'monetize', name: '变现执行', phase: 5, description: '今天如何变现？',
        choices: [
          { id: 'soft_ad', name: '软广植入', icon: '📝', description: '自然植入推广', cost: { energy: 10 }, reward: { cash: 300, exp: 20 }, successRate: 0.75 },
          { id: 'hard_ad', name: '硬广推荐', icon: '📢', description: '直接推荐产品', cost: { energy: 8 }, reward: { cash: 500, exp: 15 }, successRate: 0.6, riskTrust: -3 },
          { id: 'own_product', name: '自有产品', icon: '🎨', description: '推自己的产品', cost: { energy: 15 }, reward: { cash: 800, trust: 5, exp: 30 }, successRate: 0.5 }
        ]
      },
      { id: 'brand_deal', name: '品牌合作', phase: 5, description: '大品牌来谈合作',
        choices: [
          { id: 'exclusive', name: '独家代言', icon: '⭐', description: '签独家合约', cost: { energy: 15 }, reward: { cash: 2000, exp: 40 }, successRate: 0.6 },
          { id: 'campaign', name: '单次活动', icon: '🎯', description: '只做一次', cost: { energy: 10 }, reward: { cash: 800, exp: 25 }, successRate: 0.8 },
          { id: 'long_term', name: '长期合作', icon: '🤝', description: '建立长期关系', cost: { energy: 12 }, reward: { cash: 1000, trust: 10, exp: 30 }, successRate: 0.7 }
        ]
      },
      { id: 'scale_up', name: '规模扩张', phase: 5, description: '如何扩大影响力？',
        choices: [
          { id: 'more_platform', name: '多平台发展', icon: '🌐', description: '入驻更多平台', cost: { energy: 20 }, reward: { reach: 500, exp: 35 }, successRate: 0.7 },
          { id: 'deep_niche', name: '深耕领域', icon: '🎯', description: '在细分领域做深', cost: { energy: 15 }, reward: { trust: 20, exp: 30 }, successRate: 0.8 },
          { id: 'ip_build', name: '打造IP', icon: '👑', description: '建立个人品牌', cost: { energy: 18, cash: 200 }, reward: { reach: 300, trust: 15, exp: 40 }, successRate: 0.55 }
        ]
      }
    ]
  },

  // 自由职业服务
  freelance: {
    market_research: [
      { id: 'skill_audit', name: '技能盘点', phase: 1, description: '评估你的专业技能',
        choices: [
          { id: 'core', name: '核心技能', icon: '💪', description: '专注最强技能', cost: { energy: 10 }, reward: { exp: 20 }, successRate: 0.9 },
          { id: 'multi', name: '多技能组合', icon: '🎨', description: '展示多种能力', cost: { energy: 15 }, reward: { exp: 25, reach: 100 }, successRate: 0.7 },
          { id: 'learn_new', name: '学习新技能', icon: '📚', description: '补充市场需要的技能', cost: { energy: 20 }, reward: { exp: 35, marketing: 2 }, successRate: 0.6 }
        ]
      },
      { id: 'market_rate', name: '定价调研', phase: 1, description: '了解市场价格水平',
        choices: [
          { id: 'low', name: '低价入市', icon: '💰', description: '用低价获取第一批客户', cost: { energy: 8 }, reward: { members: 5, exp: 15 } },
          { id: 'mid', name: '中等定价', icon: '⚖️', description: '性价比路线', cost: { energy: 10 }, reward: { trust: 5, exp: 20 } },
          { id: 'premium', name: '高端定价', icon: '👑', description: '只服务高端客户', cost: { energy: 12 }, reward: { trust: 10, exp: 25 } }
        ]
      },
      { id: 'platform_choice', name: '平台选择', phase: 1, description: '选择接单平台',
        choices: [
          { id: 'upwork', name: '国际平台', icon: '🌍', description: 'Upwork等国际平台', cost: { energy: 15 }, reward: { reach: 300, exp: 25 }, successRate: 0.6 },
          { id: 'local', name: '国内平台', icon: '🇨🇳', description: '猪八戒等国内平台', cost: { energy: 10 }, reward: { reach: 200, exp: 20 }, successRate: 0.75 },
          { id: 'direct', name: '直接获客', icon: '🤝', description: '通过人脉接单', cost: { energy: 12 }, reward: { trust: 10, exp: 20 }, successRate: 0.8 }
        ]
      }
    ],
    promotion_prep: [
      { id: 'portfolio', name: '作品集', phase: 2, description: '准备你的作品集',
        choices: [
          { id: 'best', name: '精选作品', icon: '💎', description: '只放最好的作品', cost: { energy: 12 }, reward: { trust: 15, exp: 20 }, successRate: 0.85 },
          { id: 'diverse', name: '多样展示', icon: '🎨', description: '展示不同类型', cost: { energy: 15 }, reward: { reach: 150, exp: 25 }, successRate: 0.75 },
          { id: 'case_study', name: '案例故事', icon: '📖', description: '详细案例分析', cost: { energy: 18 }, reward: { trust: 20, exp: 30 }, successRate: 0.7 }
        ]
      },
      { id: 'profile_setup', name: '个人品牌', phase: 2, description: '建立个人品牌形象',
        choices: [
          { id: 'professional', name: '专业形象', icon: '👔', description: '严肃专业风格', cost: { energy: 10 }, reward: { trust: 12, exp: 18 } },
          { id: 'friendly', name: '亲和形象', icon: '😊', description: '亲切好沟通', cost: { energy: 8 }, reward: { engagement: 10, exp: 15 } },
          { id: 'expert', name: '专家形象', icon: '🎓', description: '领域专家定位', cost: { energy: 15 }, reward: { trust: 18, exp: 25 } }
        ]
      },
      { id: 'first_client', name: '第一个客户', phase: 2, description: '如何获得第一个客户？',
        choices: [
          { id: 'free_sample', name: '免费样品', icon: '🎁', description: '免费做一个获口碑', cost: { energy: 15 }, reward: { members: 3, trust: 10, exp: 20 }, successRate: 0.85 },
          { id: 'low_price', name: '低价试水', icon: '💰', description: '低价快速成交', cost: { energy: 10 }, reward: { members: 2, cash: 100, exp: 15 }, successRate: 0.8 },
          { id: 'network', name: '人脉推荐', icon: '🤝', description: '找朋友介绍', cost: { energy: 8 }, reward: { members: 1, trust: 8, exp: 12 }, successRate: 0.9 }
        ]
      }
    ],
    promotion_exec: [
      { id: 'service_promotion', name: '服务推广', phase: 3, description: '在哪里推广你的服务？',
        isPromotion: true,
        choices: [
          { id: 'linkedin', name: 'LinkedIn推广', icon: '💼', description: '在职场社交平台展示', cost: { energy: 10 }, reward: { reach: 400, members: 3, exp: 20 }, successRate: 0.7, channelId: 'weibo' },
          { id: 'zhihu', name: '知乎专业回答', icon: '📚', description: '回答专业问题引流', cost: { energy: 12 }, reward: { reach: 300, trust: 8, exp: 22 }, successRate: 0.75, channelId: 'wechat_group' },
          { id: 'moments', name: '朋友圈案例', icon: '💬', description: '分享成功案例', cost: { energy: 8 }, reward: { reach: 150, trust: 10, members: 2, exp: 15 }, successRate: 0.85, channelId: 'wechat_moments' }
        ]
      },
      { id: 'client_acquire', name: '客户获取', phase: 3, description: '今天如何找客户？',
        choices: [
          { id: 'bid', name: '主动投标', icon: '📝', description: '在平台投标项目', cost: { energy: 10 }, reward: { members: 2, exp: 15 }, successRate: 0.5 },
          { id: 'content', name: '内容引流', icon: '✍️', description: '发专业内容吸引', cost: { energy: 12 }, reward: { reach: 200, exp: 20 }, successRate: 0.6 },
          { id: 'referral', name: '老客推荐', icon: '🔄', description: '请老客户推荐', cost: { energy: 8 }, reward: { members: 1, trust: 8, exp: 15 }, successRate: 0.75 }
        ]
      },
      { id: 'project_manage', name: '项目执行', phase: 3, description: '客户项目如何执行？',
        choices: [
          { id: 'fast', name: '快速交付', icon: '⚡', description: '尽快完成', cost: { energy: 15 }, reward: { cash: 300, exp: 20 }, successRate: 0.7 },
          { id: 'quality', name: '精益求精', icon: '💎', description: '追求完美质量', cost: { energy: 20 }, reward: { trust: 15, cash: 200, exp: 25 }, successRate: 0.85 },
          { id: 'communicate', name: '频繁沟通', icon: '💬', description: '保持密切沟通', cost: { energy: 12 }, reward: { trust: 10, exp: 18 }, successRate: 0.9 }
        ]
      },
      { id: 'handle_revision', name: '修改要求', phase: 3, description: '客户要求修改，怎么处理？',
        choices: [
          { id: 'accept', name: '全部接受', icon: '✅', description: '满足客户要求', cost: { energy: 15 }, reward: { trust: 10, exp: 15 }, successRate: 0.9 },
          { id: 'negotiate', name: '协商边界', icon: '🤝', description: '讨论修改范围', cost: { energy: 10 }, reward: { trust: 5, cash: 100, exp: 18 }, successRate: 0.7 },
          { id: 'charge', name: '额外收费', icon: '💰', description: '超出范围收费', cost: { energy: 8 }, reward: { cash: 200, exp: 12 }, successRate: 0.5, riskTrust: -5 }
        ]
      }
    ],
    community_ops: [
      { id: 'client_relation', name: '客户关系', phase: 4, description: '如何维护客户关系？',
        choices: [
          { id: 'followup', name: '定期回访', icon: '📞', description: '主动联系老客户', cost: { energy: 8 }, reward: { trust: 10, exp: 15 } },
          { id: 'discount', name: '老客优惠', icon: '🎫', description: '给老客户折扣', cost: { energy: 5 }, reward: { trust: 8, members: 1, exp: 12 } },
          { id: 'value_add', name: '增值服务', icon: '🎁', description: '提供额外价值', cost: { energy: 12 }, reward: { trust: 15, exp: 20 } }
        ]
      },
      { id: 'difficult_client', name: '难缠客户', phase: 4, description: '遇到难缠的客户',
        choices: [
          { id: 'patient', name: '耐心沟通', icon: '🙏', description: '耐心解决问题', cost: { energy: 15 }, reward: { trust: 12, exp: 20 }, successRate: 0.7 },
          { id: 'boundary', name: '设立边界', icon: '🚧', description: '明确服务边界', cost: { energy: 10 }, reward: { exp: 15 }, successRate: 0.6 },
          { id: 'refund', name: '退款了结', icon: '💸', description: '退钱结束合作', cost: { energy: 5, cash: -100 }, reward: { exp: 10 }, successRate: 0.9 }
        ]
      },
      { id: 'skill_growth', name: '技能提升', phase: 4, description: '如何提升专业能力？',
        choices: [
          { id: 'course', name: '在线课程', icon: '📚', description: '学习专业课程', cost: { energy: 15, cash: 200 }, reward: { exp: 35 } },
          { id: 'practice', name: '项目实战', icon: '💪', description: '通过项目积累', cost: { energy: 12 }, reward: { exp: 25 } },
          { id: 'mentor', name: '找导师', icon: '🎓', description: '请教行业前辈', cost: { energy: 10, cash: 100 }, reward: { trust: 5, exp: 30 } }
        ]
      }
    ],
    conversion: [
      { id: 'rate_increase', name: '提价策略', phase: 5, description: '是时候提价了',
        choices: [
          { id: 'gradual', name: '逐步提价', icon: '📈', description: '慢慢提高价格', cost: { energy: 8 }, reward: { cash: 300, exp: 20 }, successRate: 0.85 },
          { id: 'new_tier', name: '新增高端', icon: '👑', description: '增加高端服务线', cost: { energy: 12 }, reward: { cash: 500, trust: 5, exp: 25 }, successRate: 0.7 },
          { id: 'package', name: '打包服务', icon: '📦', description: '组合服务套餐', cost: { energy: 10 }, reward: { cash: 400, exp: 22 }, successRate: 0.75 }
        ]
      },
      { id: 'passive_income', name: '被动收入', phase: 5, description: '创造被动收入',
        choices: [
          { id: 'template', name: '卖模板', icon: '📄', description: '销售工作模板', cost: { energy: 15 }, reward: { cash: 200, exp: 25 }, successRate: 0.6 },
          { id: 'course', name: '做课程', icon: '🎓', description: '录制教学课程', cost: { energy: 20 }, reward: { cash: 500, trust: 10, exp: 35 }, successRate: 0.5 },
          { id: 'retainer', name: '长期合约', icon: '📝', description: '签订长期服务', cost: { energy: 12 }, reward: { cash: 800, exp: 30 }, successRate: 0.65 }
        ]
      },
      { id: 'scale_decision', name: '规模决策', phase: 5, description: '业务发展方向',
        choices: [
          { id: 'solo', name: '个人精品', icon: '💎', description: '保持个人服务', cost: { energy: 10 }, reward: { trust: 15, exp: 25 } },
          { id: 'team', name: '组建团队', icon: '👥', description: '招人扩大规模', cost: { energy: 18, cash: 500 }, reward: { reach: 300, exp: 40 }, successRate: 0.6 },
          { id: 'agency', name: '成立工作室', icon: '🏢', description: '开设工作室', cost: { energy: 20, cash: 1000 }, reward: { reach: 500, trust: 10, exp: 50 }, successRate: 0.5 }
        ]
      }
    ]
  },

  // 无货源电商
  dropshipping: {
    market_research: [
      { id: 'product_research', name: '选品调研', phase: 1, description: '找到有潜力的产品',
        choices: [
          { id: 'trending', name: '追踪爆款', icon: '🔥', description: '找当前热销品', cost: { energy: 12 }, reward: { exp: 25, marketing: 2 }, successRate: 0.7 },
          { id: 'niche', name: '挖掘小众', icon: '💎', description: '寻找蓝海产品', cost: { energy: 15 }, reward: { exp: 30, trust: 5 }, successRate: 0.6 },
          { id: 'data', name: '数据分析', icon: '📊', description: '用工具分析数据', cost: { energy: 10 }, reward: { exp: 20, marketing: 3 }, successRate: 0.8 }
        ]
      },
      { id: 'supplier_find', name: '供应商对接', phase: 1, description: '找到靠谱的供应商',
        choices: [
          { id: '1688', name: '1688采购', icon: '🏭', description: '阿里巴巴找货', cost: { energy: 10 }, reward: { exp: 20 }, successRate: 0.85 },
          { id: 'factory', name: '直接工厂', icon: '🔧', description: '对接源头工厂', cost: { energy: 18 }, reward: { trust: 10, exp: 30 }, successRate: 0.5 },
          { id: 'agent', name: '代发平台', icon: '📦', description: '用一件代发平台', cost: { energy: 8 }, reward: { exp: 15 }, successRate: 0.9 }
        ]
      },
      { id: 'platform_select', name: '销售平台', phase: 1, description: '选择销售渠道',
        choices: [
          { id: 'taobao', name: '淘宝开店', icon: '🛒', description: '淘宝店铺', cost: { energy: 12 }, reward: { reach: 300, exp: 20 } },
          { id: 'pinduoduo', name: '拼多多', icon: '🍊', description: '拼多多店铺', cost: { energy: 10 }, reward: { reach: 400, exp: 18 } },
          { id: 'douyin', name: '抖音小店', icon: '🎵', description: '抖音电商', cost: { energy: 15 }, reward: { reach: 500, exp: 25 } }
        ]
      }
    ],
    promotion_prep: [
      { id: 'store_setup', name: '店铺装修', phase: 2, description: '装修你的店铺',
        choices: [
          { id: 'simple', name: '简洁风格', icon: '✨', description: '简单清爽', cost: { energy: 8 }, reward: { exp: 15 }, successRate: 0.9 },
          { id: 'professional', name: '专业设计', icon: '🎨', description: '精心设计', cost: { energy: 15 }, reward: { trust: 10, exp: 25 }, successRate: 0.8 },
          { id: 'template', name: '模板套用', icon: '📋', description: '用现成模板', cost: { energy: 5 }, reward: { exp: 10 }, successRate: 0.95 }
        ]
      },
      { id: 'listing_create', name: '上架商品', phase: 2, description: '商品上架策略',
        choices: [
          { id: 'few', name: '精选少量', icon: '💎', description: '只上精品', cost: { energy: 10 }, reward: { trust: 8, exp: 18 } },
          { id: 'many', name: '铺货策略', icon: '📦', description: '大量铺货', cost: { energy: 15 }, reward: { reach: 200, exp: 20 } },
          { id: 'test', name: '测款上新', icon: '🧪', description: '边测试边上', cost: { energy: 12 }, reward: { marketing: 2, exp: 22 } }
        ]
      },
      { id: 'first_order', name: '首单策略', phase: 2, description: '如何获得第一单？',
        choices: [
          { id: 'low_price', name: '亏本引流', icon: '💰', description: '超低价吸引', cost: { energy: 8, cash: 50 }, reward: { orders: 3, exp: 15 }, successRate: 0.85 },
          { id: 'friend', name: '找朋友下单', icon: '👥', description: '朋友帮忙', cost: { energy: 5 }, reward: { orders: 1, exp: 10 }, successRate: 0.95 },
          { id: 'ad', name: '付费推广', icon: '📢', description: '开直通车', cost: { energy: 10, cash: 100 }, reward: { orders: 2, reach: 300, exp: 20 }, successRate: 0.6 }
        ]
      }
    ],
    promotion_exec: [
      { id: 'shop_promotion', name: '店铺推广', phase: 3, description: '选择推广渠道',
        isPromotion: true,
        choices: [
          { id: 'douyin_ad', name: '抖音带货', icon: '🎵', description: '发短视频推广商品', cost: { energy: 12 }, reward: { reach: 800, orders: 3, exp: 22 }, successRate: 0.6, channelId: 'douyin' },
          { id: 'xiaohongshu_plant', name: '小红书种草', icon: '📕', description: '发布商品种草笔记', cost: { energy: 10 }, reward: { reach: 500, orders: 2, exp: 18 }, successRate: 0.7, channelId: 'xiaohongshu' },
          { id: 'wechat_share', name: '微信群推广', icon: '👥', description: '在购物群发布', cost: { energy: 8 }, reward: { reach: 250, orders: 1, trust: 5, exp: 15 }, successRate: 0.8, channelId: 'wechat_group' }
        ]
      },
      { id: 'daily_operation', name: '日常运营', phase: 3, description: '今天做什么？',
        choices: [
          { id: 'optimize', name: '优化标题', icon: '✍️', description: '优化商品标题', cost: { energy: 10 }, reward: { reach: 100, exp: 15 } },
          { id: 'customer', name: '处理客服', icon: '💬', description: '回复客户咨询', cost: { energy: 8 }, reward: { trust: 8, exp: 12 } },
          { id: 'new_product', name: '上新产品', icon: '🆕', description: '上架新商品', cost: { energy: 12 }, reward: { reach: 150, exp: 18 } }
        ]
      },
      { id: 'traffic_boost', name: '引流推广', phase: 3, description: '如何增加流量？',
        choices: [
          { id: 'seo', name: '自然搜索', icon: '🔍', description: '优化搜索排名', cost: { energy: 12 }, reward: { reach: 200, exp: 20 }, successRate: 0.7 },
          { id: 'paid', name: '付费广告', icon: '💰', description: '开广告投放', cost: { energy: 8, cash: 200 }, reward: { reach: 500, orders: 2, exp: 15 }, successRate: 0.65 },
          { id: 'content', name: '内容带货', icon: '📱', description: '发短视频带货', cost: { energy: 15 }, reward: { reach: 400, trust: 5, exp: 25 }, successRate: 0.5 }
        ]
      },
      { id: 'order_handle', name: '订单处理', phase: 3, description: '有订单了！',
        choices: [
          { id: 'fast', name: '极速发货', icon: '🚀', description: '立即下单发货', cost: { energy: 8 }, reward: { trust: 10, exp: 15 }, successRate: 0.85 },
          { id: 'check', name: '仔细核对', icon: '🔍', description: '核对后再发', cost: { energy: 10 }, reward: { trust: 12, exp: 18 }, successRate: 0.9 },
          { id: 'batch', name: '批量处理', icon: '📦', description: '积累一起发', cost: { energy: 6 }, reward: { exp: 12 }, successRate: 0.8 }
        ]
      }
    ],
    community_ops: [
      { id: 'review_manage', name: '评价管理', phase: 4, description: '如何获得好评？',
        choices: [
          { id: 'gift', name: '好评返现', icon: '💵', description: '给好评返现', cost: { energy: 5, cash: 20 }, reward: { trust: 10, exp: 12 } },
          { id: 'followup', name: '主动回访', icon: '📞', description: '询问使用体验', cost: { energy: 8 }, reward: { trust: 8, engagement: 5, exp: 15 } },
          { id: 'quality', name: '品质保障', icon: '✅', description: '靠品质赢口碑', cost: { energy: 10 }, reward: { trust: 15, exp: 18 } }
        ]
      },
      { id: 'bad_review', name: '差评处理', phase: 4, description: '收到差评了',
        choices: [
          { id: 'refund', name: '退款道歉', icon: '🙏', description: '全额退款', cost: { energy: 8, cash: 50 }, reward: { trust: 8, exp: 15 }, successRate: 0.85 },
          { id: 'negotiate', name: '协商解决', icon: '💬', description: '沟通修改评价', cost: { energy: 12 }, reward: { trust: 5, exp: 18 }, successRate: 0.6 },
          { id: 'improve', name: '改进产品', icon: '🔧', description: '根据反馈改进', cost: { energy: 15 }, reward: { trust: 12, exp: 22 }, successRate: 0.75 }
        ]
      },
      { id: 'repeat_customer', name: '复购营销', phase: 4, description: '如何让客户复购？',
        choices: [
          { id: 'coupon', name: '发优惠券', icon: '🎫', description: '发放复购券', cost: { energy: 5, cash: 30 }, reward: { orders: 2, exp: 12 } },
          { id: 'member', name: '会员体系', icon: '⭐', description: '建立会员制度', cost: { energy: 12 }, reward: { trust: 10, retention: 10, exp: 20 } },
          { id: 'new_product', name: '上新通知', icon: '🔔', description: '新品优先通知', cost: { energy: 8 }, reward: { engagement: 8, exp: 15 } }
        ]
      }
    ],
    conversion: [
      { id: 'profit_optimize', name: '利润优化', phase: 5, description: '如何提升利润？',
        choices: [
          { id: 'negotiate', name: '谈供应商', icon: '🤝', description: '争取更低进价', cost: { energy: 12 }, reward: { cash: 300, exp: 22 }, successRate: 0.7 },
          { id: 'bundle', name: '组合销售', icon: '📦', description: '打包提客单价', cost: { energy: 8 }, reward: { orders: 2, cash: 200, exp: 18 } },
          { id: 'premium', name: '高端产品', icon: '👑', description: '增加高利润品', cost: { energy: 15 }, reward: { cash: 500, trust: 5, exp: 28 }, successRate: 0.6 }
        ]
      },
      { id: 'scale_store', name: '店铺扩张', phase: 5, description: '如何扩大规模？',
        choices: [
          { id: 'more_sku', name: '扩充品类', icon: '📈', description: '增加商品种类', cost: { energy: 15 }, reward: { reach: 300, exp: 25 } },
          { id: 'more_store', name: '多店运营', icon: '🏪', description: '开设分店', cost: { energy: 20, cash: 200 }, reward: { reach: 500, exp: 35 }, successRate: 0.65 },
          { id: 'brand', name: '自建品牌', icon: '🏷️', description: '打造自有品牌', cost: { energy: 18, cash: 500 }, reward: { trust: 20, exp: 40 }, successRate: 0.5 }
        ]
      },
      { id: 'automation', name: '效率提升', phase: 5, description: '提高运营效率',
        choices: [
          { id: 'tools', name: '工具辅助', icon: '🛠️', description: '使用ERP工具', cost: { energy: 10, cash: 100 }, reward: { exp: 25 } },
          { id: 'outsource', name: '外包客服', icon: '👥', description: '找人帮忙客服', cost: { energy: 5, cash: 300 }, reward: { exp: 20 } },
          { id: 'focus', name: '聚焦爆款', icon: '🎯', description: '集中资源做爆款', cost: { energy: 12 }, reward: { orders: 5, cash: 400, exp: 28 }, successRate: 0.7 }
        ]
      }
    ]
  },

  // 线上资料笔记售卖
  notes_selling: {
    market_research: [
      { id: 'niche_research', name: '资料赛道调研', phase: 1, description: '调研哪类资料最有市场需求',
        choices: [
          { id: 'exam', name: '考试资料', icon: '📝', description: '考研/考公/考证试题笔记', cost: { energy: 10 }, reward: { exp: 25, marketing: 2 }, successRate: 0.85 },
          { id: 'money', name: '赚钱方法', icon: '💰', description: '副业/理财/创业方法合集', cost: { energy: 12 }, reward: { exp: 30, reach: 200 }, successRate: 0.8 },
          { id: 'parenting', name: '育儿教育', icon: '👶', description: '育儿技巧/早教资料/亲子教育', cost: { energy: 10 }, reward: { exp: 25, trust: 5 }, successRate: 0.85 },
          { id: 'multi', name: '多品类布局', icon: '🌐', description: '同时覆盖多个热门品类', cost: { energy: 18 }, reward: { exp: 35, marketing: 3, reach: 300 }, successRate: 0.65 }
        ]
      },
      { id: 'source_collection', name: '资料来源', phase: 1, description: '从哪里收集整理资料？',
        choices: [
          { id: 'free', name: '免费资源整合', icon: '🔍', description: '整理网上免费公开资料', cost: { energy: 12 }, reward: { exp: 20 }, successRate: 0.9 },
          { id: 'original', name: '原创整理', icon: '✍️', description: '自己总结提炼原创笔记', cost: { energy: 20 }, reward: { trust: 15, exp: 35, creativity: 3 }, successRate: 0.75 },
          { id: 'purchase', name: '付费资料再加工', icon: '📦', description: '购买优质资料二次整理', cost: { energy: 15, cash: 100 }, reward: { exp: 25, trust: 8 }, successRate: 0.8 }
        ]
      },
      { id: 'format_design', name: '资料包装', phase: 1, description: '选择资料呈现方式',
        choices: [
          { id: 'pdf', name: 'PDF精排', icon: '📄', description: '精美排版的PDF文档', cost: { energy: 12 }, reward: { trust: 10, exp: 20 }, successRate: 0.85 },
          { id: 'notion', name: 'Notion模板', icon: '📋', description: '可编辑的Notion笔记模板', cost: { energy: 15 }, reward: { trust: 12, creativity: 2, exp: 25 }, successRate: 0.75 },
          { id: 'package', name: '资料大礼包', icon: '🎁', description: '多种格式打包（PDF+思维导图+表格）', cost: { energy: 18 }, reward: { trust: 15, exp: 30, reach: 100 }, successRate: 0.7 }
        ]
      }
    ],
    promotion_prep: [
      { id: 'sample_create', name: '制作样品', phase: 2, description: '制作第一份资料产品',
        choices: [
          { id: 'mini', name: '免费试读版', icon: '🆓', description: '做一份精华试读引流', cost: { energy: 10 }, reward: { reach: 300, exp: 15 }, successRate: 0.85 },
          { id: 'full', name: '完整资料包', icon: '📚', description: '直接做完整版上架', cost: { energy: 18 }, reward: { trust: 10, exp: 30 }, successRate: 0.75 },
          { id: 'series', name: '系列资料', icon: '📖', description: '规划系列产品线', cost: { energy: 15 }, reward: { trust: 8, marketing: 2, exp: 25 }, successRate: 0.8 }
        ]
      },
      { id: 'pricing', name: '定价策略', phase: 2, description: '资料如何定价？',
        choices: [
          { id: 'low', name: '低价走量 (9.9元)', icon: '💰', description: '9.9元吸引大量购买', cost: { energy: 8 }, reward: { members: 5, exp: 15 }, successRate: 0.85 },
          { id: 'mid', name: '中等定价 (29.9元)', icon: '⚖️', description: '性价比路线', cost: { energy: 8 }, reward: { trust: 5, exp: 18 }, successRate: 0.8 },
          { id: 'premium', name: '高端定价 (99元+)', icon: '👑', description: '高端精品路线，含更新服务', cost: { energy: 10 }, reward: { trust: 10, exp: 22 }, successRate: 0.7 }
        ]
      },
      { id: 'channel_setup', name: '渠道开通', phase: 2, description: '在哪里售卖资料？',
        choices: [
          { id: 'xianyu', name: '闲鱼上架', icon: '🐟', description: '闲鱼虚拟商品', cost: { energy: 8 }, reward: { reach: 200, exp: 15 }, successRate: 0.9 },
          { id: 'taobao', name: '淘宝虚拟店', icon: '🛒', description: '开淘宝虚拟商品店', cost: { energy: 12 }, reward: { reach: 300, exp: 20 }, successRate: 0.8 },
          { id: 'wechat', name: '公众号+社群', icon: '💬', description: '公众号引流+微信群成交', cost: { energy: 15 }, reward: { trust: 10, reach: 150, exp: 22 }, successRate: 0.75 }
        ]
      }
    ],
    promotion_exec: [
      { id: 'content_marketing', name: '内容引流', phase: 3, description: '发布引流内容吸引买家',
        isPromotion: true,
        choices: [
          { id: 'xiaohongshu', name: '小红书种草', icon: '📕', description: '发资料干货笔记引流', cost: { energy: 10 }, reward: { reach: 600, members: 5, exp: 20 }, successRate: 0.75, channelId: 'xiaohongshu' },
          { id: 'douyin', name: '抖音短视频', icon: '🎵', description: '拍资料展示短视频', cost: { energy: 15 }, reward: { reach: 1000, members: 8, exp: 25 }, successRate: 0.6, channelId: 'douyin' },
          { id: 'zhihu', name: '知乎回答', icon: '📚', description: '回答相关问题植入推广', cost: { energy: 12 }, reward: { reach: 400, trust: 8, members: 3, exp: 22 }, successRate: 0.7, channelId: 'wechat_group' }
        ]
      },
      { id: 'free_value', name: '免费价值输出', phase: 3, description: '用免费内容吸引付费用户',
        choices: [
          { id: 'share', name: '分享干货片段', icon: '📝', description: '发布资料精华片段', cost: { energy: 8 }, reward: { reach: 300, trust: 5, exp: 15 }, successRate: 0.8 },
          { id: 'guide', name: '发布使用指南', icon: '📖', description: '教别人怎么用好这些资料', cost: { energy: 12 }, reward: { trust: 10, engagement: 8, exp: 20 }, successRate: 0.75 },
          { id: 'community', name: '建免费交流群', icon: '👥', description: '拉群交流顺便推广', cost: { energy: 10 }, reward: { members: 5, engagement: 10, exp: 18 }, successRate: 0.7 }
        ]
      },
      { id: 'customer_acquire', name: '客户转化', phase: 3, description: '有人咨询了，如何成交？',
        choices: [
          { id: 'sample', name: '发试读样品', icon: '🎁', description: '先看再买建立信任', cost: { energy: 8 }, reward: { trust: 10, orders: 2, exp: 15 }, successRate: 0.8 },
          { id: 'testimonial', name: '展示好评', icon: '⭐', description: '给Ta看其他人的评价', cost: { energy: 5 }, reward: { trust: 8, orders: 1, exp: 12 }, successRate: 0.75 },
          { id: 'bundle', name: '打包优惠', icon: '📦', description: '多份打包优惠价', cost: { energy: 10 }, reward: { cash: 200, orders: 3, exp: 20 }, successRate: 0.7 }
        ]
      },
      { id: 'update_content', name: '资料更新', phase: 3, description: '保持资料内容新鲜',
        choices: [
          { id: 'regular', name: '定期更新', icon: '🔄', description: '每月更新一次内容', cost: { energy: 12 }, reward: { trust: 12, exp: 18 }, successRate: 0.85 },
          { id: 'hot', name: '追热点更新', icon: '🔥', description: '根据热点及时补充', cost: { energy: 15 }, reward: { reach: 200, exp: 22 }, successRate: 0.7 },
          { id: 'user_feedback', name: '按需更新', icon: '💬', description: '根据用户反馈补充', cost: { energy: 10 }, reward: { trust: 15, engagement: 8, exp: 20 }, successRate: 0.8 }
        ]
      }
    ],
    community_ops: [
      { id: 'buyer_group', name: '买家社群', phase: 4, description: '如何运营买家群？',
        choices: [
          { id: 'exclusive', name: '专属更新群', icon: '🔒', description: '买家进群享持续更新', cost: { energy: 10 }, reward: { trust: 15, engagement: 10, exp: 20 } },
          { id: 'exchange', name: '资源交换群', icon: '🔄', description: '大家互相分享资源', cost: { energy: 8 }, reward: { engagement: 15, members: 3, exp: 15 } },
          { id: 'vip', name: 'VIP会员群', icon: '👑', description: '付费VIP享所有资料', cost: { energy: 12 }, reward: { trust: 10, cash: 100, exp: 22 } }
        ]
      },
      { id: 'handle_complaint', name: '处理售后', phase: 4, description: '有人觉得资料不值',
        choices: [
          { id: 'refund', name: '无条件退款', icon: '💸', description: '快速退款维护口碑', cost: { energy: 5, cash: -30 }, reward: { trust: 5, exp: 10 }, successRate: 0.9 },
          { id: 'supplement', name: '补充更多资料', icon: '📚', description: '额外赠送资料', cost: { energy: 12 }, reward: { trust: 12, exp: 18 }, successRate: 0.8 },
          { id: 'explain', name: '解释价值', icon: '💬', description: '耐心讲解资料价值', cost: { energy: 10 }, reward: { trust: 8, exp: 15 }, successRate: 0.6 }
        ]
      },
      { id: 'referral_program', name: '转介绍计划', phase: 4, description: '让老客户帮你推荐',
        choices: [
          { id: 'discount', name: '推荐返现', icon: '💰', description: '推荐1人返5元', cost: { energy: 8, cash: 50 }, reward: { members: 5, exp: 18 } },
          { id: 'free_gift', name: '推荐送资料', icon: '🎁', description: '推荐成功送独家资料', cost: { energy: 10 }, reward: { members: 3, trust: 8, exp: 15 } },
          { id: 'affiliate', name: '分销模式', icon: '🔗', description: '让客户成为分销员', cost: { energy: 15 }, reward: { members: 8, reach: 300, exp: 25 }, successRate: 0.6 }
        ]
      }
    ],
    conversion: [
      { id: 'product_line', name: '产品线扩展', phase: 5, description: '扩展资料品类',
        choices: [
          { id: 'new_niche', name: '开拓新品类', icon: '🆕', description: '进入新的资料领域', cost: { energy: 15 }, reward: { reach: 300, exp: 25 }, successRate: 0.7 },
          { id: 'deep_dive', name: '深耕细分', icon: '🎯', description: '在细分领域做到极致', cost: { energy: 12 }, reward: { trust: 15, exp: 22 }, successRate: 0.85 },
          { id: 'subscription', name: '订阅制服务', icon: '📅', description: '按月订阅持续更新', cost: { energy: 18 }, reward: { cash: 500, trust: 10, exp: 35 }, successRate: 0.6 }
        ]
      },
      { id: 'automation', name: '自动化发货', phase: 5, description: '提高运营效率',
        choices: [
          { id: 'auto_reply', name: '自动回复+发货', icon: '🤖', description: '设置自动化流程', cost: { energy: 10, cash: 50 }, reward: { exp: 25 }, successRate: 0.85 },
          { id: 'platform', name: '知识付费平台', icon: '🌐', description: '上架知识付费平台自动售卖', cost: { energy: 12 }, reward: { reach: 400, exp: 28 }, successRate: 0.75 },
          { id: 'mini_program', name: '小程序商城', icon: '📱', description: '开发资料售卖小程序', cost: { energy: 20, cash: 300 }, reward: { reach: 500, trust: 10, exp: 35 }, successRate: 0.6 }
        ]
      },
      { id: 'brand_build', name: '品牌打造', phase: 5, description: '建立资料品牌',
        choices: [
          { id: 'ip', name: '打造个人IP', icon: '👤', description: '成为领域知名整理达人', cost: { energy: 15 }, reward: { reach: 400, trust: 20, exp: 30 }, successRate: 0.55 },
          { id: 'team', name: '组建团队', icon: '👥', description: '招人帮忙整理更多资料', cost: { energy: 10, cash: 500 }, reward: { reach: 300, exp: 28 }, successRate: 0.75 },
          { id: 'course', name: '开设教程', icon: '🎓', description: '教别人也做资料售卖', cost: { energy: 18 }, reward: { cash: 1000, trust: 15, exp: 40 }, successRate: 0.5 }
        ]
      }
    ]
  },

  // 街头角色扮演活动
  street_rpg: {
    market_research: [
      { id: 'theme_research', name: '主题调研', phase: 1, description: '调研什么类型的RPG最受欢迎',
        choices: [
          { id: 'fantasy', name: '奇幻冒险', icon: '⚔️', description: '中世纪/魔法风格冒险剧情', cost: { energy: 10 }, reward: { exp: 25, creativity: 3 }, successRate: 0.85 },
          { id: 'mystery', name: '悬疑推理', icon: '🔍', description: '城市探案/密室逃脱类', cost: { energy: 12 }, reward: { exp: 30, trust: 5 }, successRate: 0.8 },
          { id: 'romance', name: '古风恋爱', icon: '🌸', description: '古装/校园恋爱剧情', cost: { energy: 10 }, reward: { exp: 25, reach: 200 }, successRate: 0.8 },
          { id: 'zombie', name: '末日生存', icon: '🧟', description: '丧尸/废土生存大逃杀', cost: { energy: 15 }, reward: { exp: 35, reach: 300, creativity: 2 }, successRate: 0.7 }
        ]
      },
      { id: 'location_scout', name: '选址踩点', phase: 1, description: '寻找适合举办活动的场地',
        choices: [
          { id: 'park', name: '城市公园', icon: '🌳', description: '免费开放空间，人流量大', cost: { energy: 12 }, reward: { exp: 20, reach: 200 }, successRate: 0.9 },
          { id: 'street', name: '商业步行街', icon: '🏙️', description: '人流密集但需沟通管理', cost: { energy: 15 }, reward: { exp: 25, reach: 400 }, successRate: 0.7 },
          { id: 'campus', name: '大学校园', icon: '🎓', description: '年轻人聚集，容易传播', cost: { energy: 10 }, reward: { exp: 20, members: 5 }, successRate: 0.85 }
        ]
      },
      { id: 'script_design', name: '剧本设计', phase: 1, description: '设计角色扮演的核心剧情',
        choices: [
          { id: 'simple', name: '轻量入门本', icon: '📖', description: '30分钟简单体验，新手友好', cost: { energy: 10 }, reward: { exp: 15, trust: 5 }, successRate: 0.9 },
          { id: 'standard', name: '标准剧情本', icon: '📚', description: '1-2小时沉浸式剧情', cost: { energy: 18 }, reward: { exp: 30, trust: 10, creativity: 3 }, successRate: 0.75 },
          { id: 'epic', name: '史诗级大作', icon: '🏰', description: '半天大型多线剧情', cost: { energy: 25 }, reward: { exp: 40, trust: 15, creativity: 5, reach: 200 }, successRate: 0.55 }
        ]
      }
    ],
    promotion_prep: [
      { id: 'recruit_npc', name: '招募NPC', phase: 2, description: '招募志愿者扮演NPC角色',
        choices: [
          { id: 'friends', name: '朋友帮忙', icon: '👫', description: '找朋友免费客串', cost: { energy: 8 }, reward: { exp: 10 }, successRate: 0.9 },
          { id: 'volunteers', name: '招募志愿者', icon: '📢', description: '在社交平台招募', cost: { energy: 12 }, reward: { members: 5, exp: 20 }, successRate: 0.75 },
          { id: 'cosplayer', name: '邀请Coser', icon: '🎭', description: '邀请Cosplay爱好者参与', cost: { energy: 15, cash: 100 }, reward: { reach: 300, trust: 8, exp: 25 }, successRate: 0.7 }
        ]
      },
      { id: 'props_prepare', name: '道具准备', phase: 2, description: '准备活动所需的道具装备',
        choices: [
          { id: 'diy', name: 'DIY手工道具', icon: '✂️', description: '自己动手做，省钱', cost: { energy: 15 }, reward: { creativity: 3, exp: 18 }, successRate: 0.8 },
          { id: 'rent', name: '租借道具服装', icon: '👗', description: '租赁专业道具', cost: { energy: 8, cash: 200 }, reward: { trust: 10, exp: 15 }, successRate: 0.9 },
          { id: 'sponsor', name: '找赞助商提供', icon: '🤝', description: '联系商家赞助道具', cost: { energy: 18 }, reward: { cash: 100, exp: 25 }, successRate: 0.5 }
        ]
      },
      { id: 'pricing_model', name: '定价模式', phase: 2, description: '如何收费？',
        choices: [
          { id: 'free_trial', name: '首次免费体验', icon: '🆓', description: '首场免费吸引人气', cost: { energy: 8 }, reward: { reach: 400, members: 8, exp: 15 }, successRate: 0.85 },
          { id: 'ticket', name: '门票制 (39-99元)', icon: '🎫', description: '按人收门票费', cost: { energy: 8 }, reward: { exp: 18 }, successRate: 0.8 },
          { id: 'vip', name: 'VIP包场定制', icon: '👑', description: '企业/团体包场定制剧情', cost: { energy: 12 }, reward: { trust: 10, exp: 22 }, successRate: 0.65 }
        ]
      }
    ],
    promotion_exec: [
      { id: 'event_promote', name: '活动宣传', phase: 3, description: '宣传你的RPG活动',
        isPromotion: true,
        choices: [
          { id: 'douyin', name: '抖音短视频', icon: '🎵', description: '拍活动精彩片段', cost: { energy: 12 }, reward: { reach: 1000, members: 10, exp: 25 }, successRate: 0.65, channelId: 'douyin' },
          { id: 'xiaohongshu', name: '小红书图文', icon: '📕', description: '发活动体验帖', cost: { energy: 10 }, reward: { reach: 600, members: 5, exp: 20 }, successRate: 0.75, channelId: 'xiaohongshu' },
          { id: 'local', name: '本地社群推广', icon: '📍', description: '在本地生活群宣传', cost: { energy: 8 }, reward: { reach: 300, members: 8, exp: 15 }, successRate: 0.8, channelId: 'wechat_group' }
        ]
      },
      { id: 'run_event', name: '举办活动', phase: 3, description: '今天开展RPG活动！',
        choices: [
          { id: 'small', name: '小型场 (10人)', icon: '🎲', description: '小团体精品体验', cost: { energy: 15 }, reward: { cash: 300, trust: 8, exp: 20 }, successRate: 0.85 },
          { id: 'medium', name: '中型场 (30人)', icon: '🎭', description: '多线剧情同时进行', cost: { energy: 22 }, reward: { cash: 800, trust: 10, exp: 30 }, successRate: 0.7 },
          { id: 'large', name: '大型场 (50人+)', icon: '🏟️', description: '大型户外RPG盛会', cost: { energy: 30, cash: 200 }, reward: { cash: 2000, reach: 500, trust: 15, exp: 40 }, successRate: 0.5 }
        ]
      },
      { id: 'player_experience', name: '玩家体验', phase: 3, description: '如何提升玩家体验？',
        choices: [
          { id: 'photo', name: '提供拍照服务', icon: '📸', description: '帮玩家拍精美照片', cost: { energy: 10 }, reward: { trust: 10, reach: 200, exp: 15 }, successRate: 0.85 },
          { id: 'reward', name: '设置通关奖励', icon: '🏆', description: '完成剧情有实物奖品', cost: { energy: 8, cash: 100 }, reward: { trust: 12, engagement: 10, exp: 18 }, successRate: 0.8 },
          { id: 'immersive', name: '增强沉浸感', icon: '🎶', description: '加音乐/灯光/烟雾效果', cost: { energy: 12, cash: 150 }, reward: { trust: 15, creativity: 3, exp: 25 }, successRate: 0.7 }
        ]
      }
    ],
    community_ops: [
      { id: 'player_club', name: '玩家俱乐部', phase: 4, description: '建立忠实玩家社群',
        choices: [
          { id: 'wechat', name: '微信粉丝群', icon: '💬', description: '拉群交流预约', cost: { energy: 8 }, reward: { members: 5, engagement: 10, exp: 15 } },
          { id: 'ranking', name: '玩家排行榜', icon: '🏅', description: '设立积分排名系统', cost: { energy: 12 }, reward: { engagement: 15, trust: 8, exp: 20 } },
          { id: 'story_vote', name: '剧情投票', icon: '🗳️', description: '让玩家投票决定下期剧情', cost: { energy: 10 }, reward: { engagement: 20, trust: 10, exp: 18 } }
        ]
      },
      { id: 'handle_issues', name: '处理突发', phase: 4, description: '活动中遇到意外情况',
        choices: [
          { id: 'weather', name: '天气应急方案', icon: '🌧️', description: '准备室内备选方案', cost: { energy: 10 }, reward: { trust: 10, exp: 15 }, successRate: 0.85 },
          { id: 'dispute', name: '调解玩家纠纷', icon: '⚖️', description: '公平处理规则争议', cost: { energy: 12 }, reward: { trust: 12, exp: 18 }, successRate: 0.7 },
          { id: 'safety', name: '安全保障', icon: '🛡️', description: '确保活动安全有序', cost: { energy: 8 }, reward: { trust: 15, exp: 12 }, successRate: 0.9 }
        ]
      }
    ],
    conversion: [
      { id: 'revenue_expand', name: '收入拓展', phase: 5, description: '拓展更多收入来源',
        choices: [
          { id: 'merch', name: '周边商品', icon: '🎁', description: '卖角色/道具周边', cost: { energy: 12, cash: 200 }, reward: { cash: 600, exp: 25 }, successRate: 0.7 },
          { id: 'sponsor', name: '品牌赞助', icon: '💼', description: '拉商家冠名赞助', cost: { energy: 15 }, reward: { cash: 1500, exp: 30 }, successRate: 0.5 },
          { id: 'franchise', name: '加盟授权', icon: '🔗', description: '授权他人运营分场', cost: { energy: 18 }, reward: { cash: 2000, reach: 500, exp: 40 }, successRate: 0.45 }
        ]
      },
      { id: 'scale_events', name: '活动升级', phase: 5, description: '如何做大做强？',
        choices: [
          { id: 'theme_park', name: '主题乐园化', icon: '🎢', description: '打造固定沉浸式场地', cost: { energy: 20, cash: 1000 }, reward: { reach: 800, trust: 20, exp: 45 }, successRate: 0.4 },
          { id: 'online', name: '线上线下联动', icon: '🌐', description: '线上预热+线下体验', cost: { energy: 15 }, reward: { reach: 600, members: 10, exp: 30 }, successRate: 0.65 },
          { id: 'city_tour', name: '城市巡回', icon: '🚌', description: '去其他城市办活动', cost: { energy: 25, cash: 500 }, reward: { reach: 1000, cash: 1500, exp: 40 }, successRate: 0.55 }
        ]
      }
    ]
  },

  // 移动休息室广告车
  vehicle_lounge: {
    market_research: [
      { id: 'location_research', name: '选址调研', phase: 1, description: '调研最佳停靠位置',
        choices: [
          { id: 'office', name: '写字楼商圈', icon: '🏢', description: '白领午休需求大', cost: { energy: 12 }, reward: { exp: 25, marketing: 3 }, successRate: 0.85 },
          { id: 'scenic', name: '景区/步行街', icon: '🏖️', description: '游客和逛街人群多', cost: { energy: 10 }, reward: { exp: 20, reach: 200 }, successRate: 0.8 },
          { id: 'event', name: '展会/赛事场外', icon: '🎪', description: '大型活动人流爆发', cost: { energy: 15 }, reward: { exp: 30, reach: 400 }, successRate: 0.7 },
          { id: 'campus', name: '大学城周边', icon: '🎓', description: '学生群体高频需求', cost: { energy: 10 }, reward: { exp: 20, members: 5 }, successRate: 0.85 }
        ]
      },
      { id: 'vehicle_select', name: '车辆选型', phase: 1, description: '选择合适的车辆类型',
        choices: [
          { id: 'van', name: '面包车改装', icon: '🚐', description: '成本低，空间够用', cost: { energy: 10, cash: 300 }, reward: { exp: 15 }, successRate: 0.9 },
          { id: 'rv', name: '房车租赁', icon: '🏕️', description: '空间大体验好，租金高', cost: { energy: 8, cash: 800 }, reward: { trust: 10, exp: 20 }, successRate: 0.85 },
          { id: 'bus', name: '大巴改装', icon: '🚌', description: '超大空间可容纳更多人', cost: { energy: 15, cash: 1500 }, reward: { trust: 15, reach: 300, exp: 30 }, successRate: 0.65 }
        ]
      },
      { id: 'service_design', name: '服务设计', phase: 1, description: '车内提供什么服务？',
        choices: [
          { id: 'rest', name: '纯休息空间', icon: '😴', description: '舒适座椅+空调+WiFi', cost: { energy: 8 }, reward: { trust: 10, exp: 15 }, successRate: 0.9 },
          { id: 'cafe', name: '休息+饮品', icon: '☕', description: '提供免费饮品增加停留', cost: { energy: 12, cash: 100 }, reward: { trust: 15, engagement: 8, exp: 20 }, successRate: 0.8 },
          { id: 'entertainment', name: '休息+娱乐体验', icon: '🎮', description: '加按摩椅/游戏/VR', cost: { energy: 15, cash: 300 }, reward: { trust: 18, engagement: 15, reach: 200, exp: 28 }, successRate: 0.7 }
        ]
      }
    ],
    promotion_prep: [
      { id: 'interior_setup', name: '车内布置', phase: 2, description: '装修车内环境',
        choices: [
          { id: 'simple', name: '简洁舒适', icon: '🛋️', description: '基础装饰，干净整洁', cost: { energy: 10 }, reward: { trust: 5, exp: 12 }, successRate: 0.9 },
          { id: 'themed', name: '主题装饰', icon: '🎨', description: '打造特定主题风格', cost: { energy: 15, cash: 200 }, reward: { trust: 12, creativity: 3, exp: 20 }, successRate: 0.8 },
          { id: 'luxury', name: '豪华体验', icon: '✨', description: '高端氛围感十足', cost: { energy: 18, cash: 500 }, reward: { trust: 18, reach: 200, exp: 28 }, successRate: 0.7 }
        ]
      },
      { id: 'ad_system', name: '广告系统搭建', phase: 2, description: '搭建车内广告播放系统',
        choices: [
          { id: 'screen', name: '安装显示屏', icon: '📺', description: '车内安装广告大屏', cost: { energy: 10, cash: 300 }, reward: { exp: 18 }, successRate: 0.9 },
          { id: 'audio', name: '音频广告', icon: '🔊', description: '背景音乐穿插广告', cost: { energy: 8, cash: 50 }, reward: { exp: 12 }, successRate: 0.85 },
          { id: 'interactive', name: '互动广告', icon: '📱', description: '扫码互动体验式广告', cost: { energy: 15, cash: 200 }, reward: { engagement: 10, exp: 22 }, successRate: 0.75 }
        ]
      },
      { id: 'find_advertisers', name: '寻找广告主', phase: 2, description: '谁来投广告？',
        choices: [
          { id: 'local', name: '本地商家', icon: '🏪', description: '周边餐饮/商铺合作', cost: { energy: 12 }, reward: { cash: 200, exp: 18 }, successRate: 0.8 },
          { id: 'brand', name: '品牌广告', icon: '💼', description: '联系品牌方投放', cost: { energy: 18 }, reward: { cash: 500, exp: 25 }, successRate: 0.5 },
          { id: 'platform', name: '广告平台接单', icon: '🌐', description: '通过广告平台获取订单', cost: { energy: 10 }, reward: { cash: 300, exp: 20 }, successRate: 0.7 }
        ]
      }
    ],
    promotion_exec: [
      { id: 'launch_promote', name: '开业宣传', phase: 3, description: '宣传你的移动休息室',
        isPromotion: true,
        choices: [
          { id: 'douyin', name: '抖音探店风格', icon: '🎵', description: '拍创意视频引关注', cost: { energy: 12 }, reward: { reach: 1000, members: 8, exp: 25 }, successRate: 0.65, channelId: 'douyin' },
          { id: 'local_life', name: '本地生活平台', icon: '📍', description: '美团/大众点评推广', cost: { energy: 10 }, reward: { reach: 500, members: 5, exp: 18 }, successRate: 0.8, channelId: 'xiaohongshu' },
          { id: 'street', name: '现场引导', icon: '🪧', description: '摆放指示牌和横幅', cost: { energy: 8, cash: 50 }, reward: { reach: 300, members: 10, exp: 15 }, successRate: 0.85, channelId: 'wechat_group' }
        ]
      },
      { id: 'daily_ops', name: '日常运营', phase: 3, description: '今天如何运营？',
        choices: [
          { id: 'normal', name: '正常营业', icon: '🚐', description: '按计划停靠运营', cost: { energy: 12 }, reward: { cash: 200, exp: 15 }, successRate: 0.85 },
          { id: 'hotspot', name: '蹭热点地段', icon: '🔥', description: '去人流爆发的地方', cost: { energy: 18 }, reward: { cash: 500, reach: 300, exp: 22 }, successRate: 0.6 },
          { id: 'collab', name: '联合活动', icon: '🤝', description: '和商家搞联合促销', cost: { energy: 15 }, reward: { cash: 400, members: 5, trust: 8, exp: 20 }, successRate: 0.7 }
        ]
      },
      { id: 'sales_strategy', name: '车内销售', phase: 3, description: '在车内销售什么产品？',
        choices: [
          { id: 'drinks', name: '饮品小食', icon: '🧃', description: '卖饮料和小零食', cost: { energy: 8, cash: 80 }, reward: { cash: 250, exp: 12 }, successRate: 0.85 },
          { id: 'merch', name: '特色商品', icon: '🛍️', description: '卖创意商品/文创', cost: { energy: 10, cash: 200 }, reward: { cash: 400, exp: 18 }, successRate: 0.7 },
          { id: 'experience', name: '体验服务', icon: '💆', description: '付费升级体验（按摩/VR）', cost: { energy: 12, cash: 150 }, reward: { cash: 350, trust: 8, exp: 20 }, successRate: 0.75 }
        ]
      }
    ],
    community_ops: [
      { id: 'regular_users', name: '常客运营', phase: 4, description: '培养回头客',
        choices: [
          { id: 'membership', name: '会员卡制度', icon: '💳', description: '办会员享专属服务', cost: { energy: 10 }, reward: { trust: 12, members: 5, exp: 18 } },
          { id: 'feedback', name: '收集反馈', icon: '📋', description: '听取用户建议改进', cost: { energy: 8 }, reward: { trust: 15, exp: 15 } },
          { id: 'referral', name: '推荐有礼', icon: '🎁', description: '老带新享优惠', cost: { energy: 10, cash: 50 }, reward: { members: 8, exp: 18 } }
        ]
      },
      { id: 'advertiser_mgmt', name: '广告主维护', phase: 4, description: '维护广告合作关系',
        choices: [
          { id: 'report', name: '提供数据报告', icon: '📊', description: '给广告主看投放数据', cost: { energy: 10 }, reward: { cash: 200, trust: 10, exp: 18 }, successRate: 0.85 },
          { id: 'bundle', name: '打包优惠', icon: '📦', description: '签长期广告合约', cost: { energy: 12 }, reward: { cash: 500, exp: 22 }, successRate: 0.7 },
          { id: 'exclusive', name: '独家冠名', icon: '⭐', description: '车辆冠名合作', cost: { energy: 15 }, reward: { cash: 1000, trust: 12, exp: 28 }, successRate: 0.55 }
        ]
      }
    ],
    conversion: [
      { id: 'fleet_expand', name: '车队扩展', phase: 5, description: '扩大车队规模',
        choices: [
          { id: 'add_vehicle', name: '增加车辆', icon: '🚐', description: '租更多车覆盖更多地点', cost: { energy: 15, cash: 800 }, reward: { reach: 500, exp: 30 }, successRate: 0.7 },
          { id: 'different_type', name: '差异化车型', icon: '🚌', description: '不同主题/功能车辆', cost: { energy: 18, cash: 1000 }, reward: { reach: 400, trust: 15, creativity: 3, exp: 35 }, successRate: 0.6 },
          { id: 'partner', name: '合伙人模式', icon: '🤝', description: '招募合伙人共同运营', cost: { energy: 20 }, reward: { cash: 1000, reach: 600, exp: 35 }, successRate: 0.5 }
        ]
      },
      { id: 'revenue_diversify', name: '收入多元化', phase: 5, description: '拓展盈利渠道',
        choices: [
          { id: 'event_rental', name: '活动出租', icon: '🎪', description: '出租给活动/市集', cost: { energy: 12 }, reward: { cash: 800, exp: 25 }, successRate: 0.75 },
          { id: 'data_sell', name: '人流数据服务', icon: '📈', description: '向商家提供区域人流分析', cost: { energy: 15 }, reward: { cash: 600, trust: 10, exp: 28 }, successRate: 0.6 },
          { id: 'franchise', name: '加盟授权', icon: '🔗', description: '授权他人运营分车队', cost: { energy: 20 }, reward: { cash: 2000, reach: 800, exp: 40 }, successRate: 0.45 }
        ]
      }
    ]
  }
}

// 通用任务模板（用于其他项目）
const DEFAULT_TASKS = OPERATION_TASKS

// 客户消息模板
const CUSTOMER_MESSAGES = {
  inquiry: [
    '这个产品质量怎么样？',
    '有什么优惠吗？',
    '发货快吗？',
    '能便宜点吗？',
    '这个适合送人吗？',
    '有其他颜色/款式吗？',
    '售后怎么处理？',
  ],
  positive: [
    '收到了，质量不错！',
    '物流很快，好评！',
    '比想象中好，会回购的',
    '朋友推荐来的，果然没让我失望',
    '性价比很高，推荐给闺蜜了',
  ],
  negative: [
    '感觉和图片有点差距...',
    '发货有点慢啊',
    '包装能不能仔细点',
    '这个价格感觉有点贵',
  ],
  neutral: [
    '看看有什么新品',
    '等有活动再买',
    '先收藏了',
    '帮朋友问问',
  ]
}

// 市场研究数据模板
const MARKET_INSIGHTS = [
  { topic: '用户痛点', insights: ['价格敏感', '追求品质', '重视售后', '喜欢尝新', '从众心理'] },
  { topic: '消费趋势', insights: ['社交电商崛起', '直播带货火热', '私域流量重要', '内容种草有效', '社群团购增长'] },
  { topic: '竞品策略', insights: ['低价引流', '会员锁客', '爆品策略', '社群裂变', 'KOL合作'] },
  { topic: '用户画像', insights: ['25-40岁女性为主', '二三线城市', '价格敏感但重品质', '社交媒体活跃', '易受朋友影响'] },
]

// 推广内容类型
const CONTENT_TYPES = [
  { id: 'product_intro', name: '产品介绍', icon: '📦', effect: { interest: 10, trust: 5 }, description: '详细介绍产品特点和优势' },
  { id: 'user_story', name: '用户故事', icon: '💭', effect: { interest: 5, trust: 15 }, description: '分享真实用户使用体验' },
  { id: 'discount_info', name: '优惠信息', icon: '🏷️', effect: { interest: 20, trust: 0 }, description: '发布限时优惠活动' },
  { id: 'tutorial', name: '教程攻略', icon: '📖', effect: { interest: 8, trust: 12 }, description: '提供实用教程内容' },
  { id: 'behind_scenes', name: '幕后花絮', icon: '🎬', effect: { interest: 6, trust: 10 }, description: '展示创业幕后故事' },
  { id: 'trending', name: '蹭热点', icon: '🔥', effect: { interest: 25, trust: -2 }, description: '结合热门话题创作' },
]

// 零成本创业项目列表
const STARTUP_PROJECTS = [
  {
    id: 'content',
    name: '自媒体内容创作',
    description: '通过公众号、抖音、小红书等平台创作内容变现',
    initialCost: 0,
    monthlyExpense: 0,
    potentialRevenue: [500, 50000],
    difficulty: 'easy',
    skills: ['写作', '创意', '社交媒体'],
    timeToProfit: '1-3个月',
    icon: '📝'
  },
  {
    id: 'freelance',
    name: '自由职业服务',
    description: '提供设计、编程、翻译、咨询等专业服务',
    initialCost: 0,
    monthlyExpense: 0,
    potentialRevenue: [2000, 30000],
    difficulty: 'medium',
    skills: ['专业技能', '沟通', '时间管理'],
    timeToProfit: '即时',
    icon: '💼'
  },
  {
    id: 'dropshipping',
    name: '无货源电商',
    description: '通过1688、拼多多等平台代发货销售',
    initialCost: 0,
    monthlyExpense: 100,
    potentialRevenue: [1000, 100000],
    difficulty: 'medium',
    skills: ['选品', '营销', '客服'],
    timeToProfit: '1-2个月',
    icon: '🛒'
  },
  {
    id: 'online_course',
    name: '在线教育/知识付费',
    description: '制作并销售在线课程或知识产品',
    initialCost: 0,
    monthlyExpense: 50,
    potentialRevenue: [1000, 200000],
    difficulty: 'hard',
    skills: ['专业知识', '教学', '营销'],
    timeToProfit: '2-6个月',
    icon: '🎓'
  },
  {
    id: 'affiliate',
    name: '联盟营销/带货',
    description: '推广他人产品赚取佣金',
    initialCost: 0,
    monthlyExpense: 0,
    potentialRevenue: [500, 80000],
    difficulty: 'easy',
    skills: ['流量获取', '内容创作', '选品'],
    timeToProfit: '1-2个月',
    icon: '🔗'
  },
  {
    id: 'consulting',
    name: '咨询顾问服务',
    description: '提供商业、技术、营销等领域咨询',
    initialCost: 0,
    monthlyExpense: 0,
    potentialRevenue: [5000, 100000],
    difficulty: 'hard',
    skills: ['行业经验', '分析能力', '沟通'],
    timeToProfit: '即时',
    icon: '🎯'
  },
  {
    id: 'saas',
    name: 'SaaS/工具开发',
    description: '开发并销售软件即服务产品',
    initialCost: 0,
    monthlyExpense: 200,
    potentialRevenue: [0, 500000],
    difficulty: 'hard',
    skills: ['编程', '产品设计', '营销'],
    timeToProfit: '6-12个月',
    icon: '⚡'
  },
  {
    id: 'community',
    name: '付费社群运营',
    description: '创建并运营付费会员社群',
    initialCost: 0,
    monthlyExpense: 50,
    potentialRevenue: [1000, 50000],
    difficulty: 'medium',
    skills: ['社群运营', '内容输出', '人脉'],
    timeToProfit: '2-4个月',
    icon: '👥'
  },
  {
    id: 'group_buying',
    name: '零成本团购运营',
    description: '通过社交平台发起团购，创建社群邀请用户参与，利用AI模拟用户行为优化运营策略',
    initialCost: 0,
    monthlyExpense: 0,
    potentialRevenue: [2000, 150000],
    difficulty: 'medium',
    skills: ['社群运营', '社交媒体', '数据分析'],
    timeToProfit: '1-2个月',
    icon: '🛍️',
    features: [
      '社交平台引流（Facebook、小红书等）',
      '社群活动运营（红包、游戏、互动）',
      'AI模拟用户行为测试转化率',
      '商业数据分析优化运营策略'
    ]
  },
  {
    id: 'notes_selling',
    name: '线上资料笔记售卖',
    description: '收集整理各类实用资料（考试试题、赚钱方法、育儿技巧等），通过闲鱼、小红书、公众号、淘宝虚拟店等渠道售卖电子资料包',
    initialCost: 0,
    monthlyExpense: 30,
    potentialRevenue: [1000, 80000],
    difficulty: 'easy',
    skills: ['信息整理', '文案写作', '多渠道运营'],
    timeToProfit: '1-2个月',
    icon: '📚',
    features: [
      '零成本收集整理网络公开资料',
      '制作精美电子资料包/笔记',
      '多平台分发售卖（闲鱼、淘宝、小红书等）',
      '建立资料更新订阅体系持续变现'
    ]
  },
  {
    id: 'street_rpg',
    name: '街头角色扮演活动',
    description: '在街头组织真人角色扮演游戏活动，参与者付费体验沉浸式剧情，通过门票、道具售卖和品牌赞助盈利',
    initialCost: 0,
    monthlyExpense: 200,
    potentialRevenue: [2000, 120000],
    difficulty: 'medium',
    skills: ['创意策划', '活动组织', '社交媒体'],
    timeToProfit: '1-3个月',
    icon: '🎭',
    features: [
      '设计原创剧情和角色体系',
      '招募玩家和NPC志愿者',
      '街头场景布置与互动环节',
      '短视频传播引爆线下流量'
    ]
  },
  {
    id: 'vehicle_lounge',
    name: '移动休息室广告车',
    description: '租赁车辆改造为免费休息空间，在车内进行产品展示、销售和播放广告，通过广告收入和车内销售盈利',
    initialCost: 0,
    monthlyExpense: 500,
    potentialRevenue: [3000, 150000],
    difficulty: 'hard',
    skills: ['商务谈判', '营销策划', '运营管理'],
    timeToProfit: '2-4个月',
    icon: '🚐',
    features: [
      '租赁/改装车辆为舒适休息室',
      '免费提供休息吸引人流',
      '车内大屏播放广告赚取广告费',
      '车内设置商品展示区进行销售'
    ]
  }
]

// 市场事件
const MARKET_EVENTS = [
  { id: 'ai_boom', name: 'AI技术爆发', effect: { saas: 1.5, consulting: 1.3, online_course: 1.2 }, description: '人工智能技术突破带来新机遇' },
  { id: 'economic_downturn', name: '经济下行压力', effect: { all: 0.8 }, description: '消费者支出减少，市场整体萎缩' },
  { id: 'policy_support', name: '创业政策支持', effect: { all: 1.2 }, description: '政府出台扶持政策，创业环境改善' },
  { id: 'platform_change', name: '平台算法调整', effect: { content: 0.7, affiliate: 0.8 }, description: '主要平台调整推荐算法' },
  { id: 'viral_trend', name: '新消费趋势', effect: { dropshipping: 1.4, content: 1.3, group_buying: 1.5, notes_selling: 1.3, street_rpg: 1.3 }, description: '新的消费热点出现' },
  { id: 'exam_season', name: '考试季来临', effect: { notes_selling: 1.8, online_course: 1.4 }, description: '考试季来临，考试资料需求暴增' },
  { id: 'social_commerce', name: '社交电商热潮', effect: { group_buying: 1.6, community: 1.3, affiliate: 1.2, notes_selling: 1.2, vehicle_lounge: 1.2 }, description: '社交电商模式大热，团购社群活跃' },
  { id: 'competition', name: '竞争加剧', effect: { freelance: 0.85, consulting: 0.9 }, description: '更多人进入市场，竞争加剧' },
  { id: 'outdoor_boom', name: '户外活动热潮', effect: { street_rpg: 1.6, vehicle_lounge: 1.4 }, description: '户外休闲娱乐需求爆发，线下活动火热' },
  { id: 'ad_market_growth', name: '广告市场扩张', effect: { vehicle_lounge: 1.5, content: 1.2, affiliate: 1.1 }, description: '广告主预算增加，线下广告需求旺盛' },
]

// 市场数据（模拟真实市场报告）
const MARKET_DATA = {
  industries: [
    { name: '电子商务', growth: 15.2, size: '12.4万亿', trend: 'up' },
    { name: '在线教育', growth: 22.8, size: '5680亿', trend: 'up' },
    { name: '内容创作', growth: 18.5, size: '3200亿', trend: 'up' },
    { name: 'SaaS服务', growth: 31.2, size: '1890亿', trend: 'up' },
    { name: '自由职业', growth: 12.3, size: '8900亿', trend: 'stable' },
    { name: '社交团购', growth: 28.6, size: '4200亿', trend: 'up' },
    { name: '社群经济', growth: 25.6, size: '420亿', trend: 'up' },
    { name: '数字资料/知识付费', growth: 35.2, size: '1500亿', trend: 'up' },
    { name: '线下沉浸式娱乐', growth: 42.5, size: '980亿', trend: 'up' },
    { name: '移动广告/新零售', growth: 33.8, size: '2100亿', trend: 'up' },
  ],
  consumerConfidence: 68,
  startupSuccessRate: 23,
  averageTimeToProfit: 8,
}

// AI 导师性格和回复模板
const AI_PERSONALITIES = {
  mentor: {
    name: '创业导师 Alex',
    avatar: '🧠',
    style: 'supportive',
    greeting: '欢迎来到创业聊天室！我是你的AI创业导师Alex。有什么创业问题想咨询吗？'
  },
  investor: {
    name: '投资人 Victoria',
    avatar: '💎',
    style: 'analytical',
    greeting: '你好，我是虚拟投资人Victoria。让我来评估一下你的商业计划。'
  },
  founder: {
    name: '连续创业者 David',
    avatar: '🚀',
    style: 'practical',
    greeting: '嘿！我是三次创业的老兵David。有什么实战经验可以分享给你。'
  },
  marketSpecialist: {
    name: '市场专员 Luna',
    avatar: '📊',
    style: 'data-driven',
    greeting: '你好！我是市场专员Luna，专注于数据分析和市场研究。让我用数据帮你找到市场机会！'
  }
}

// 市场专员教学内容
const MARKET_SPECIALIST_TIPS = [
  { id: 'trend_analysis', title: '趋势分析法', content: '通过观察市场增长率和用户行为变化，预测未来3-6个月的市场走向。增长率>15%的赛道值得重点关注！', icon: '📈' },
  { id: 'competitor_research', title: '竞品分析', content: '研究竞争对手的定价、产品特点和用户评价。找到他们的薄弱环节，就是你的机会！', icon: '🔍' },
  { id: 'user_persona', title: '用户画像', content: '明确目标用户的年龄、收入、痛点和消费习惯。精准定位比广撒网效率高10倍！', icon: '👥' },
  { id: 'price_strategy', title: '定价策略', content: '参考市场均价，新手建议低于市场价10-20%切入，等积累口碑后再逐步提价。', icon: '💰' },
  { id: 'timing', title: '时机把握', content: '关注节假日、购物节、季节变化带来的需求波动。提前1个月布局，抢占先机！', icon: '⏰' },
  { id: 'data_source', title: '数据来源', content: '免费数据：百度指数、微信指数、淘宝生意参谋；付费数据：艾瑞咨询、易观分析。', icon: '📚' },
]

// 市场动态消息模板
const MARKET_DYNAMICS = [
  { type: 'trend', messages: [
    '📈 监测到【{industry}】行业本周搜索量上涨{percent}%，建议关注相关机会！',
    '🔥 热点预警：{topic}话题在社交平台爆发，相关内容互动量激增！',
    '📊 数据显示：目标用户活跃时间集中在{time}，建议此时段发布内容。'
  ]},
  { type: 'opportunity', messages: [
    '💡 发现机会：{niche}细分市场竞争度低，但需求稳定增长中！',
    '🎯 精准洞察：{age}岁用户群体对{category}产品需求旺盛，转化率高于平均。',
    '⭐ 蓝海提示：{platform}平台{category}类内容供给不足，现在入场正当时！'
  ]},
  { type: 'warning', messages: [
    '⚠️ 风险提示：{industry}行业竞争加剧，新进入者需差异化定位。',
    '📉 注意：{platform}平台算法调整，建议优化内容策略。',
    '🚨 市场信号：消费者对{category}品类价格敏感度上升，控制成本很重要。'
  ]},
  { type: 'insight', messages: [
    '🧠 深度分析：根据历史数据，{month}月是{category}的销售旺季，提前备货！',
    '📋 用户反馈汇总：{percent}%的顾客最关心{feature}，优化此点可提升转化。',
    '🎓 市场教育：{industry}行业平均获客成本为¥{cost}，你的表现{comparison}。'
  ]}
]

// 实时市场数据模拟
const REALTIME_MARKET_DATA = {
  industries: {
    '电商零售': { baseGrowth: 12, volatility: 3, season: [1.0, 0.9, 0.85, 0.9, 0.95, 1.1, 1.0, 0.95, 1.0, 1.1, 1.3, 1.5] },
    '内容创作': { baseGrowth: 18, volatility: 5, season: [1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.9, 1.0, 1.1, 1.1, 1.0] },
    '在线教育': { baseGrowth: 15, volatility: 4, season: [0.8, 1.2, 1.0, 1.0, 1.0, 0.7, 0.6, 0.7, 1.2, 1.1, 1.0, 0.9] },
    '社交团购': { baseGrowth: 25, volatility: 6, season: [0.9, 1.0, 1.0, 1.0, 1.1, 1.2, 1.0, 1.0, 1.1, 1.2, 1.4, 1.3] },
    '自由职业': { baseGrowth: 10, volatility: 2, season: [1.0, 1.0, 1.1, 1.1, 1.0, 0.9, 0.9, 0.9, 1.1, 1.1, 1.0, 1.0] },
  },
  platforms: {
    '小红书': { users: '2.6亿', avgEngagement: 4.2, bestContent: '种草笔记', peakHours: '20:00-22:00' },
    '抖音': { users: '7亿', avgEngagement: 2.8, bestContent: '短视频', peakHours: '12:00-14:00, 20:00-23:00' },
    '微信': { users: '12亿', avgEngagement: 8.5, bestContent: '私域运营', peakHours: '09:00-10:00, 20:00-21:00' },
    '微博': { users: '5.8亿', avgEngagement: 1.5, bestContent: '话题营销', peakHours: '10:00-12:00, 19:00-21:00' },
  }
}

const useGameStore = create((set, get) => ({
  // 玩家状态
  player: {
    name: '创业者',
    cash: 10000,
    reputation: 50,
    energy: 100,
    skills: {
      marketing: 30,
      technology: 30,
      management: 30,
      creativity: 30,
      networking: 30
    },
    level: 1,
    experience: 0
  },
  
  // 当前项目
  activeProjects: [],
  completedProjects: [],
  
  // 游戏时间（月份）
  gameMonth: 1,
  gameYear: 2026,
  
  // 聊天消息
  messages: [],
  
  // 当前AI角色
  currentAI: 'mentor',
  
  // 市场状态
  marketCondition: 1.0,
  activeEvents: [],
  
  // 可用项目
  availableProjects: STARTUP_PROJECTS,
  
  // 市场数据
  marketData: MARKET_DATA,
  
  // 是否正在打字
  isTyping: false,

  // 游戏是否开始
  gameStarted: false,

  // 新增：成就系统
  unlockedAchievements: [],
  
  // 新增：每日任务
  dailyTasks: [],
  completedDailyTasks: [],
  lastTaskRefresh: null,
  
  // 新增：挑战系统
  currentChallenge: null,
  completedChallenges: 0,
  
  // 新增：竞争对手
  competitors: COMPETITORS,
  competitorRelations: {},
  
  // 新增：投资融资
  totalInvestment: 0,
  equityGiven: 0,
  investors: [],
  
  // 新增：培训中的课程
  activeTraining: null,
  
  // 新增：通知队列
  notifications: [],
  
  // 新增：历史记录
  revenueHistory: [],
  
  // 新增：决策事件
  pendingDecision: null,
  
  // 新增：社群运营模拟
  communityMembers: [],
  communityMetrics: {
    totalMembers: 0,
    activeMembers: 0,
    engagement: 0,
    conversion: 0,
    retention: 0,
    trust: 0,
    todayOrders: 0,
    totalOrders: 0
  },
  operationLog: [],
  
  // 新增：推广模拟
  promotionStats: {
    totalReach: 0,
    totalImpressions: 0,
    followers: 0,
    potentialCustomers: [],
    contentPublished: 0,
    campaignHistory: []
  },

  // 新增：任务驱动运营系统
  currentPhase: 0, // 当前运营阶段 0=未开始 1-5=各阶段
  currentTask: null, // 当前任务
  completedTasks: [], // 已完成任务
  taskQueue: [], // 待处理任务队列
  customerChats: [], // 客户聊天记录
  marketInsights: [], // 已获得的市场洞察
  selectingProject: false, // 是否正在选择项目

  // 市场专员系统
  marketSpecialistActive: false, // 市场专员是否激活
  marketDynamics: [], // 市场动态消息
  learnedTips: [], // 已学习的市场技巧
  marketDataHistory: [], // 市场数据历史记录

  // 贷款系统
  loans: [],
  totalDebt: 0,
  totalLoansTaken: 0,

  // 员工系统
  employees: [],
  totalSalaryCost: 0,

  // 危机事件
  pendingCrisis: null,
  crisisHandled: 0,

  // 游戏评分
  gameScore: 0,

  // 高级内容解锁
  premiumUnlocked: JSON.parse(localStorage.getItem('premiumUnlocked') || 'false'),

  // 初始化游戏
  initGame: (playerName) => {
    set({
      player: {
        ...get().player,
        name: playerName
      },
      gameStarted: true,
      messages: [{
        id: Date.now(),
        type: 'system',
        content: `🎮 欢迎 ${playerName} 进入创业聊天室！`,
        timestamp: new Date()
      }, {
        id: Date.now() + 1,
        type: 'ai',
        sender: AI_PERSONALITIES.mentor,
        content: AI_PERSONALITIES.mentor.greeting,
        timestamp: new Date()
      }]
    })
  },

  // 发送消息
  sendMessage: (content) => {
    const state = get()
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    
    set({ 
      messages: [...state.messages, userMessage],
      isTyping: true
    })
    
    // AI响应
    setTimeout(() => {
      const response = get().generateAIResponse(content)
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        sender: AI_PERSONALITIES[state.currentAI],
        content: response,
        timestamp: new Date()
      }
      set({ 
        messages: [...get().messages, aiMessage],
        isTyping: false
      })
    }, 1000 + Math.random() * 1500)
  },

  // 生成AI响应
  generateAIResponse: (userInput) => {
    const state = get()
    const input = userInput.toLowerCase()
    
    // 命令处理
    if (input.includes('查看项目') || input.includes('项目列表') || input === '项目') {
      // 设置项目选择模式
      set({ selectingProject: true })
      
      let text = `📋 **可启动的零成本创业项目：**\n\n`
      STARTUP_PROJECTS.forEach((p, index) => {
        const diffText = p.difficulty === 'easy' ? '⭐简单' : p.difficulty === 'medium' ? '⭐⭐中等' : '⭐⭐⭐困难'
        text += `**${index + 1}. ${p.icon} ${p.name}**\n`
        text += `   ${diffText} | 预期收入: ¥${p.potentialRevenue[0]}-${p.potentialRevenue[1]}/月\n`
        text += `   ${p.description}\n\n`
      })
      text += `💡 输入数字 **1-${STARTUP_PROJECTS.length}** 选择项目，或输入"启动 [项目名]"`
      return text
    }
    
    // 数字选择项目（优先于任务选择）
    if (state.selectingProject && /^[1-9]$/.test(input.trim())) {
      const projectIndex = parseInt(input.trim()) - 1
      if (projectIndex >= 0 && projectIndex < STARTUP_PROJECTS.length) {
        const project = STARTUP_PROJECTS[projectIndex]
        set({ selectingProject: false })
        get().startProject(project)
        
        // 启动任务驱动运营系统
        const operationResult = get().startProjectOperation(project.id)
        
        if (operationResult) {
          return operationResult.welcome
        }
        
        return `🚀 太棒了！你已经启动了【${project.name}】项目！\n\n` +
          `📊 项目详情：\n` +
          `- 初始成本: ¥${project.initialCost}\n` +
          `- 月度支出: ¥${project.monthlyExpense}\n` +
          `- 预期收入: ¥${project.potentialRevenue[0]}-${project.potentialRevenue[1]}/月\n` +
          `- 所需技能: ${project.skills.join(', ')}\n\n` +
          `💡 输入"任务"查看运营任务！`
      }
    }
    
    if (input.includes('启动')) {
      const projectName = input.replace('启动', '').trim()
      const project = STARTUP_PROJECTS.find(p => 
        p.name.includes(projectName) || projectName.includes(p.name.substring(0, 4))
      )
      if (project) {
        set({ selectingProject: false })
        get().startProject(project)
        
        // 启动任务驱动运营系统
        const operationResult = get().startProjectOperation(project.id)
        
        if (operationResult) {
          return operationResult.welcome
        }
        
        return `🚀 太棒了！你已经启动了【${project.name}】项目！\n\n` +
          `📊 项目详情：\n` +
          `- 初始成本: ¥${project.initialCost}\n` +
          `- 月度支出: ¥${project.monthlyExpense}\n` +
          `- 预期收入: ¥${project.potentialRevenue[0]}-${project.potentialRevenue[1]}/月\n` +
          `- 所需技能: ${project.skills.join(', ')}\n\n` +
          `💡 输入"任务"查看运营任务！`
      }
      return '❌ 未找到该项目，请输入"查看项目"查看可用项目列表。'
    }
    
    // 危机事件决策 - 最高优先级
    if (state.pendingCrisis && /^[1-3]$/.test(input.trim())) {
      const crisisResult = get().handleCrisisChoice(parseInt(input.trim()) - 1)
      if (crisisResult) return crisisResult
    }

    // 任务系统命令 - 数字选择优先处理
    if (/^[1-4]$/.test(input.trim())) {
      const result = get().handleChoiceInput(input.trim())
      if (result) return result
    }
    
    // 选择命令
    if (input.startsWith('选') || input.startsWith('选择')) {
      const num = input.replace(/选择?/g, '').trim()
      if (/^[1-4]$/.test(num)) {
        const result = get().handleChoiceInput(num)
        if (result) return result
      }
    }
    
    if (input === '任务' || input.includes('查看任务') || input.includes('任务列表')) {
      return get().getTaskStatus()
    }
    
    if (input.includes('执行任务') || input === '执行' || input === '开始任务') {
      return get().executeTask()
    }
    
    if (input.includes('客户消息') || input.includes('查看消息')) {
      return get().getCustomerChats()
    }
    
    if (input.includes('回复客户') || input.includes('回复')) {
      if (input.includes('专业')) {
        return get().replyCustomer('professional')
      } else if (input.includes('促销') || input.includes('优惠')) {
        return get().replyCustomer('promotional')
      }
      return get().replyCustomer('friendly')
    }
    
    if (input.includes('市场报告') || input.includes('市场数据')) {
      return get().getMarketReport()
    }

    // 推广系统命令 - 放在前面优先处理
    if (input === '推广' || input === '推广渠道' || input.includes('推广列表')) {
      return get().getPromotionChannels()
    }
    
    if (input.includes('推广数据') || input.includes('推广统计')) {
      return get().getPromotionStats()
    }
    
    // 具体推广渠道命令
    if (input.includes('推广 ') || input.startsWith('推广')) {
      const parts = input.replace('推广', '').trim().split(' ')
      const channelName = parts[0]
      if (channelName) {
        const contentName = parts[1] || ''
        const channel = PROMOTION_CHANNELS.find(c => 
          c.name.includes(channelName) || channelName.includes(c.name.substring(0, 2))
        )
        if (channel) {
          const content = CONTENT_TYPES.find(c => 
            contentName && (c.name.includes(contentName) || contentName.includes(c.name.substring(0, 2)))
          )
          return get().runPromotion(channel.id, content?.id)
        }
      }
    }
    
    // 快捷推广命令
    if (input.includes('小红书')) {
      return get().runPromotion('xiaohongshu', 'product_intro')
    }
    if (input.includes('抖音')) {
      return get().runPromotion('douyin', 'product_intro')
    }
    if (input.includes('朋友圈')) {
      return get().runPromotion('wechat_moments', 'product_intro')
    }
    if (input.includes('微信群') && !input.includes('社群')) {
      return get().runPromotion('wechat_group', 'discount_info')
    }
    if (input.includes('微博')) {
      return get().runPromotion('weibo', 'trending')
    }
    if (input.includes('付费广告') || input.includes('投广告')) {
      return get().runPromotion('paid_ad', 'product_intro')
    }
    if (input.includes('kol') || input.includes('网红') || input.includes('达人合作')) {
      return get().runPromotion('kol', 'user_story')
    }
    
    if (input.includes('我的状态') || input.includes('查看状态')) {
      const p = state.player
      return `👤 **${p.name}的创业状态**\n\n` +
        `💰 资金: ¥${p.cash.toLocaleString()}\n` +
        `⭐ 声誉: ${p.reputation}/100\n` +
        `⚡ 精力: ${p.energy}/100\n` +
        `📈 等级: Lv.${p.level} (${p.experience} EXP)\n\n` +
        `**技能值:**\n` +
        `- 营销: ${p.skills.marketing}\n` +
        `- 技术: ${p.skills.technology}\n` +
        `- 管理: ${p.skills.management}\n` +
        `- 创意: ${p.skills.creativity}\n` +
        `- 人脉: ${p.skills.networking}\n\n` +
        `📅 游戏时间: ${state.gameYear}年${state.gameMonth}月`
    }
    
    if (input.includes('下个月') || input.includes('推进时间')) {
      get().advanceMonth()
      return `⏰ 时间推进到${get().gameYear}年${get().gameMonth}月...\n\n${get().getMonthlyReport()}`
    }

    // 市场专员命令
    if (input.includes('市场专员') || input.includes('呼叫luna') || input.includes('luna')) {
      return get().activateMarketSpecialist()
    }
    
    if (input.includes('市场教学') || input.includes('学习市场') || input.includes('市场技巧')) {
      return get().getMarketTips()
    }
    
    if (input.includes('市场动态') || input.includes('实时数据')) {
      return get().getMarketDynamics()
    }
    
    if (input.includes('平台分析') || input.includes('平台数据')) {
      return get().getPlatformAnalysis()
    }

    // 角色互动命令
    if (input.includes('找导师') || input.includes('导师对话') || input.includes('alex')) {
      return get().characterDialogue('mentor')
    }
    
    if (input.includes('找顾客') || input.includes('顾客对话') || input.includes('小美')) {
      return get().characterDialogue('customer')
    }
    
    if (input.includes('找投资') || input.includes('投资人对话') || input.includes('david')) {
      return get().characterDialogue('investor')
    }

    // 休息系统
    if (input === '休息' || input.includes('恢复精力') || input === '睡觉') {
      return get().showRestOptions()
    }
    if (/^休息[1-4]$/.test(input.trim())) {
      return get().doRest(parseInt(input.trim().replace('休息', '')) - 1)
    }

    // 贷款系统
    if (input === '贷款' || input.includes('借钱') || input === '银行') {
      return get().showLoanOptions()
    }
    if (input.includes('申请贷款')) {
      const loanName = input.replace('申请贷款', '').trim()
      return get().applyLoan(loanName)
    }
    if (input === '还款' || input.includes('还贷')) {
      return get().repayLoan()
    }

    // 员工系统
    if (input === '招聘' || input.includes('雇佣') || input.includes('招人')) {
      return get().showHireOptions()
    }
    if (/^招聘[1-6]$/.test(input.trim())) {
      return get().hireEmployee(parseInt(input.trim().replace('招聘', '')) - 1)
    }
    if (input === '团队' || input.includes('我的团队') || input === '员工') {
      return get().showTeam()
    }
    if (input.includes('解雇') || input.includes('开除')) {
      const empName = input.replace(/解雇|开除/g, '').trim()
      return get().fireEmployee(empName)
    }

    // 评分系统
    if (input === '评分' || input.includes('我的评分') || input === '得分') {
      return get().calculateScore()
    }

    if (input.includes('帮助') || input.includes('命令')) {
      return `📖 **可用命令：**\n\n` +
        `**📋 基础操作**\n` +
        `- **查看项目** - 浏览所有零成本创业项目\n` +
        `- **启动 [项目名]** - 开始一个创业项目\n` +
        `- **我的状态** - 查看个人创业状态\n` +
        `- **下个月** - 推进游戏时间\n` +
        `- **休息** - 恢复精力（休息1-4）\n` +
        `- **评分** - 查看创业评分\n\n` +
        `**👥 角色互动**\n` +
        `- **市场专员** / **Luna** - 呼叫市场分析师Luna\n` +
        `- **找导师** / **Alex** - 与创业导师Alex对话\n` +
        `- **找顾客** / **小美** - 与顾客小美互动\n` +
        `- **找投资** / **David** - 与投资人David洽谈\n\n` +
        `**📊 市场与数据**\n` +
        `- **市场报告** - 查看最新市场数据和趋势\n` +
        `- **市场教学** - 学习市场分析技巧\n` +
        `- **市场动态** - 查看实时市场动态\n` +
        `- **平台分析** - 查看各平台数据分析\n` +
        `- **竞争对手** - 查看市场竞争情况\n\n` +
        `**💰 财务管理**\n` +
        `- **贷款** / **银行** - 查看贷款产品\n` +
        `- **申请贷款 [贷款名]** - 申请贷款\n` +
        `- **还款** - 偿还贷款\n\n` +
        `**👥 团队管理**\n` +
        `- **招聘** - 查看可招聘员工\n` +
        `- **招聘1-6** - 雇佣员工\n` +
        `- **团队** - 查看当前团队\n` +
        `- **解雇 [员工名]** - 解雇员工\n\n` +
        `**🎯 成长系统**\n` +
        `- **培训** - 查看可用的技能培训课程\n` +
        `- **学习 [课程名]** - 报名参加培训\n` +
        `- **成就** - 查看已解锁的成就\n` +
        `- **每日任务** - 查看今日任务\n\n` +
        `**⚔️ 挑战与机遇**\n` +
        `- **挑战** - 发起一次随机挑战\n` +
        `- **融资** - 查看可用的投资机会\n` +
        `- **寻求融资 [投资人名]** - 向投资人融资\n` +
        `- **高级融资** - 🔒 4种实战融资方法（付费内容）\n` +
        `- **融资详情1-4** - 查看融资方法详细案例\n` +
        `- **序列号 [码]** - 输入序列号解锁付费内容\n\n` +
        `💡 你也可以直接和我聊天，询问创业相关的问题！`
    }

    // 培训系统
    if (input.includes('培训') && !input.includes('学习')) {
      return `📚 **技能培训中心**\n\n${TRAINING_COURSES.map(c => 
        `**${c.name}** - ¥${c.cost}\n   ${c.description}\n   效果: ${c.skill === 'marketing' ? '营销' : c.skill === 'technology' ? '技术' : c.skill === 'management' ? '管理' : c.skill === 'creativity' ? '创意' : '人脉'}+${c.increase} | 时长: ${c.duration}个月`
      ).join('\n\n')}\n\n输入"学习 [课程名]"开始培训！`
    }

    if (input.includes('学习')) {
      const courseName = input.replace('学习', '').trim()
      const course = TRAINING_COURSES.find(c => c.name.includes(courseName) || courseName.includes(c.name.substring(0, 3)))
      if (course) {
        return get().startTraining(course)
      }
      return '❌ 未找到该课程，请输入"培训"查看可用课程列表。'
    }

    // 成就系统
    if (input.includes('成就')) {
      const unlocked = state.unlockedAchievements
      const locked = ACHIEVEMENTS.filter(a => !unlocked.includes(a.id))
      return `🏆 **成就系统**\n\n` +
        `**已解锁 (${unlocked.length}/${ACHIEVEMENTS.length}):**\n` +
        (unlocked.length > 0 ? unlocked.map(id => {
          const a = ACHIEVEMENTS.find(ach => ach.id === id)
          return `${a.icon} ${a.name} - ${a.description}`
        }).join('\n') : '暂无解锁的成就\n') +
        `\n\n**待解锁:**\n` +
        locked.slice(0, 5).map(a => `🔒 ${a.name} - ${a.description}`).join('\n') +
        (locked.length > 5 ? `\n...还有${locked.length - 5}个成就等待解锁` : '')
    }

    // 每日任务
    if (input.includes('每日任务') || input.includes('日常')) {
      get().refreshDailyTasks()
      const tasks = get().dailyTasks
      const completed = get().completedDailyTasks
      return `📋 **每日任务**\n\n` +
        tasks.map(t => {
          const done = completed.includes(t.id)
          return `${done ? '✅' : '⬜'} **${t.name}**\n   ${t.description}\n   奖励: ${t.reward.cash ? `¥${t.reward.cash}` : ''} ${t.reward.exp ? `+${t.reward.exp}EXP` : ''}\n   命令: ${t.command}`
        }).join('\n\n') +
        `\n\n💡 完成任务命令即可获得奖励！`
    }

    // 挑战系统
    if (input === '挑战' || input.includes('发起挑战')) {
      if (state.player.energy < 20) {
        return '❌ 精力不足！需要至少20点精力才能发起挑战。休息一下再来吧！'
      }
      const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]
      set({ currentChallenge: challenge })
      return `⚔️ **${challenge.name}**\n\n` +
        `${challenge.description}\n\n` +
        `难度: ${challenge.difficulty === 'easy' ? '🟢 简单' : challenge.difficulty === 'medium' ? '🟡 中等' : '🔴 困难'}\n` +
        `成功率: ${Math.floor(challenge.successRate * 100)}%\n` +
        `成功奖励: ${Object.entries(challenge.reward).map(([k, v]) => `${k === 'cash' ? '💰' : k === 'reputation' ? '⭐' : k === 'exp' ? '📈' : '🎯'}${v > 0 ? '+' : ''}${v}`).join(' ')}\n` +
        `失败惩罚: ${Object.entries(challenge.penalty).map(([k, v]) => `${k === 'cash' ? '💰' : k === 'reputation' ? '⭐' : k === 'energy' ? '⚡' : '🎯'}${v}`).join(' ')}\n\n` +
        `输入"接受挑战"开始，或"放弃挑战"取消。`
    }

    if (input.includes('接受挑战')) {
      return get().attemptChallenge()
    }

    if (input.includes('放弃挑战')) {
      set({ currentChallenge: null })
      return '🏳️ 你选择了放弃这次挑战。下次再来吧！'
    }

    // 竞争对手
    if (input.includes('竞争对手') || input.includes('对手')) {
      return `🏢 **市场竞争格局**\n\n` +
        COMPETITORS.map(c => 
          `${c.avatar} **${c.name}**\n   实力: ${'⭐'.repeat(Math.floor(c.strength / 20))} (${c.strength})\n   领域: ${c.specialty}\n   ${c.description}`
        ).join('\n\n') +
        `\n\n💡 提升自己的实力才能在竞争中脱颖而出！`
    }

    // 序列号验证
    if (input.startsWith('序列号') || input.startsWith('激活码') || input.startsWith('czrz') || input.startsWith('vip-')) {
      const serial = input.replace(/^(序列号|激活码)\s*/, '').trim()
      if (validateSerial(serial)) {
        localStorage.setItem('premiumUnlocked', 'true')
        set({ premiumUnlocked: true })
        return `🎉 **序列号验证成功！**\n\n` +
          `✅ 高级融资课程已解锁！\n\n` +
          `你现在可以查看以下付费内容：\n` +
          PREMIUM_FINANCING_METHODS.map(m => `${m.icon} **${m.name}** - ${m.summary.substring(0, 30)}...`).join('\n') +
          `\n\n输入"高级融资"查看完整内容。`
      }
      return `❌ 序列号无效，请检查后重新输入。\n\n格式：序列号 XXXX-XXXX-XXXX-XXXX`
    }

    // 高级融资方法（付费内容）
    if (input.includes('高级融资') || input.includes('融资方法') || input.includes('融资课程')) {
      if (!get().premiumUnlocked) {
        return `🔒 **高级融资方法 - 付费内容**\n\n` +
          `本模块包含4种实战融资策略，附真实案例分析：\n\n` +
          PREMIUM_FINANCING_METHODS.map(m => `${m.icon} **${m.name}**\n   ${m.summary.substring(0, 40)}...\n   难度：${m.difficulty === 'easy' ? '🟢简单' : m.difficulty === 'medium' ? '🟡中等' : '🔴困难'} | 潜力：${m.potential}`).join('\n\n') +
          `\n\n━━━━━━━━━━━━━━━━━━\n` +
          `🔐 此为付费内容，需输入序列号解锁\n` +
          `格式：序列号 XXXX-XXXX-XXXX-XXXX\n` +
          `━━━━━━━━━━━━━━━━━━`
      }
      return `💎 **高级融资方法 - 已解锁**\n\n` +
        `以下为4种零成本创业融资策略，附真实案例和实操步骤：\n\n` +
        PREMIUM_FINANCING_METHODS.map((m, i) => {
          return `━━━━━━━━━━━━━━━━━━\n` +
            `**${i + 1}. ${m.icon} ${m.name}**\n` +
            `${m.summary}\n` +
            `难度：${m.difficulty === 'easy' ? '🟢简单' : m.difficulty === 'medium' ? '🟡中等' : '🔴困难'} | 融资潜力：${m.potential}\n\n` +
            `📚 **真实案例：**\n` +
            m.cases.map((c, ci) => `**案例${ci + 1}：${c.name}**\n${c.description}\n🏆 结果：${c.result}`).join('\n\n') +
            `\n\n📋 **实操步骤：**\n` +
            m.steps.join('\n') +
            `\n\n💡 **实战技巧：**\n` +
            m.tips.map(t => `• ${t}`).join('\n')
        }).join('\n\n') +
        `\n\n━━━━━━━━━━━━━━━━━━\n` +
        `也可输入"融资详情1-4"单独查看某一种方法。`
    }

    // 融资详情查看
    if (/^融资详情[1-4]$/.test(input.trim())) {
      if (!get().premiumUnlocked) {
        return `🔒 请先输入序列号解锁付费内容。\n格式：序列号 XXXX-XXXX-XXXX-XXXX`
      }
      const idx = parseInt(input.trim().replace('融资详情', '')) - 1
      const method = PREMIUM_FINANCING_METHODS[idx]
      if (!method) return '❌ 无效的编号，请输入融资详情1-4。'
      return `${method.icon} **${method.name}**\n\n` +
        `📝 **概述：**${method.summary}\n\n` +
        `💰 **融资潜力：**${method.potential}\n` +
        `📊 **难度：**${method.difficulty === 'easy' ? '🟢 简单（新手可操作）' : method.difficulty === 'medium' ? '🟡 中等（需一定经验）' : '🔴 困难（需商业基础）'}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📚 **真实案例分析：**\n\n` +
        method.cases.map((c, i) => `**案例${i + 1}：${c.name}**\n${c.description}\n🏆 结果：${c.result}`).join('\n\n') +
        `\n\n━━━━━━━━━━━━━━━━━━\n` +
        `📋 **实操步骤：**\n` +
        method.steps.join('\n') +
        `\n\n━━━━━━━━━━━━━━━━━━\n` +
        `💡 **实战技巧：**\n` +
        method.tips.map(t => `• ${t}`).join('\n')
    }

    // 融资系统
    if (input.includes('融资') && !input.includes('寻求')) {
      return `💰 **融资机会**\n\n` +
        `当前股权已出让: ${state.equityGiven}%\n` +
        `累计获得投资: ¥${state.totalInvestment.toLocaleString()}\n\n` +
        `**可接触的投资人:**\n` +
        INVESTORS.map(inv => {
          const canContact = state.player.reputation >= inv.minReputation
          return `${inv.avatar} **${inv.name}** ${canContact ? '✅' : '🔒'}\n   ${inv.description}\n   投资额度: 最高¥${inv.maxInvestment.toLocaleString()}\n   要求股权: ${inv.equity}%\n   ${canContact ? '' : `需要声誉达到${inv.minReputation}才能接触`}`
        }).join('\n\n') +
        `\n\n输入"寻求融资 [投资人名]"发起融资请求。\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💎 输入"高级融资"查看4种零成本实战融资策略（${state.premiumUnlocked ? '✅已解锁' : '🔒付费内容'}）`
    }

    if (input.includes('寻求融资')) {
      const investorName = input.replace('寻求融资', '').trim()
      const investor = INVESTORS.find(i => i.name.includes(investorName) || investorName.includes(i.name.substring(0, 3)))
      if (investor) {
        return get().seekInvestment(investor)
      }
      return '❌ 未找到该投资人，请输入"融资"查看可用投资人列表。'
    }

    // 社交活动
    if (input.includes('社交') || input.includes('人脉')) {
      if (state.player.energy < 15) {
        return '❌ 精力不足！需要至少15点精力才能参加社交活动。'
      }
      return get().doNetworking()
    }

    // 社群运营命令
    if (input.includes('社群') || input.includes('群状态')) {
      return get().getCommunityStatus()
    }
    
    if (input.includes('群聊') || input.includes('群动态')) {
      return get().simulateGroupChat()
    }
    
    if (input.includes('运营活动') || input.includes('活动列表')) {
      return `🎯 **运营活动**\n\n` +
        OPERATION_ACTIVITIES.map(a => 
          `${a.icon} **${a.name}** ${a.cost > 0 ? `(¥${a.cost})` : '(免费)'}\n   ${a.description}\n   效果: ${Object.entries(a.effect).map(([k, v]) => `${k}+${v}`).join(', ')}`
        ).join('\n\n') +
        `\n\n💡 输入活动名称执行，如"发红包"、"秒杀"、"发优惠券"等`
    }
    
    // 具体运营活动命令
    if (input.includes('发红包') || input.includes('红包')) {
      return get().runOperation('red_packet')
    }
    if (input.includes('秒杀') || input.includes('限时')) {
      return get().runOperation('flash_sale')
    }
    if (input.includes('群游戏') || input.includes('游戏')) {
      return get().runOperation('group_game')
    }
    if (input.includes('晒单') || input.includes('分享')) {
      return get().runOperation('share_experience')
    }
    if (input.includes('新品') || input.includes('预告')) {
      return get().runOperation('new_product')
    }
    if (input.includes('优惠券') || input.includes('发券')) {
      return get().runOperation('coupon')
    }
    if (input.includes('直播') || input.includes('答疑')) {
      return get().runOperation('live_qa')
    }
    if (input.includes('邀请有礼') || input.includes('拉新')) {
      return get().runOperation('referral')
    }

    // 复盘
    if (input.includes('复盘')) {
      if (state.activeProjects.length === 0) {
        return '📊 暂无运营中的项目可以复盘。先启动一个项目吧！'
      }
      const totalRevenue = state.activeProjects.reduce((sum, p) => sum + p.revenue, 0)
      const avgProgress = state.activeProjects.reduce((sum, p) => sum + p.progress, 0) / state.activeProjects.length
      return `📊 **项目复盘分析**\n\n` +
        `**本月数据概览:**\n` +
        `- 总收入: ¥${totalRevenue.toLocaleString()}\n` +
        `- 平均进度: ${Math.floor(avgProgress)}%\n` +
        `- 项目数量: ${state.activeProjects.length}\n\n` +
        `**各项目详情:**\n` +
        state.activeProjects.map(p => 
          `${p.icon} **${p.name}**\n   进度: ${Math.floor(p.progress)}% | 收入: ¥${p.revenue.toLocaleString()} | 客户: ${p.customers}人`
        ).join('\n\n') +
        `\n\n💡 建议：${avgProgress < 50 ? '项目还在起步阶段，需要持续投入时间和精力。' : avgProgress < 80 ? '项目发展良好，可以考虑扩大规模。' : '项目接近成熟，可以考虑启动新项目分散风险。'}`
    }

    if (input.includes('切换导师') || input.includes('换导师')) {
      const personalities = Object.keys(AI_PERSONALITIES)
      const currentIndex = personalities.indexOf(state.currentAI)
      const nextIndex = (currentIndex + 1) % personalities.length
      const nextAI = personalities[nextIndex]
      set({ currentAI: nextAI })
      return `${AI_PERSONALITIES[nextAI].avatar} 你好！我是${AI_PERSONALITIES[nextAI].name}。${AI_PERSONALITIES[nextAI].greeting}`
    }

    // 智能回复
    if (input.includes('如何') || input.includes('怎么') || input.includes('建议')) {
      const tips = [
        '💡 零成本创业的关键是利用你已有的技能和资源。先问问自己：你有什么独特的能力或知识？',
        '💡 建议从小处开始，验证你的想法。MVP（最小可行产品）比完美产品更重要。',
        '💡 关注现金流而非估值。作为零成本创业者，活下来比什么都重要。',
        '💡 利用社交媒体建立个人品牌，这是免费且有效的营销方式。',
        '💡 找到你的第一批种子用户，他们的反馈比任何市场调研都有价值。'
      ]
      return tips[Math.floor(Math.random() * tips.length)]
    }
    
    if (input.includes('自媒体') || input.includes('内容')) {
      return '📱 自媒体是零成本创业的绝佳起点！\n\n' +
        '**关键成功因素：**\n' +
        '1. 选择垂直细分领域\n' +
        '2. 保持内容更新频率\n' +
        '3. 与粉丝互动建立信任\n' +
        '4. 多平台分发内容\n\n' +
        '当前市场数据显示，内容创作行业增长率达18.5%，是个好赛道！'
    }
    
    // 默认回复
    const defaultReplies = [
      `有趣的想法！你的创业灵感来自哪里？输入"查看项目"看看有哪些零成本创业机会。`,
      `我理解你的困惑。创业路上遇到问题很正常。说说具体情况，我来帮你分析。`,
      `不错的思路！在当前市场环境下，我建议你先查看"市场报告"了解最新趋势。`,
      `作为创业者，保持学习很重要。你可以输入"帮助"查看所有可用命令。`,
    ]
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
  },

  // 启动项目
  startProject: (project) => {
    const state = get()
    if (state.activeProjects.find(p => p.id === project.id)) {
      return false
    }
    
    set({
      activeProjects: [...state.activeProjects, {
        ...project,
        startMonth: state.gameMonth,
        startYear: state.gameYear,
        progress: 0,
        revenue: 0,
        customers: 0
      }],
      player: {
        ...state.player,
        cash: state.player.cash - project.initialCost
      }
    })
    return true
  },

  // 推进月份
  advanceMonth: () => {
    const state = get()
    let newMonth = state.gameMonth + 1
    let newYear = state.gameYear
    
    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    }
    
    // 处理项目收入
    let totalRevenue = 0
    let totalExpense = 0
    const updatedProjects = state.activeProjects.map(project => {
      const monthsRunning = (newYear - project.startYear) * 12 + (newMonth - project.startMonth)
      const employeeProgressBoost = state.employees.reduce((sum, e) => sum + (e.bonus.progressBoost || 0), 0)
      const progress = Math.min(100, project.progress + 10 + Math.random() * 10 + employeeProgressBoost)
      const marketFactor = state.marketCondition
      
      // 技能加成
      const skillBonus = 1 + (state.player.skills.marketing + state.player.skills.management) / 400
      
      // 员工收入加成
      const employeeRevenueBoost = 1 + state.employees.reduce((sum, e) => sum + (e.bonus.revenueBoost || 0), 0)
      
      // 计算收入（基于进度和市场）
      const baseRevenue = project.potentialRevenue[0] + 
        (project.potentialRevenue[1] - project.potentialRevenue[0]) * (progress / 100) * Math.random()
      const revenue = Math.floor(baseRevenue * marketFactor * skillBonus * employeeRevenueBoost * (monthsRunning > 2 ? 1 : 0.3))
      
      totalRevenue += revenue
      totalExpense += project.monthlyExpense
      
      return {
        ...project,
        progress,
        revenue,
        customers: Math.floor(revenue / 50)
      }
    })
    
    // 随机市场事件
    const eventChance = Math.random()
    let newEvents = [...state.activeEvents]
    if (eventChance > 0.7 && newEvents.length < 2) {
      const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)]
      if (!newEvents.find(e => e.id === event.id)) {
        newEvents.push(event)
      }
    }
    
    // 更新市场状况
    let newMarketCondition = 1.0
    newEvents.forEach(event => {
      if (event.effect.all) {
        newMarketCondition *= event.effect.all
      }
    })
    
    // 处理培训进度
    let trainingUpdate = state.activeTraining
    let skillUpdate = { ...state.player.skills }
    let trainingCompleteMsg = null
    
    if (trainingUpdate) {
      trainingUpdate = { ...trainingUpdate, remainingMonths: trainingUpdate.remainingMonths - 1 }
      if (trainingUpdate.remainingMonths <= 0) {
        skillUpdate[trainingUpdate.skill] = Math.min(100, skillUpdate[trainingUpdate.skill] + trainingUpdate.increase)
        trainingCompleteMsg = {
          id: Date.now(),
          type: 'system',
          content: `📖 培训完成！【${trainingUpdate.name}】- ${trainingUpdate.skill}技能 +${trainingUpdate.increase}`,
          timestamp: new Date()
        }
        trainingUpdate = null
      }
    }
    
    // 计算经验值
    const expGained = Math.floor(totalRevenue / 100) + state.activeProjects.length * 5
    const newExp = state.player.experience + expGained
    const newLevel = Math.floor(newExp / 100) + 1
    
    // 记录收入历史
    const newRevenueHistory = [...state.revenueHistory, { month: newMonth, year: newYear, revenue: totalRevenue }].slice(-12)
    
    // 员工工资和效果
    const totalSalary = state.employees.reduce((sum, e) => sum + e.salary, 0)
    let employeeEnergyBonus = 0
    state.employees.forEach(emp => {
      if (emp.bonus.energy) employeeEnergyBonus += emp.bonus.energy
      if (emp.bonus.marketing) skillUpdate.marketing = Math.min(100, skillUpdate.marketing + emp.bonus.marketing)
      if (emp.bonus.technology) skillUpdate.technology = Math.min(100, skillUpdate.technology + emp.bonus.technology)
      if (emp.bonus.management) skillUpdate.management = Math.min(100, skillUpdate.management + emp.bonus.management)
      if (emp.bonus.creativity) skillUpdate.creativity = Math.min(100, skillUpdate.creativity + emp.bonus.creativity)
    })
    
    // 贷款利息
    let totalInterest = 0
    const updatedLoans = state.loans.map(loan => {
      const interest = Math.floor(loan.remaining * loan.interest)
      totalInterest += interest
      return { ...loan, remaining: loan.remaining + interest, monthsLeft: loan.monthsLeft - 1 }
    }).filter(loan => loan.monthsLeft > 0 && loan.remaining > 0)
    
    set({
      gameMonth: newMonth,
      gameYear: newYear,
      activeProjects: updatedProjects,
      activeEvents: newEvents,
      marketCondition: newMarketCondition,
      activeTraining: trainingUpdate,
      revenueHistory: newRevenueHistory,
      loans: updatedLoans,
      totalDebt: updatedLoans.reduce((sum, l) => sum + l.remaining, 0),
      player: {
        ...state.player,
        cash: state.player.cash + totalRevenue - totalExpense - totalSalary - totalInterest,
        experience: newExp,
        level: newLevel,
        energy: Math.min(100, state.player.energy + 20 + employeeEnergyBonus),
        skills: skillUpdate
      }
    })
    
    // 添加培训完成消息
    if (trainingCompleteMsg) {
      set({ messages: [...get().messages, trainingCompleteMsg] })
    }
    
    // 触发随机事件
    const randomEvent = get().triggerRandomEvent()
    if (randomEvent) {
      const eventMsg = {
        id: Date.now() + 1,
        type: 'system',
        content: `📰 ${randomEvent.event.name}: ${randomEvent.event.description} ${randomEvent.effectText}`,
        timestamp: new Date()
      }
      set({ messages: [...get().messages, eventMsg] })
    }
    
    // 触发危机事件
    if (Math.random() < 0.15 && !get().pendingCrisis && state.activeProjects.length > 0) {
      const crisis = CRISIS_EVENTS[Math.floor(Math.random() * CRISIS_EVENTS.length)]
      set({ pendingCrisis: crisis })
      const crisisMsg = {
        id: Date.now() + 2,
        type: 'system',
        content: `🚨 紧急事件：${crisis.name}`,
        timestamp: new Date()
      }
      set({ messages: [...get().messages, crisisMsg] })
      const choicesMsg = {
        id: Date.now() + 3,
        type: 'ai',
        sender: AI_PERSONALITIES.mentor,
        content: get().formatCrisisChoices(crisis),
        timestamp: new Date()
      }
      set({ messages: [...get().messages, choicesMsg] })
    }
    
    // 检查成就
    get().checkAchievements()
    
    // 刷新每日任务
    get().refreshDailyTasks()
  },

  // 获取月度报告
  getMonthlyReport: () => {
    const state = get()
    let report = `📊 **${state.gameYear}年${state.gameMonth}月经营报告**\n\n`
    
    if (state.activeProjects.length === 0) {
      report += '📭 暂无运营中的项目。输入"查看项目"开始你的创业旅程！\n'
    } else {
      report += '**项目运营情况：**\n'
      state.activeProjects.forEach(p => {
        report += `${p.icon} ${p.name}: 进度${Math.floor(p.progress)}% | 本月收入¥${p.revenue.toLocaleString()} | 客户${p.customers}人\n`
      })
    }
    
    if (state.activeEvents.length > 0) {
      report += '\n**市场动态：**\n'
      state.activeEvents.forEach(e => {
        report += `📰 ${e.name}: ${e.description}\n`
      })
    }
    
    report += `\n💰 当前资金: ¥${state.player.cash.toLocaleString()}`
    
    return report
  },

  // 获取市场报告
  getMarketReport: () => {
    const data = MARKET_DATA
    const state = get()
    
    return `📈 **2026年市场研究报告**\n\n` +
      `**行业规模与增长：**\n` +
      data.industries.map(i => 
        `- ${i.name}: 规模${i.size} | ${i.trend === 'up' ? '📈' : '➡️'} 增长${i.growth}%`
      ).join('\n') +
      `\n\n**宏观指标：**\n` +
      `- 消费者信心指数: ${data.consumerConfidence}\n` +
      `- 创业成功率: ${data.startupSuccessRate}%\n` +
      `- 平均盈利周期: ${data.averageTimeToProfit}个月\n\n` +
      `**当前市场状况：** ${state.marketCondition >= 1 ? '🟢 良好' : '🟡 一般'}\n\n` +
      `💡 *数据来源：模拟市场研究机构*`
  },

  // 切换AI角色
  switchAI: (aiType) => {
    if (AI_PERSONALITIES[aiType]) {
      set({ currentAI: aiType })
    }
  },

  // 新增：开始培训
  startTraining: (course) => {
    const state = get()
    if (state.player.cash < course.cost) {
      return `❌ 资金不足！${course.name}需要¥${course.cost}，你当前只有¥${state.player.cash}。`
    }
    if (state.activeTraining) {
      return `❌ 你正在学习【${state.activeTraining.name}】，请先完成当前课程。`
    }
    
    set({
      activeTraining: { ...course, remainingMonths: course.duration },
      player: {
        ...state.player,
        cash: state.player.cash - course.cost
      }
    })
    
    return `📖 **开始学习：${course.name}**\n\n` +
      `${course.description}\n\n` +
      `- 费用: ¥${course.cost} (已支付)\n` +
      `- 时长: ${course.duration}个月\n` +
      `- 效果: ${course.skill}技能 +${course.increase}\n\n` +
      `💡 课程将在${course.duration}个月后完成，届时技能将自动提升！`
  },

  // 新增：尝试挑战
  attemptChallenge: () => {
    const state = get()
    const challenge = state.currentChallenge
    if (!challenge) {
      return '❌ 当前没有进行中的挑战。输入"挑战"开始一次新挑战！'
    }

    // 消耗精力
    const energyCost = challenge.difficulty === 'easy' ? 10 : challenge.difficulty === 'medium' ? 20 : 30
    
    // 技能加成
    const skillBonus = (state.player.skills.management + state.player.skills.creativity) / 200
    const finalSuccessRate = Math.min(0.95, challenge.successRate + skillBonus)
    
    const success = Math.random() < finalSuccessRate
    
    let resultText = ''
    const updates = {
      currentChallenge: null,
      completedChallenges: state.completedChallenges + 1,
      player: {
        ...state.player,
        energy: Math.max(0, state.player.energy - energyCost)
      }
    }
    
    if (success) {
      resultText = `🎉 **挑战成功！**\n\n${challenge.name}\n\n**获得奖励:**\n`
      Object.entries(challenge.reward).forEach(([key, value]) => {
        if (key === 'cash') {
          updates.player.cash = (updates.player.cash || state.player.cash) + value
          resultText += `💰 资金 +¥${value}\n`
        } else if (key === 'reputation') {
          updates.player.reputation = Math.min(100, (updates.player.reputation || state.player.reputation) + value)
          resultText += `⭐ 声誉 +${value}\n`
        } else if (key === 'exp') {
          updates.player.experience = (updates.player.experience || state.player.experience) + value
          resultText += `📈 经验 +${value}\n`
        } else if (key === 'networking') {
          updates.player.skills = { ...state.player.skills, networking: state.player.skills.networking + value }
          resultText += `🤝 人脉 +${value}\n`
        } else if (key === 'creativity') {
          updates.player.skills = { ...state.player.skills, creativity: state.player.skills.creativity + value }
          resultText += `💡 创意 +${value}\n`
        }
      })
    } else {
      resultText = `😔 **挑战失败...**\n\n${challenge.name}\n\n**承受损失:**\n`
      Object.entries(challenge.penalty).forEach(([key, value]) => {
        if (key === 'cash') {
          updates.player.cash = Math.max(0, (updates.player.cash || state.player.cash) + value)
          resultText += `💰 资金 ${value}\n`
        } else if (key === 'reputation') {
          updates.player.reputation = Math.max(0, (updates.player.reputation || state.player.reputation) + value)
          resultText += `⭐ 声誉 ${value}\n`
        } else if (key === 'energy') {
          updates.player.energy = Math.max(0, (updates.player.energy || state.player.energy) + value)
          resultText += `⚡ 精力 ${value}\n`
        }
      })
    }
    
    resultText += `\n已完成挑战次数: ${updates.completedChallenges}`
    
    set(updates)
    get().checkAchievements()
    
    return resultText
  },

  // 新增：寻求融资
  seekInvestment: (investor) => {
    const state = get()
    
    if (state.player.reputation < investor.minReputation) {
      return `❌ 声誉不足！需要达到${investor.minReputation}才能接触${investor.name}。当前声誉: ${state.player.reputation}`
    }
    
    if (state.activeProjects.length === 0) {
      return `❌ ${investor.name}表示：你需要先有一个运营中的项目才能获得投资。`
    }
    
    if (state.equityGiven >= 49) {
      return `❌ 你已经出让了${state.equityGiven}%的股权，继续融资将失去公司控制权。`
    }
    
    // 融资成功率基于声誉和项目表现
    const projectScore = state.activeProjects.reduce((sum, p) => sum + p.progress + p.revenue / 1000, 0) / state.activeProjects.length
    const successRate = 0.3 + (state.player.reputation / 200) + (projectScore / 200)
    
    if (Math.random() < successRate) {
      const investAmount = Math.floor(investor.maxInvestment * (0.5 + Math.random() * 0.5))
      
      set({
        player: {
          ...state.player,
          cash: state.player.cash + investAmount,
          reputation: Math.min(100, state.player.reputation + 5)
        },
        totalInvestment: state.totalInvestment + investAmount,
        equityGiven: state.equityGiven + investor.equity,
        investors: [...state.investors, { ...investor, amount: investAmount, date: `${state.gameYear}/${state.gameMonth}` }]
      })
      
      get().checkAchievements()
      
      return `🎊 **融资成功！**\n\n` +
        `${investor.avatar} ${investor.name}决定投资你的项目！\n\n` +
        `💰 获得投资: ¥${investAmount.toLocaleString()}\n` +
        `📊 出让股权: ${investor.equity}%\n` +
        `⭐ 声誉 +5\n\n` +
        `累计融资: ¥${(state.totalInvestment + investAmount).toLocaleString()}\n` +
        `累计出让股权: ${state.equityGiven + investor.equity}%`
    } else {
      return `😔 **融资未成功**\n\n` +
        `${investor.avatar} ${investor.name}表示："项目很有潜力，但目前时机还不成熟。继续努力，提升项目数据后再来吧！"\n\n` +
        `💡 提升声誉和项目收入可以增加融资成功率。`
    }
  },

  // 新增：社交活动
  doNetworking: () => {
    const state = get()
    const results = [
      { text: '参加了一场创业者沙龙', reward: { networking: 3, reputation: 2 } },
      { text: '在行业峰会上结识了几位同行', reward: { networking: 4, cash: 500 } },
      { text: '受邀参加了一个私密饭局', reward: { networking: 5, reputation: 3 } },
      { text: '在线上社群活跃发言', reward: { networking: 2, reputation: 1 } },
      { text: '帮助了一位创业新人', reward: { networking: 2, reputation: 4 } },
      { text: '参加了投资人见面会', reward: { networking: 3, reputation: 2, cash: 1000 } },
    ]
    
    const result = results[Math.floor(Math.random() * results.length)]
    
    const updates = {
      player: {
        ...state.player,
        energy: state.player.energy - 15,
        skills: {
          ...state.player.skills,
          networking: Math.min(100, state.player.skills.networking + (result.reward.networking || 0))
        },
        reputation: Math.min(100, state.player.reputation + (result.reward.reputation || 0)),
        cash: state.player.cash + (result.reward.cash || 0)
      }
    }
    
    set(updates)
    get().completeDailyTask('network')
    
    return `🤝 **社交活动**\n\n` +
      `${result.text}\n\n` +
      `**收获:**\n` +
      (result.reward.networking ? `🤝 人脉技能 +${result.reward.networking}\n` : '') +
      (result.reward.reputation ? `⭐ 声誉 +${result.reward.reputation}\n` : '') +
      (result.reward.cash ? `💰 资金 +¥${result.reward.cash}\n` : '') +
      `⚡ 精力 -15`
  },

  // 新增：刷新每日任务
  refreshDailyTasks: () => {
    const state = get()
    const today = `${state.gameYear}-${state.gameMonth}`
    
    if (state.lastTaskRefresh !== today) {
      const shuffled = [...DAILY_TASKS].sort(() => Math.random() - 0.5)
      set({
        dailyTasks: shuffled.slice(0, 3),
        completedDailyTasks: [],
        lastTaskRefresh: today
      })
    }
  },

  // 新增：完成每日任务
  completeDailyTask: (command) => {
    const state = get()
    const task = state.dailyTasks.find(t => t.command.includes(command) || command.includes(t.command))
    
    if (task && !state.completedDailyTasks.includes(task.id)) {
      const updates = {
        completedDailyTasks: [...state.completedDailyTasks, task.id],
        player: {
          ...state.player,
          cash: state.player.cash + (task.reward.cash || 0),
          experience: state.player.experience + (task.reward.exp || 0)
        }
      }
      
      if (task.reward.networking) {
        updates.player.skills = {
          ...state.player.skills,
          networking: Math.min(100, state.player.skills.networking + task.reward.networking)
        }
      }
      
      set(updates)
    }
  },

  // 新增：检查成就
  checkAchievements: () => {
    const state = get()
    const newAchievements = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (!state.unlockedAchievements.includes(achievement.id)) {
        try {
          if (achievement.condition(state)) {
            newAchievements.push(achievement)
          }
        } catch (e) {
          // 忽略条件检查错误
        }
      }
    })
    
    if (newAchievements.length > 0) {
      const totalReward = newAchievements.reduce((sum, a) => sum + a.reward, 0)
      
      set({
        unlockedAchievements: [...state.unlockedAchievements, ...newAchievements.map(a => a.id)],
        player: {
          ...state.player,
          cash: state.player.cash + totalReward
        },
        notifications: [
          ...state.notifications,
          ...newAchievements.map(a => ({
            type: 'achievement',
            title: `🏆 成就解锁: ${a.name}`,
            content: `${a.description}\n奖励: ¥${a.reward}`,
            timestamp: new Date()
          }))
        ]
      })
      
      // 添加成就消息到聊天
      newAchievements.forEach(a => {
        const achievementMsg = {
          id: Date.now() + Math.random(),
          type: 'system',
          content: `🏆 成就解锁：${a.icon} ${a.name} - ${a.description} (奖励¥${a.reward})`,
          timestamp: new Date()
        }
        set({ messages: [...get().messages, achievementMsg] })
      })
    }
  },

  // 新增：处理随机事件
  triggerRandomEvent: () => {
    const state = get()
    
    for (const event of RANDOM_EVENTS) {
      if (Math.random() < event.chance) {
        const updates = { player: { ...state.player } }
        let effectText = ''
        
        Object.entries(event.effect).forEach(([key, value]) => {
          if (key === 'cash') {
            updates.player.cash = Math.max(0, state.player.cash + value)
            effectText += value > 0 ? `💰 +¥${value} ` : `💰 ${value} `
          } else if (key === 'reputation') {
            updates.player.reputation = Math.max(0, Math.min(100, state.player.reputation + value))
            effectText += value > 0 ? `⭐ +${value} ` : `⭐ ${value} `
          } else if (key === 'energy') {
            updates.player.energy = Math.max(0, Math.min(100, state.player.energy + value))
            effectText += value > 0 ? `⚡ +${value} ` : `⚡ ${value} `
          } else if (key === 'exp') {
            updates.player.experience = state.player.experience + value
            effectText += `📈 +${value}EXP `
          } else if (key === 'creativity') {
            updates.player.skills = { ...state.player.skills, creativity: Math.min(100, state.player.skills.creativity + value) }
            effectText += `💡 创意+${value} `
          }
        })
        
        set(updates)
        
        return {
          event,
          effectText
        }
      }
    }
    return null
  },

  // 新增：添加通知
  addNotification: (notification) => {
    set({
      notifications: [...get().notifications, { ...notification, timestamp: new Date() }]
    })
  },

  // 新增：清除通知
  clearNotifications: () => {
    set({ notifications: [] })
  },

  // 新增：初始化社群（启动团购项目时调用）
  initCommunity: () => {
    const initialMembers = SIMULATED_USERS.slice(0, 5).map(u => ({
      ...u,
      joinedAt: new Date(),
      lastActive: new Date(),
      purchaseCount: 0,
      satisfaction: 50 + Math.floor(Math.random() * 30)
    }))
    
    set({
      communityMembers: initialMembers,
      communityMetrics: {
        totalMembers: initialMembers.length,
        activeMembers: initialMembers.filter(m => m.type === 'active' || m.type === 'loyal').length,
        engagement: 30,
        conversion: 10,
        retention: 60,
        trust: 40,
        todayOrders: 0,
        totalOrders: 0
      },
      operationLog: [{
        time: new Date(),
        action: '社群创建',
        result: `初始成员${initialMembers.length}人`
      }]
    })
  },

  // 新增：执行运营活动
  runOperation: (activityId) => {
    const state = get()
    const activity = OPERATION_ACTIVITIES.find(a => a.id === activityId)
    if (!activity) return '❌ 未找到该运营活动'
    
    if (state.player.cash < activity.cost) {
      return `❌ 资金不足！${activity.name}需要¥${activity.cost}`
    }
    
    if (state.player.energy < 10) {
      return '❌ 精力不足！需要至少10点精力'
    }
    
    // 扣除成本和精力
    const newCash = state.player.cash - activity.cost
    const newEnergy = state.player.energy - 10
    
    // 计算效果
    const metrics = { ...state.communityMetrics }
    let resultText = ''
    
    Object.entries(activity.effect).forEach(([key, value]) => {
      const bonus = Math.floor(value * (0.8 + Math.random() * 0.4))
      if (metrics[key] !== undefined) {
        metrics[key] = Math.min(100, metrics[key] + bonus)
      }
      const keyNames = {
        engagement: '📊 活跃度',
        conversion: '💰 转化率',
        retention: '🔄 留存率',
        trust: '🤝 信任度',
        growth: '📈 增长'
      }
      resultText += `${keyNames[key] || key} +${bonus}\n`
    })
    
    // 模拟用户反应
    const userReactions = state.communityMembers.slice(0, 3).map(u => {
      const reactions = [
        `${u.avatar} ${u.name}：谢谢老板！`,
        `${u.avatar} ${u.name}：这个活动不错！`,
        `${u.avatar} ${u.name}：已参与~`,
        `${u.avatar} ${u.name}：[表情]`,
        `${u.avatar} ${u.name}：支持！`
      ]
      return reactions[Math.floor(Math.random() * reactions.length)]
    })
    
    // 可能产生新订单
    const orderChance = (metrics.conversion / 100) * (metrics.engagement / 100)
    const newOrders = Math.random() < orderChance ? Math.floor(Math.random() * 3) + 1 : 0
    const orderRevenue = newOrders * (50 + Math.floor(Math.random() * 100))
    
    metrics.todayOrders += newOrders
    metrics.totalOrders += newOrders
    
    // 可能吸引新成员
    let newMemberText = ''
    if (activity.effect.growth && Math.random() < 0.4) {
      const potentialNew = SIMULATED_USERS.filter(u => !state.communityMembers.find(m => m.id === u.id))
      if (potentialNew.length > 0) {
        const newMember = {
          ...potentialNew[0],
          joinedAt: new Date(),
          lastActive: new Date(),
          purchaseCount: 0,
          satisfaction: 50
        }
        set({ communityMembers: [...state.communityMembers, newMember] })
        metrics.totalMembers++
        newMemberText = `\n🆕 新成员加入：${newMember.avatar} ${newMember.name}`
      }
    }
    
    // 更新日志
    const logEntry = {
      time: new Date(),
      action: activity.name,
      result: resultText.trim()
    }
    
    set({
      player: { ...state.player, cash: newCash + orderRevenue, energy: newEnergy },
      communityMetrics: metrics,
      operationLog: [...state.operationLog.slice(-9), logEntry]
    })
    
    return `${activity.icon} **${activity.name}**\n\n` +
      `${activity.description}\n\n` +
      `**用户反应：**\n${userReactions.join('\n')}\n\n` +
      `**运营效果：**\n${resultText}` +
      (newOrders > 0 ? `\n🛒 产生${newOrders}笔订单，收入¥${orderRevenue}` : '') +
      newMemberText +
      `\n\n⚡ 精力-10 ${activity.cost > 0 ? `| 💰 成本-¥${activity.cost}` : ''}`
  },

  // 新增：查看社群状态
  getCommunityStatus: () => {
    const state = get()
    const metrics = state.communityMetrics
    const members = state.communityMembers
    
    if (members.length === 0) {
      return '📢 还没有创建社群，请先启动团购项目！'
    }
    
    const activeCount = members.filter(m => m.type === 'active' || m.type === 'loyal' || m.type === 'influencer').length
    
    return `👥 **社群运营面板**\n\n` +
      `**成员概况：**\n` +
      `- 总成员：${metrics.totalMembers}人\n` +
      `- 活跃成员：${activeCount}人\n` +
      `- 今日订单：${metrics.todayOrders}笔\n` +
      `- 累计订单：${metrics.totalOrders}笔\n\n` +
      `**运营指标：**\n` +
      `📊 活跃度：${metrics.engagement}%  ${'█'.repeat(Math.floor(metrics.engagement / 10))}${'░'.repeat(10 - Math.floor(metrics.engagement / 10))}\n` +
      `💰 转化率：${metrics.conversion}%  ${'█'.repeat(Math.floor(metrics.conversion / 10))}${'░'.repeat(10 - Math.floor(metrics.conversion / 10))}\n` +
      `🔄 留存率：${metrics.retention}%  ${'█'.repeat(Math.floor(metrics.retention / 10))}${'░'.repeat(10 - Math.floor(metrics.retention / 10))}\n` +
      `🤝 信任度：${metrics.trust}%  ${'█'.repeat(Math.floor(metrics.trust / 10))}${'░'.repeat(10 - Math.floor(metrics.trust / 10))}\n\n` +
      `**群成员：**\n` +
      members.slice(0, 6).map(m => `${m.avatar} ${m.name} (${m.type === 'active' ? '活跃' : m.type === 'lurker' ? '潜水' : m.type === 'influencer' ? '达人' : m.type === 'loyal' ? '忠实' : m.type === 'skeptic' ? '谨慎' : '新人'})`).join(' | ') +
      (members.length > 6 ? `\n...还有${members.length - 6}人` : '') +
      `\n\n💡 输入"运营活动"查看可执行的活动`
  },

  // 新增：模拟群聊
  simulateGroupChat: () => {
    const state = get()
    const members = state.communityMembers
    
    if (members.length === 0) {
      return '📢 社群还没有成员，先启动项目吧！'
    }
    
    const chatMessages = [
      { type: 'question', templates: ['这个产品怎么样？', '有人买过吗？', '质量好不好？', '多久能到货？'] },
      { type: 'positive', templates: ['刚收到货，质量不错！', '已下单~', '回购了！', '推荐给朋友了', '性价比很高'] },
      { type: 'neutral', templates: ['看看再说', '考虑一下', '有点犹豫', '等下次优惠'] },
      { type: 'active', templates: ['今天有什么好物推荐？', '最近有活动吗？', '群主在吗？', '抢红包！'] }
    ]
    
    const selectedMembers = members.sort(() => Math.random() - 0.5).slice(0, 4)
    const chat = selectedMembers.map(member => {
      let msgType = 'neutral'
      if (member.type === 'active' || member.type === 'loyal') msgType = Math.random() > 0.3 ? 'positive' : 'active'
      else if (member.type === 'skeptic') msgType = 'question'
      else if (member.type === 'influencer') msgType = 'positive'
      
      const typeMessages = chatMessages.find(c => c.type === msgType)?.templates || chatMessages[2].templates
      const message = typeMessages[Math.floor(Math.random() * typeMessages.length)]
      
      return `${member.avatar} **${member.name}**：${message}`
    })
    
    // 可能产生购买意向
    const metrics = state.communityMetrics
    const buyIntent = selectedMembers.filter(m => Math.random() < m.purchaseRate * (metrics.trust / 100))
    
    let buyText = ''
    if (buyIntent.length > 0) {
      buyText = `\n\n🛒 **购买动态：**\n` +
        buyIntent.map(m => `${m.avatar} ${m.name} 正在下单...`).join('\n')
      
      const revenue = buyIntent.length * (30 + Math.floor(Math.random() * 70))
      set({
        player: { ...state.player, cash: state.player.cash + revenue },
        communityMetrics: {
          ...metrics,
          todayOrders: metrics.todayOrders + buyIntent.length,
          totalOrders: metrics.totalOrders + buyIntent.length
        }
      })
      buyText += `\n💰 +¥${revenue}`
    }
    
    return `💬 **社群实时动态**\n\n${chat.join('\n\n')}${buyText}\n\n💡 输入"运营活动"可以提升活跃度和转化率`
  },

  // 新增：执行推广活动
  runPromotion: (channelId, contentId) => {
    const state = get()
    const channel = PROMOTION_CHANNELS.find(c => c.id === channelId)
    const content = CONTENT_TYPES.find(c => c.id === contentId) || CONTENT_TYPES[0]
    
    if (!channel) return '❌ 未找到该推广渠道'
    
    if (state.player.cash < channel.cost) {
      return `❌ 资金不足！${channel.name}推广需要¥${channel.cost}`
    }
    
    if (state.player.energy < 15) {
      return '❌ 精力不足！推广需要至少15点精力'
    }
    
    // 扣除成本和精力
    const newCash = state.player.cash - channel.cost
    const newEnergy = state.player.energy - 15
    
    // 计算推广效果
    const skillBonus = 1 + (state.player.skills.marketing + state.player.skills.creativity) / 200
    const baseReach = channel.effect.reach * (0.7 + Math.random() * 0.6) * skillBonus
    const reach = Math.floor(baseReach)
    const conversionRate = (channel.effect.conversion + content.effect.interest / 10) / 100
    const newFollowers = Math.floor(reach * conversionRate * (0.5 + Math.random() * 0.5))
    const potentialBuyers = Math.floor(newFollowers * (content.effect.trust / 100 + 0.1))
    
    // 模拟互动数据
    const likes = Math.floor(reach * (0.03 + Math.random() * 0.07))
    const comments = Math.floor(likes * (0.1 + Math.random() * 0.2))
    const shares = Math.floor(comments * (0.2 + Math.random() * 0.3))
    
    // 模拟用户评论
    const commentTemplates = [
      '看起来不错！',
      '已关注，期待更多内容',
      '这个靠谱吗？',
      '收藏了',
      '朋友推荐来的',
      '价格怎么样？',
      '想了解更多',
      '已下单！',
      '等反馈',
      '支持一下'
    ]
    const userComments = Array(Math.min(comments, 5)).fill(0).map(() => {
      const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)]
      const comment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]
      return `${user.avatar} ${user.name}：${comment}`
    })
    
    // 可能直接产生收入
    let directRevenue = 0
    if (Math.random() < conversionRate * 2) {
      directRevenue = Math.floor(potentialBuyers * (20 + Math.random() * 80))
    }
    
    // 更新推广统计
    const stats = state.promotionStats
    const campaignEntry = {
      time: new Date(),
      channel: channel.name,
      content: content.name,
      reach,
      followers: newFollowers,
      revenue: directRevenue
    }
    
    // 添加潜在客户到社群
    const newPotentialCustomers = []
    for (let i = 0; i < Math.min(potentialBuyers, 3); i++) {
      const template = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)]
      newPotentialCustomers.push({
        ...template,
        id: `potential_${Date.now()}_${i}`,
        name: `用户${Math.floor(Math.random() * 1000)}`,
        source: channel.name,
        joinedAt: new Date()
      })
    }
    
    set({
      player: { 
        ...state.player, 
        cash: newCash + directRevenue, 
        energy: newEnergy,
        experience: state.player.experience + 10
      },
      promotionStats: {
        totalReach: stats.totalReach + reach,
        totalImpressions: stats.totalImpressions + reach * 1.5,
        followers: stats.followers + newFollowers,
        potentialCustomers: [...stats.potentialCustomers, ...newPotentialCustomers].slice(-20),
        contentPublished: stats.contentPublished + 1,
        campaignHistory: [...stats.campaignHistory.slice(-9), campaignEntry]
      }
    })
    
    // 如果有社群，添加新成员
    if (state.communityMembers.length > 0 && newPotentialCustomers.length > 0) {
      set({
        communityMembers: [...state.communityMembers, ...newPotentialCustomers].slice(0, 20),
        communityMetrics: {
          ...state.communityMetrics,
          totalMembers: state.communityMetrics.totalMembers + newPotentialCustomers.length
        }
      })
    }
    
    return `${channel.icon} **${channel.name}推广 - ${content.name}**\n\n` +
      `📊 **推广数据：**\n` +
      `- 曝光量：${reach.toLocaleString()}人\n` +
      `- 点赞：${likes} | 评论：${comments} | 转发：${shares}\n` +
      `- 新增关注：+${newFollowers}人\n` +
      `- 潜在客户：+${potentialBuyers}人\n` +
      (directRevenue > 0 ? `- 直接转化收入：+¥${directRevenue}\n` : '') +
      `\n💬 **用户互动：**\n${userComments.join('\n') || '暂无评论'}\n\n` +
      `⚡ 精力-15 ${channel.cost > 0 ? `| 💰 成本-¥${channel.cost}` : ''}`
  },

  // 新增：查看推广数据
  getPromotionStats: () => {
    const state = get()
    const stats = state.promotionStats
    
    if (stats.contentPublished === 0) {
      return `📢 **推广中心**\n\n` +
        `你还没有开始推广，输入"推广"查看可用渠道！\n\n` +
        `**可用推广渠道：**\n` +
        PROMOTION_CHANNELS.slice(0, 4).map(c => `${c.icon} ${c.name}`).join(' | ') +
        `\n\n💡 输入"推广 [渠道名]"开始推广`
    }
    
    return `📊 **推广数据面板**\n\n` +
      `**累计数据：**\n` +
      `- 总曝光：${stats.totalReach.toLocaleString()}次\n` +
      `- 总关注：${stats.followers}人\n` +
      `- 发布内容：${stats.contentPublished}条\n` +
      `- 潜在客户池：${stats.potentialCustomers.length}人\n\n` +
      `**最近推广记录：**\n` +
      (stats.campaignHistory.slice(-3).map(c => 
        `${c.channel} - 曝光${c.reach} | 新增${c.followers}粉丝${c.revenue > 0 ? ` | 收入¥${c.revenue}` : ''}`
      ).join('\n') || '暂无记录') +
      `\n\n💡 输入"推广"查看可用渠道`
  },

  // 新增：查看推广渠道列表
  getPromotionChannels: () => {
    return `📢 **推广渠道**\n\n` +
      PROMOTION_CHANNELS.map(c => 
        `${c.icon} **${c.name}** ${c.cost > 0 ? `(¥${c.cost})` : '(免费)'}\n   ${c.description}\n   预计曝光：${c.effect.reach}人 | 转化率：${c.effect.conversion}%`
      ).join('\n\n') +
      `\n\n**内容类型：**\n` +
      CONTENT_TYPES.map(c => `${c.icon} ${c.name}`).join(' | ') +
      `\n\n💡 输入"推广 [渠道名]"或"推广 [渠道名] [内容类型]"开始推广\n例如："推广 小红书" 或 "推广 抖音 优惠信息"`
  },

  // ========== 任务驱动运营系统 ==========
  
  // 启动项目运营（任务模式）
  startProjectOperation: (projectId) => {
    const state = get()
    const project = state.activeProjects.find(p => p.id === projectId)
    if (!project) return null
    
    // 获取项目专属任务模板，如果没有则使用默认模板
    const projectTasks = PROJECT_TASKS[projectId] || DEFAULT_TASKS
    
    // 生成第一阶段任务
    const phase1Tasks = projectTasks.market_research.map(t => ({
      ...t,
      projectId,
      status: 'pending',
      startTime: null
    }))
    
    // 保存当前项目使用的任务模板
    set({
      currentPhase: 1,
      taskQueue: phase1Tasks,
      currentTask: phase1Tasks[0],
      marketInsights: [],
      currentProjectTasks: projectTasks // 保存项目专属任务模板
    })
    
    // 返回欢迎消息和第一个任务选择界面
    const firstTask = phase1Tasks[0]
    const phaseNames = {
      content: '内容策划',
      freelance: '技能定位',
      dropshipping: '选品调研',
      online_course: '课程规划',
      affiliate: '选品研究',
      consulting: '专业定位',
      saas: '产品规划',
      community: '社群定位',
      group_buying: '市场研究'
    }
    const phaseName = phaseNames[projectId] || '市场研究'
    
    return {
      welcome: `🚀 **项目【${project.name}】运营启动！**\n\n` +
        `📋 **第一阶段：${phaseName}**\n` +
        `让我们开始规划你的创业之路！\n\n` +
        get().formatTaskChoices(firstTask),
      task: firstTask
    }
  },

  // 格式化任务选择界面
  formatTaskChoices: (task) => {
    if (!task || !task.choices) return ''
    
    let text = `🎯 **当前任务：${task.name}**\n`
    text += `${task.description}\n\n`
    text += `**请选择你的策略：**\n\n`
    
    task.choices.forEach((choice, index) => {
      const costText = []
      if (choice.cost?.energy) costText.push(`⚡${choice.cost.energy}精力`)
      if (choice.cost?.cash) costText.push(`💰¥${choice.cost.cash}`)
      const costStr = costText.length > 0 ? ` (${costText.join(' ')})` : ''
      
      text += `**${index + 1}. ${choice.icon} ${choice.name}**${costStr}\n`
      text += `   ${choice.description}\n`
      if (choice.successRate && choice.successRate < 1) {
        text += `   成功率：${Math.floor(choice.successRate * 100)}%\n`
      }
      text += '\n'
    })
    
    text += `💡 输入数字 **1**、**2** 或 **3** 选择策略`
    return text
  },

  // 显示当前任务选择
  showTaskChoices: () => {
    const state = get()
    const task = state.currentTask
    
    if (!task) {
      return '❌ 当前没有待执行的任务。输入"任务"查看任务列表。'
    }
    
    return get().formatTaskChoices(task)
  },

  // 执行策略选择
  executeChoice: (choiceIndex) => {
    const state = get()
    const task = state.currentTask
    
    if (!task || !task.choices) {
      return '❌ 当前没有待执行的任务。'
    }
    
    const choice = task.choices[choiceIndex]
    if (!choice) {
      return `❌ 无效的选择，请输入 1-${task.choices.length} 之间的数字。`
    }
    
    // 检查资源
    const energyCost = choice.cost?.energy || 0
    const cashCost = choice.cost?.cash || 0
    
    if (state.player.energy < energyCost) {
      return `❌ 精力不足！需要 ${energyCost} 点精力，当前只有 ${state.player.energy} 点。`
    }
    if (state.player.cash < cashCost) {
      return `❌ 资金不足！需要 ¥${cashCost}，当前只有 ¥${state.player.cash}。`
    }
    
    // 计算成功率
    const successRate = choice.successRate || 1
    const skillBonus = (state.player.skills.marketing + state.player.skills.communication) / 400
    const finalSuccessRate = Math.min(0.95, successRate + skillBonus)
    const isSuccess = Math.random() < finalSuccessRate
    
    // 扣除资源
    let newCash = state.player.cash - cashCost
    let newEnergy = state.player.energy - energyCost
    
    // 计算奖励
    const rewards = choice.reward || {}
    const multiplier = isSuccess ? 1 : 0.3 // 失败时只获得30%奖励
    
    // 生成结果文本
    let result = ''
    
    // 推广任务特殊处理
    if (task.isPromotion && choice.channelId) {
      const channel = PROMOTION_CHANNELS.find(c => c.id === choice.channelId)
      if (isSuccess) {
        result = `📢 **${choice.name} - 推广成功！**\n\n`
        result += `🎯 在${channel?.name || choice.name}发布内容获得不错反响！\n`
        const likes = Math.floor(Math.random() * 50) + 20
        const comments = Math.floor(Math.random() * 20) + 5
        const shares = Math.floor(Math.random() * 10) + 2
        result += `👍 点赞 ${likes} | 💬 评论 ${comments} | 🔄 分享 ${shares}\n`
      } else {
        result = `📢 **${choice.name} - 推广效果一般**\n\n`
        result += `内容发布了，但没有获得太多关注...\n`
        result += `💡 下次可以尝试蹭热点或优化内容质量\n`
      }
    } else if (isSuccess) {
      result = `✅ **${choice.name} - 成功！**\n\n`
      result += get().generateChoiceResult(task, choice, true)
    } else {
      result = `⚠️ **${choice.name} - 效果不佳**\n\n`
      result += get().generateChoiceResult(task, choice, false)
    }
    
    // 计算实际奖励
    let rewardText = '\n\n📊 **本次收获：**\n'
    const player = { ...state.player, energy: newEnergy, cash: newCash }
    const metrics = { ...state.communityMetrics }
    const promo = { ...state.promotionStats }
    
    if (rewards.exp) {
      const expGain = Math.floor(rewards.exp * multiplier)
      player.experience += expGain
      rewardText += `- 经验 +${expGain}\n`
    }
    if (rewards.cash) {
      const cashGain = Math.floor(rewards.cash * multiplier)
      player.cash += cashGain
      rewardText += `- 资金 +¥${cashGain}\n`
    }
    if (rewards.marketing) {
      const skillGain = Math.floor(rewards.marketing * multiplier)
      player.skills.marketing = Math.min(100, player.skills.marketing + skillGain)
      rewardText += `- 营销技能 +${skillGain}\n`
    }
    if (rewards.members) {
      const memberGain = Math.floor(rewards.members * multiplier)
      metrics.totalMembers += memberGain
      rewardText += `- 社群成员 +${memberGain}人\n`
    }
    if (rewards.reach) {
      const reachGain = Math.floor(rewards.reach * multiplier)
      promo.totalReach += reachGain
      rewardText += `- 曝光 +${reachGain}人\n`
    }
    if (rewards.trust) {
      const trustGain = Math.floor(rewards.trust * multiplier)
      metrics.trust = Math.min(100, metrics.trust + trustGain)
      rewardText += `- 信任度 +${trustGain}\n`
    }
    if (rewards.engagement) {
      const engGain = Math.floor(rewards.engagement * multiplier)
      metrics.engagement = Math.min(100, metrics.engagement + engGain)
      rewardText += `- 活跃度 +${engGain}\n`
    }
    if (rewards.orders) {
      const orderGain = Math.floor(rewards.orders * multiplier)
      metrics.todayOrders += orderGain
      metrics.totalOrders += orderGain
      player.cash += orderGain * 50
      rewardText += `- 订单 +${orderGain}单 (收入 +¥${orderGain * 50})\n`
    }
    if (rewards.conversion) {
      const convGain = Math.floor(rewards.conversion * multiplier)
      metrics.conversion = Math.min(100, metrics.conversion + convGain)
      rewardText += `- 转化率 +${convGain}%\n`
    }
    
    // 风险惩罚
    if (!isSuccess && choice.riskTrust) {
      metrics.trust = Math.max(0, metrics.trust + choice.riskTrust)
      rewardText += `- ⚠️ 信任度 ${choice.riskTrust}\n`
    }
    
    // 推广任务额外统计
    if (task.isPromotion && choice.channelId) {
      promo.totalCampaigns = (promo.totalCampaigns || 0) + 1
      const conversionRate = isSuccess ? 0.03 : 0.01
      const newLeads = Math.floor((rewards.reach || 0) * multiplier * conversionRate)
      promo.totalLeads = (promo.totalLeads || 0) + newLeads
      if (newLeads > 0) {
        rewardText += `- 潜在客户 +${newLeads}人\n`
      }
    }
    
    result += rewardText
    
    // 生成客户互动
    let chatMessages = []
    if (task.isCustomerInteraction || rewards.members || rewards.orders) {
      chatMessages = get().generateCustomerChats(isSuccess ? 3 : 1)
      if (chatMessages.length > 0) {
        result += '\n💬 **社群动态：**\n' + chatMessages.map(c => `${c.avatar} ${c.name}：${c.message}`).join('\n')
      }
    }
    
    // 完成任务，进入下一个
    const completedTasks = [...state.completedTasks, { ...task, choice: choice.id, success: isSuccess, completedAt: new Date() }]
    const remainingTasks = state.taskQueue.filter(t => t.id !== task.id)
    
    let nextTask = null
    let phaseComplete = false
    
    if (remainingTasks.length > 0) {
      nextTask = remainingTasks[0]
    } else {
      phaseComplete = true
      const nextPhase = state.currentPhase + 1
      if (nextPhase <= 5) {
        const phaseKeys = ['market_research', 'promotion_prep', 'promotion_exec', 'community_ops', 'conversion']
        // 使用项目专属任务模板
        const projectTasks = state.currentProjectTasks || PROJECT_TASKS[task.projectId] || DEFAULT_TASKS
        const nextPhaseTasks = projectTasks[phaseKeys[nextPhase - 1]].map(t => ({
          ...t,
          projectId: task.projectId,
          status: 'pending'
        }))
        set({
          currentPhase: nextPhase,
          taskQueue: nextPhaseTasks,
          currentTask: nextPhaseTasks[0]
        })
        nextTask = nextPhaseTasks[0]
      }
    }
    
    set({
      player,
      communityMetrics: metrics,
      promotionStats: promo,
      completedTasks,
      taskQueue: remainingTasks,
      currentTask: nextTask,
      customerChats: [...state.customerChats, ...chatMessages]
    })
    
    // 显示下一个任务
    if (phaseComplete && nextTask) {
      const phaseNames = ['', '市场研究', '推广准备', '引流推广', '社群运营', '转化变现']
      result += `\n\n🎉 **阶段完成！进入第${state.currentPhase + 1}阶段：${phaseNames[state.currentPhase + 1]}**`
    }
    
    if (nextTask) {
      result += '\n\n' + '═'.repeat(30) + '\n\n'
      result += get().formatTaskChoices(nextTask)
    } else if (state.currentPhase >= 5) {
      result += '\n\n🏆 **恭喜！所有运营任务已完成！**\n你的项目已进入稳定运营阶段。\n\n💡 你可以继续使用"推广"、"运营活动"等命令运营项目。'
    }
    
    return result
  },

  // 生成选择结果描述
  generateChoiceResult: (task, choice, isSuccess) => {
    const results = {
      // 竞品分析
      'analyze_competitors': {
        deep: {
          success: '经过深入研究，你发现了竞品的核心优势和弱点：\n• 主要竞品采用低价策略抢占市场\n• 他们的售后服务是短板\n• 用户普遍反映物流较慢\n\n💡 这些信息将帮助你制定差异化策略！',
          fail: '研究花了不少时间，但信息有限：\n• 只找到了一些表面数据\n• 需要更多渠道收集情报'
        },
        quick: {
          success: '快速扫描了主要竞品：\n• 识别出3个主要竞争对手\n• 了解了大致价格区间\n• 知道了他们的主打产品',
          fail: '扫描太快，遗漏了一些重要信息...'
        },
        spy: {
          success: '卧底调研收获满满！\n• 以客户身份体验了竞品服务\n• 了解了他们的话术和套路\n• 发现了他们不为人知的优惠政策',
          fail: '被竞品客服识破了身份，没问到太多信息...'
        }
      },
      // 目标用户
      'target_audience': {
        broad: {
          success: '广撒网策略效果不错：\n• 触达了多个用户群体\n• 发现年轻妈妈群体最感兴趣\n• 获得了初步的用户画像数据',
          fail: '覆盖面太广，用户反馈比较分散...'
        },
        niche: {
          success: '精准定位效果显著：\n• 锁定25-35岁职场女性\n• 她们有消费能力且追求品质\n• 转化意愿明显更高',
          fail: '目标群体太窄，获客量有限...'
        },
        test: {
          success: 'AB测试数据出炉：\n• A组(年轻妈妈)转化率8%\n• B组(职场女性)转化率12%\n• 明确了最佳目标人群！',
          fail: '测试样本不够，数据不够显著...'
        }
      },
      // 定价策略
      'pricing_strategy': {
        low: {
          success: '低价策略吸引了大量用户：\n• 订单量迅速增长\n• 用户口口相传"这家便宜"\n• 快速积累了第一批客户',
          fail: '价格太低利润微薄，有点吃力...'
        },
        mid: {
          success: '性价比定位获得认可：\n• 用户觉得物有所值\n• 既有销量又有利润\n• 复购率不错',
          fail: '定位有点尴尬，两边都不讨好...'
        },
        premium: {
          success: '高端定位建立了品牌调性：\n• 吸引了追求品质的用户\n• 利润空间充足\n• 用户粘性很高',
          fail: '价格门槛太高，观望的多下单的少...'
        }
      },
      // 内容风格
      'content_style': {
        professional: {
          success: '专业权威的内容风格建立起来了：\n• 发布了几篇深度分析文章\n• 用户评价"很专业，值得信赖"\n• 开始有人主动咨询了',
          fail: '内容太专业，普通用户看不太懂...'
        },
        casual: {
          success: '轻松有趣的风格很受欢迎：\n• 内容阅读量明显提升\n• 用户互动积极，评论区很热闹\n• 分享率超出预期',
          fail: '内容太随意，有用户觉得不够专业...'
        },
        story: {
          success: '故事化内容打动了很多人：\n• 分享了真实的创业故事\n• 评论区很多人表示"太真实了"\n• 引发了情感共鸣',
          fail: '故事讲得不够动人，反响平平...'
        }
      },
      // 渠道选择
      'channel_select': {
        xiaohongshu: {
          success: '小红书种草效果不错：\n• 笔记获得了不少收藏\n• 评论区有人询问购买方式\n• 精准触达了目标用户群',
          fail: '笔记流量一般，需要优化内容...'
        },
        douyin: {
          success: '抖音视频爆了一个小热门：\n• 播放量突破1万\n• 评论区互动热烈\n• 涨了不少粉丝',
          fail: '视频没上热门，流量比较低...'
        },
        wechat: {
          success: '微信私域运营开局顺利：\n• 朋友圈互动率很高\n• 有朋友主动帮忙转发\n• 建立了第一个客户群',
          fail: '朋友圈刷屏被屏蔽了几个...'
        },
        multi: {
          success: '多渠道并行全面开花：\n• 各平台都有一定曝光\n• 形成了矩阵效应\n• 品牌认知度提升',
          fail: '精力分散，每个渠道都做得一般...'
        }
      },
      // 首次推广
      'first_campaign': {
        free_trial: {
          success: '免费试用活动反响热烈：\n• 收到了很多试用申请\n• 试用用户好评如潮\n• 开始有人主动下单了',
          fail: '申请试用的人不少，但转化有限...'
        },
        discount: {
          success: '限时折扣活动成功：\n• 短时间内成交了几单\n• 用户觉得很划算\n• 建立了初步的销售信心',
          fail: '折扣力度不够吸引人...'
        },
        content_only: {
          success: '纯内容引流见效了：\n• 优质内容被大量转发\n• 自然流量稳步增长\n• 积累了一批精准粉丝',
          fail: '内容传播有限，需要坚持积累...'
        }
      },
      // 日常内容
      'daily_content': {
        product: {
          success: '产品展示内容效果不错：\n• 清晰展示了产品特点\n• 有用户直接询价\n• 转化意向明显',
          fail: '产品展示太生硬，像广告...'
        },
        lifestyle: {
          success: '生活分享引发共鸣：\n• 场景化内容很真实\n• 用户留言说"想要同款"\n• 软性种草成功',
          fail: '场景不够贴近用户...'
        },
        hot_topic: {
          success: '蹭热点蹭成功了！\n• 内容获得大量曝光\n• 借势营销效果显著\n• 涨粉明显',
          fail: '热点蹭得有点尬，没火起来...'
        }
      },
      // 用户获取
      'user_acquire': {
        referral: {
          success: '老带新活动效果喜人：\n• 老用户积极推荐朋友\n• 新用户质量很高\n• 裂变效应开始显现',
          fail: '推荐奖励吸引力不够...'
        },
        community: {
          success: '社群裂变玩法成功：\n• 群成员快速增长\n• 群内气氛活跃\n• 形成了社群文化',
          fail: '裂变效果一般，增长缓慢...'
        },
        organic: {
          success: '自然增长稳步进行：\n• 靠口碑慢慢积累\n• 用户质量很高\n• 留存率表现优秀',
          fail: '增长太慢，需要提速...'
        }
      },
      // 客户咨询
      'handle_inquiry': {
        warm: {
          success: '热情服务赢得好感：\n• 客户感受到了真诚\n• 顺利解答了所有疑问\n• 客户表示会考虑购买',
          fail: '太热情反而让客户有压力...'
        },
        professional: {
          success: '专业解答建立信任：\n• 客户对产品有了深入了解\n• 专业度获得认可\n• 成交可能性大增',
          fail: '解答太专业，客户没完全听懂...'
        },
        urgent: {
          success: '紧迫感促成了成交：\n• 客户担心错过优惠\n• 快速下单了\n• 销售技巧奏效',
          fail: '催得太急，客户反感了...'
        }
      },
      // 群内活动
      'group_activity': {
        redpacket: {
          success: '红包活跃了气氛：\n• 群内瞬间热闹起来\n• 大家纷纷冒泡感谢\n• 顺势推了一波产品',
          fail: '红包抢完就没人说话了...'
        },
        quiz: {
          success: '知识问答互动满满：\n• 群成员积极参与答题\n• 在互动中植入了产品信息\n• 既有趣又有用',
          fail: '问题太难，参与的人不多...'
        },
        share: {
          success: '晒单活动效果超预期：\n• 收到了很多真实晒单\n• 形成了良好的口碑效应\n• 新用户被种草了',
          fail: '参与晒单的人比较少...'
        }
      },
      // 处理投诉
      'handle_complaint': {
        apologize: {
          success: '诚恳道歉化解了危机：\n• 客户感受到了诚意\n• 接受了补偿方案\n• 表示会继续支持',
          fail: '道歉了但客户还是不太满意...'
        },
        explain: {
          success: '耐心解释获得理解：\n• 客户明白了实际情况\n• 误会解除了\n• 关系得到修复',
          fail: '解释半天客户不买账...'
        },
        ignore: {
          success: '冷处理后客户自己消气了：\n• 过了一阵子事情平息\n• 没有进一步发酵\n• 侥幸过关',
          fail: '客户更生气了，到处发差评...'
        }
      },
      // 会员关怀
      'member_care': {
        exclusive: {
          success: '专属优惠让会员感到特别：\n• 会员觉得受到重视\n• 复购率明显提升\n• 会员粘性增强',
          fail: '优惠力度不够，吸引力有限...'
        },
        birthday: {
          success: '生日祝福暖心了：\n• 会员收到祝福很感动\n• 在朋友圈分享了\n• 带来了自然曝光',
          fail: '祝福太普通，没什么印象...'
        },
        vip_group: {
          success: 'VIP群运营得很好：\n• 核心用户聚集在一起\n• 形成了铁粉社群\n• 成为了品牌代言人',
          fail: 'VIP群不太活跃...'
        }
      },
      // 销售策略
      'sales_strategy': {
        soft_sell: {
          success: '软性推荐自然成交：\n• 用户感觉不到推销感\n• 主动询问购买方式\n• 成交很自然',
          fail: '太软了，用户没get到购买信息...'
        },
        flash_sale: {
          success: '限时秒杀引爆销量：\n• 订单量瞬间涌入\n• 营造了抢购氛围\n• 销售额创新高',
          fail: '秒杀没几个人抢，有点尴尬...'
        },
        bundle: {
          success: '组合套餐提升客单价：\n• 用户觉得打包更划算\n• 平均客单价提升30%\n• 库存也清了不少',
          fail: '套餐组合不够吸引人...'
        }
      },
      // 团购开团
      'group_buy': {
        small: {
          success: '3人小团很快成团：\n• 用户拉朋友一起买\n• 成团率很高\n• 社交裂变效果好',
          fail: '差一个人成团，有点可惜...'
        },
        medium: {
          success: '10人中团成功开团：\n• 群里组织了拼团\n• 价格优惠到位\n• 大家都很满意',
          fail: '人数凑不齐，团购失败...'
        },
        large: {
          success: '50人大团居然成了！\n• 动员了所有资源\n• 创造了销售奇迹\n• 品牌影响力大增',
          fail: '人数缺口太大，大团失败了...'
        }
      },
      // 扩张决策
      'expand_decide': {
        stable: {
          success: '稳扎稳打策略奏效：\n• 现有客户维护得很好\n• 复购率持续提升\n• 基础越来越扎实',
          fail: '太保守了，增长停滞...'
        },
        expand: {
          success: '快速扩张大获成功：\n• 新用户涌入\n• 市场份额提升\n• 品牌知名度大增',
          fail: '扩张太快，服务跟不上...'
        },
        diversify: {
          success: '品类扩展打开新局面：\n• 新产品线受到欢迎\n• 满足了更多用户需求\n• 收入来源多元化',
          fail: '新品类水土不服，反响平平...'
        }
      },
      // 默认结果
      'default': {
        success: '策略执行成功，达到了预期效果！',
        fail: '这次效果一般，下次换个策略试试。'
      }
    }
    
    const taskResults = results[task.id] || results['default']
    const choiceResult = taskResults[choice.id] || taskResults
    
    if (typeof choiceResult === 'object' && choiceResult.success) {
      return isSuccess ? choiceResult.success : choiceResult.fail
    }
    
    return isSuccess ? results['default'].success : results['default'].fail
  },

  // 旧的executeTask改为显示选择
  executeTask: () => {
    return get().showTaskChoices()
  },

  // 处理数字输入选择
  handleChoiceInput: (num) => {
    const index = parseInt(num) - 1
    if (isNaN(index) || index < 0) {
      return null
    }
    return get().executeChoice(index)
  },

  // 生成竞品分析
  generateCompetitorAnalysis: () => {
    const competitors = COMPETITORS.slice(0, 3)
    const insights = MARKET_INSIGHTS.find(m => m.topic === '竞品策略').insights
    const selectedInsights = insights.sort(() => Math.random() - 0.5).slice(0, 3)
    
    get().addMarketInsight('competitors', selectedInsights)
    
    return `📊 **竞品分析报告**\n\n` +
      `**主要竞争对手：**\n` +
      competitors.map(c => `${c.avatar} ${c.name} - 实力${c.strength} - ${c.description}`).join('\n') +
      `\n\n**竞品策略洞察：**\n` +
      selectedInsights.map(i => `• ${i}`).join('\n') +
      `\n\n💡 **建议：** 避开正面竞争，寻找差异化定位`
  },

  // 生成用户画像分析
  generateAudienceAnalysis: () => {
    const insights = MARKET_INSIGHTS.find(m => m.topic === '用户画像').insights
    const selectedInsights = insights.sort(() => Math.random() - 0.5).slice(0, 4)
    
    get().addMarketInsight('audience', selectedInsights)
    
    return `👥 **目标用户画像**\n\n` +
      `**用户特征：**\n` +
      selectedInsights.map(i => `• ${i}`).join('\n') +
      `\n\n**用户痛点：**\n` +
      MARKET_INSIGHTS.find(m => m.topic === '用户痛点').insights.slice(0, 3).map(i => `• ${i}`).join('\n') +
      `\n\n💡 **建议：** 针对用户痛点设计产品和服务`
  },

  // 生成市场规模分析
  generateMarketSizeAnalysis: () => {
    const trends = MARKET_INSIGHTS.find(m => m.topic === '消费趋势').insights
    const selectedTrends = trends.sort(() => Math.random() - 0.5).slice(0, 3)
    
    get().addMarketInsight('trends', selectedTrends)
    
    const marketSize = Math.floor(1000 + Math.random() * 9000)
    const growthRate = Math.floor(10 + Math.random() * 25)
    
    return `📈 **市场规模评估**\n\n` +
      `**市场数据：**\n` +
      `• 目标市场规模：约${marketSize}亿元\n` +
      `• 年增长率：${growthRate}%\n` +
      `• 竞争程度：中等偏高\n\n` +
      `**行业趋势：**\n` +
      selectedTrends.map(t => `• ${t}`).join('\n') +
      `\n\n💡 **结论：** 市场空间大，但需要找准切入点`
  },

  // 生成内容规划
  generateContentPlan: () => {
    const contentTypes = CONTENT_TYPES.slice(0, 4)
    return `📝 **内容发布计划**\n\n` +
      `**推荐内容类型：**\n` +
      contentTypes.map(c => `${c.icon} ${c.name} - ${c.description}`).join('\n') +
      `\n\n**发布节奏建议：**\n` +
      `• 小红书：每天1-2条图文\n` +
      `• 抖音：每天1条短视频\n` +
      `• 朋友圈：每天2-3条动态\n\n` +
      `💡 **关键：** 保持更新频率，内容要有价值`
  },

  // 生成渠道推荐
  generateChannelRecommendation: () => {
    const channels = PROMOTION_CHANNELS.filter(c => c.cost === 0).slice(0, 4)
    return `📢 **推广渠道分析**\n\n` +
      `**推荐免费渠道：**\n` +
      channels.map(c => `${c.icon} ${c.name}\n   曝光潜力：${c.effect.reach}人 | 转化率：${c.effect.conversion}%\n   ${c.description}`).join('\n\n') +
      `\n\n**渠道优先级：**\n` +
      `1️⃣ 朋友圈 - 信任度高，适合冷启动\n` +
      `2️⃣ 微信群 - 精准触达，转化好\n` +
      `3️⃣ 小红书 - 种草效果佳\n` +
      `4️⃣ 抖音 - 曝光量大\n\n` +
      `💡 **建议：** 先从熟人圈子开始，逐步扩展`
  },

  // 模拟首条内容
  simulateFirstContent: () => {
    const contentType = CONTENT_TYPES[Math.floor(Math.random() * 3)]
    const reach = Math.floor(50 + Math.random() * 100)
    const likes = Math.floor(reach * 0.1)
    
    return `✍️ **首条内容已发布！**\n\n` +
      `📱 内容类型：${contentType.icon} ${contentType.name}\n` +
      `👀 初始曝光：${reach}人\n` +
      `❤️ 点赞数：${likes}\n\n` +
      `**内容预览：**\n` +
      `"大家好！今天给大家分享一个超值好物..."\n\n` +
      `💡 第一条内容的数据很正常，坚持发布会越来越好！`
  },

  // 模拟社交发布
  simulateSocialPost: () => {
    const channel = PROMOTION_CHANNELS[Math.floor(Math.random() * 4)]
    const reach = Math.floor(channel.effect.reach * (0.5 + Math.random() * 0.5))
    const engagement = Math.floor(reach * 0.05)
    
    return `${channel.icon} **${channel.name}内容发布成功！**\n\n` +
      `📊 **数据表现：**\n` +
      `• 曝光量：${reach}人\n` +
      `• 互动数：${engagement}\n` +
      `• 新增关注：${Math.floor(engagement * 0.3)}人\n\n` +
      `💬 有用户开始询问了...`
  },

  // 模拟种子用户
  simulateSeedUsers: () => {
    const users = SIMULATED_USERS.slice(0, 5)
    return `🌱 **种子用户获取成功！**\n\n` +
      `**首批用户：**\n` +
      users.map(u => `${u.avatar} ${u.name} - ${u.type === 'active' ? '活跃用户' : u.type === 'lurker' ? '潜水用户' : u.type === 'influencer' ? '小KOL' : '普通用户'}`).join('\n') +
      `\n\n💡 这些是你的第一批忠实用户，好好维护！`
  },

  // 模拟裂变
  simulateViralAttempt: () => {
    const success = Math.random() > 0.4
    const newUsers = success ? Math.floor(5 + Math.random() * 10) : Math.floor(1 + Math.random() * 3)
    
    return success ?
      `🎉 **裂变活动效果不错！**\n\n` +
      `📈 新增用户：${newUsers}人\n` +
      `🔗 分享次数：${Math.floor(newUsers * 1.5)}次\n\n` +
      `有老用户在帮你推荐了！` :
      `📊 **裂变活动效果一般**\n\n` +
      `📈 新增用户：${newUsers}人\n\n` +
      `💡 下次可以提高裂变奖励试试`
  },

  // 模拟欢迎新人
  simulateWelcomeNew: () => {
    const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)]
    return `👋 **新成员入群！**\n\n` +
      `${user.avatar} ${user.name} 加入了社群\n\n` +
      `你发送了欢迎消息：\n` +
      `"欢迎${user.name}！有任何问题随时问哦~"\n\n` +
      `${user.avatar} ${user.name}：谢谢群主！看了好久终于加入了`
  },

  // 模拟日常互动
  simulateDailyInteraction: () => {
    const users = SIMULATED_USERS.sort(() => Math.random() - 0.5).slice(0, 3)
    return `💬 **社群日常互动**\n\n` +
      `**今日活跃话题：**\n` +
      `你发起了话题："大家最近有什么想要的产品吗？"\n\n` +
      `**用户回复：**\n` +
      users.map(u => `${u.avatar} ${u.name}：${u.interests[0]}类的产品有推荐吗？`).join('\n') +
      `\n\n💡 根据用户需求选品会更精准！`
  },

  // 模拟价值分享
  simulateValueSharing: () => {
    return `📚 **价值内容分享**\n\n` +
      `你在群里分享了一篇实用攻略：\n` +
      `"【省钱攻略】如何用最少的钱买到最好的产品..."\n\n` +
      `**群友反馈：**\n` +
      `👩 丽丽：收藏了！\n` +
      `👨 小王：群主太贴心了\n` +
      `👴 老张：转发给老伴看看\n\n` +
      `💡 持续分享价值内容能建立信任`
  },

  // 模拟产品推荐
  simulateProductRecommend: () => {
    const interested = Math.floor(3 + Math.random() * 5)
    return `🛍️ **产品推荐**\n\n` +
      `你在群里推荐了今日好物：\n` +
      `"今天给大家推荐一款超高性价比的...原价99，群内专享价59！"\n\n` +
      `**用户反应：**\n` +
      `👀 ${interested}人表示感兴趣\n` +
      `❓ 2人询问详情\n` +
      `🛒 1人准备下单\n\n` +
      `💡 产品推荐要突出价值和优惠`
  },

  // 模拟限时优惠
  simulateFlashSale: () => {
    const orders = Math.floor(2 + Math.random() * 4)
    const revenue = orders * (30 + Math.floor(Math.random() * 50))
    return `⚡ **限时秒杀活动**\n\n` +
      `你发起了限时秒杀：\n` +
      `"限时1小时！前10名下单立减20元！"\n\n` +
      `**活动数据：**\n` +
      `🔥 参与人数：${orders + Math.floor(Math.random() * 3)}人\n` +
      `✅ 成交订单：${orders}单\n` +
      `💰 销售额：¥${revenue}\n\n` +
      `🎉 限时活动能有效刺激购买！`
  },

  // 模拟团购
  simulateGroupBuy: () => {
    const participants = Math.floor(5 + Math.random() * 8)
    const orders = Math.floor(participants * 0.7)
    const revenue = orders * (40 + Math.floor(Math.random() * 60))
    return `🛒 **团购活动开团！**\n\n` +
      `你发起了团购：\n` +
      `"3人成团！团购价比市场价便宜30%！"\n\n` +
      `**团购进度：**\n` +
      `👥 参团人数：${participants}人\n` +
      `✅ 成团数：${Math.floor(participants / 3)}个\n` +
      `📦 总订单：${orders}单\n` +
      `💰 销售额：¥${revenue}\n\n` +
      `🎉 团购活动圆满成功！`
  },

  // 生成客户聊天
  generateCustomerChats: (count) => {
    const chats = []
    const types = ['inquiry', 'positive', 'neutral']
    
    for (let i = 0; i < count; i++) {
      const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const messages = CUSTOMER_MESSAGES[type]
      const message = messages[Math.floor(Math.random() * messages.length)]
      
      chats.push({
        id: Date.now() + i,
        avatar: user.avatar,
        name: user.name,
        message,
        type,
        time: new Date()
      })
    }
    
    return chats
  },

  // 添加市场洞察
  addMarketInsight: (category, insights) => {
    const state = get()
    set({
      marketInsights: [...state.marketInsights, { category, insights, time: new Date() }]
    })
  },

  // 查看当前任务
  getTaskStatus: () => {
    const state = get()
    const phaseNames = ['未开始', '市场研究', '推广准备', '引流推广', '社群运营', '转化变现']
    
    if (state.currentPhase === 0) {
      return `📋 **任务系统**\n\n` +
        `当前没有进行中的项目运营。\n\n` +
        `💡 启动一个项目后，会自动开始任务引导！`
    }
    
    let response = `📋 **运营任务进度**\n\n` +
      `📍 当前阶段：第${state.currentPhase}阶段 - ${phaseNames[state.currentPhase]}\n` +
      `✅ 已完成任务：${state.completedTasks.length}个\n\n`
    
    if (state.currentTask) {
      response += `🎯 **当前任务：${state.currentTask.name}**\n` +
        `${state.currentTask.description}\n\n` +
        `💡 输入"执行任务"开始`
    }
    
    if (state.taskQueue.length > 1) {
      response += `\n\n**待完成任务：**\n` +
        state.taskQueue.slice(1).map(t => `• ${t.name}`).join('\n')
    }
    
    return response
  },

  // 查看客户消息
  getCustomerChats: () => {
    const state = get()
    
    if (state.customerChats.length === 0) {
      return `💬 **客户消息**\n\n暂无客户消息。完成引流任务后会有客户互动！`
    }
    
    const recentChats = state.customerChats.slice(-10)
    return `💬 **最近客户消息**\n\n` +
      recentChats.map(c => `${c.avatar} **${c.name}**：${c.message}`).join('\n\n') +
      `\n\n💡 及时回复客户消息能提升转化率！`
  },

  // 回复客户
  replyCustomer: (replyType) => {
    const state = get()
    const pendingChats = state.customerChats.filter(c => c.type === 'inquiry')
    
    if (pendingChats.length === 0) {
      return '💬 当前没有待回复的客户咨询。'
    }
    
    const chat = pendingChats[0]
    const replies = {
      friendly: '亲，这个产品质量很好的，很多老客户都回购了呢~',
      professional: '您好，这款产品采用优质材料，支持7天无理由退换。',
      promotional: '现在下单还有专属优惠哦，限时特价！'
    }
    
    const reply = replies[replyType] || replies.friendly
    const converted = Math.random() > 0.5
    
    // 更新客户状态
    const updatedChats = state.customerChats.map(c => 
      c.id === chat.id ? { ...c, replied: true } : c
    )
    
    let response = `💬 **回复客户**\n\n` +
      `${chat.avatar} ${chat.name}：${chat.message}\n\n` +
      `你回复：${reply}\n\n`
    
    if (converted) {
      response += `🎉 ${chat.name}：好的，那我下单了！\n\n` +
        `✅ 成功转化！订单+1`
      
      set({
        customerChats: updatedChats,
        communityMetrics: {
          ...state.communityMetrics,
          todayOrders: state.communityMetrics.todayOrders + 1,
          totalOrders: state.communityMetrics.totalOrders + 1
        },
        player: {
          ...state.player,
          cash: state.player.cash + 50
        }
      })
    } else {
      response += `${chat.avatar} ${chat.name}：好的，我再考虑一下\n\n` +
        `💡 客户还在犹豫，可以稍后再跟进`
      
      set({ customerChats: updatedChats })
    }
    
    return response
  },

  // ========== 市场专员系统 ==========
  
  // 激活市场专员
  activateMarketSpecialist: () => {
    const state = get()
    set({ 
      marketSpecialistActive: true,
      currentAI: 'marketSpecialist'
    })
    
    // 生成一条市场动态
    const dynamics = get().generateMarketDynamic()
    
    return `📊 **市场专员 Luna 已上线！**\n\n` +
      `${AI_PERSONALITIES.marketSpecialist.avatar} 你好！我是市场专员Luna，专注于数据分析和市场研究。\n\n` +
      `我可以帮你：\n` +
      `• **市场教学** - 学习如何分析市场和找数据\n` +
      `• **市场动态** - 查看实时市场趋势和机会\n` +
      `• **平台分析** - 了解各平台用户数据\n` +
      `• **市场报告** - 获取行业深度报告\n\n` +
      `📈 **最新动态：**\n${dynamics}\n\n` +
      `💡 输入以上命令获取更多信息！`
  },

  // 生成市场动态消息
  generateMarketDynamic: () => {
    const state = get()
    const month = state.gameMonth
    const industries = ['电商零售', '内容创作', '在线教育', '社交团购', '自由职业']
    const platforms = ['小红书', '抖音', '微信', '微博']
    const categories = ['美妆', '食品', '家居', '服装', '数码']
    const ages = ['18-24', '25-35', '35-45']
    const features = ['性价比', '品质', '服务', '包装', '物流速度']
    const topics = ['双十一', '年货节', '618', '开学季', '春节送礼']
    const niches = ['宠物用品', '健康食品', '小众护肤', '智能家居', '手工饰品']
    
    const typeIndex = Math.floor(Math.random() * MARKET_DYNAMICS.length)
    const dynamicType = MARKET_DYNAMICS[typeIndex]
    const messageIndex = Math.floor(Math.random() * dynamicType.messages.length)
    let message = dynamicType.messages[messageIndex]
    
    // 替换占位符
    message = message
      .replace('{industry}', industries[Math.floor(Math.random() * industries.length)])
      .replace('{percent}', Math.floor(10 + Math.random() * 30))
      .replace('{topic}', topics[Math.floor(Math.random() * topics.length)])
      .replace('{time}', ['20:00-22:00', '12:00-14:00', '09:00-10:00'][Math.floor(Math.random() * 3)])
      .replace('{niche}', niches[Math.floor(Math.random() * niches.length)])
      .replace('{age}', ages[Math.floor(Math.random() * ages.length)])
      .replace('{category}', categories[Math.floor(Math.random() * categories.length)])
      .replace('{platform}', platforms[Math.floor(Math.random() * platforms.length)])
      .replace('{month}', ['1-2', '3-4', '5-6', '7-8', '9-10', '11-12'][Math.floor(month / 2)])
      .replace('{feature}', features[Math.floor(Math.random() * features.length)])
      .replace('{cost}', Math.floor(20 + Math.random() * 80))
      .replace('{comparison}', Math.random() > 0.5 ? '优于行业平均' : '需要优化')
    
    return message
  },

  // 获取市场教学技巧
  getMarketTips: () => {
    const state = get()
    const learnedCount = state.learnedTips.length
    
    let response = `📊 **市场专员Luna的市场分析课堂**\n\n`
    response += `${AI_PERSONALITIES.marketSpecialist.avatar} 让我教你如何找市场和分析数据！\n\n`
    
    MARKET_SPECIALIST_TIPS.forEach((tip, index) => {
      const learned = state.learnedTips.includes(tip.id)
      response += `${tip.icon} **${index + 1}. ${tip.title}** ${learned ? '✅已学习' : ''}\n`
      response += `   ${tip.content}\n\n`
    })
    
    response += `━━━━━━━━━━━━━━━━━━━━\n`
    response += `📈 **实战建议：**\n`
    response += `1. 每周花30分钟看行业报告\n`
    response += `2. 关注3-5个竞品的动态\n`
    response += `3. 建立自己的数据追踪表\n`
    response += `4. 定期复盘调整策略\n\n`
    response += `💡 已学习 ${learnedCount}/${MARKET_SPECIALIST_TIPS.length} 个技巧`
    
    // 标记为已学习
    if (learnedCount < MARKET_SPECIALIST_TIPS.length) {
      const nextTip = MARKET_SPECIALIST_TIPS.find(t => !state.learnedTips.includes(t.id))
      if (nextTip) {
        set({ 
          learnedTips: [...state.learnedTips, nextTip.id],
          player: {
            ...state.player,
            skills: {
              ...state.player.skills,
              marketing: Math.min(100, state.player.skills.marketing + 2)
            },
            experience: state.player.experience + 15
          }
        })
        response += `\n\n🎉 学习了【${nextTip.title}】！营销技能+2，经验+15`
      }
    }
    
    return response
  },

  // 获取市场动态
  getMarketDynamics: () => {
    const state = get()
    const month = state.gameMonth
    
    // 生成多条动态
    const dynamics = []
    for (let i = 0; i < 5; i++) {
      dynamics.push(get().generateMarketDynamic())
    }
    
    // 基于季节生成市场建议
    const seasonAdvice = {
      1: '年货节即将到来，食品礼盒类需求旺盛',
      2: '春节后消费回落，适合积累内容和粉丝',
      3: '春季换新，服装家居类需求上升',
      4: '清明踏青季，户外用品关注度提升',
      5: '母亲节+520，礼品类需求高峰',
      6: '618大促，全品类爆发期',
      7: '暑期档，教育培训和亲子产品热销',
      8: '开学季预热，学习用品需求上涨',
      9: '秋季换新，服装美妆类活跃',
      10: '双十一预热期，是积累流量的好时机',
      11: '双十一大促，年度最大购物节',
      12: '双十二+年终，冲刺全年业绩'
    }
    
    let response = `📊 **实时市场动态 - ${state.gameYear}年${month}月**\n\n`
    response += `${AI_PERSONALITIES.marketSpecialist.avatar} Luna为你整理的最新市场情报：\n\n`
    
    response += `📅 **本月市场特点：**\n`
    response += `${seasonAdvice[month]}\n\n`
    
    response += `📈 **实时动态：**\n`
    dynamics.forEach((d, i) => {
      response += `${i + 1}. ${d}\n`
    })
    
    response += `\n━━━━━━━━━━━━━━━━━━━━\n`
    response += `📊 **行业增长数据：**\n`
    Object.entries(REALTIME_MARKET_DATA.industries).forEach(([name, data]) => {
      const seasonFactor = data.season[month - 1]
      const currentGrowth = (data.baseGrowth * seasonFactor + (Math.random() - 0.5) * data.volatility).toFixed(1)
      const trend = seasonFactor > 1 ? '📈' : seasonFactor < 1 ? '📉' : '➡️'
      response += `${trend} ${name}: ${currentGrowth}% ${seasonFactor > 1.1 ? '🔥热门' : ''}\n`
    })
    
    response += `\n💡 输入"平台分析"查看各平台详细数据`
    
    return response
  },

  // 获取平台分析
  getPlatformAnalysis: () => {
    const state = get()
    
    let response = `📱 **平台数据分析报告**\n\n`
    response += `${AI_PERSONALITIES.marketSpecialist.avatar} Luna为你分析各平台特点：\n\n`
    
    Object.entries(REALTIME_MARKET_DATA.platforms).forEach(([name, data]) => {
      response += `━━━━━━━━━━━━━━━━━━━━\n`
      response += `📱 **${name}**\n`
      response += `👥 用户规模：${data.users}\n`
      response += `📊 平均互动率：${data.avgEngagement}%\n`
      response += `🎯 最佳内容类型：${data.bestContent}\n`
      response += `⏰ 发布黄金时间：${data.peakHours}\n\n`
    })
    
    response += `━━━━━━━━━━━━━━━━━━━━\n`
    response += `💡 **Luna的建议：**\n\n`
    
    if (state.activeProjects.length > 0) {
      const project = state.activeProjects[0]
      if (project.id === 'content' || project.id === 'affiliate') {
        response += `基于你的【${project.name}】项目，推荐优先布局**抖音**和**小红书**，\n`
        response += `这两个平台的内容曝光机会大，适合新手起步。\n\n`
      } else if (project.id === 'group_buying' || project.id === 'community') {
        response += `基于你的【${project.name}】项目，推荐优先布局**微信**私域，\n`
        response += `通过朋友圈和社群运营，转化率更高。\n\n`
      } else {
        response += `建议从**微信朋友圈**开始，利用熟人信任快速起步，\n`
        response += `再逐步拓展到**小红书**获取公域流量。\n\n`
      }
    } else {
      response += `新手建议从**微信朋友圈**开始，利用熟人信任快速验证想法，\n`
      response += `再逐步拓展到公域平台获取更多流量。\n\n`
    }
    
    response += `📈 数据是最好的老师，记得定期分析你的运营数据！`
    
    return response
  },

  // 发送市场专员消息（在聊天中插入市场动态）
  sendMarketSpecialistMessage: () => {
    const state = get()
    if (!state.marketSpecialistActive) return
    
    const dynamic = get().generateMarketDynamic()
    const message = {
      id: Date.now(),
      type: 'ai',
      sender: AI_PERSONALITIES.marketSpecialist,
      content: `📊 **市场快讯**\n\n${dynamic}\n\n💡 抓住机会！`,
      timestamp: new Date()
    }
    
    set({ messages: [...state.messages, message] })
  },

  // ========== 角色对话系统 ==========
  
  // 角色对话
  characterDialogue: (characterId) => {
    const state = get()
    const characters = {
      mentor: {
        name: '创业导师 Alex',
        avatar: '👨‍💼',
        greetings: [
          '你好！我是Alex，很高兴见到你！有什么创业问题尽管问我。',
          '嗨！准备好开始今天的创业之旅了吗？让我来帮你规划一下！',
          '欢迎！作为你的创业导师，我会全力支持你的每一个决定。'
        ],
        tips: [
          '💡 创业第一步：先验证你的想法是否有市场需求。',
          '💡 保持学习的心态，市场变化很快，要跟上节奏。',
          '💡 不要害怕失败，每次失败都是成长的机会。',
          '💡 建立你的人脉网络，很多机会来自于人际关系。'
        ],
        questions: [
          '你今天想了解哪方面的创业知识？',
          '有什么具体的问题困扰着你吗？',
          '需要我帮你分析一下当前的项目进展吗？'
        ]
      },
      customer: {
        name: '顾客 小美',
        avatar: '🛍️',
        greetings: [
          '哇～你们家有什么好东西推荐吗？',
          '朋友推荐我来的，听说质量不错！',
          '我正在找一些好用的产品，能给我介绍一下吗？'
        ],
        tips: [
          '🛒 我喜欢性价比高的产品！',
          '🛒 包装好看的话我会更想买～',
          '🛒 有优惠活动的话记得告诉我哦！',
          '🛒 售后服务好的话我会推荐给朋友的！'
        ],
        questions: [
          '你们最近有什么新品吗？',
          '有没有什么优惠活动呀？',
          '这个产品有其他颜色吗？'
        ]
      },
      investor: {
        name: '投资人 David',
        avatar: '💰',
        greetings: [
          '你好，我听说了你的项目，很感兴趣。',
          '让我看看你们的数据，我对有潜力的项目一直保持关注。',
          '创业不容易，但我欣赏有冲劲的年轻人。说说你的计划。'
        ],
        tips: [
          '📊 我看重的是增长潜力和团队执行力。',
          '📊 数据要真实，不要夸大其词。',
          '📊 告诉我你的竞争壁垒是什么。',
          '📊 盈利模式要清晰，不能光烧钱。'
        ],
        questions: [
          '你们的月增长率是多少？',
          '目前的获客成本怎么样？',
          '未来6个月的规划是什么？'
        ]
      }
    }
    
    const char = characters[characterId] || characters.mentor
    const greeting = char.greetings[Math.floor(Math.random() * char.greetings.length)]
    const tip = char.tips[Math.floor(Math.random() * char.tips.length)]
    const question = char.questions[Math.floor(Math.random() * char.questions.length)]
    
    // 根据游戏状态生成个性化内容
    let personalizedContent = ''
    if (state.activeProjects.length > 0) {
      const project = state.activeProjects[0]
      if (characterId === 'mentor') {
        personalizedContent = `\n\n📋 我看到你正在做【${project.name}】项目，进展如何？有什么需要帮助的吗？`
      } else if (characterId === 'customer') {
        personalizedContent = `\n\n🛍️ 哦！你做的是${project.name}相关的吗？我正好需要这方面的产品呢！`
      } else if (characterId === 'investor') {
        personalizedContent = `\n\n💼 【${project.name}】项目，嗯，这个赛道我有研究。目前数据表现怎么样？`
      }
    } else {
      if (characterId === 'mentor') {
        personalizedContent = `\n\n🎯 我注意到你还没有启动项目，要不要先看看有哪些适合的项目？输入"查看项目"开始探索！`
      }
    }
    
    // 增加经验值奖励
    set({
      player: {
        ...state.player,
        experience: state.player.experience + 5
      }
    })
    
    return `${char.avatar} **${char.name}**\n\n` +
      `"${greeting}"\n\n` +
      `${tip}${personalizedContent}\n\n` +
      `${char.avatar}: "${question}"\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🎁 与${char.name.split(' ')[0]}对话，经验+5`
  },

  // 获取角色问候语
  getCharacterGreeting: (characterId) => {
    const greetings = {
      mentor: ['让我们开始吧！', '准备好了吗？', '今天想学点什么？'],
      luna: ['数据已准备好！', '来看看最新趋势～', '有新的市场情报！'],
      customer: ['有新品吗？', '最近有优惠吗？', '帮我推荐一下～'],
      investor: ['说说你的计划', '数据呢？', '我在听...']
    }
    const list = greetings[characterId] || greetings.mentor
    return list[Math.floor(Math.random() * list.length)]
  },

  // ========== 休息系统 ==========
  showRestOptions: () => {
    const state = get()
    return `😴 **休息恢复**\n\n当前精力：${state.player.energy}/100\n\n` +
      REST_OPTIONS.map((opt, i) =>
        `**${i + 1}. ${opt.icon} ${opt.name}** ${opt.cost > 0 ? `(¥${opt.cost})` : '(免费)'}\n   恢复精力：+${opt.energyRecover}\n`
      ).join('\n') +
      `\n💡 输入"休息1"到"休息4"选择休息方式`
  },

  doRest: (index) => {
    const state = get()
    const option = REST_OPTIONS[index]
    if (!option) return '❌ 无效的选择，请输入"休息1"-"休息4"'
    if (state.player.cash < option.cost) {
      return `❌ 资金不足！${option.name}需要¥${option.cost}，当前资金¥${state.player.cash}`
    }
    if (state.player.energy >= 95) {
      return '😊 你的精力已经很充沛了，不需要休息！'
    }
    const newEnergy = Math.min(100, state.player.energy + option.energyRecover)
    set({
      player: { ...state.player, cash: state.player.cash - option.cost, energy: newEnergy }
    })
    return `${option.icon} **${option.name}**\n\n${option.timeText}\n\n` +
      `⚡ 精力恢复：${state.player.energy} → ${newEnergy}\n` +
      (option.cost > 0 ? `💰 花费：¥${option.cost}\n` : '') +
      `\n💡 精力充沛才能做更多事情！`
  },

  // ========== 贷款系统 ==========
  showLoanOptions: () => {
    const state = get()
    let response = `🏦 **银行贷款中心**\n\n当前负债：¥${state.totalDebt.toLocaleString()} | 贷款：${state.loans.length}笔\n\n`
    if (state.loans.length > 0) {
      response += `**现有贷款：**\n`
      state.loans.forEach(loan => {
        response += `- ${loan.name}：剩余¥${loan.remaining.toLocaleString()} | 月利${(loan.interest * 100).toFixed(0)}% | 剩${loan.monthsLeft}月\n`
      })
      response += `\n`
    }
    response += `**可申请贷款：**\n\n`
    BANK_LOANS.forEach(loan => {
      const canApply = state.loans.length < 3
      response += `${canApply ? '✅' : '🔒'} **${loan.name}** - ¥${loan.amount.toLocaleString()}\n   ${loan.description} | 期限${loan.term}个月\n\n`
    })
    response += `💡 输入"申请贷款 [贷款名]"申请，如"申请贷款 创业贷款"\n输入"还款"偿还贷款`
    return response
  },

  applyLoan: (loanName) => {
    const state = get()
    const loan = BANK_LOANS.find(l => l.name.includes(loanName) || loanName.includes(l.name.substring(0, 2)))
    if (!loan) return '❌ 未找到该贷款产品，请输入"贷款"查看可用贷款。'
    if (state.loans.length >= 3) return '❌ 你已有3笔贷款，无法再借更多。请先还清部分贷款。'
    if (state.totalDebt > state.player.cash * 5) return '❌ 负债过高，银行拒绝了你的贷款申请。'
    const newLoan = { ...loan, remaining: loan.amount, monthsLeft: loan.term, startMonth: state.gameMonth, startYear: state.gameYear }
    set({
      loans: [...state.loans, newLoan],
      totalDebt: state.totalDebt + loan.amount,
      totalLoansTaken: (state.totalLoansTaken || 0) + 1,
      player: { ...state.player, cash: state.player.cash + loan.amount }
    })
    return `🏦 **贷款审批通过！**\n\n💰 贷款类型：${loan.name}\n💵 金额：¥${loan.amount.toLocaleString()}\n📊 月利率：${(loan.interest * 100).toFixed(0)}%\n📅 期限：${loan.term}个月\n\n⚠️ 每月将自动扣除利息，注意现金流！\n当前总负债：¥${(state.totalDebt + loan.amount).toLocaleString()}`
  },

  repayLoan: () => {
    const state = get()
    if (state.loans.length === 0) return '✅ 你没有任何贷款需要还款！'
    const loan = state.loans[0]
    const repayAmount = Math.min(loan.remaining, state.player.cash)
    if (repayAmount <= 0) return '❌ 资金不足，无法还款。'
    const updatedLoan = { ...loan, remaining: loan.remaining - repayAmount }
    let updatedLoans = state.loans.map((l, i) => i === 0 ? updatedLoan : l)
    let resultText = ''
    if (updatedLoan.remaining <= 0) {
      updatedLoans = updatedLoans.filter((_, i) => i !== 0)
      resultText = `🎉 **贷款还清！**\n\n【${loan.name}】已全部还清！\n\n`
    } else {
      resultText = `💰 **部分还款成功**\n\n还款金额：¥${repayAmount.toLocaleString()}\n剩余欠款：¥${updatedLoan.remaining.toLocaleString()}\n\n`
    }
    set({
      loans: updatedLoans,
      totalDebt: updatedLoans.reduce((sum, l) => sum + l.remaining, 0),
      player: { ...state.player, cash: state.player.cash - repayAmount }
    })
    resultText += `当前总负债：¥${updatedLoans.reduce((sum, l) => sum + l.remaining, 0).toLocaleString()}`
    return resultText
  },

  // ========== 员工系统 ==========
  showHireOptions: () => {
    const state = get()
    let response = `👥 **人才市场**\n\n当前团队：${state.employees.length}/5人 | 月薪支出：¥${state.totalSalaryCost.toLocaleString()}\n\n**可招聘人员：**\n\n`
    AVAILABLE_EMPLOYEES.forEach((emp, i) => {
      const hired = state.employees.find(e => e.id === emp.id)
      response += `**${i + 1}. ${hired ? '✅' : '💼'} ${emp.name}** - 月薪¥${emp.salary}\n   ${emp.description}${hired ? '（已雇佣）' : ''}\n\n`
    })
    response += `💡 输入"招聘1"到"招聘6"雇佣员工\n输入"团队"查看当前团队 | "解雇 [员工名]"辞退员工`
    return response
  },

  hireEmployee: (index) => {
    const state = get()
    const emp = AVAILABLE_EMPLOYEES[index]
    if (!emp) return '❌ 无效的选择'
    if (state.employees.length >= 5) return '❌ 团队已满（最多5人），请先解雇员工腾出位置。'
    if (state.employees.find(e => e.id === emp.id)) return `❌ 你已经雇佣了${emp.name}，不能重复雇佣。`
    if (state.player.cash < emp.salary * 2) return `❌ 资金不足！雇佣${emp.name}需要至少¥${emp.salary * 2}（两月工资保证金）。`
    const newEmployees = [...state.employees, { ...emp, hiredAt: `${state.gameYear}/${state.gameMonth}` }]
    set({
      employees: newEmployees,
      totalSalaryCost: newEmployees.reduce((sum, e) => sum + e.salary, 0),
      player: { ...state.player, cash: state.player.cash - emp.salary }
    })
    get().checkAchievements()
    return `🎉 **成功招聘：${emp.name}！**\n\n💼 职位：${emp.name}\n💰 月薪：¥${emp.salary}\n✨ 效果：${emp.description}\n\n已预付首月工资¥${emp.salary}\n当前团队${newEmployees.length}/5人 | 月薪支出¥${newEmployees.reduce((sum, e) => sum + e.salary, 0)}`
  },

  showTeam: () => {
    const state = get()
    if (state.employees.length === 0) {
      return `👥 **我的团队**\n\n你还没有雇佣任何员工。\n\n💡 输入"招聘"查看可用人才\n员工可以帮你提升技能、恢复精力、增加收入！`
    }
    let response = `👥 **我的团队** (${state.employees.length}/5人)\n\n💰 月薪总支出：¥${state.totalSalaryCost.toLocaleString()}\n\n`
    state.employees.forEach(emp => {
      response += `💼 **${emp.name}** - ¥${emp.salary}/月\n   ${emp.description}\n   入职时间：${emp.hiredAt}\n\n`
    })
    response += `**团队效果（每月）：**\n`
    let totalEnergyBonus = 0, totalRevenueBoost = 0
    state.employees.forEach(emp => {
      if (emp.bonus.energy) totalEnergyBonus += emp.bonus.energy
      if (emp.bonus.revenueBoost) totalRevenueBoost += emp.bonus.revenueBoost
    })
    if (totalEnergyBonus > 0) response += `⚡ 精力恢复 +${totalEnergyBonus}\n`
    if (totalRevenueBoost > 0) response += `📈 收入提升 +${Math.floor(totalRevenueBoost * 100)}%\n`
    response += `\n💡 输入"解雇 [员工名]"解雇员工`
    return response
  },

  fireEmployee: (empName) => {
    const state = get()
    const emp = state.employees.find(e => e.name.includes(empName) || empName.includes(e.name))
    if (!emp) return `❌ 未找到该员工，输入"团队"查看当前员工列表。`
    const newEmployees = state.employees.filter(e => e.id !== emp.id)
    const severancePay = Math.floor(emp.salary / 2)
    set({
      employees: newEmployees,
      totalSalaryCost: newEmployees.reduce((sum, e) => sum + e.salary, 0),
      player: { ...state.player, cash: state.player.cash - severancePay }
    })
    return `👋 **已解雇：${emp.name}**\n\n支付遣散费¥${severancePay}\n当前团队${newEmployees.length}/5人\n月薪支出降至¥${newEmployees.reduce((sum, e) => sum + e.salary, 0)}`
  },

  // ========== 危机事件系统 ==========
  formatCrisisChoices: (crisis) => {
    if (!crisis) return ''
    let text = `🚨 **${crisis.name}**\n\n${crisis.description}\n\n**请立即做出决策：**\n\n`
    crisis.choices.forEach((choice, i) => {
      const costParts = []
      if (choice.cost.cash) costParts.push(`💰¥${choice.cost.cash}`)
      if (choice.cost.energy) costParts.push(`⚡${choice.cost.energy}精力`)
      if (choice.cost.reputation && choice.cost.reputation < 0) costParts.push(`⭐${choice.cost.reputation}声誉`)
      const costStr = costParts.length > 0 ? ` (${costParts.join(' ')})` : ''
      text += `**${i + 1}. ${choice.icon} ${choice.name}**${costStr}\n`
      if (choice.successRate < 1) text += `   成功率：${Math.floor(choice.successRate * 100)}%\n`
      text += '\n'
    })
    text += `⚠️ 输入 **1**、**2** 或 **3** 做出决策！`
    return text
  },

  handleCrisisChoice: (choiceIndex) => {
    const state = get()
    const crisis = state.pendingCrisis
    if (!crisis) return null
    const choice = crisis.choices[choiceIndex]
    if (!choice) return `❌ 无效选择，请输入1-${crisis.choices.length}`
    if (choice.cost.cash && state.player.cash < choice.cost.cash) return `❌ 资金不足！需要¥${choice.cost.cash}`
    if (choice.cost.energy && state.player.energy < choice.cost.energy) return `❌ 精力不足！需要${choice.cost.energy}点精力`
    const isSuccess = Math.random() < (choice.successRate || 1)
    const player = { ...state.player }
    if (choice.cost.cash) player.cash -= choice.cost.cash
    if (choice.cost.energy) player.energy = Math.max(0, player.energy - choice.cost.energy)
    if (choice.cost.reputation) player.reputation = Math.max(0, player.reputation + choice.cost.reputation)
    let resultText = ''
    if (isSuccess) {
      resultText = `✅ **危机处理成功！**\n\n${choice.icon} ${choice.name}\n\n**获得：**\n`
      const r = choice.reward || {}
      if (r.cash) { player.cash += r.cash; resultText += `💰 资金 +¥${r.cash}\n` }
      if (r.exp) { player.experience += r.exp; resultText += `📈 经验 +${r.exp}\n` }
      if (r.reputation) { player.reputation = Math.min(100, player.reputation + r.reputation); resultText += `⭐ 声誉 +${r.reputation}\n` }
      if (r.trust) { resultText += `🤝 信任度 +${r.trust}\n` }
      if (r.energy) { player.energy = Math.min(100, player.energy + r.energy); resultText += `⚡ 精力 +${r.energy}\n` }
      if (r.technology) { player.skills = { ...player.skills, technology: Math.min(100, player.skills.technology + r.technology) }; resultText += `🔧 技术 +${r.technology}\n` }
      if (r.networking) { player.skills = { ...player.skills, networking: Math.min(100, player.skills.networking + r.networking) }; resultText += `🤝 人脉 +${r.networking}\n` }
      if (r.management) { player.skills = { ...player.skills, management: Math.min(100, player.skills.management + r.management) }; resultText += `📋 管理 +${r.management}\n` }
      if (r.creativity) { player.skills = { ...player.skills, creativity: Math.min(100, player.skills.creativity + r.creativity) }; resultText += `💡 创意 +${r.creativity}\n` }
      if (r.reach) { resultText += `📢 曝光 +${r.reach}\n` }
      if (r.members) { resultText += `👥 成员 +${r.members}\n` }
    } else {
      resultText = `⚠️ **危机处理失败...**\n\n${choice.icon} ${choice.name}\n\n这次没有达到预期效果。\n`
      if (choice.riskReputation) {
        player.reputation = Math.max(0, player.reputation + choice.riskReputation)
        resultText += `⭐ 声誉 ${choice.riskReputation}\n`
      }
    }
    set({ player, pendingCrisis: null, crisisHandled: state.crisisHandled + 1 })
    get().checkAchievements()
    resultText += `\n已处理危机：${state.crisisHandled + 1}次`
    return resultText
  },

  // ========== 评分系统 ==========
  calculateScore: () => {
    const state = get()
    const p = state.player
    const wealthScore = Math.min(30, Math.floor(p.cash / 5000) * 2)
    const reputationScore = Math.min(20, Math.floor(p.reputation / 5))
    const skillScore = Math.min(20, Math.floor(Object.values(p.skills).reduce((a, b) => a + b, 0) / 25))
    const projectScore = Math.min(15, state.activeProjects.length * 3 + state.completedProjects.length * 2)
    const achievementScore = Math.min(10, state.unlockedAchievements.length * 2)
    const teamScore = Math.min(5, state.employees.length)
    const totalScore = wealthScore + reputationScore + skillScore + projectScore + achievementScore + teamScore
    set({ gameScore: totalScore })
    let grade = 'F', gradeText = '创业小白'
    if (totalScore >= 90) { grade = 'S'; gradeText = '创业传奇' }
    else if (totalScore >= 80) { grade = 'A'; gradeText = '商业大亨' }
    else if (totalScore >= 65) { grade = 'B'; gradeText = '创业达人' }
    else if (totalScore >= 50) { grade = 'C'; gradeText = '小有成就' }
    else if (totalScore >= 35) { grade = 'D'; gradeText = '初出茅庐' }
    else if (totalScore >= 20) { grade = 'E'; gradeText = '创业新手' }
    const bar = (val, max) => {
      const filled = Math.min(10, Math.floor(val / max * 10))
      return '█'.repeat(filled) + '░'.repeat(10 - filled)
    }
    get().checkAchievements()
    return `🏆 **创业评分报告**\n\n` +
      `**总评分：${totalScore}/100 (${grade}级 - ${gradeText})**\n\n` +
      `${'⭐'.repeat(Math.ceil(totalScore / 20))}${'☆'.repeat(5 - Math.ceil(totalScore / 20))}\n\n` +
      `**各维度得分：**\n` +
      `💰 财富积累：${wealthScore}/30 ${bar(wealthScore, 30)}\n` +
      `⭐ 声誉口碑：${reputationScore}/20 ${bar(reputationScore, 20)}\n` +
      `🎯 技能水平：${skillScore}/20 ${bar(skillScore, 20)}\n` +
      `📋 项目成就：${projectScore}/15 ${bar(projectScore, 15)}\n` +
      `🏆 成就收集：${achievementScore}/10 ${bar(achievementScore, 10)}\n` +
      `👥 团队建设：${teamScore}/5 ${bar(teamScore, 5)}\n\n` +
      `**📊 创业数据：**\n` +
      `- 创业时长：${((state.gameYear - 2026) * 12 + state.gameMonth)}个月\n` +
      `- 总资产：¥${p.cash.toLocaleString()}\n` +
      `- 负债：¥${state.totalDebt.toLocaleString()}\n` +
      `- 团队规模：${state.employees.length}人\n` +
      `- 已处理危机：${state.crisisHandled}次\n` +
      `- 完成挑战：${state.completedChallenges}次\n\n` +
      `💡 继续努力，提升各项指标冲击更高评级！`
  }
}))

export default useGameStore
export { STARTUP_PROJECTS, MARKET_EVENTS, MARKET_DATA, AI_PERSONALITIES, ACHIEVEMENTS, DAILY_TASKS, CHALLENGES, COMPETITORS, INVESTORS, TRAINING_COURSES, RANDOM_EVENTS, SIMULATED_USERS, OPERATION_ACTIVITIES, PROMOTION_CHANNELS, CONTENT_TYPES, MARKET_SPECIALIST_TIPS, REALTIME_MARKET_DATA, REST_OPTIONS, BANK_LOANS, AVAILABLE_EMPLOYEES, CRISIS_EVENTS, PREMIUM_FINANCING_METHODS, validateSerial }
