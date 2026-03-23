import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, patientProfile } from '@/lib/schema';
import { eq, gte, lte, and } from 'drizzle-orm';

// Vercel Cron will call this daily at 8 AM
export async function GET() {
  try {
    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Query appointments for today
    const todaysAppointments = await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        scheduledTime: appointments.scheduledTime,
        status: appointments.status,
        platform: appointments.platform,
        profile: patientProfile
      })
      .from(appointments)
      .leftJoin(patientProfile, eq(appointments.userId, patientProfile.userId))
      .where(
        and(
          gte(appointments.scheduledTime, startOfDay),
          lte(appointments.scheduledTime, endOfDay),
          eq(appointments.status, 'PENDING')
        )
      );

    // For each appointment, "wake up" and prepare
    // In real implementation, send Telegram message or email
    for (const appt of todaysAppointments) {
      console.log(`Waking up for appointment: ${appt.id} with ${appt.profile?.userId || 'Patient'}`);
      
      // TODO: Send proactive message via Telegram/Email
      // TODO: Run psychology news grounding
      // TODO: Generate daily briefing
    }

    return NextResponse.json({ 
      message: 'Wake up routine completed', 
      appointments: todaysAppointments.length 
    });
  } catch (error) {
    console.error('Wake up error:', error);
    return NextResponse.json({ error: 'Failed to wake up' }, { status: 500 });
  }
}