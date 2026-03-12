'use client'

import { useEffect, useState } from 'react'
import { sampleGenZ } from '@/lib/genz'

export default function Loading() {
    const [msg, setMsg] = useState<string>(sampleGenZ())

    useEffect(() => {
        const interval = setInterval(() => {
            setMsg(sampleGenZ())
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="loading-container">
            <div className="spinner-3d"></div>
            <div className="gen-z-text animate-fadeIn">{msg}</div>
        </div>
    )
}
