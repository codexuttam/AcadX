import { NextResponse } from 'next/server'

function simpleFixTitle(title: string) {
    let t = title.trim()
    if (!t) return t
    // basic capitalization
    t = t.charAt(0).toUpperCase() + t.slice(1)
    // ensure ends with ? for questions
    if (!/[?!.]$/.test(t)) t = t + '?'
    // common quick fixes
    t = t.replace(/\bthw\b/ig, 'the')
    t = t.replace(/\bdont\b/ig, "don't")
    t = t.replace(/\bi\b/g, 'I')
    return t
}

function simpleFixDescription(desc: string) {
    let d = desc.trim()
    if (!d) return d
    // collapse multiple spaces
    d = d.replace(/\s{2,}/g, ' ')
    // fix some common misspellings / patterns
    d = d.replace(/\bthw\b/ig, 'the')
    d = d.replace(/\bthn\b/ig, 'then')
    d = d.replace(/\bdont\b/ig, "don't")
    d = d.replace(/\bi\b/g, 'I')
    // ensure sentences start with capital letter
    d = d.split(/([.!?]\s+)/).map(s => s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s).join('')

    // If description is very short, suggest a structure
    if (d.length < 80) {
        d = d + '\n\nWhat I tried:\n-\nExpected behavior:\n-\nActual behavior / Error:\n-'
    }

    return d
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title = '', description = '', codeSnippet = '' } = body

        const enhanced = {
            title: simpleFixTitle(title),
            description: simpleFixDescription(description + (codeSnippet ? '\n\nCode:\n' + codeSnippet : ''))
        }

        return NextResponse.json({ ok: true, enhanced })
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 })
    }
}
