import MockAdapter from 'axios-mock-adapter'
import api from './api'

// ── Seed data ────────────────────────────────────────────────────────────────

const USERS = [
  { id: 1, username: 'jordanc',  email: 'jordan@example.com',  points: 1840, season_rank: 1 },
  { id: 2, username: 'priya_v',  email: 'priya@example.com',   points: 1520, season_rank: 2 },
  { id: 3, username: 'tomasz_k', email: 'tomasz@example.com',  points: 1390, season_rank: 3 },
  { id: 4, username: 'mei_l',    email: 'mei@example.com',     points: 1100, season_rank: 4 },
  { id: 5, username: 'devraj',   email: 'devraj@example.com',  points:  870, season_rank: 5 },
]

const DILEMMAS = [
  {
    id: 1, user_id: 2, username: 'priya_v', category: 'personal',
    content: "My best friend got the job I applied for first. She doesn't know I applied. Do I tell her?",
    votes_yes: 312, votes_no: 88,
    outcome: "I told her. Awkward for a week but we're fine now — she appreciated the honesty.",
    created_at: '2025-03-10T09:00:00Z',
  },
  {
    id: 2, user_id: 3, username: 'tomasz_k', category: 'personal',
    content: "I found out my coworker is lying on their timesheet. We're friends. Do I report it?",
    votes_yes: 198, votes_no: 241,
    outcome: null,
    created_at: '2025-03-11T11:30:00Z',
  },
  {
    id: 3, user_id: 1, username: 'jordanc', category: 'community',
    content: 'Our suburb has budget for ONE upgrade: a new skate park for teens or better lighting on the main walking trail. Which should the council prioritise?',
    votes_yes: 540, votes_no: 390,
    outcome: null,
    created_at: '2025-03-12T08:15:00Z',
  },
  {
    id: 4, user_id: 4, username: 'mei_l', category: 'civic',
    content: 'The Medicare online portal forces you to re-enter your personal details on every single visit — even when logged in. Should fixing this be a top priority for the next digital services sprint?',
    votes_yes: 892, votes_no: 43,
    outcome: null,
    created_at: '2025-03-12T14:00:00Z',
  },
  {
    id: 5, user_id: 5, username: 'devraj', category: 'personal',
    content: "I've been offered a 40% pay rise to move to a competitor. My current team is in the middle of a critical project. Do I take it?",
    votes_yes: 671, votes_no: 204,
    outcome: null,
    created_at: '2025-03-13T07:45:00Z',
  },
  {
    id: 6, user_id: 2, username: 'priya_v', category: 'community',
    content: 'The 24hr laundromat on Elm St wants to close at 10pm due to noise complaints from 3 residents. Hundreds of shift workers rely on it. Should the council override the complaints?',
    votes_yes: 730, votes_no: 120,
    outcome: null,
    created_at: '2025-03-13T10:00:00Z',
  },
  {
    id: 7, user_id: 3, username: 'tomasz_k', category: 'civic',
    content: 'Centrelink appointment wait times are averaging 6 weeks. Should the government fund 200 additional caseworkers before any other service improvement this year?',
    votes_yes: 1100, votes_no: 89,
    outcome: null,
    created_at: '2025-03-13T13:20:00Z',
  },
  {
    id: 8, user_id: 1, username: 'jordanc', category: 'personal',
    content: "My parents want me to move back home to save money. I'd save $1,400/month but lose all my independence. I'm 26. Do I do it?",
    votes_yes: 445, votes_no: 388,
    outcome: null,
    created_at: '2025-03-14T06:00:00Z',
  },
]

