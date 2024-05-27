exports.contactUsMail = (name) => {
    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Hello World!</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
          <div class="container">
            <h1>Inquiry/Feedback Received</h1>

            <p>Dear ${name},</p>

            <p>Thank you for reaching out to us. We've received your message and appreciate your time in contacting us.</p>

            <p>Rest assured, your inquiry/feedback is important to us. Our team is now reviewing it, and we'll get back to you as soon as possible.</p>

            <p>For any further questions or additional information, please don't hesitate to reply to this email. Your input matters to us.</p>

            <p>Thank you once again for contacting Campus Voice. We're here to help.</p>

            <p>Best regards</p>

            <p>Sencerely,<br />Campus Voice</p>

            <a>campusvoice@nitjsr.ac.in</a>
          </div>
      </body>
    </html>`
}