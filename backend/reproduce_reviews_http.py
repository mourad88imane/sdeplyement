
import requests
import sys

def reproduce_reviews_http():
    session = requests.Session()
    base_url = "http://127.0.0.1:8000"
    
    # 1. Login
    print("Logging in...")
    login_url = f"{base_url}/admin/login/"
    r = session.get(login_url)
    csrftoken = session.cookies['csrftoken']
    
    login_data = {
        'username': 'admin',
        'password': 'password',
        'csrfmiddlewaretoken': csrftoken,
        'next': '/admin/'
    }
    
    r = session.post(login_url, data=login_data, headers={'Referer': login_url})
    
    # 2. Access Review Changelist View
    print(f"Accessing Review Changelist View...")
    list_url = f"{base_url}/admin/reviews/review/"
    r = session.get(list_url)
    
    if r.status_code == 200:
        print("SUCCESS: Review Changelist View loaded correctly.")
    else:
        print(f"FAILURE: Review Changelist View returned {r.status_code}")
        print(r.text[:5000]) 

if __name__ == "__main__":
    try:
        reproduce_reviews_http()
    except Exception as e:
        print(f"Error: {e}")
