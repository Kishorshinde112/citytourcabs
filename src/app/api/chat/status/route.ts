import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  let webhookUrl = process.env.CHATBOT_WEBHOOK_URL || process.env.CHAT_WEBHOOK_URL
  if (!webhookUrl) {
    try {
      const payload = await getPayload({ config })
      const settings = await payload.findGlobal({ slug: 'site-settings' })
      if (settings?.chatbotWebhookUrl) {
        webhookUrl = settings.chatbotWebhookUrl
      }
    } catch (_) {}
  }

  let host = null
  if (webhookUrl) {
    try {
      host = new URL(webhookUrl).host
    } catch (_) {}
  }

  return NextResponse.json({
    enabled: true,
    webhookConfigured: Boolean(webhookUrl),
    webhookHost: host,
  })
}
