// src/server.ts
import app from '@/app'
import { config } from '@/config/app'
import prisma from '@/config/database'

const start = async (): Promise<void> => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`)
      console.log(`   Health check: http://localhost:${config.port}/health`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  console.log('\n👋 Shutting down gracefully')
  process.exit(0)
})

start()
