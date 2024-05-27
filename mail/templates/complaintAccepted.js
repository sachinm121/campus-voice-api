exports.complaintAccepted = (name, complaintId) => {
    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Hello World!</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
          <div class="container">
            <h1>Complaint Reviewed and Forwarding Confirmation</h1>

            <p>Dear ${name},</p>

            <p>We hope this message finds you well.</p>

            <p>Your Complaint Number: ${complaintId}</p>

            <p>We want to inform you that your complaint has been successfully reviewed by our administrative team. </p>

            <p>We appreciate your patience throughout this process.</p>

            <p>After careful consideration, your complaint has been forwarded for further processing.</p>

            <p> Rest assured, we are actively working towards addressing your concerns and finding a suitable resolution.</p>

            <p>We will keep you updated on the progress of your complaint and notify you once a resolution has been reached.
            </p>

            <p>Thank you for bringing this matter to our attention and for your cooperation.</p>

            <p>Sencerely,<br />Campus Voice</p>
          </div>
      </body>
    </html>`
}