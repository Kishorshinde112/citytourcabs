'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export const BookingDateFilter: React.FC<any> = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedDate, setSelectedDate] = useState<string>('')

  // Sync selectedDate from URL search parameters
  useEffect(() => {
    if (!searchParams) return
    const dateLike =
      searchParams.get('where[date][like]') ||
      searchParams.get('where[date][equals]') ||
      searchParams.get('date') ||
      ''
    setSelectedDate(dateLike)
  }, [searchParams])

  const applyDateFilter = (dateStr: string) => {
    setSelectedDate(dateStr)
    const current = new URLSearchParams(searchParams ? searchParams.toString() : '')

    // Reset pagination to first page when filtering
    current.delete('page')

    if (dateStr) {
      current.set('where[date][like]', dateStr)
      current.delete('where[date][equals]')
    } else {
      current.delete('where[date][like]')
      current.delete('where[date][equals]')
      current.delete('date')
    }

    const query = current.toString()
    const targetUrl = query ? `${pathname}?${query}` : pathname
    router.push(targetUrl)
  }

  const getToday = () => new Date().toISOString().split('T')[0]
  const getTomorrow = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }
  const getYesterday = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }

  const todayStr = getToday()
  const tomorrowStr = getTomorrow()
  const yesterdayStr = getYesterday()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        background: '#FFFFFF',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        marginBottom: '14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#334155',
        }}
      >
        <span style={{ fontSize: '14px' }}>📅</span>
        <span>Travel Date Filter:</span>
      </div>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => applyDateFilter(e.target.value)}
        style={{
          padding: '4px 10px',
          fontSize: '12px',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          outline: 'none',
          color: '#0F172A',
          background: '#F8FAFC',
          cursor: 'pointer',
          fontWeight: 500,
        }}
        title="Select Travel Date"
      />

      {/* Quick Filter Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          onClick={() => applyDateFilter(todayStr)}
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: selectedDate === todayStr ? 700 : 500,
            color: selectedDate === todayStr ? '#FFFFFF' : '#334155',
            background: selectedDate === todayStr ? '#0284C7' : '#F1F5F9',
            border: selectedDate === todayStr ? '1px solid #0284C7' : '1px solid #E2E8F0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => applyDateFilter(tomorrowStr)}
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: selectedDate === tomorrowStr ? 700 : 500,
            color: selectedDate === tomorrowStr ? '#FFFFFF' : '#334155',
            background: selectedDate === tomorrowStr ? '#0284C7' : '#F1F5F9',
            border: selectedDate === tomorrowStr ? '1px solid #0284C7' : '1px solid #E2E8F0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Tomorrow
        </button>

        <button
          type="button"
          onClick={() => applyDateFilter(yesterdayStr)}
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: selectedDate === yesterdayStr ? 700 : 500,
            color: selectedDate === yesterdayStr ? '#FFFFFF' : '#334155',
            background: selectedDate === yesterdayStr ? '#0284C7' : '#F1F5F9',
            border: selectedDate === yesterdayStr ? '1px solid #0284C7' : '1px solid #E2E8F0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Yesterday
        </button>

        {selectedDate && (
          <button
            type="button"
            onClick={() => applyDateFilter('')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#DC2626',
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
            title="Clear date filter to view all bookings"
          >
            <span>✕</span>
            <span>All Dates</span>
          </button>
        )}
      </div>

      {selectedDate && (
        <span
          style={{
            fontSize: '11px',
            color: '#64748B',
            marginLeft: 'auto',
            fontWeight: 500,
          }}
        >
          Filtering bookings for: <strong style={{ color: '#0F172A' }}>{selectedDate}</strong>
        </span>
      )}
    </div>
  )
}

export default BookingDateFilter
