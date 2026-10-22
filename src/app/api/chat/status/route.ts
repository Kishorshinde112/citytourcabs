import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  let webhookUrl =
    process.env.N8N_CHAT_WEBHOOK_URL ||
    process.env.CHATBOT_WEBHOOK_URL ||
    process.env.CHAT_WEBHOOK_URL
  if (!webhookUrl) {
    try {
      const payload = await getPayload({ config })
      const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
      if (settings?.chatbotWebhookUrl) {
        webhookUrl = settings.chatbotWebhookUrl
      }
    } catch (_) {}
  }

  return NextResponse.json({
    enabled: Boolean(webhookUrl),
    webhookConfigured: Boolean(webhookUrl),
  })
}
