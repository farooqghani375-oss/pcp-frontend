'use client'
import { useEffect } from 'react'

export default function WakeUpBackend() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, { method: 'GET' })
      .catch(() => {})
  }, [])

  return null
}