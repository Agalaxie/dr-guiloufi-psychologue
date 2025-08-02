import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // Page simple qui affiche le code
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Google Authorization Code</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 600px; 
          margin: 50px auto; 
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .code {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 14px;
          word-break: break-all;
          border: 1px solid #dee2e6;
          margin: 20px 0;
        }
        .success {
          color: #28a745;
          font-weight: bold;
        }
        .instructions {
          background: #e3f2fd;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 Authorization Successful!</h1>
        <p class="success">Google authorization completed successfully!</p>
        
        <h3>📋 Your Authorization Code:</h3>
        <div class="code">${code}</div>
        
        <div class="instructions">
          <h4>📝 Next Steps:</h4>
          <ol>
            <li>Copy the code above</li>
            <li>Go back to your terminal</li>
            <li>Paste the code when prompted</li>
            <li>Press Enter to get your refresh token</li>
          </ol>
        </div>
        
        <p><small>You can close this window after copying the code.</small></p>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}