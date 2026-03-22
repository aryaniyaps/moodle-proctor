// ============================================================================
// Manual Proctoring Compatibility Layer
// Provides the manual-client-only endpoints that do not collide with core APIs
// ============================================================================

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import jwtService from '../auth/jwt.service';
import logger from '../../config/logger';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  buildManualStudent,
  ensureManualProctoringDirectories,
  getLatestManualAttempt,
  getManualExamSummary,
  MANUAL_PROCTORING_QUESTIONS
} from './manual-proctoring.compat';

export default fp(async (fastify: FastifyInstance) => {
  ensureManualProctoringDirectories();

  fastify.post('/api/login', async (request, reply) => {
    try {
      const { email, password } = request.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        return reply.code(400).send({
          success: false,
          message: 'Email and password are required'
        });
      }

      const response = await fastify.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { username: email, password }
      });

      const data = JSON.parse(response.payload);

      if (response.statusCode !== 200) {
        return reply.code(response.statusCode).send({
          success: false,
          message: data.error || data.message || 'Invalid credentials'
        });
      }

      const tokenPayload = jwtService.validateToken(data.token);
      const { examName } = await getLatestManualAttempt(fastify.pg as any, data.user.id);

      return reply.send({
        success: true,
        token: data.token,
        expiresAt: (tokenPayload.exp || Math.floor(Date.now() / 1000)) * 1000,
        student: buildManualStudent(data.user, examName)
      });
    } catch (error) {
      logger.error('Manual proctoring login error:', error);
      return reply.code(500).send({
        success: false,
        message: 'Login failed'
      });
    }
  });

  fastify.post('/api/logout', { onRequest: [authMiddleware] }, async (_request, reply) => {
    return reply.send({
      success: true,
      message: 'Logged out successfully'
    });
  });

  fastify.get('/api/session', { onRequest: [authMiddleware] }, async (request, reply) => {
    const user = (request as any).user;
    const tokenPayload = (request as any).tokenPayload;
    const { examName } = await getLatestManualAttempt(fastify.pg as any, user.id);

    return reply.send({
      success: true,
      expiresAt: (tokenPayload?.exp || Math.floor(Date.now() / 1000)) * 1000,
      student: buildManualStudent(user, examName)
    });
  });

  fastify.get('/api/exam', { onRequest: [authMiddleware] }, async (request, reply) => {
    const user = (request as any).user;

    try {
      const exam = await getManualExamSummary(fastify.pg as any, user.id);

      return reply.send({
        success: true,
        timerSeconds: exam.timerSeconds,
        questionPaper: exam.questionPaper,
        student: buildManualStudent(user, exam.examName),
        attempt: exam.attempt
      });
    } catch (error) {
      if ((error as Error).message === 'No exam found') {
        return reply.code(404).send({
          success: false,
          message: 'No exam found'
        });
      }

      logger.error('Error fetching manual proctoring exam:', error);
      return reply.code(500).send({
        success: false,
        message: 'Failed to fetch exam data'
      });
    }
  });

  fastify.get('/api/questions', { onRequest: [authMiddleware] }, async (_request, reply) => {
    return reply.send(MANUAL_PROCTORING_QUESTIONS);
  });

  logger.info('Manual proctoring compatibility routes registered');
});
