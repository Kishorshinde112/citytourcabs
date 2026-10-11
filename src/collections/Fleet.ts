import type { CollectionConfig } from 'payload'
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidatePage'

export const Fleet: CollectionConfig = {
  slug: 'fleet',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'passengers', 'pricePerKm'],
    group: 'Cab Fleet & Pricing',
  },
  access: {
    read: () => true, // Publicly readable for website
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Vehicle Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Vehicle Name (e.g. Maruti Swift Dzire)',
                  admin: { width: '50%' }
                },
                {
                  name: 'category',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Hatchback', value: 'Hatchback' },
                    { label: 'Sedan', value: 'Sedan' },
                    { label: 'SUV', value: 'SUV' },
                    { label: 'Premium SUV', value: 'Premium SUV' },
                    { label: 'Tempo Traveller', value: 'Tempo Traveller' },
                  ],
                  defaultValue: 'Sedan',
                  label: 'Vehicle Category',
                  admin: { width: '50%' }
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'passengers',
                  type: 'text',
                  defaultValue: '4',
                  label: 'Passenger Capacity',
                  admin: { width: '50%' }
                },
                {
                  name: 'luggage',
                  type: 'text',
                  defaultValue: '2 Bags',
                  label: 'Luggage Capacity',
                  admin: { width: '50%' }
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'imageMedia',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Upload Vehicle Photo (Select from Library)',
                  admin: { width: '50%' }
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  label: 'Or Fallback Vehicle Photo URL',
                  admin: { width: '50%' }
                },
              ]
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Short Description (Optional)',
            },
          ]
        },
        {
          label: 'Pricing Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'pricePerKm',
                  type: 'text',
                  label: 'Base Rate Per KM (e.g. ₹13/km)',
                  admin: { width: '50%' }
                },
                {
                  name: 'minimumKm',
                  type: 'text',
                  defaultValue: '300 km/day',
                  label: 'Minimum KM per day',
                  admin: { width: '50%' }
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'driverAllowance',
                  type: 'text',
                  defaultValue: '₹300/day',
                  label: 'Driver Allowance',
                  admin: { width: '50%' }
                },
                {
                  name: 'extraCharges',
                  type: 'text',
                  defaultValue: 'Tolls & Parking Extra',
                  label: 'Extra Charges',
                  admin: { width: '50%' }
                }
              ]
            }
          ]
        },
        {
          label: 'Features & Amenities',
          fields: [
            {
              name: 'features',
              type: 'array',
              label: 'Key Amenities (AC, Music System, Carrier, etc.)',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  label: 'Feature',
                },
              ],
            },
          ]
        }
      ]
    }
  ],
}
