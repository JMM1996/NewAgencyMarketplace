import { Resend } from 'resend'

// Lazy-load Resend client to avoid errors during build
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'CareConnect <noreply@careconnect.uk>'

interface BookingConfirmedEmailData {
  to: string
  staffName: string
  shiftTitle: string
  shiftDate: Date
  shiftTime: string
  careHomeName: string
  careHomeAddress: string
  hourlyRate: string
}

interface BookingRejectedEmailData {
  to: string
  staffName: string
  shiftTitle: string
  shiftDate: Date
  careHomeName: string
}

interface BookingRequestEmailData {
  to: string
  careHomeName: string
  shiftTitle: string
  shiftDate: Date
  shiftTime: string
  staffName: string
  staffExperience: number
}

export async function sendBookingConfirmedEmail(data: BookingConfirmedEmailData) {
  const resend = getResendClient()

  if (!resend) {
    console.log('RESEND_API_KEY not configured, skipping email')
    console.log('Would send booking confirmed email to:', data.to)
    return
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(data.shiftDate))

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: `Booking Confirmed: ${data.shiftTitle} at ${data.careHomeName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${data.staffName},</p>

            <p style="font-size: 16px;">Great news! Your application has been accepted. Here are your shift details:</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h2 style="color: #0d9488; margin-top: 0; font-size: 18px;">${data.shiftTitle}</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Care Home:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.careHomeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.shiftTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Address:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.careHomeAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Rate:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.hourlyRate}/hour</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #6b7280;">Please arrive 10-15 minutes before your shift starts. If you need to cancel, please let the care home know as soon as possible.</p>

            <p style="font-size: 16px; margin-top: 30px;">Good luck with your shift!</p>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              The CareConnect Team
            </p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('Failed to send booking confirmed email:', error)
    throw error
  }
}

export async function sendBookingRejectedEmail(data: BookingRejectedEmailData) {
  const resend = getResendClient()

  if (!resend) {
    console.log('RESEND_API_KEY not configured, skipping email')
    console.log('Would send booking rejected email to:', data.to)
    return
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(data.shiftDate))

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: `Application Update: ${data.shiftTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Application Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #6b7280; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Application Update</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${data.staffName},</p>

            <p style="font-size: 16px;">Thank you for your interest in the <strong>${data.shiftTitle}</strong> shift at <strong>${data.careHomeName}</strong> on ${formattedDate}.</p>

            <p style="font-size: 16px;">Unfortunately, the care home has chosen another candidate for this shift.</p>

            <p style="font-size: 16px;">Don't worry - there are plenty more opportunities available. Keep applying and you'll find your next shift soon!</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shifts" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Browse More Shifts</a>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              The CareConnect Team
            </p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('Failed to send booking rejected email:', error)
    throw error
  }
}

export async function sendBookingRequestEmail(data: BookingRequestEmailData) {
  const resend = getResendClient()

  if (!resend) {
    console.log('RESEND_API_KEY not configured, skipping email')
    console.log('Would send booking request email to:', data.to)
    return
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(data.shiftDate))

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: `New Applicant for ${data.shiftTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Applicant</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Shift Application</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${data.careHomeName},</p>

            <p style="font-size: 16px;">Great news! You have a new applicant for your shift:</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h2 style="color: #0d9488; margin-top: 0; font-size: 18px;">${data.shiftTitle}</h2>
              <p style="margin: 0; color: #6b7280;">${formattedDate} | ${data.shiftTime}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; font-size: 16px;">Applicant Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Name:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.staffName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Experience:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.staffExperience} years</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/care-home" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Review Application</a>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              The CareConnect Team
            </p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('Failed to send booking request email:', error)
    throw error
  }
}
