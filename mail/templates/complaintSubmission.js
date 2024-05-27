exports.complaintSubmission = (name, complaintId) => {
    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Hello World!</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
          <div class="container">
            <h1>Complaint Submission Successful</h1>
            <p>Thank you ${name} submitted your complaint. We appreciate you taking the time to provide us with your feedback</p>
            <p>Your Complaint Number: ${complaintId}</p>
            <p>We will review your complaint and get back to you as soon as possible.</p>
            <p>Thank you for patience and understanding</p>
            <p>Sencerely,<br />Campus Voice</p>
          </div>
      </body>
    </html>`
}