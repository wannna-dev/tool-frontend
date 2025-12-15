'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function AuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      console.log('🔄 Client: Exchanging OAuth code...')
      
      const supabase = createClient()
      
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('❌ Client: Failed to exchange code:', error)
          // Remove code from URL
          const url = new URL(window.location.href)
          url.searchParams.delete('code')
          router.replace(url.pathname + url.search)
        } else if (data.session) {
          console.log('✅ Client: Session created for:', data.user?.email)
          // Remove code from URL and refresh
          router.replace('/')
          router.refresh()
        }
      })
    }
  }, [code, router])

  return null
}