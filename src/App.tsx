import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  MessageCircleQuestion,
  MessageSquarePlus,
  Play,
  RefreshCcw,
  Scale,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

import { experts, type ExpertProfile } from './experts';

type Page = 'home' | 'debate';
type Stage = 'startup' | 'growth' | 'mature' | 'transition';
type ScaleValue = 'lt100' | '100-500' | '500-2000' | 'gt2000';
type Urgency = 'observe' | 'quarter' | 'urgent';
type DebateMode = 'balanced' | 'contentious' | 'execution';
type TopicKey =
  | 'structure'
  | 'culture'
  | 'performance'
  | 'change'
  | 'talent'
  | 'leadership'
  | 'hybrid';

type CaseContext = {
  stage: Stage;
  scale: ScaleValue;
  urgency: Urgency;
  mode: DebateMode;
};

type TopicProfile = {
  label: string;
  diagnosis: string;
  firstMove: string;
  hypothesis: string;
  risk: string;
  keywords: string[];
  questions: string[];
  interventions: string[];
  metrics: string[];
};

type DebateMessage = {
  id: string;
  kind: 'expert' | 'user';
  round: number;
  phase: string;
  author: string;
  role: string;
  content: string;
  counterpoint?: string;
  action?: string;
  expert?: ExpertProfile;
};

const sampleQuestions = [
  '业务增长很快，但中后台和销售团队互相抱怨，HR该怎么推动组织协同？',
  '公司要做组织重组，中层抵触明显，如何设计变革推进节奏？',
  '绩效制度改了很多次，员工仍觉得不公平，问题可能在哪里？',
];

const stageOptions: { value: Stage; label: string }[] = [
  { value: 'startup', label: '创业期' },
  { value: 'growth', label: '成长期' },
  { value: 'mature', label: '成熟期' },
  { value: 'transition', label: '转型期' },
];

const scaleOptions: { value: ScaleValue; label: string }[] = [
  { value: 'lt100', label: '100人以下' },
  { value: '100-500', label: '100-500人' },
  { value: '500-2000', label: '500-2000人' },
  { value: 'gt2000', label: '2000人以上' },
];

const urgencyOptions: { value: Urgency; label: string }[] = [
  { value: 'observe', label: '先诊断' },
  { value: 'quarter', label: '本季度落地' },
  { value: 'urgent', label: '立即干预' },
];

const modeOptions: { value: DebateMode; label: string }[] = [
  { value: 'balanced', label: '稳健会诊' },
  { value: 'contentious', label: '激烈质询' },
  { value: 'execution', label: '落地优先' },
];

