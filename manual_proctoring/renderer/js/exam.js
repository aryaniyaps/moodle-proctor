let examTimerId = null
let questionPaperUrl = null
let examSubmitted = false
let examStarted = false
let currentAttempt = null
let isSubmitting = false
let visibilityViolationLogged = false
let blurViolationLogged = false

function setExamStatus(message, type = 'info') {
  const status = document.getElementById('examMessage')

  if (!status) {
    return
  }

  status.hidden = !message
  status.className = `status-message ${type}`
  status.innerText = message || ''
}

function formatDuration(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function updateViolationCount(count) {
  document.getElementById('violationCount').innerText = String(count || 0)
}

function renderExamHeader(student) {
  document.getElementById('examStudentName').innerText = student.name
  document.getElementById('examStudentEmail').innerText = student.email
  document.getElementById('examTitle').innerText = student.exam
}

function updateSubmissionButton(isDisabled, label = 'Submit Exam') {
  const submitButton = document.getElementById('submitExamButton')

  if (!submitButton) {
    return
  }

  submitButton.disabled = isDisabled
  submitButton.innerText = label
}

function releaseExamResources() {
  if (examTimerId) {
    clearInterval(examTimerId)
    examTimerId = null
  }

  if (questionPaperUrl) {
    URL.revokeObjectURL(questionPaperUrl)
    questionPaperUrl = null
  }

  const video = document.getElementById('video')

  if (video?.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop())
    video.srcObject = null
  }

  if (window.electronAPI?.exitFullscreen) {
    window.electronAPI.exitFullscreen()
  }
}

function renderCompletionScreen(reasonLabel) {
  document.body.innerHTML = `
    <div class="completion-screen">
      <div class="completion-card">
        <h1>Exam Completed</h1>
        <p>${reasonLabel}</p>
      </div>
    </div>
  `
}

function finishExamUI(reason) {
  examSubmitted = true
  releaseExamResources()

  const messageByReason = {
    manual_submit: 'Your exam has been submitted successfully.',
    timer_expired: 'Time is up. Your exam has been submitted automatically.',
    left_exam: 'Leaving the exam submitted your attempt automatically.'
  }

  renderCompletionScreen(messageByReason[reason] || 'Your exam session has ended successfully.')
}

