import { prisma } from './prisma'

export async function checkAndResetCredits(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true, lastCreditReset: true }
    })

    if (!user) return null

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    if (user.lastCreditReset < oneWeekAgo) {
        // Reset credits
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: 10,
                lastCreditReset: new Date()
            }
        })
        return updatedUser.credits
    }

    return user.credits
}

export async function deductCredit(userId: string) {
    const currentCredits = await checkAndResetCredits(userId)

    if (currentCredits === null || currentCredits <= 0) {
        return false
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            credits: { decrement: 1 }
        }
    })

    return true
}
