"""
Email notification service using Brevo (formerly Sendinblue)
"""
import os
from typing import List, Optional
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv

load_dotenv()

# Configure Brevo API
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

FROM_EMAIL = os.getenv('BREVO_FROM_EMAIL', 'noreply@researchsentinel.com')
FROM_NAME = os.getenv('BREVO_FROM_NAME', 'ResearchSentinel')


def send_email(
    to_email: str,
    to_name: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> bool:
    """
    Send an email using Brevo API
    
    Args:
        to_email: Recipient email address
        to_name: Recipient name
        subject: Email subject
        html_content: HTML email content
        text_content: Plain text email content (optional)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": to_email, "name": to_name}],
            sender={"email": FROM_EMAIL, "name": FROM_NAME},
            subject=subject,
            html_content=html_content,
            text_content=text_content or html_content
        )
        
        api_response = api_instance.send_transac_email(send_smtp_email)
        print(f"Email sent successfully to {to_email}: {api_response}")
        return True
        
    except ApiException as e:
        print(f"Exception when sending email: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error sending email: {e}")
        return False


def send_welcome_email(user_email: str, user_name: str, user_role: str) -> bool:
    """Send welcome email to new user"""
    
    subject = "Welcome to ResearchSentinel! 🎓"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .feature {{
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-left: 4px solid #667eea;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ Welcome to ResearchSentinel!</h1>
        </div>
        <div class="content">
            <h2>Hi {user_name}! 👋</h2>
            <p>Thank you for joining ResearchSentinel as a <strong>{user_role.title()}</strong>!</p>
            
            <p>You now have access to AI-powered research integrity auditing that helps ensure your work meets the highest academic standards.</p>
            
            <h3>What you can do:</h3>
            <div class="feature">
                <strong>📄 Upload Papers</strong><br>
                Upload your research papers (PDF or DOCX) for comprehensive analysis
            </div>
            <div class="feature">
                <strong>🔍 Citation Validation</strong><br>
                Automatically verify citations against academic databases
            </div>
            <div class="feature">
                <strong>📊 Get Detailed Reports</strong><br>
                Receive scores for integrity, methodology, reproducibility, and more
            </div>
            <div class="feature">
                <strong>💡 Actionable Suggestions</strong><br>
                Get specific recommendations to improve your research
            </div>
            
            <center>
                <a href="http://localhost:3000/login" class="button">Get Started →</a>
            </center>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                <strong>Free Tier:</strong> You get 3 free audits per month to start!<br>
                Need more? Check out our <a href="http://localhost:3000/#pricing">pricing plans</a>.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="color: #666; font-size: 12px;">
                Questions? Reply to this email or visit our support center.<br>
                ResearchSentinel - Ensuring research integrity, one paper at a time. 🎓
            </p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to ResearchSentinel!
    
    Hi {user_name}!
    
    Thank you for joining ResearchSentinel as a {user_role.title()}!
    
    You now have access to AI-powered research integrity auditing.
    
    What you can do:
    - Upload Papers: Upload your research papers for analysis
    - Citation Validation: Verify citations automatically
    - Get Detailed Reports: Receive comprehensive audit scores
    - Actionable Suggestions: Get recommendations to improve
    
    Get started: http://localhost:3000/login
    
    Free Tier: You get 3 free audits per month!
    
    Questions? Reply to this email.
    
    ResearchSentinel - Ensuring research integrity, one paper at a time.
    """
    
    return send_email(user_email, user_name, subject, html_content, text_content)


def send_audit_complete_email(
    user_email: str,
    user_name: str,
    paper_title: str,
    integrity_score: int,
    report_url: str
) -> bool:
    """Send email notification when audit is complete"""
    
    # Determine risk level and color
    if integrity_score >= 85:
        risk_level = "Low Risk"
        color = "#10b981"
        emoji = "✅"
    elif integrity_score >= 70:
        risk_level = "Medium Risk"
        color = "#f59e0b"
        emoji = "⚠️"
    else:
        risk_level = "High Risk"
        color = "#ef4444"
        emoji = "❌"
    
    subject = f"Audit Complete: {paper_title} - {integrity_score}/100"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .score-card {{
                background: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px;
                margin: 20px 0;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .score {{
                font-size: 48px;
                font-weight: bold;
                color: {color};
                margin: 10px 0;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 Your Audit is Complete!</h1>
        </div>
        <div class="content">
            <h2>Hi {user_name}!</h2>
            <p>Great news! We've finished analyzing your research paper:</p>
            <p><strong>"{paper_title}"</strong></p>
            
            <div class="score-card">
                <div style="font-size: 24px; margin-bottom: 10px;">{emoji}</div>
                <div class="score">{integrity_score}/100</div>
                <div style="color: {color}; font-size: 18px; font-weight: bold;">{risk_level}</div>
            </div>
            
            <p>Your comprehensive audit report includes:</p>
            <ul>
                <li>✅ Citation validation results</li>
                <li>📊 Methodology analysis</li>
                <li>🔄 Reproducibility check</li>
                <li>🤖 AI content detection</li>
                <li>💡 Actionable improvement suggestions</li>
            </ul>
            
            <center>
                <a href="{report_url}" class="button">View Full Report →</a>
            </center>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="color: #666; font-size: 12px;">
                This audit was completed in minutes using AI-powered analysis.<br>
                ResearchSentinel - Ensuring research integrity, one paper at a time. 🎓
            </p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Your Audit is Complete!
    
    Hi {user_name}!
    
    We've finished analyzing: "{paper_title}"
    
    Overall Integrity Score: {integrity_score}/100
    Risk Level: {risk_level}
    
    Your report includes:
    - Citation validation results
    - Methodology analysis
    - Reproducibility check
    - AI content detection
    - Improvement suggestions
    
    View your full report: {report_url}
    
    ResearchSentinel - Ensuring research integrity, one paper at a time.
    """
    
    return send_email(user_email, user_name, subject, html_content, text_content)


def send_password_reset_email(user_email: str, user_name: str, reset_token: str) -> bool:
    """Send password reset email"""
    
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    
    subject = "Reset Your ResearchSentinel Password"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .warning {{
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hi {user_name}!</h2>
            <p>We received a request to reset your ResearchSentinel password.</p>
            
            <center>
                <a href="{reset_url}" class="button">Reset Password →</a>
            </center>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour for security reasons.<br>
                If you didn't request this reset, please ignore this email.
            </div>
            
            <p style="color: #666; font-size: 14px;">
                Or copy and paste this URL into your browser:<br>
                <code style="background: #e9ecef; padding: 5px; border-radius: 3px;">{reset_url}</code>
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="color: #666; font-size: 12px;">
                Need help? Contact our support team.<br>
                ResearchSentinel - Ensuring research integrity, one paper at a time. 🎓
            </p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Password Reset Request
    
    Hi {user_name}!
    
    We received a request to reset your ResearchSentinel password.
    
    Reset your password: {reset_url}
    
    This link will expire in 1 hour.
    If you didn't request this reset, please ignore this email.
    
    ResearchSentinel
    """
    
    return send_email(user_email, user_name, subject, html_content, text_content)


# Test function
if __name__ == "__main__":
    # Test sending a welcome email
    success = send_welcome_email(
        user_email="test@example.com",
        user_name="Test User",
        user_role="student"
    )
    print(f"Welcome email sent: {success}")