const topicProfiles: Record<TopicKey, TopicProfile> = {
  structure: {
    label: '组织结构与协同',
    diagnosis: '权责、接口、决策权和横向协作机制没有被同一套经营目标牵引',
    firstMove: '画出关键价值流、决策点和跨部门交付接口',
    hypothesis: '当前低效来自职责边界和决策机制错位，而不只是员工配合度不足',
    risk: '只调整组织图，却没有同步授权、会议机制和绩效责任',
    keywords: [
      '结构',
      '架构',
      '部门',
      '协同',
      '职责',
      '流程',
      '矩阵',
      '接口',
      '决策',
    ],
    questions: [
      '哪些关键事项必须跨部门完成，但没有单一负责人对结果负责？',
      '哪些会议在做决策，哪些会议只是在同步信息？',
      '一线遇到冲突时，升级路径是清晰的还是靠个人关系推动？',
    ],
    interventions: [
      '建立关键价值流责任图',
      '重定义RACI和授权边界',
      '设置跨部门议题的单一决策负责人',
    ],
    metrics: [
      '跨部门事项周期',
      '决策返工率',
      '关键项目延期率',
      '接口争议升级次数',
    ],
  },
  culture: {
    label: '组织文化与信任',
    diagnosis: '价值观口号、领导行为和日常管理动作之间存在落差',
    firstMove: '收集关键场景中的真实行为样本，而不是先重写价值观文案',
    hypothesis: '文化问题背后往往是激励、权力距离和安全感共同作用的结果',
    risk: '把文化当作宣导项目，忽略高层示范和制度信号',
    keywords: [
      '文化',
      '价值观',
      '氛围',
      '信任',
      '冲突',
      '沟通',
      '敬业',
      '归属',
      '心理安全',
    ],
    questions: [
      '员工在哪些场景中会选择沉默，而不是说出真实风险？',
      '领导层最常奖励的行为，和公开倡导的价值观是否一致？',
      '冲突发生后，组织是在复盘问题，还是在寻找责任人？',
    ],
    interventions: [
      '做关键文化场景访谈',
      '把价值观转译为可观察行为',
      '建立团队复盘和冲突调解机制',
    ],
    metrics: [
      '员工净推荐值',
      '心理安全评分',
      '跨层级反馈次数',
      '关键人才留任率',
    ],
  },
  performance: {
    label: '绩效与激励机制',
    diagnosis: '目标、评价、激励和资源配置没有形成闭环',
    firstMove: '检查目标是否能从战略逐层分解到团队和关键岗位',
    hypothesis: '绩效争议不是评分技术问题，而是目标清晰度和管理节奏问题',
    risk: '只改考核表，不改经营复盘、辅导反馈和激励分配',
    keywords: [
      '绩效',
      '激励',
      '考核',
      'kpi',
      'okr',
      '薪酬',
      '奖金',
      '目标',
      '晋升',
    ],
    questions: [
      '员工知道自己为什么拿这个目标，以及目标如何影响公司结果吗？',
      '管理者每月提供反馈，还是只在绩效季一次性评价？',
      '激励分配是在奖励个人英雄，还是奖励组织需要的协作行为？',
    ],
    interventions: [
      '重建目标分解和经营复盘节奏',
      '训练管理者做月度绩效对话',
      '建立绩效校准会和改进计划',
    ],
    metrics: [
      '目标达成率',
      '绩效反馈频次',
      '高绩效人才保留率',
      '团队协同指标达成率',
    ],
  },
  change: {
    label: '变革推进与组织发展',
    diagnosis: '变革理由、利益格局、能力建设和反馈机制没有同时设计',
    firstMove: '明确变革叙事、受影响群体和关键阻力来源',
    hypothesis: '抵触不是态度问题，而是损失感、能力缺口和信任不足的组合',
    risk: '用项目管理替代变革管理，只追进度却不处理组织情绪和能力',
    keywords: [
      '变革',
      '转型',
      '重组',
      '调整',
      '落地',
      '推进',
      '抵触',
      '改革',
      '合并',
    ],
    questions: [
      '这次变革对哪些群体意味着权力、资源或身份的变化？',
      '员工听到的变革理由，是业务语言还是管理口号？',
      '中层管理者是变革伙伴，还是被动传话人？',
    ],
    interventions: [
      '绘制利益相关方影响地图',
      '设计变革沟通和倾听节奏',
      '建立中层变革伙伴小组',
    ],
    metrics: ['关键里程碑完成率', '变革理解度', '试点采用率', '阻力议题关闭率'],
  },
  talent: {
    label: '人才梯队与关键岗位',
    diagnosis: '人才标准、关键岗位、继任准备和业务挑战之间没有对齐',
    firstMove: '识别关键岗位和关键能力缺口，而不是泛化地做培训',
    hypothesis: '人才问题常常是组织能力没有被明确定义和持续盘点',
    risk: '把人才发展做成课程供给，缺少真实业务场景中的历练和反馈',
    keywords: [
      '人才',
      '干部',
      '继任',
      '招聘',
      '留人',
      '梯队',
      '能力',
      '培训',
      '高潜',
      '关键岗位',
    ],
    questions: [
      '哪些岗位一旦空缺，会直接影响战略目标？',
      '高潜标准是在描述潜力，还是在奖励当前绩效？',
      '业务挑战是否被设计成发展人才的真实场域？',
    ],
    interventions: [
      '定义关键岗位和继任风险',
      '建立九宫格和人才校准会',
      '设计业务挑战型发展项目',
    ],
    metrics: [
      '关键岗位继任覆盖率',
      '高潜人才成长速度',
      '关键人才流失率',
      '内部晋升占比',
    ],
  },
  leadership: {
    label: '领导力与管理系统',
    diagnosis: '管理者角色、决策习惯和组织节奏没有支持当前业务复杂度',
    firstMove: '校准管理者必须承担的组织责任和不可外包给HR的动作',
    hypothesis: '很多组织问题最终表现为领导团队没有形成一致的管理语言',
    risk: '把领导力当成个人素质提升，忽略团队决策和管理机制',
    keywords: [
      '领导',
      '管理者',
      '高管',
      '老板',
      '创始人',
      '授权',
      '中层',
      '决策层',
      '管理',
    ],
    questions: [
      '管理者最常把哪些组织责任转交给HR处理？',
      '领导团队是否能对同一问题给出一致的优先级判断？',
      '授权失败是能力问题，还是信任和控制方式问题？',
    ],
    interventions: [
      '建立领导团队组织议题会',
      '统一管理者角色和行为标准',
      '设计授权边界和决策原则',
    ],
    metrics: [
      '管理者反馈质量',
      '授权事项完成率',
      '领导团队一致性评分',
      '关键决策周期',
    ],
  },
  hybrid: {
    label: '综合组织诊断',
    diagnosis: '症状横跨结构、文化、绩效和领导系统，需要先确定主因链条',
    firstMove: '用组织诊断访谈、数据和关键场景观察建立问题地图',
    hypothesis: '当前问题可能不是单一职能问题，而是多个组织系统互相强化',
    risk: '过早给方案，导致HR背负无法由HR单独解决的系统问题',
    keywords: [],
    questions: [
      '这个问题最先在哪里被观察到，最严重的后果是什么？',
      '谁拥有改变这个问题所需的权力和资源？',
      '如果三个月后问题改善，现场会出现什么不同？',
    ],
    interventions: [
      '建立组织问题因果地图',
      '访谈关键利益相关方',
      '选择一个高影响场景做试点',
    ],
    metrics: ['问题关闭率', '业务负责人参与度', '试点改善幅度', '员工体验变化'],
  },
};

