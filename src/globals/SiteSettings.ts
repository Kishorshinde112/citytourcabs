import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidatePage'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Branding & Contact',
  admin: {
    group: 'Site Branding & Contact',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand & General',
          description: 'Set your website name and upload your logo.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  required: true,
                  defaultValue: 'City Tour Cabs',
                  label: 'Website Name',
                  admin: { width: '50%' }
                },
                {
                  name: 'logoUrl',
                  type: 'text',
                  defaultValue: '/assets/citytourcabs-logo.png',
                  label: 'Fallback Logo URL',
                  admin: { width: '50%' }
                }
              ]
            },
            {
              name: 'logoMedia',
              type: 'upload',
              relationTo: 'media',
              label: 'Website Logo Image (Upload or select from Media Library)',
            },
          ]
        },
        {
          label: 'Contact Info',
          description: 'These details appear in the footer and contact sections.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'supportPhone',
                  type: 'text',
                  required: true,
                  defaultValue: '7021001921',
                  label: 'Main Booking Phone',
                  admin: { width: '33%' }
                },
                {
                  name: 'helpPhone',
                  type: 'text',
                  defaultValue: '9967672660',
                  label: 'Helpline Phone',
                  admin: { width: '33%' }
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  defaultValue: '917021001921',
                  label: 'WhatsApp Number (with Country Code)',
                  admin: { width: '34%' }
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'supportEmail',
                  type: 'email',
                  defaultValue: 'citytourcabs8@gmail.com',
                  label: 'Support Email Address',
                  admin: { width: '50%' }
                },
                {
                  name: 'workingHours',
                  type: 'text',
                  defaultValue: '24/7 Available (Open All 365 Days)',
                  label: 'Operating Working Hours',
                  admin: { width: '50%' }
                }
              ]
            },
            {
              name: 'officeAddress',
              type: 'textarea',
              defaultValue: 'Shop No 4, Chembur West, Mumbai, Maharashtra 400071',
              label: 'Physical Office Address',
            },
          ]
        },
        {
          label: 'Announcements & Popups',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              label: 'Top Announcement Header Bar',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Top Announcement Bar across all pages?',
                },
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Available 24/7 for your convenience • 100% Sanitized Cabs with Expert Drivers',
                  label: 'Announcement Message',
                },
              ],
            },
            {
              name: 'promoPopup',
              type: 'group',
              label: 'Automatic Discount Enquiry Popup Modal',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Discount Popup?',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'delaySeconds',
                      type: 'number',
                      defaultValue: 5,
                      label: 'Trigger Delay (Seconds)',
                      admin: { width: '50%' }
                    }
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'headline',
                      type: 'text',
                      defaultValue: 'Special Tour Offer!',
                      label: 'Offer Headline',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'discountBadge',
                      type: 'text',
                      defaultValue: 'FLAT 15% OFF',
                      label: 'Badge Text (e.g. FLAT 15% OFF)',
                      admin: { width: '50%' }
                    }
                  ]
                },
                {
                  name: 'subtext',
                  type: 'textarea',
                  defaultValue: 'Get Flat 15% OFF on advance bookings for Mumbai Sightseeing and Outstation Tours.',
                  label: 'Offer Subtitle / Description',
                },
                {
                  name: 'couponCode',
                  type: 'text',
                  defaultValue: 'CITY15',
                  label: 'Coupon / Promo Code',
                },
              ],
            }
          ]
        },
        {
          label: 'Footer & Social',
          fields: [
            {
              name: 'footer',
              type: 'group',
              label: 'Footer Content & Links',
              fields: [
                {
                  name: 'bio',
                  type: 'textarea',
                  defaultValue: 'City Tour Cabs is Mumbai\'s trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips.',
                  label: 'Footer Company Bio',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'facebookUrl',
                      type: 'text',
                      defaultValue: 'https://facebook.com',
                      label: 'Facebook Profile URL',
                      admin: { width: '50%' }
                    },
                    {
                      name: 'instagramUrl',
                      type: 'text',
                      defaultValue: 'https://instagram.com',
                      label: 'Instagram Profile URL',
                      admin: { width: '50%' }
                    }
                  ]
                },
                {
                  name: 'copyright',
                  type: 'text',
                  defaultValue: '© 2026 City Tour Cabs. All rights reserved.',
                  label: 'Copyright Notice',
                },
                {
                  name: 'quickLinks',
                  type: 'array',
                  label: 'Footer Quick Links (Custom navigation)',
                  admin: {
                    components: {
                    },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          label: 'Link Label',
                          admin: { width: '50%' }
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                          label: 'URL or Path (e.g. /about)',
                          admin: { width: '50%' }
                        },
                      ]
                    }
                  ],
                },
              ],
            }
          ]
        },
        {
          label: 'Advanced Integration',
          fields: [
            {
              name: 'chatbotWebhookUrl',
              type: 'text',
              defaultValue: 'https://n8n.kishorlab.dev/webhook-test/4d6e3906-3c0c-4c18-bef2-cf30563485c0',
              label: 'n8n AI Chatbot Webhook URL',
              admin: {
                description: 'The URL that powers the live chat widget on the bottom right.',
              }
            },
          ]
        }
      ]
    }
  ],
}
