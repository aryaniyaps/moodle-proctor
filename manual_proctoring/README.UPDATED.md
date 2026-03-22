# Manual Proctoring Electron Application

A desktop application for manual proctoring of online exams, built with Electron.

## Overview

This Electron app connects to the main backend API for authentication, exam management, question paper delivery, and violation logging through the manual-proctoring compatibility layer.

## Architecture

```text
Electron App
  -> HTTP to http://localhost:5000
  -> Manual compatibility routes in backend/src/modules/manual-proctoring/
  -> AI proctoring WebSocket to ws://localhost:8000/proctor
```

## Quick Start

### Prerequisites

1. Start the main backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the AI proctoring service if you want live camera monitoring:
   ```bash
   cd ai_proctoring
   uv sync
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Install and Run

```bash
cd manual_proctoring
npm install
npm start
```

### Login Credentials

- Email: `user`
- Password: `password`

## Configuration

The Electron client targets:

```javascript
const APP_CONFIG = {
  apiBaseUrl: 'http://localhost:5000'
}
```

It also sends `X-Manual-Proctoring-Client: 1` so the main backend can return the legacy manual-app response shapes.

## API Integration

The Electron client uses these compatibility endpoints on the main backend:

- `POST /api/login`
- `POST /api/logout`
- `GET /api/session`
- `GET /api/student`
- `GET /api/exam`
- `POST /api/exam/start`
- `POST /api/exam/violations`
- `POST /api/exam/submit`
- `GET /api/questions`

## Troubleshooting

### Connection refused

- Make sure the main backend is running on `http://localhost:5000`

### Login fails

- Use the manual compatibility credentials: `user / password`

### Question paper does not load

- Check that the backend is running and that `backend/uploads/manual-proctoring/question-paper.pdf` exists

### Proctoring is not active

- Start the AI service on `http://localhost:8000`

## Related Docs

- [Migration Guide](./MIGRATION_GUIDE.md)
- [Main README](../README.md)
