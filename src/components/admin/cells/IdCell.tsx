'use client'

import React, { useState } from 'react'
import type { DefaultCellComponentProps } from 'payload'

export const IdCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const fullId = typeof cellData === 'string' ? cellData : String(cellData || '')
  const [copied, setCopied] = useState(false)

  if (!fullId) {
    return <span style={{ color: '#94A3B8' }}>—</span>
  }

  // Format ID: Truncate long UUIDs (e.g., "BK-26ea1731-dc6b-4b2a-9c1a-f6ba65e8924e")
  // into clean, compact "BK-26ea...924e"
  let displayId = fullId
  if (fullId.length > 18) {
    if (fullId.startsWith('BK-')) {
      const core = fullId.slice(3)
      displayId = `BK-${core.slice(0, 4)}...${core.slice(-4)}`
    } else {
      displayId = `${fullId.slice(0, 6)}...${fullId.slice(-4)}`
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
      }}
      title={`Full ID: ${fullId} (Click icon to copy)`}
    >
      <span
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '11px',
          fontWeight: 600,
          color: '#1E293B',
          background: '#F1F5F9',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #CBD5E1',
          letterSpacing: '0.02em',
        }}
      >
        {displayId}
      </span>
      <button
        type="button"
        className="table-action-btn"
        onClick={handleCopy}
        title="Copy Full Booking ID"
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '2px 4px',
          fontSize: '11px',
          color: copied ? '#059669' : '#64748B',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {copied ? '✓' : '📋'}
      </button>
    </div>
  )
}

export default IdCell