const COMMENTS = [
  // Dilemma 1 — best friend got the job
  { id: 1,  dilemma_id: 1, user_id: 3, username: 'tomasz_k', content: 'Honesty is always the right call, even when it hurts.', created_at: '2025-03-10T10:00:00Z' },
  { id: 2,  dilemma_id: 1, user_id: 5, username: 'devraj',   content: 'She might feel guilty if she finds out later that you stayed quiet.', created_at: '2025-03-10T10:45:00Z' },
  { id: 3,  dilemma_id: 1, user_id: 4, username: 'mei_l',    content: 'Real friends can handle the truth. Tell her.', created_at: '2025-03-10T11:20:00Z' },
  { id: 4,  dilemma_id: 1, user_id: 1, username: 'jordanc',  content: "If the roles were reversed, you'd want to know.", created_at: '2025-03-10T12:00:00Z' },
  { id: 5,  dilemma_id: 1, user_id: 2, username: 'priya_v',  content: "Don't tell her. You didn't get the job, she did. Move on.", created_at: '2025-03-10T12:30:00Z' },
  { id: 6,  dilemma_id: 1, user_id: 3, username: 'tomasz_k', content: 'Staying silent is a form of deception in a close friendship.', created_at: '2025-03-10T13:00:00Z' },
  { id: 7,  dilemma_id: 1, user_id: 5, username: 'devraj',   content: 'Tell her before someone else does. That would be way worse.', created_at: '2025-03-10T13:45:00Z' },
  { id: 8,  dilemma_id: 1, user_id: 4, username: 'mei_l',    content: 'This is only awkward if you make it awkward. Just be casual about it.', created_at: '2025-03-10T14:10:00Z' },

  // Dilemma 2 — coworker timesheet
  { id: 9,  dilemma_id: 2, user_id: 1, username: 'jordanc',  content: 'Talk to them first before going to management. Give them a chance.', created_at: '2025-03-11T12:00:00Z' },
  { id: 10, dilemma_id: 2, user_id: 4, username: 'mei_l',    content: "If you don't report it and it comes out, you're implicated too.", created_at: '2025-03-11T13:10:00Z' },
  { id: 11, dilemma_id: 2, user_id: 5, username: 'devraj',   content: 'How much are we talking? A few minutes or hours of fraud?', created_at: '2025-03-11T13:40:00Z' },
  { id: 12, dilemma_id: 2, user_id: 2, username: 'priya_v',  content: 'Friendship and professional integrity are two different things.', created_at: '2025-03-11T14:00:00Z' },
  { id: 13, dilemma_id: 2, user_id: 3, username: 'tomasz_k', content: "Report it anonymously if you can. Protects you and gives them a chance to fix it.", created_at: '2025-03-11T14:30:00Z' },
  { id: 14, dilemma_id: 2, user_id: 1, username: 'jordanc',  content: "You already know the answer. That's why you're asking.", created_at: '2025-03-11T15:00:00Z' },

  // Dilemma 3 — skate park vs lighting
  { id: 15, dilemma_id: 3, user_id: 2, username: 'priya_v',  content: 'Lighting affects safety for everyone. Skate park only helps a subset.', created_at: '2025-03-12T09:00:00Z' },
  { id: 16, dilemma_id: 3, user_id: 5, username: 'devraj',   content: 'Teens need somewhere to go or they end up causing the problems the lighting is meant to prevent.', created_at: '2025-03-12T09:30:00Z' },
  { id: 17, dilemma_id: 3, user_id: 4, username: 'mei_l',    content: 'Has anyone actually surveyed the residents? Not just the loudest voices?', created_at: '2025-03-12T10:00:00Z' },
  { id: 18, dilemma_id: 3, user_id: 1, username: 'jordanc',  content: 'Lighting is infrastructure. Skate park is amenity. Infrastructure first.', created_at: '2025-03-12T10:30:00Z' },
  { id: 19, dilemma_id: 3, user_id: 3, username: 'tomasz_k', content: 'Both are valid. The framing of this as either/or is the real problem.', created_at: '2025-03-12T11:00:00Z' },
  { id: 20, dilemma_id: 3, user_id: 2, username: 'priya_v',  content: 'Women walking home at night would choose lighting every time.', created_at: '2025-03-12T11:20:00Z' },
  { id: 21, dilemma_id: 3, user_id: 5, username: 'devraj',   content: 'Skate parks reduce vandalism and loitering. There is data on this.', created_at: '2025-03-12T11:45:00Z' },

  // Dilemma 4 — Medicare portal
  { id: 22, dilemma_id: 4, user_id: 1, username: 'jordanc',  content: 'This is embarrassing for a government portal in 2025. Absolutely fix it first.', created_at: '2025-03-12T15:00:00Z' },
  { id: 23, dilemma_id: 4, user_id: 3, username: 'tomasz_k', content: 'My elderly mum gives up every time. This is a real accessibility issue.', created_at: '2025-03-12T15:30:00Z' },
  { id: 24, dilemma_id: 4, user_id: 5, username: 'devraj',   content: 'Session persistence is a solved problem. There is no excuse for this in 2025.', created_at: '2025-03-12T16:00:00Z' },
  { id: 25, dilemma_id: 4, user_id: 2, username: 'priya_v',  content: 'The number of people who just give up and miss out on rebates because of this UX is staggering.', created_at: '2025-03-12T16:30:00Z' },
  { id: 26, dilemma_id: 4, user_id: 4, username: 'mei_l',    content: 'Yes but there are bigger systemic issues. This feels like polishing the deck chairs.', created_at: '2025-03-12T17:00:00Z' },
  { id: 27, dilemma_id: 4, user_id: 1, username: 'jordanc',  content: "Quick wins matter. Fix the easy stuff and build momentum for the harder changes.", created_at: '2025-03-12T17:30:00Z' },

  // Dilemma 5 — 40% pay rise
  { id: 28, dilemma_id: 5, user_id: 2, username: 'priya_v',  content: '40% is life-changing money. Your team will survive without you.', created_at: '2025-03-13T08:00:00Z' },
  { id: 29, dilemma_id: 5, user_id: 3, username: 'tomasz_k', content: "Finish the project, negotiate a counter-offer, then decide. Don't burn bridges.", created_at: '2025-03-13T08:45:00Z' },
  { id: 30, dilemma_id: 5, user_id: 4, username: 'mei_l',    content: 'Companies are not loyal to you. Take the money.', created_at: '2025-03-13T09:00:00Z' },
  { id: 31, dilemma_id: 5, user_id: 1, username: 'jordanc',  content: 'What does the new role actually look like day to day? Money is not everything.', created_at: '2025-03-13T09:30:00Z' },
  { id: 32, dilemma_id: 5, user_id: 5, username: 'devraj',   content: 'Use the offer as leverage. Your current employer might match it.', created_at: '2025-03-13T10:00:00Z' },
  { id: 33, dilemma_id: 5, user_id: 2, username: 'priya_v',  content: "If they won't match 40% you already have your answer about how they value you.", created_at: '2025-03-13T10:30:00Z' },
  { id: 34, dilemma_id: 5, user_id: 3, username: 'tomasz_k', content: 'Leaving mid-project will follow you. Reputation matters in small industries.', created_at: '2025-03-13T11:00:00Z' },

  // Dilemma 6 — laundromat
  { id: 35, dilemma_id: 6, user_id: 3, username: 'tomasz_k', content: 'Three residents vs hundreds of workers. The math is obvious.', created_at: '2025-03-13T10:30:00Z' },
  { id: 36, dilemma_id: 6, user_id: 1, username: 'jordanc',  content: 'Noise ordinances exist for a reason. What time does it actually get loud?', created_at: '2025-03-13T11:00:00Z' },
  { id: 37, dilemma_id: 6, user_id: 4, username: 'mei_l',    content: 'Shift workers are already disadvantaged. This would make it worse.', created_at: '2025-03-13T11:30:00Z' },
  { id: 38, dilemma_id: 6, user_id: 5, username: 'devraj',   content: 'Can they soundproof it? Compromise before the council has to step in.', created_at: '2025-03-13T12:00:00Z' },

  // Dilemma 7 — Centrelink
  { id: 39, dilemma_id: 7, user_id: 2, username: 'priya_v',  content: '6 weeks is inhumane when people are in crisis. Yes, fund the workers.', created_at: '2025-03-13T14:00:00Z' },
  { id: 40, dilemma_id: 7, user_id: 4, username: 'mei_l',    content: 'The digital self-service tools are broken too. More staff is a band-aid.', created_at: '2025-03-13T14:30:00Z' },
  { id: 41, dilemma_id: 7, user_id: 1, username: 'jordanc',  content: 'Both. But if forced to choose, human support for vulnerable people comes first.', created_at: '2025-03-13T15:00:00Z' },
  { id: 42, dilemma_id: 7, user_id: 5, username: 'devraj',   content: 'Fix the system so you need fewer caseworkers long term. Invest in tech.', created_at: '2025-03-13T15:30:00Z' },
  { id: 43, dilemma_id: 7, user_id: 3, username: 'tomasz_k', content: "Tech takes years to roll out. People need help now. Hire the workers.", created_at: '2025-03-13T16:00:00Z' },

  // Dilemma 8 — move back home
  { id: 44, dilemma_id: 8, user_id: 4, username: 'mei_l',    content: "$1,400/month invested for 2 years is a house deposit. Do it.", created_at: '2025-03-14T07:00:00Z' },
  { id: 45, dilemma_id: 8, user_id: 2, username: 'priya_v',  content: 'The independence you lose is hard to get back mentally. Be careful.', created_at: '2025-03-14T07:30:00Z' },
  { id: 46, dilemma_id: 8, user_id: 5, username: 'devraj',   content: 'Set a hard end date before you move in. 12 months max.', created_at: '2025-03-14T08:00:00Z' },
  { id: 47, dilemma_id: 8, user_id: 1, username: 'jordanc',  content: 'Depends entirely on your relationship with your parents. For some people this is fine, for others it is a disaster.', created_at: '2025-03-14T08:30:00Z' },
  { id: 48, dilemma_id: 8, user_id: 3, username: 'tomasz_k', content: 'Negotiate the terms upfront. Rent, chores, guests, curfew expectations. All of it.', created_at: '2025-03-14T09:00:00Z' },
  { id: 49, dilemma_id: 8, user_id: 4, username: 'mei_l',    content: 'At 26 the stigma is basically gone. Housing costs are insane. Be practical.', created_at: '2025-03-14T09:30:00Z' },
]

