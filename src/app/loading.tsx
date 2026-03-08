'use client'

import { useEffect, useState } from 'react'

const GEN_Z_MESSAGES = [
    "Pehle use kar, firr toh reviews milenge... 😉",
    "Bussing through the Maxwell's equations... 🔥",
    "Maxwell ke equations solve ho rahe hain, wait kar... ⚡",
    "Logic build ho raha hai, no cap... 🧠",
    "Compilation in progress, respect the crunch... 💻",
    "Server heating up, just like my brain before exams... 🌡️",
    "Frontend is giving main character energy... ✨",
    "Deadlines are closer than they appear... 🕒",
    "Debugging the final boss... 👾",
    "Loading your academic rizz... 📈"
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