const phaseLabels = [
  '诊断假设',
  '交叉质询',
  '方案收敛',
  '压力测试',
  '迭代追问',
];

const defaultContext: CaseContext = {
  stage: 'growth',
  scale: '100-500',
  urgency: 'quarter',
  mode: 'balanced',
};

const getTopicResult = (brief: string) => {
  const scored = (Object.entries(topicProfiles) as [TopicKey, TopicProfile][])
    .filter(([key]) => key !== 'hybrid')
    .map(([key, profile]) => ({
      key,
      score: profile.keywords.reduce(
        (total, keyword) => total + (brief.includes(keyword) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);

  const primary = scored[0]?.score > 0 ? scored[0].key : 'hybrid';
  const secondary = scored
    .filter((item) => item.score > 0 && item.key !== primary)
    .slice(0, 2)
    .map((item) => item.key);

  return { primary, secondary, profile: topicProfiles[primary] };
};

const pick = (items: string[], round: number, offset = 0) =>
  items[(round + offset) % items.length];
const optionLabel = <T extends string>(
  options: { value: T; label: string }[],
  value: T,
) => options.find((option) => option.value === value)?.label ?? value;
const phaseLabel = (round: number) =>
  phaseLabels[Math.min(round - 1, phaseLabels.length - 1)];

function expertMessage(
  expert: ExpertProfile,
  index: number,
  brief: string,
  round: number,
  context: CaseContext,
): DebateMessage {
  const { profile } = getTopicResult(brief);
  const target = experts[(index + round) % experts.length];
  const question = pick(profile.questions, round, index);
  const intervention = pick(profile.interventions, round, index);
  const metric = pick(profile.metrics, round, index);
  const stage = optionLabel(stageOptions, context.stage);
  const scale = optionLabel(scaleOptions, context.scale);
  const tone =
    context.mode === 'contentious'
      ? '我直接质询一个前提'
      : context.mode === 'execution'
        ? '落地上我会先压缩范围'
        : '我补充一个不同判断';

  if (round === 1) {
    return {
      id: `${round}-${expert.id}`,
      kind: 'expert',
      round,
      phase: phaseLabel(round),
      author: expert.name,
      role: expert.school,
      expert,
      content: `从${expert.school}看，这更像“${profile.label}”议题。我的第一判断是：${profile.diagnosis}。在${stage}、${scale}的情境里，HR不宜急着开药方，先用${expert.evidence}验证主因。`,
      counterpoint: `我会先问：${question}`,
      action: `第一步：${profile.firstMove}。`,
    };
  }

  if (round === 2) {
    return {
      id: `${round}-${expert.id}`,
      kind: 'expert',
      round,
      phase: phaseLabel(round),
      author: expert.name,
      role: expert.school,
      expert,
      content: `${tone}：${target.name}强调“${target.stance}”，但如果只沿着这个方向走，可能忽略“${expert.blindSpot}”。我的假设是：${profile.hypothesis}。`,
      counterpoint: `分歧点：先处理${intervention}，还是先做${target.intervention}？`,
      action: `证据要求：用${expert.evidence}交叉验证。`,
    };
  }

  if (round === 3) {
    return {
      id: `${round}-${expert.id}`,
      kind: 'expert',
      round,
      phase: phaseLabel(round),
      author: expert.name,
      role: expert.school,
      expert,
      content: `我接受前两轮争论，但方案必须进入可执行形态。建议把“${expert.intervention}”和“${intervention}”组合成一个试点，限定一个业务单元，观察${metric}是否改善。`,
      counterpoint: `不能只看满意度，要看行为和业务结果是否同步变化。`,
      action: `HR角色：设计节奏、推动反馈、让业务负责人承担结果。`,
    };
  }

  return {
    id: `${round}-${expert.id}`,
    kind: 'expert',
    round,
    phase: phaseLabel(round),
    author: expert.name,
    role: expert.school,
    expert,
    content: `第${round}轮我会继续往下钻：若${metric}没有动，说明主因判断仍需回到“${profile.label}”重新校准。`,
    counterpoint: `我要求补充证据：${question}`,
    action: `下一轮动作：${intervention}，并在两周后复盘。`,
  };
}

const makeRound = (brief: string, round: number, context: CaseContext) =>
  experts.map((expert, index) =>
    expertMessage(expert, index, brief, round, context),
  );

function finalAnswer(brief: string, context: CaseContext, round: number) {
  const { profile, secondary } = getTopicResult(brief);
  const related = secondary.map((key) => topicProfiles[key].label).join('、');
  return {
    diagnosis: `当前问题应按“${profile.label}”处理，重点不是单一HR政策，而是${profile.diagnosis}。${related ? `同时留意${related}的连带影响。` : ''}`,
    consensus: [
      `先用${profile.firstMove}建立事实地图，再决定干预顺序。`,
      `HR负责诊断方法和节奏设计，业务负责人必须拥有问题和结果。`,
      `选择一个高影响场景试点，避免一次性铺开导致反馈失真。`,
      `每两周复盘${profile.metrics[0]}和${profile.metrics[1]}，用数据修正判断。`,
    ],
    disagreements: [
      '查兰和鸿鹄会更早推动业务负责人承诺。',
      '尤里奇会要求HR服务边界和组织能力指标更清楚。',
      '沙因和许知言会提醒：流程变化前先处理隐藏假设和信任问题。',
      '平克会追问工作自主权，复杂性派会反对一次性大方案。',
    ],
    roadmap: [
      `0-2周：访谈关键利益相关方，完成${profile.firstMove}。`,
      `3-6周：围绕一个业务单元试点${profile.interventions[0]}。`,
      `7-12周：将有效做法固化为会议、指标、授权或绩效机制。`,
      `第${Math.max(round, 3)}轮后：保留专家分歧，每月做一次组织复盘。`,
    ],
    metrics: profile.metrics,
  };
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [question, setQuestion] = useState('');
  const [caseBrief, setCaseBrief] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);
  const [context, setContext] = useState<CaseContext>(defaultContext);

  const activeBrief = caseBrief || question;
  const topic = useMemo(() => getTopicResult(activeBrief), [activeBrief]);
  const answer = useMemo(
    () => finalAnswer(activeBrief, context, round),
    [activeBrief, context, round],
  );

  const enterDebate = (initialQuestion = '') => {
    setQuestion(initialQuestion);
    setCaseBrief('');
    setMessages([]);
    setRound(0);
    setFinished(false);
    setFollowUp('');
    setPage('debate');
    window.scrollTo({ top: 0 });
  };

  const start = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setCaseBrief(trimmed);
    setMessages(makeRound(trimmed, 1, context));
    setRound(1);
    setFinished(false);
  };

  const continueDebate = () => {
    const nextRound = round + 1;
    const trimmedFollowUp = followUp.trim();
    const nextBrief = trimmedFollowUp
      ? `${activeBrief}\n追问：${trimmedFollowUp}`
      : activeBrief;
    const userMessage: DebateMessage | null = trimmedFollowUp
      ? {
          id: `user-${nextRound}-${Date.now()}`,
          kind: 'user',
          round: nextRound,
          phase: 'HR追问',
          author: 'HR',
          role: '问题补充',
          content: trimmedFollowUp,
        }
      : null;
    setCaseBrief(nextBrief);
    setMessages((prev) => [
      ...prev,
      ...(userMessage ? [userMessage] : []),
      ...makeRound(nextBrief, nextRound, context),
    ]);
    setRound(nextRound);
    setFollowUp('');
    setFinished(false);
  };

  const reset = () => {
    setQuestion('');
    setCaseBrief('');
    setFollowUp('');
    setMessages([]);
    setRound(0);
    setFinished(false);
    setContext(defaultContext);
  };

  if (page === 'debate') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <button className="ghost-button" onClick={() => setPage('home')}>
            <ArrowLeft size={17} />
            返回首页
          </button>
          <div>
            <span className="eyebrow">HR 组织问题会诊</span>
            <h1>专家辩论室</h1>
          </div>
          <div className="status-pill">
            {finished
              ? '已形成答案'
              : round
                ? `第${round}轮 ${phaseLabel(round)}`
                : '待开始'}
          </div>
        </header>

        <main className="debate-layout">
          <section className="workspace">
            <div className="panel">
              <div className="panel-title">
                <MessageCircleQuestion size={18} />
                组织问题
              </div>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="例如：业务增长很快，但中后台和销售团队互相抱怨，项目经常延期，HR该怎么推动组织协同改善？"
                className="question-input"
              />

              <div className="controls-grid">
                <label>
                  组织阶段
                  <select
                    value={context.stage}
                    onChange={(event) =>
                      setContext((prev) => ({
                        ...prev,
                        stage: event.target.value as Stage,
                      }))
                    }
                  >
                    {stageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  组织规模
                  <select
                    value={context.scale}
                    onChange={(event) =>
                      setContext((prev) => ({
                        ...prev,
                        scale: event.target.value as ScaleValue,
                      }))
                    }
                  >
                    {scaleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  推进节奏
                  <select
                    value={context.urgency}
                    onChange={(event) =>
                      setContext((prev) => ({
                        ...prev,
                        urgency: event.target.value as Urgency,
                      }))
                    }
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="segmented">
                {modeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={context.mode === option.value ? 'active' : ''}
                    onClick={() =>
                      setContext((prev) => ({ ...prev, mode: option.value }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="button-row">
                <button
                  className="primary-button"
                  onClick={start}
                  disabled={!question.trim()}
                >
                  <Play size={17} />
                  开始辩论
                </button>
                <button className="secondary-button" onClick={reset}>
                  <RefreshCcw size={17} />
                  重置
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="debate-heading">
                <div>
                  <div className="panel-title">
                    <Users size={18} />
                    专家辩论
                  </div>
                  <p>
                    {messages.length
                      ? `当前主议题：${topic.profile.label}`
                      : '提交问题后，专家席会开始第一轮诊断。'}
                  </p>
                </div>
                <div className="phase-list">
                  {phaseLabels.slice(0, 4).map((phase, index) => (
                    <span
                      key={phase}
                      className={round >= index + 1 || finished ? 'done' : ''}
                    >
                      {phase}
                    </span>
                  ))}
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="empty-state">
                  <BrainCircuit size={38} />
                  <p>输入问题并点击“开始辩论”。</p>
                </div>
              ) : (
                <div className="message-list">
                  {messages.map((message) =>
                    message.kind === 'user' ? (
                      <article className="user-message" key={message.id}>
                        <MessageSquarePlus size={17} />
                        <span>{message.content}</span>
                      </article>
                    ) : (
                      <article
                        className="expert-message"
                        key={message.id}
                        style={{ borderLeftColor: message.expert?.accent }}
                      >
                        <div className="message-head">
                          <div
                            className="avatar"
                            style={{ background: message.expert?.accent }}
                          >
                            {message.expert?.avatar}
                          </div>
                          <div>
                            <strong>{message.author}</strong>
                            <p>{message.role}</p>
                          </div>
                          <span>
                            第{message.round}轮 · {message.phase}
                          </span>
                        </div>
                        <p>{message.content}</p>
                        <div className="message-points">
                          <div>
                            <Scale size={15} />
                            {message.counterpoint}
                          </div>
                          <div>
                            <Target size={15} />
                            {message.action}
                          </div>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}

              {messages.length > 0 && (
                <div className="follow-up">
                  <textarea
                    value={followUp}
                    onChange={(event) => setFollowUp(event.target.value)}
                    placeholder="补充新的业务背景，或要求专家继续围绕某个分歧辩论。"
                  />
                  <div className="button-row vertical">
                    <button className="primary-button" onClick={continueDebate}>
                      <ArrowRight size={17} />
                      继续辩论
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => setFinished(true)}
                    >
                      <BadgeCheck size={17} />
                      得到答案
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="answer-sidebar">
            <div className="panel sticky">
              <div className="panel-title">
                <ClipboardList size={18} />
                答案板
              </div>
              {messages.length === 0 ? (
                <p className="muted">尚未形成诊断。</p>
              ) : (
                <>
                  <h3>初步诊断</h3>
                  <p>{answer.diagnosis}</p>
                  <h3>共识</h3>
                  {answer.consensus.map((item) => (
                    <div className="answer-item" key={item}>
                      <CheckCircle2 size={16} />
                      {item}
                    </div>
                  ))}
                  {finished && (
                    <>
                      <h3>保留分歧</h3>
                      {answer.disagreements.map((item) => (
                        <div className="mini-card" key={item}>
                          {item}
                        </div>
                      ))}
                      <h3>90天路线</h3>
                      {answer.roadmap.map((item) => (
                        <div className="answer-item" key={item}>
                          <ArrowRight size={16} />
                          {item}
                        </div>
                      ))}
                      <h3>追踪指标</h3>
                      <div className="tag-row">
                        {answer.metrics.map((metric) => (
                          <span key={metric}>{metric}</span>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </aside>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <span className="eyebrow">
          <BrainCircuit size={16} />
          HR 组织问题咨询
        </span>
        <div className="hero-grid">
          <div>
            <h1>让组织发展专家先亮观点，再进入辩论</h1>
            <p>
              首页展示查兰、尤里奇、沙因、鸿鹄、平克、桑德伯格等专家的核心观点和实践案例。点击底部对话框后，进入多流派专家辩论室。
            </p>
          </div>
          <div className="stats">
            <div>
              <strong>{experts.length}</strong>
              <span>专家</span>
            </div>
            <div>
              <strong>OD</strong>
              <span>流派</span>
            </div>
            <div>
              <strong>90天</strong>
              <span>路线</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="experts-grid">
          {experts.map((expert) => (
            <article
              className="expert-card"
              key={expert.id}
              style={{ borderTopColor: expert.accent }}
            >
              <div className="expert-card-head">
                <div className="avatar" style={{ background: expert.accent }}>
                  {expert.avatar}
                </div>
                <div>
                  <h2>{expert.name}</h2>
                  <p>{expert.school}</p>
                </div>
                <span>{expert.origin}</span>
              </div>
              <div className="quote-block">
                <Sparkles size={15} />
                <p>{expert.viewpoint}</p>
              </div>
              <div className="case-block">
                <strong>实际案例</strong>
                <p>{expert.caseStudy}</p>
              </div>
              <p className="takeaway">{expert.takeaway}</p>
            </article>
          ))}
        </section>

        <section className="entry-panel">
          <div className="entry-head">
            <div>
              <div className="panel-title">
                <MessageCircleQuestion size={18} />
                进入专家辩论
              </div>
              <p>点击对话框进入辩论页，随后输入你的组织问题。</p>
            </div>
            <button className="primary-button" onClick={() => enterDebate()}>
              开始
              <ArrowRight size={17} />
            </button>
          </div>
          <textarea
            readOnly
            onClick={() => enterDebate()}
            className="entry-textarea"
            placeholder="点击这里，进入辩论页：例如我们组织协同很弱，HR该如何判断根因并推动改变？"
          />
          <div className="sample-row">
            {sampleQuestions.map((item) => (
              <button key={item} onClick={() => enterDebate(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
