exports.complaintSolved = (name, complaintId) => {
    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Hello World!</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
          <div class="container">
            <h1> Confirmation: Successful Resolution of Complaint [Complaint Number: ${complaintId}]</h1>
            <p>Dear ${name},</p>
            <p>We trust this email finds you in good spirits.</p>
            <p>We are pleased to inform you that your recent complaint, registered under the reference number: ${complaintId}, has been successfully resolved. Our administrative team diligently reviewed your concern and took necessary actions to address it.</p>
            <p>We understand the importance of prompt and effective resolution, and we are delighted to have been able to assist you in this matter. Your patience and cooperation throughout this process have been greatly appreciated.</p>

            <p>Should you have any further questions or require additional assistance, please do not hesitate to reach out to us. We are committed to ensuring your satisfaction and are here to help in any way we can.</p>

            <p>Once again, we extend our gratitude for bringing this matter to our attention. Your feedback is invaluable to us as we continually strive to enhance our services and provide the best possible experience for our customers.</p>
            
            <p>Sencerely,<br />Campus Voice</p>
          </div>
      </body>
    </html>`
}