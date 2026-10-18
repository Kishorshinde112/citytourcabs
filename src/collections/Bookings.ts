import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Form Submission',
    plural: 'Form Submissions',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['id', 'type', 'name', 'phone', 'actions', 'route', 'vehicle', 'date', 'status', 'createdAt'],
    group: 'LEADS & BOOKINGS',
    components: {
      afterListTable: ['@/components/admin/RecordDrawer#RecordDrawer'],
    },
  },
  access: {
    read: ({ req: { user } }) => Boolean(user) && user.collection === 'users' && ['admin','operator'].includes(user.role),
    create: ({ req: { user } }) => Boolean(user) && user.collection === 'users' && user.role === 'admin',
    update: ({ req: { user } }) => Boolean(user) && user.collection === 'users' && ['admin','operator'].includes(user.role),
    delete: ({ req: { user } }) => Boolean(user) && user.collection === 'users' && user.role === 'admin',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => 'BK-' + Math.floor(100000 + Math.random() * 900000),
    },
    {
      name: 'type',
      label: 'Submission Type',
      type: 'text',
      defaultValue: 'Inquiry',
      admin: {
        components: {
          Cell: '@/components/admin/cells/LeadTypeCell#LeadTypeCell',
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      index: true,
      label: 'Phone Number',
      admin: {
        components: {
          Cell: '@/components/admin/cells/PhoneCell#PhoneCell',
        },
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/components/admin/cells/LeadActionsCell#LeadActionsCell',
        },
      },
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp Number',
    },
    {
      name: 'route',
      type: 'text',
      required: true,
      label: 'Trip / Tour Destination',
    },
    {
      name: 'vehicle',
      type: 'text',
      defaultValue: 'Standard Cab / Sedan',
      label: 'Selected Car Type',
    },
    {
      name: 'date',
      type: 'text',
      required: true,
      label: 'Travel Date',
    },
    {
      name: 'pickup_address',
      type: 'textarea',
      label: 'Pickup Location / Address',
    },
    {
      name: 'pickup_time',
      type: 'text',
      label: 'Pickup Time',
    },
    {
      name: 'passengers',
      type: 'text',
      defaultValue: '4',
      label: 'Passenger Count',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Pending',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Confirmed', value: 'Confirmed' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
      admin: {
        components: {
          Cell: '@/components/admin/cells/StatusCell#StatusCell',
        },
      },
    },
    {
      name: 'special_requirements',
      type: 'textarea',
      label: 'Customer Message / Special Requirements',
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer URL',
    },
  ],
}
