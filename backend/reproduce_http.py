
import requests
import sys

def reproduce_http():
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
    if r.status_code != 200 or "Log in" in r.text:
        print("Login failed!")
        # check if redirects
        if r.url == f"{base_url}/admin/":
            print("Login success (redirected).")
        else:
            print(f"Login failed. Status: {r.status_code}")
            return

    # 2. Get Course ID
    # We need a course ID. Let's assume 1 exists or create one via API if needed.
    # Or just try to list courses and parse ID.
    print("Listing courses...")
    r = session.get(f"{base_url}/admin/courses/course/")
    if r.status_code != 200:
        print(f"Failed to list courses: {r.status_code}")
        return

    # Try to find a link to change view
    course_id = 20
    # match = re.search(r'/admin/courses/course/(\d+)/change/', r.text)
    # if not match:
    #     print("No courses found - trying hardcoded ID 20")
    #     course_id = 20
    # else:
    #     course_id = match.group(1)
    print(f"Found course ID: {course_id}")

    # 3. Access Change View
    print(f"Accessing Change View for {course_id}...")
    change_url = f"{base_url}/admin/courses/course/{course_id}/change/"
    r = session.get(change_url)
    
    if r.status_code == 200:
        print("SUCCESS: Change View loaded correctly.")
    else:
        print(f"FAILURE: Change View returned {r.status_code}")
        print(r.text[:5000]) # First 5000 chars of traceback

if __name__ == "__main__":
    try:
        reproduce_http()
    except Exception as e:
        print(f"Error: {e}")
