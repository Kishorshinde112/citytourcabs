import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

function generateFallbackChatResponse(query: string): string {
  const q = (query || '').toLowerCase()

  if (q.includes('mumbai') || q.includes('darshan')) {
    return '🚖 **Mumbai Darshan Packages:**\n- Full-day guided sightseeing starting at just ₹2,499 (Sedan) / ₹3,499 (Ertiga SUV).\n- Covers Gateway of India, Marine Drive, Haji Ali, Siddhivinayak Temple, Bandra-Worli Sea Link, and more.\n- Includes toll, fuel, and experienced driver-cum-guide.\n\nWould you like to book or know timing options?'
  }

  if (q.includes('lonavala') || q.includes('khandala')) {
    return "⛰️ **Lonavala & Khandala Tour:**\n- Same-day return or overnight package.\n- Visit Tiger Point, Bhushi Dam, Lion's Point, Karla Caves & Wax Museum.\n- Fares start from ₹2,799 (Dzire) and ₹3,899 (Ertiga SUV) with transparent pricing.\n\nShall I arrange an instant quote for your travel date?"
  }

  if (q.includes('shirdi') || q.includes('jyotirlinga') || q.includes('ashtavinayak')) {
    return '🛕 **Spiritual & Pilgrimage Tours:**\n- **Shirdi Sai Baba Darshan**: 1-day or 2-day comfortable AC cab with pickup from anywhere in Mumbai/Pune.\n- **3 Jyotirlinga Tour**: Trimbakeshwar, Bhimashankar & Grishneshwar (customizable 2-3 days).\n- **Ashtavinayak Darshan**: Complete 8 Ganpati tour package with clean sanitized cabs.\n\nTell me your starting point and dates to get the best package deal!'
  }

  if (q.includes('alibaug') || q.includes('matheran') || q.includes('mahabaleshwar') || q.includes('konkan') || q.includes('igatpuri')) {
    return '🏖️ **Weekend & Holiday Getaways:**\n- We cover Alibaug, Matheran Eco-hills, Mahabaleshwar-Panchgani, Igatpuri & scenic Konkan Coastal road trips.\n- Clean AC cabs with drivers who know the best viewpoints and food stops.\n- Drop your preferred destination and passenger count to check availability!'
  }

  if (q.includes('fare') || q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('km') || q.includes('fleet')) {
    return '🚘 **City Tour Cabs Fleet & Pricing:**\n- **Sedan (Swift Dzire/Etios)**: 4 Seater • Affordable, comfortable • Starting ₹13-14/km\n- **SUV (Maruti Ertiga/Carens)**: 6 Seater • Perfect for families • Starting ₹17-18/km\n- **Premium (Innova Crysta)**: 6/7 Seater • Maximum comfort & luxury • Starting ₹22-25/km\n- Zero hidden fees! All local rental & outstation packages have transparent pricing.'
  }

  if (q.includes('book') || q.includes('contact') || q.includes('call') || q.includes('phone') || q.includes('number') || q.includes('agent') || q.includes('help')) {
    return "📞 **Instant Booking & Support:**\n- Call / WhatsApp our booking manager directly at: **+91 7021001921** or Helpline **+91 9967672660**.\n- You can also use the 'Book Now' form on this website or chat with us on WhatsApp for 24/7 instant confirmation!"
  }

  return 'Namaste! 🙏 Welcome to **City Tour Cabs**.\n\nI can assist you with:\n1. 🚖 Mumbai Darshan & City Sightseeing\n2. ⛰️ Lonavala, Alibaug, Mahabaleshwar & Matheran getaways\n3. 🛕 Shirdi, Ashtavinayak & Jyotirlinga pilgrimage packages\n4. 🚘 Outstation one-way & round-trip AC cabs\n\nHow can I help you plan your journey today? You can also call us directly at **+91 7021001921**!'
}

export async function POST(req: Request) {
  try {
    const { message, sessionId, history } = await req.json()
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
    }

    let webhookUrl =
      process.env.N8N_CHAT_WEBHOOK_URL ||
      process.env.CHATBOT_WEBHOOK_URL ||
      process.env.CHAT_WEBHOOK_URL

    if (!webhookUrl) {
      try {
        const payload = await getPayload({ config })
        const settings = await payload.findGlobal({ slug: 'site-settings' })
        if (settings?.chatbotWebhookUrl) {
          webhookUrl = settings.chatbotWebhookUrl
        }
      } catch (_) {}
    }

    if (webhookUrl) {
      try {
        const payloadObj = {
          chatInput: message.trim(),
          message: message.trim(),
          query: message.trim(),
          sessionId: sessionId || `session_${Date.now()}`,
          action: 'sendMessage',
          history: history || [],
          timestamp: new Date().toISOString(),
          source: 'citytourcabs-nextjs',
        }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 7000)

        const webhookResponse = await fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'CityTourCabs-AI/2.0',
          },
          body: JSON.stringify(payloadObj),
          signal: controller.signal,
        }).catch(() => null)

        clearTimeout(timeout)

        if (webhookResponse && webhookResponse.ok) {
          const rawText = await webhookResponse.text()
          let replyText = ''

          if (rawText.includes('"type":"item"') || rawText.includes('{"type":')) {
            const lines = rawText.split('\n')
            let accumulated = ''
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed) continue
              try {
                const parsed = JSON.parse(trimmed)
                if (parsed.type === 'item' && parsed.content) {
                  accumulated += parsed.content
                } else if (parsed.content && typeof parsed.content === 'string') {
                  accumulated += parsed.content
                }
              } catch (_) {}
            }
            if (accumulated.trim()) {
              replyText = accumulated.trim()
            }
          }

          if (!replyText) {
            try {
              const data = JSON.parse(rawText)
              if (data.output) replyText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output)
              else if (data.reply) replyText = typeof data.reply === 'string' ? data.reply : JSON.stringify(data.reply)
              else if (data.response) replyText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response)
              else if (data.message) replyText = typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
              else if (data.text) replyText = typeof data.text === 'string' ? data.text : JSON.stringify(data.text)
              else if (Array.isArray(data) && data.length > 0) {
                const first = data[0]
                replyText = first.output || first.reply || first.message || JSON.stringify(first)
              } else {
                replyText = JSON.stringify(data)
              }
            } catch (_) {
              replyText = rawText
            }
          }

          if (replyText && replyText.trim()) {
            return NextResponse.json({ success: true, reply: replyText.trim(), source: 'webhook' })
          }
        }
      } catch (forwardErr: any) {
        console.error('Error forwarding message to webhook:', forwardErr.message)
      }
    }

    const fallbackReply = generateFallbackChatResponse(message)
    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      source: webhookUrl ? 'fallback_after_webhook_error' : 'internal_assistant',
    })
  } catch (err: any) {
    console.error('Chat endpoint error:', err)
    return NextResponse.json({ error: 'Internal server error processing chat message.' }, { status: 500 })
  }
}
