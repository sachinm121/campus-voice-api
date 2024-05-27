exports.complaintRejected = (name, complaintId) => {
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

            <p>We regret to inform you that after careful review by our administrative team, your complaint has been rejected for further processing at this time. </p>

            <p>Please note that this decision was made after thorough consideration of all relevant factors. While we understand this may be disappointing, we assure you that we take all complaints seriously and aim to provide fair and thorough evaluations.</p>

            <p>If you have any questions or would like further clarification on this decision, please don't hesitate to reach out to us. We value your feedback and are here to assist you in any way we can.</p>

            <p>Thank you for your understanding.</p>

            <p>Sencerely,<br />Campus Voice</p>
          </div>
      </body>
    </html>`
}