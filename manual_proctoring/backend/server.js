const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 5000
const SESSION_TTL_MS = 60 * 60 * 1000
const EXAM_DURATION_SECONDS = 10 * 60

app.use(cors())
app.use(express.json())

const student = {
  id: 'ST101',
  name: 'Asif',
  email: 'user',
  exam: 'IoT Final Exam'
}

const demoUser = {
  email: 'user',
  password: 'password'
}

const sessions = new Map()
const examAttempts = new Map()

function generateToken() {
  return crypto.randomBytes(24).toString('hex')
}

function getPublicStudentProfile() {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    exam: student.exam
  }
}

function createSession() {
  const token = generateToken()
  const expiresAt = Date.now() + SESSION_TTL_MS

  sessions.set(token, {
    studentId: student.id,
    expiresAt
  })

  return {
    token,
    expiresAt
  }
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.slice('Bearer '.length).trim()
}

function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req)

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    })
  }

  const session = sessions.get(token)

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid session'
    })
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token)

    return res.status(401).json({
      success: false,
      message: 'Session expired'
    })
  }

  req.token = token
  req.session = session
  req.student = getPublicStudentProfile()
  next()
}

function getAttemptForStudent(studentId) {
  if (!examAttempts.has(studentId)) {
    examAttempts.set(studentId, {
      status: 'not_started',
      startedAt: null,
      submittedAt: null,
      submissionReason: null,
      violationCount: 0,
      violations: []
    })
  }

  return examAttempts.get(studentId)
}

function serializeAttempt(attempt) {
  return {
    status: attempt.status,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    submissionReason: attempt.submissionReason,
    violationCount: attempt.violationCount,
    violations: attempt.violations
  }
}

app.post('/api/login', (req, res) => {
  const email = String(req.body.email || '').trim()
  const password = String(req.body.password || '')

  if (email !== demoUser.email || password !== demoUser.password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  const session = createSession()

  return res.json({
    success: true,
    token: session.token,
    expiresAt: session.expiresAt,
    student: getPublicStudentProfile()
  })
})

app.post('/api/logout', requireAuth, (req, res) => {
  sessions.delete(req.token)

  return res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

app.get('/api/session', requireAuth, (req, res) => {
  return res.json({
    success: true,
    expiresAt: req.session.expiresAt,
    student: req.student
  })
})

app.get('/api/student', requireAuth, (req, res) => {
  return res.json({
    success: true,
    student: req.student,
    attempt: serializeAttempt(getAttemptForStudent(req.student.id))
  })
})

app.use('/files', requireAuth, express.static(path.join(__dirname, 'files')))

app.get('/api/exam', requireAuth, (req, res) => {
  const attempt = getAttemptForStudent(req.student.id)

  return res.json({
    success: true,
    timerSeconds: EXAM_DURATION_SECONDS,
    questionPaper: 'question-paper.pdf',
    student: req.student,
    attempt: serializeAttempt(attempt)
  })
})

app.post('/api/exam/start', requireAuth, (req, res) => {
  const attempt = getAttemptForStudent(req.student.id)

  if (attempt.status === 'submitted') {
    return res.status(409).json({
      success: false,
      message: 'This exam has already been submitted.',
      attempt: serializeAttempt(attempt)
    })
  }

  if (attempt.status === 'not_started') {
    attempt.status = 'in_progress'
    attempt.startedAt = Date.now()
  }

  return res.json({
    success: true,
    attempt: serializeAttempt(attempt)
  })
})

app.post('/api/exam/violations', requireAuth, (req, res) => {
  const attempt = getAttemptForStudent(req.student.id)
  const type = String(req.body.type || '').trim()
  const detail = String(req.body.detail || '').trim()

  if (attempt.status !== 'in_progress') {
    return res.status(409).json({
      success: false,
      message: 'Cannot log violations before the exam starts or after it is submitted.'
    })
  }

  const violation = {
    type: type || 'unknown',
    detail,
    createdAt: Date.now()
  }

  attempt.violations.push(violation)
  attempt.violationCount += 1

  return res.json({
    success: true,
    attempt: serializeAttempt(attempt)
  })
})

app.post('/api/exam/submit', requireAuth, (req, res) => {
  const attempt = getAttemptForStudent(req.student.id)
  const reason = String(req.body.reason || 'manual_submit').trim()

  if (attempt.status === 'submitted') {
    return res.json({
      success: true,
      attempt: serializeAttempt(attempt)
    })
  }

  if (attempt.status === 'not_started') {
    attempt.startedAt = Date.now()
  }

  attempt.status = 'submitted'
  attempt.submittedAt = Date.now()
  attempt.submissionReason = reason

  return res.json({
    success: true,
    attempt: serializeAttempt(attempt)
  })
})

app.get('/api/questions', requireAuth, (req, res) => {
  return res.json([
    {
      id: 1,
      question: 'What does IoT stand for?',
      options: [
        'Internet of Things',
        'Input Output Technology',
        'Internet Tool',
        'None'
      ]
    },
    {
      id: 2,
      question: 'Which protocol is used in IoT?',
      options: ['MQTT', 'HTTP', 'CoAP', 'All of the above']
    }
  ])
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
