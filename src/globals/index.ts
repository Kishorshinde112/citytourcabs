import { isCmsAdmin } from '@/lib/cmsAccess';
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Settings',
  admin: {
    group: 'SETTINGS',
  },
  access: { read: () => true, update:isCmsAdmin },
  fields: [
    { name: 'businessName', type: 'text', label: 'Business Name' },
    { name: 'phone', type: 'text', label: 'Primary Phone' },
    { name: 'helpPhone', type: 'text', label: 'Help / Alternate Phone' },
    { name: 'email', type: 'text', label: 'Email Address' },
    { name: 'whatsapp', type: 'text', label: 'WhatsApp Number' },
    { name: 'chatbotWebhookUrl', type: 'text', label: 'Chatbot Webhook URL', access: {read:isCmsAdmin,update:isCmsAdmin} },
    {
      name: 'notificationsEnabled',
      type: 'checkbox',
      label: 'Enable Booking & Enquiry Notifications',
      defaultValue: true,
      access: { read: isCmsAdmin, update: isCmsAdmin },
      admin: {
        description: 'When enabled, new bookings and enquiries are sent to the webhook URLs below.',
      },
    },
    {
      name: 'bookingWebhookUrl',
      type: 'text',
      label: 'Booking Notification Webhook URL',
      access: { read: isCmsAdmin, update: isCmsAdmin },
      admin: {
        description: 'n8n webhook for booking requests. Falls back to N8N_INTERNAL_URL when empty.',
      },
    },
    {
      name: 'enquiryWebhookUrl',
      type: 'text',
      label: 'Enquiry Notification Webhook URL',
      access: { read: isCmsAdmin, update: isCmsAdmin },
      admin: {
        description: 'n8n webhook for quick enquiries. Falls back to N8N_INTERNAL_URL when empty.',
      },
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'officeAddress',
      type: 'text',
      label: 'Office Address',
      defaultValue: 'Shop No 4, Chembur West, Mumbai, Maharashtra 400071',
    },
    {
      name: 'workingHours',
      type: 'text',
      label: 'Working Hours',
      defaultValue: '24/7 Available (Open All 365 Days)',
    },
    {
      name: 'announcement',
      type: 'group',
      label: 'Announcement Bar',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show Announcement Bar',
          defaultValue: true,
        },
        {
          name: 'text',
          type: 'text',
          label: 'Announcement Text',
          defaultValue: 'Available 24/7 for your convenience',
        },
      ],
    },
    {
      name: 'promoPopup',
      type: 'group',
      label: 'Promotional Enquiry Popup',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Timed Popup',
          defaultValue: true,
        },
        {
          name: 'delaySeconds',
          type: 'number',
          label: 'Delay (seconds)',
          defaultValue: 5,
          min: 1,
          max: 120,
        },
        {
          name: 'headline',
          type: 'text',
          label: 'Headline',
          defaultValue: 'Special Tour Offer!',
        },
        {
          name: 'subtext',
          type: 'text',
          label: 'Subtext',
          defaultValue: 'Get Flat 15% OFF on advance bookings for Mumbai Sightseeing and Outstation Tours.',
        },
        {
          name: 'discountBadge',
          type: 'text',
          label: 'Discount Badge',
          defaultValue: 'FLAT 15% OFF',
        },
        {
          name: 'couponCode',
          type: 'text',
          label: 'Coupon Code',
          defaultValue: 'CITY15',
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer Content',
      fields: [
        {
          name: 'bio',
          type: 'textarea',
          label: 'Footer Bio',
          defaultValue:
            "City Tour Cabs is Mumbai's trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips.",
        },
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: '© 2026 City Tour Cabs. All rights reserved.',
        },
        { name: 'facebookUrl', type: 'text', label: 'Facebook URL' },
        { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
      ],
    },
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
  access: { read: () => true, update:isCmsAdmin },
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
  access: { read: () => true, update:isCmsAdmin },
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
