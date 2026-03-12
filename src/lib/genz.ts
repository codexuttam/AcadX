export const GEN_Z_MESSAGES: string[] = [
  "Turning lecture slides into vibes — not just PDF energy. 🎧📚",
  "Bussing through the Maxwell's equations... 🔥",
  "Logic build ho raha hai, no cap... 🧠",
  "Compilation in progress, respect the crunch... 💻",
  "Server heating up, just like my brain before exams... 🌡️",
  "Frontend is giving main character energy... ✨",
  "Deadlines are closer than they appear... 🕒",
  "Debugging the final boss... 👾",
  "Loading your academic rizz... 📈",
  "No cap, this derivation is straight fire. ✍️",
]

export function sampleGenZ(): string {
  return GEN_Z_MESSAGES[Math.floor(Math.random() * GEN_Z_MESSAGES.length)]
}

export function pickByDay(): string {
  return GEN_Z_MESSAGES[new Date().getDate() % GEN_Z_MESSAGES.length]
}

export default GEN_Z_MESSAGES
export const GENZ_MESSAGES = [
  "Turning lecture slides into vibes — not just PDF energy. 🎧📚",
  "Bussing through the Maxwell's equations... 🔥",
  "Logic build ho raha hai, no cap... 🧠",
  "Compilation in progress, respect the crunch... 💻",
  "Frontend is giving main character energy... ✨",
  "Deadlines are closer than they appear... 🕒",
  "Debugging the final boss... 👾",
  "Loading your academic rizz... 📈",
  "Making circuits sing, one simulation at a time. ⚡",
  "Turning theory into practical flex. 💪"
]

export function randomGenZ() {
  return GENZ_MESSAGES[Math.floor(Math.random() * GENZ_MESSAGES.length)]
}

export function quoteOfDay() {
  // Stable pick by day so homepage shows a reproducible line per day
  return GENZ_MESSAGES[new Date().getDate() % GENZ_MESSAGES.length]
}
