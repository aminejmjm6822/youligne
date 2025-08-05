import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.STUDENT) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    const studentId = session.user.id

    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count({
      where: {
        userId: studentId
      }
    })

    // Get completed courses
    const completedCourses = await prisma.enrollment.count({
      where: {
        userId: studentId,
        completed: true
      }
    })

    // Get user points and level
    const user = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        points: true,
        level: true
      }
    })
    const totalPoints = user?.points || 0
    const currentLevel = user?.level || 1

    // Get recent enrollments (active courses)
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: studentId,
        completed: false
      },
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    // Get upcoming assignments
    const upcomingAssignments = await prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              userId: studentId
            }
          }
        },
        dueDate: {
          gte: new Date()
        },
        submissions: {
          none: {
            userId: studentId
          }
        }
      },
      take: 5,
      orderBy: {
        dueDate: 'asc'
      },
      include: {
        course: {
          select: {
            title: true
          }
        }
      }
    })

    // Get recent badges
    const badges = await prisma.badge.findMany({
      where: {
        userId: studentId
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      totalEnrollments,
      completedCourses,
      totalPoints,
      currentLevel,
      recentEnrollments,
      upcomingAssignments,
      badges
    })

  } catch (error) {
    console.error('Student dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}