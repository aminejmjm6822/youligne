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

    // Update user status to rejected
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        status: AccountStatus.REJECTED
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        title: 'Compte rejeté',
        message: 'Votre demande de compte a été rejetée. Veuillez contacter le support pour plus d\'informations.',
        type: 'account_rejected',
        userId: userId
      }
    })

    return NextResponse.json({
      message: 'Utilisateur rejeté avec succès',
      user: updatedUser
    })

  } catch (error) {
    console.error('User rejection error:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}