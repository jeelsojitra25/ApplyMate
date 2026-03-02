Build a cross-browser extension called "ApplyMate Clipper" that automatically detects and saves job applications to the ApplyMate app.

TECH STACK:
- Manifest V3 (works in Chrome, Edge, Brave)
- Firefox compatible (Manifest V2 fallback)
- Vanilla JavaScript only, no frameworks

FUNCTIONALITY:
The extension should:
1. Detect when user is on a job posting page on these sites:
   - linkedin.com/jobs
   - indeed.com
   - glassdoor.com
   - ca.indeed.com
   - workday.com
   - lever.co
   - greenhouse.io
   - myworkdayjobs.com
   - any URL containing /careers/ or /jobs/

2. Show a floating button "Save to ApplyMate" on detected job pages

3. When clicked, automatically extract:
   - Company name
   - Job title/role
   - Job URL (current page URL)
   - Today's date as applied_date
   - Follow up date (7 days from today automatically)

4. Show a small popup to confirm the extracted data before saving, 
   with fields the user can edit if extraction was wrong

5. Send a POST request to:
   POST https://your-render-backend-url.com/api/applications
   Headers: { Authorization: Bearer TOKEN }
   Body: { company, role, status: "Applied", applied_date, follow_up_date, job_url }

6. Show success/error notification after saving

TOKEN MANAGEMENT:
- Extension should have a settings page where user pastes their JWT token from ApplyMate
- Store token securely using chrome.storage.sync
- Show "Not connected" state if no token is set

FILE STRUCTURE:
applymate-extension/
├── manifest.json
├── background.js
├── content.js          ← injected into job pages
├── popup.html          ← main popup UI
├── popup.js
├── settings.html       ← where user enters their token
├── settings.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── styles/
    └── content.css     ← styles for floating button

EXTRACTION LOGIC:
For LinkedIn: 
  - Company: .jobs-unified-top-card__company-name
  - Title: .jobs-unified-top-card__job-title

For Indeed:
  - Company: [data-testid="inlineHeader-companyName"]
  - Title: .jobsearch-JobInfoHeader-title

For others: 
  - Try meta tags: og:title, og:site_name
  - Fallback to page title and domain name

IMPORTANT:
- Must work without user logging into extension separately
- Token based auth only
- Clean minimal UI matching ApplyMate colors (#4299e1 blue, white background)
- Show ApplyMate logo in popup
- After saving successfully, update the button to show "Saved!" in green
- Handle errors gracefully with clear messages

- <img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/bcc4fd2c-616e-4878-8b16-fff300ef2085" />

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/f8cae471-8efe-4ae8-a4cc-14aa6b639326" />

![Uploading image.png…]()
