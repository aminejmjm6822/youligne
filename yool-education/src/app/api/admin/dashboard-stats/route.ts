import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get total courses
    const totalCourses = await prisma.course.count()

    // Get total revenue
    const totalRevenueResult = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })
    const totalRevenue = totalRevenueResult._sum.amount || 0

    // Get pending approvals
    const pendingApprovals = await prisma.user.count({
      where: {
        status: 'PENDING'
      }
    })

    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    // Get recent courses (last 10)
    const recentCourses = await prisma.course.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        enrollments: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalRevenue,
      pendingApprovals,
      recentUsers,
      recentCourses
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}