const COMMUNITIES = [
  { id: 1, slug: 'fitzroy',         name: 'Fitzroy',              type: 'suburb',  members: 1240, icon: '🏘️' },
  { id: 2, slug: 'unimelb',         name: 'UniMelb',              type: 'school',  members: 8300, icon: '🎓' },
  { id: 3, slug: 'acme-corp',       name: 'Acme Corp',            type: 'work',    members:  430, icon: '💼' },
  { id: 4, slug: 'northside-fc',    name: 'Northside FC',         type: 'club',    members:  180, icon: '⚽' },
  { id: 5, slug: 'inner-north',     name: 'Inner North',          type: 'suburb',  members: 3100, icon: '🏙️' },
]

// tag some dilemmas to communities
const DILEMMA_COMMUNITIES = [
  { dilemma_id: 3, community_slug: 'fitzroy' },
  { dilemma_id: 3, community_slug: 'inner-north' },
  { dilemma_id: 6, community_slug: 'fitzroy' },
  { dilemma_id: 6, community_slug: 'inner-north' },
  { dilemma_id: 7, community_slug: 'inner-north' },
  { dilemma_id: 2, community_slug: 'acme-corp' },
  { dilemma_id: 5, community_slug: 'acme-corp' },
  { dilemma_id: 1, community_slug: 'unimelb' },
  { dilemma_id: 8, community_slug: 'unimelb' },
  { dilemma_id: 4, community_slug: 'unimelb' },
]

