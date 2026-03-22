function setMessage(message, type = 'info') {
  const messageElement = document.getElementById('loginMessage')

  if (!messageElement) {
    return
  }

  messageElement.hidden = !message
  messageElement.className = `status-message ${type}`
  messageElement.innerText = message || ''
}

function setLoadingState(isLoading) {
  const loginButton = document.getElementById('loginButton')

  if (!loginButton) {
    return
  }

  loginButton.disabled = isLoading
  loginButton.innerText = isLoading ? 'Signing In...' : 'Login'
}

async function validateExistingSession() {
  const session = getStoredSession()

  if (!session || !session.token) {
    return
  }

  setLoadingState(true)
  setMessage('Checking active session...', 'info')

  try {
    const response = await fetchWithSession(`${API_BASE_URL}/api/session`)

    if (!response) {
      return
    }

    if (!response.ok) {
      clearSession()
      setMessage('', 'info')
      return
    }

    const data = await response.json()

    storeSession({
      token: session.token,
      expiresAt: data.expiresAt,
      student: data.student
    })

    window.location = 'dashboard.html'
  } catch (error) {
    setMessage('Could not verify your saved session. Please sign in again.', 'error')
  } finally {
    setLoadingState(false)
  }
}

async function login() {
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value

  if (!email || !password) {
    setMessage('Enter both email and password.', 'error')
    return
  }

  setLoadingState(true)
  setMessage('Signing you in...', 'info')

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Manual-Proctoring-Client': '1'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      clearSession()
      setMessage(data.message || 'Invalid login credentials.', 'error')
      return
    }

    storeSession({
      token: data.token,
      expiresAt: data.expiresAt,
      student: data.student
    })

    window.location = 'dashboard.html'
  } catch (error) {
    clearSession()
    setMessage('Unable to reach the server. Check that the backend is running.', 'error')
  } finally {
    setLoadingState(false)
  }
}

window.addEventListener('load', () => {
  const redirectMessage = consumeRedirectMessage()

  if (redirectMessage) {
    setMessage(redirectMessage, 'info')
  }

  validateExistingSession()

  document.getElementById('password').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      login()
    }
  })
})
