import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import healthRoutes from './api/health/health.routes'
import { sharedMiddleware } from './shared/middleware/index'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true })

  // Cross-cutting middleware: request ID, response time
  app.register(sharedMiddleware)

  // API routes — each resource is registered under its own prefix
  await app.register(healthRoutes)
  // Future: await app.register(propertyRoutes, { prefix: '/api/v1/properties' })

  return app
}
