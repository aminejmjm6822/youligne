import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    const teacherId = session.user.id

    // Get total courses by teacher
    const totalCourses = await prisma.course.count({
      where: {
        teacherId
      }
    })

    // Get total students enrolled in teacher's courses
    const totalStudentsResult = await prisma.enrollment.findMany({
      where: {
        course: {
          teacherId
        }
      },
      distinct: ['userId']
    })
    const totalStudents = totalStudentsResult.length

    // Get total revenue from teacher's courses
    const totalRevenueResult = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        courseId: {
          in: await prisma.course.findMany({
            where: { teacherId },
            select: { id: true }
          }).then(courses => courses.map(c => c.id))
        }
      },
      _sum: {
        amount: true
      }
    })
    const totalRevenue = (totalRevenueResult._sum.amount || 0) * 0.85 // 85% for teacher (15% platform fee)

    // Get pending withdrawals
    const pendingWithdrawalsResult = await prisma.withdrawal.aggregate({
      where: {
        userId: teacherId,
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    })
    const pendingWithdrawals = pendingWithdrawalsResult._sum.amount || 0

    // Get recent courses (last 5)
    const recentCourses = await prisma.course.findMany({
      where: {
        teacherId
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })

    // Get recent enrollments in teacher's courses (last 10)
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          teacherId
        }
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      totalCourses,
      totalStudents,
      totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimals
      pendingWithdrawals,
      recentCourses,
      recentEnrollments
    })

  } catch (error) {
    console.error('Teacher dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}