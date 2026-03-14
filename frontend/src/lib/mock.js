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
  { id: 1,  dilemma_id: 1, user_id: 3, username: 'tomasz_k', content: 'Honesty is always the right call, even when it hurts.', created_at: '2025-03-10T10:00:00Z' },
  { id: 2,  dilemma_id: 1, user_id: 5, username: 'devraj',   content: 'She might feel guilty if she finds out later that you stayed quiet.', created_at: '2025-03-10T10:45:00Z' },
  { id: 3,  dilemma_id: 1, user_id: 4, username: 'mei_l',    content: 'Real friends can handle the truth. Tell her.', created_at: '2025-03-10T11:20:00Z' },
  { id: 4,  dilemma_id: 2, user_id: 1, username: 'jordanc',  content: 'Talk to them first before going to management. Give them a chance.', created_at: '2025-03-11T12:00:00Z' },
  { id: 5,  dilemma_id: 2, user_id: 4, username: 'mei_l',    content: "If you don't report it and it comes out, you're implicated too.", created_at: '2025-03-11T13:10:00Z' },
  { id: 6,  dilemma_id: 3, user_id: 2, username: 'priya_v',  content: 'Lighting affects safety for everyone. Skate park only helps a subset.', created_at: '2025-03-12T09:00:00Z' },
  { id: 7,  dilemma_id: 3, user_id: 5, username: 'devraj',   content: 'Teens need somewhere to go or they end up causing the problems the lighting is meant to prevent.', created_at: '2025-03-12T09:30:00Z' },
  { id: 8,  dilemma_id: 4, user_id: 1, username: 'jordanc',  content: 'This is embarrassing for a government portal in 2025. Absolutely fix it first.', created_at: '2025-03-12T15:00:00Z' },
  { id: 9,  dilemma_id: 5, user_id: 2, username: 'priya_v',  content: '40% is life-changing money. Your team will survive without you.', created_at: '2025-03-13T08:00:00Z' },
  { id: 10, dilemma_id: 5, user_id: 3, username: 'tomasz_k', content: "Finish the project, negotiate a counter-offer, then decide. Don't burn bridges.", created_at: '2025-03-13T08:45:00Z' },
]

// ── Mutable state ─────────────────────────────────────────────────────────────

let dilemmas = [...DILEMMAS]
let comments = [...COMMENTS]
let nextId = dilemmas.length + 1
let nextCommentId = comments.length + 1
let currentUser = null

// ── Boot mock ─────────────────────────────────────────────────────────────────

const mock = new MockAdapter(api, { delayResponse: 300 })

// Auth
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

// Dilemmas
mock.onGet('/dilemmas').reply((config) => {
  const category = config.params?.category
  const filtered = category ? dilemmas.filter((d) => d.category === category) : dilemmas
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

// Comments
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
