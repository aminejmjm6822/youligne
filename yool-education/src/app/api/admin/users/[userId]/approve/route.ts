import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, AccountStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    const { userId } = params

    // Update user status to approved
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        status: AccountStatus.APPROVED
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        title: 'Compte approuvé',
        message: 'Votre compte a été approuvé par un administrateur. Vous pouvez maintenant vous connecter.',
        type: 'account_approved',
        userId: userId
      }
    })

    return NextResponse.json({
      message: 'Utilisateur approuvé avec succès',
      user: updatedUser
    })

  } catch (error) {
    console.error('User approval error:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}