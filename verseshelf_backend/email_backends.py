import requests
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

class ResendEmailBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        if not email_messages:
            return 0
        
        sent_count = 0
        api_key = getattr(settings, 'RESEND_API_KEY', None)
        
        if not api_key:
            print("Resend API Key is missing!")
            return 0
            
        for message in email_messages:
            try:
                for recipient in message.to:
                    payload = {
                        "from": getattr(settings, 'RESEND_FROM_EMAIL', 'VerseShelf <onboarding@resend.dev>'),
                        "to": recipient,
                        "subject": message.subject,
                        "text": message.body,
                    }
                    response = requests.post(
                        "https://api.resend.com/emails",
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "Content-Type": "application/json",
                        },
                        json=payload,
                        timeout=settings.EMAIL_TIMEOUT
                    )
                    if response.status_code in [200, 201]:
                        sent_count += 1
                    else:
                        print(f"Resend HTTP API failed with status {response.status_code}: {response.text}")
            except Exception as e:
                print("Resend HTTP request exception occurred:", e)
                
        return sent_count