// ── Mutable state ─────────────────────────────────────────────────────────────

let dilemmas = [...DILEMMAS]
let comments = [...COMMENTS]
let nextId = dilemmas.length + 1
let nextCommentId = comments.length + 1
let currentUser = null

// ── Boot mock ─────────────────────────────────────────────────────────────────

const mock = new MockAdapter(api, { delayResponse: 300 })

mock.onPost('/auth/login').reply((config) => {
  const params = new URLSearchParams(config.data)
  const username = params.get('username')
  const found = USERS.find((u) => u.username === username) ?? USERS[0]
  currentUser = { ...found }
  return [200, { access_token: 'mock-token-' + found.id }]
})

mock.onPost('/auth/register').reply((config) => {
  const body = JSON.parse(config.data)
  const newUser = { id: USERS.length + 1, username: body.username, email: body.email, points: 0, season_rank: null }
  USERS.push(newUser)
  return [201, newUser]
})

mock.onGet('/users/me').reply(() => {
  if (!currentUser) return [401, { detail: 'Not authenticated' }]
  return [200, currentUser]
})

mock.onGet('/users/leaderboard').reply(() => {
  return [200, [...USERS].sort((a, b) => b.points - a.points)]
})

mock.onGet('/communities').reply(() => {
  return [200, COMMUNITIES]
})