async function reportViolation(type, detail) {
  if (!examStarted || examSubmitted) {
    return
  }

  try {
    const response = await fetchWithSession(`${API_BASE_URL}/api/exam/violations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, detail })
    })

    if (!response) {
      return
    }

    const data = await response.json()

    if (response.ok && data.attempt) {
      currentAttempt = data.attempt
      updateViolationCount(data.attempt.violationCount)
    }
  } catch (error) {
    console.error('Failed to report violation:', error)
  }
}

function startTimer(totalSeconds) {
  const timerElement = document.getElementById('timer')
  let remainingSeconds = totalSeconds

  timerElement.innerText = formatDuration(remainingSeconds)

  examTimerId = setInterval(() => {
    remainingSeconds -= 1

    if (remainingSeconds < 0) {
      submitExam('timer_expired')
      return
    }

    timerElement.innerText = formatDuration(remainingSeconds)
  }, 1000)
}

async function loadQuestionPaper(questionPaperName) {
  const response = await fetchWithSession(`${API_BASE_URL}/files/${questionPaperName}`)

  if (!response) {
    return
  }

  if (!response.ok) {
    throw new Error('Question paper request failed')
  }

  const fileBlob = await response.blob()
  questionPaperUrl = URL.createObjectURL(fileBlob)
  document.getElementById('questionFrame').src = `${questionPaperUrl}#toolbar=0`
}

async function startExamAttempt() {
  const response = await fetchWithSession(`${API_BASE_URL}/api/exam/start`, {
    method: 'POST'
  })

  if (!response) {
    return false
  }

  const data = await response.json()

  if (!response.ok || !data.success) {
    setExamStatus(data.message || 'Could not start this exam.', 'error')
    return false
  }

  currentAttempt = data.attempt
  updateViolationCount(data.attempt.violationCount)
  examStarted = true
  return true
}

async function loadExam() {
  setExamStatus('Loading exam details...', 'info')

  try {
    const response = await fetchWithSession(`${API_BASE_URL}/api/exam`)

    if (!response) {
      return
    }

    const data = await response.json()

    if (!response.ok || !data.success) {
      setExamStatus('Could not load the exam data.', 'error')
      return
    }

    if (data.attempt?.status === 'submitted') {
      finishExamUI(data.attempt.submissionReason || 'manual_submit')
      return
    }

    renderExamHeader(data.student)

    const started = await startExamAttempt()

    if (!started) {
      return
    }

    startTimer(data.timerSeconds)
    await loadQuestionPaper(data.questionPaper)
    setExamStatus('Exam loaded successfully.', 'info')
  } catch (error) {
    console.error('Error loading exam:', error)
    setExamStatus('Failed to load the exam. Please verify the backend is running.', 'error')
  }
}

async function submitExam(reason = 'manual_submit') {
  if (examSubmitted || isSubmitting) {
    return
  }

  isSubmitting = true
  updateSubmissionButton(true, 'Submitting...')
  setExamStatus('Submitting your exam...', 'info')

  try {
    const response = await fetchWithSession(`${API_BASE_URL}/api/exam/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })

    if (!response) {
      return
    }

    const data = await response.json()

    if (!response.ok || !data.success) {
      setExamStatus(data.message || 'Could not submit the exam.', 'error')
      return
    }

    currentAttempt = data.attempt
    finishExamUI(reason)
  } catch (error) {
    console.error('Submit error:', error)
    setExamStatus('Could not submit the exam. Please try again.', 'error')
  } finally {
    isSubmitting = false
    updateSubmissionButton(examSubmitted, examSubmitted ? 'Submitted' : 'Submit Exam')
  }
}

async function startCamera() {
  const video = document.getElementById('video')

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setExamStatus('Camera access is not supported in this environment.', 'error')
    await reportViolation('camera_unavailable', 'Camera API is not supported in this environment.')
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })

    video.srcObject = stream
    setExamStatus('Camera connected. Good luck!', 'info')
  } catch (error) {
    console.error('Camera error:', error)
    setExamStatus('Please allow camera permission before starting the exam.', 'error')
    await reportViolation('camera_blocked', 'Camera permission was denied or unavailable.')
  }
}

async function goBackToDashboard() {
  if (examSubmitted) {
    window.location = 'dashboard.html'
    return
  }

  const shouldLeave = window.confirm('Leaving the exam will submit it immediately. Do you want to continue?')

  if (!shouldLeave) {
    return
  }

  await reportViolation('left_exam_view', 'Candidate left the exam view before completion.')
  await submitExam('left_exam')
}

function registerExamGuards() {
  document.addEventListener('contextmenu', event => event.preventDefault())
  document.addEventListener('copy', event => event.preventDefault())
  document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.key.toLowerCase() === 'p') {
      event.preventDefault()
      setExamStatus('Printing is disabled during the exam.', 'error')
      reportViolation('blocked_shortcut', 'Candidate attempted to print during the exam.')
    }
  })

  window.addEventListener('blur', () => {
    if (!examStarted || examSubmitted || blurViolationLogged) {
      return
    }

    blurViolationLogged = true
    setExamStatus('Exam window focus was lost. This activity has been recorded.', 'error')
    reportViolation('window_blur', 'Candidate moved focus away from the exam window.')
  })

  window.addEventListener('focus', () => {
    blurViolationLogged = false
  })

  document.addEventListener('visibilitychange', () => {
    if (!examStarted || examSubmitted) {
      return
    }

    if (document.hidden && !visibilityViolationLogged) {
      visibilityViolationLogged = true
      setExamStatus('Exam visibility changed. This activity has been recorded.', 'error')
      reportViolation('visibility_hidden', 'Candidate switched away from the exam page.')
      return
    }

    if (!document.hidden) {
      visibilityViolationLogged = false
    }
  })

  if (window.electronAPI?.onFullscreenExited) {
    window.electronAPI.onFullscreenExited(() => {
      if (!examStarted || examSubmitted) {
        return
      }

      setExamStatus('Fullscreen was exited. This activity has been recorded.', 'error')
      reportViolation('fullscreen_exit', 'Candidate exited fullscreen mode during the exam.')
    })
  }
}

window.addEventListener('beforeunload', () => {
  if (!examSubmitted) {
    reportViolation('page_unload', 'Exam page attempted to unload before submission.')
  }

  releaseExamResources()
})

window.addEventListener('load', async () => {
  registerExamGuards()

  if (window.electronAPI?.startFullscreen) {
    window.electronAPI.startFullscreen()
  }

  await loadExam()
  await startCamera()
})
