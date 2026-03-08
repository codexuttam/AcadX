'use client'

import { useEffect, useState } from 'react'

const GEN_Z_MESSAGES = [
    "Wait while we gas you up... ⛽",
    "No cap, we're almost there... 🧢",
    "Bussing through the data... 🔥",
    "Just a sec, we're vibing... ✨",
    "Main character energy incoming... 💅",
    "Doing a quick check, respect the grind... 💪",
    "Calculating the rizz level... 😎",
    "Awaiting your presence, it's giving main character... 👑",
    "We out here fetching facts... 🗣️",
    "Don't leave us on read, stay with us... 📱"
]

export default function Loading() {
    const [msg, setMsg] = useState(GEN_Z_MESSAGES[0])

    useEffect(() => {
        const interval = setInterval(() => {
            setMsg(GEN_Z_MESSAGES[Math.floor(Math.random() * GEN_Z_MESSAGES.length)])
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
