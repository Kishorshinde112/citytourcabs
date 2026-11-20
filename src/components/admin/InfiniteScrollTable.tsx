'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

export const InfiniteScrollTable: React.FC<any> = (props) => {
  const searchParams = useSearchParams()
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDocs, setTotalDocs] = useState<number | null>(null)
  const [loadedCount, setLoadedCount] = useState<number>(0)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  // Reset state when filters/search changes
  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
    isFetchingRef.current = false

    // Initial count of rows currently in DOM
    const initialRows = document.querySelectorAll('table.table tbody tr')
    setLoadedCount(initialRows.length)
  }, [searchParams])

  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return
    isFetchingRef.current = true
    setLoadingMore(true)

    try {
      const nextPage = currentPage + 1
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
      params.set('page', String(nextPage))
      if (!params.has('limit')) {
        params.set('limit', '100')
      }
      params.set('depth', '1')

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('payload-token') || localStorage.getItem('adminToken')
          : null
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`/api/bookings?${params.toString()}`, {
        headers,
        credentials: 'include',
      })

      if (!res.ok) {
        setHasMore(false)
        return
      }

      const data = await res.json()
      const newDocs = Array.isArray(data?.docs) ? data.docs : []
      setTotalDocs(typeof data?.totalDocs === 'number' ? data.totalDocs : null)

      if (newDocs.length === 0 || !data?.hasNextPage) {
        setHasMore(false)
      }

      if (newDocs.length > 0) {
        const tbody = document.querySelector('table.table tbody')
        if (tbody) {
          const currentTotalRows = tbody.querySelectorAll('tr').length
          newDocs.forEach((doc: any, i: number) => {
            const tr = document.createElement('tr')
            tr.className = `row-${currentTotalRows + i + 1}`
            tr.setAttribute('data-id', String(doc.id))

            const fullId = String(doc.id || '')
            const shortId =
              fullId.length > 18
                ? fullId.startsWith('BK-')
                  ? `BK-${fullId.slice(3, 7)}...${fullId.slice(-4)}`
                  : `${fullId.slice(0, 6)}...${fullId.slice(-4)}`
                : fullId

            const isBooking = String(doc.type || '').toLowerCase() === 'booking'
            const badgeClass = isBooking
              ? 'lead-type-badge lead-type-badge--booking'
              : 'lead-type-badge lead-type-badge--quick_enquiry'
            const badgeLabel = isBooking ? 'Booking' : 'Enquiry'

            const phone = doc.phone || ''
            const cleanPhone = phone.replace(/\D/g, '')
            const formattedDate = doc.date || ''
            const formattedTime = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''

            tr.innerHTML = `
              <td class="cell-_select">
                <input type="checkbox" aria-label="Select row" />
              </td>
              <td class="cell-id">
                <a href="/admin/collections/bookings/${fullId}" style="text-decoration:none;">
                  <span style="font-family: monospace; font-size: 11px; font-weight: 600; color: #1E293B; background: #F1F5F9; padding: 2px 6px; border-radius: 4px; border: 1px solid #CBD5E1;">
                    ${shortId}
                  </span>
                </a>
              </td>
              <td class="cell-type">
                <span class="${badgeClass}">${badgeLabel}</span>
              </td>
              <td class="cell-name">
                <a href="/admin/collections/bookings/${fullId}" style="font-weight: 600; color: #0F172A; text-decoration: none;">
                  ${doc.name || '—'}
                </a>
              </td>
              <td class="cell-phone">
                <span style="font-weight: 600; color: #1E293B;">${phone}</span>
              </td>
              <td class="cell-actions">
                <div style="display:inline-flex;gap:4px;">
                  <a href="tel:${cleanPhone}" class="table-action-btn" style="padding:2px 6px;font-size:11px;background:#FEF08A;color:#854D0E;border-radius:4px;text-decoration:none;font-weight:600;">Call</a>
                  <a href="https://wa.me/91${cleanPhone}?text=Hi" target="_blank" rel="noopener noreferrer" class="table-action-btn" style="padding:2px 6px;font-size:11px;background:#BBF7D0;color:#166534;border-radius:4px;text-decoration:none;font-weight:600;">WA</a>
                </div>
              </td>
              <td class="cell-route">${doc.route || '—'}</td>
              <td class="cell-vehicle">${doc.vehicle || '—'}</td>
              <td class="cell-date">${formattedDate}</td>
              <td class="cell-status">
                <span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;background:#F1F5F9;color:#475569;">
                  ${doc.status || 'Pending'}
                </span>
              </td>
              <td class="cell-createdAt" style="font-size:11px;color:#64748B;">${formattedTime}</td>
            `
            tbody.appendChild(tr)
          })
          setLoadedCount(tbody.querySelectorAll('tr').length)
        }
        setCurrentPage(nextPage)
      }
    } catch (err) {
      console.warn('Infinite scroll error:', err)
      setHasMore(false)
    } finally {
      isFetchingRef.current = false
      setLoadingMore(false)
    }
  }, [currentPage, hasMore, searchParams])

  // Set up intersection observer on bottom sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          loadNextPage()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => {
      observer.disconnect()
    }
  }, [loadNextPage, hasMore])

  return (
    <div
      style={{
        padding: '16px 0 24px 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}
    >
      <div ref={sentinelRef} style={{ height: '4px', width: '100%' }} />

      {loadingMore && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#0284C7',
            background: '#F0F9FF',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid #BAE6FD',
            fontWeight: 500,
          }}
        >
          <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          <span>Loading more bookings as you scroll...</span>
        </div>
      )}

      {!hasMore && loadedCount > 0 && (
        <div
          style={{
            fontSize: '12px',
            color: '#64748B',
            fontWeight: 500,
            background: '#F8FAFC',
            padding: '4px 12px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
          }}
        >
          ✓ All bookings loaded ({loadedCount} {totalDocs ? `of ${totalDocs}` : ''} total)
        </div>
      )}
    </div>
  )
}

export default InfiniteScrollTable