mock.onGet('/dilemmas').reply((config) => {
  const category = config.params?.category
  const community = config.params?.community
  let filtered = dilemmas
  if (community) {
    const ids = DILEMMA_COMMUNITIES.filter((dc) => dc.community_slug === community).map((dc) => dc.dilemma_id)
    filtered = filtered.filter((d) => ids.includes(d.id))
  }
  if (category) filtered = filtered.filter((d) => d.category === category)
  return [200, [...filtered].reverse()]
})

mock.onGet('/dilemmas/mine').reply(() => {
  if (!currentUser) return [401, { detail: 'Not authenticated' }]
  return [200, dilemmas.filter((d) => d.user_id === currentUser.id).reverse()]
})

mock.onPost('/dilemmas').reply((config) => {
  if (!currentUser) return [401, { detail: 'Not authenticated' }]
  const body = JSON.parse(config.data)
  const newDilemma = {
    id: nextId++,
    user_id: currentUser.id,
    username: currentUser.username,
    category: body.category,
    content: body.content,
    votes_yes: 0,
    votes_no: 0,
    outcome: null,
    created_at: new Date().toISOString(),
  }
  dilemmas.push(newDilemma)
  return [201, newDilemma]
})

mock.onPost(/\/dilemmas\/\d+\/vote/).reply((config) => {
  if (!currentUser) return [401, { detail: 'Not authenticated' }]
  const id = parseInt(config.url.split('/')[2])
  const { choice } = JSON.parse(config.data)
  const d = dilemmas.find((d) => d.id === id)
  if (!d) return [404, { detail: 'Not found' }]
  if (choice === 'yes') d.votes_yes += 1
  else d.votes_no += 1
  currentUser.points += 10
  return [200, { points_earned: 10, dilemma: d }]
})

mock.onGet(/\/dilemmas\/\d+\/comments/).reply((config) => {
  const id = parseInt(config.url.split('/')[2])
  return [200, comments.filter((c) => c.dilemma_id === id)]
})

mock.onPost(/\/dilemmas\/\d+\/comments/).reply((config) => {
  if (!currentUser) return [401, { detail: 'Not authenticated' }]
  const id = parseInt(config.url.split('/')[2])
  const { content } = JSON.parse(config.data)
  const newComment = {
    id: nextCommentId++,
    dilemma_id: id,
    user_id: currentUser.id,
    username: currentUser.username,
    content,
    created_at: new Date().toISOString(),
  }
  comments.push(newComment)
  return [201, newComment]
})
