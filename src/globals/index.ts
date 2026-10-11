import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Settings',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true },
  fields: [
    { name: 'businessName', type: 'text', label: 'Business Name' },
    { name: 'phone', type: 'text', label: 'Primary Phone' },
    { name: 'helpPhone', type: 'text', label: 'Help / Alternate Phone' },
    { name: 'email', type: 'text', label: 'Email Address' },
    { name: 'whatsapp', type: 'text', label: 'WhatsApp Number' },
    { name: 'chatbotWebhookUrl', type: 'text', label: 'Chatbot Webhook URL' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    // Retain legacy columns for database compatibility
    { name: 'siteName', type: 'text', admin: { hidden: true } },
    { name: 'supportPhone', type: 'text', admin: { hidden: true } },
    { name: 'supportEmail', type: 'text', admin: { hidden: true } },
    { name: 'whatsappNumber', type: 'text', admin: { hidden: true } },
  ],
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'copyright', type: 'text' },
  ],
}
