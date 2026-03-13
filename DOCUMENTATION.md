# MS Global Visa Consultancy - Website Documentation

---

## What is This?

This is the complete website for **MS Global Visa Consultancy**, a visa and immigration consulting company based in Islamabad, Pakistan. The website is built using plain HTML, CSS, and JavaScript — no frameworks or complex tools needed. It includes a public-facing website and a private admin panel.

---

## Folder Structure

```
visa consutant web/
├── index.html              ← Main website (homepage)
├── images/logo.png         ← Small icon shown in browser tab (favicon)
├── css/
│   └── styles.css          ← All the styling for the website
├── js/
│   └── script.js           ← All the interactive features (animations, forms, etc.)
├── images/                 ← All pictures used on the website
│   ├── hero/               ← Slideshow images for the top banner
│   ├── flags/              ← Country flag images for destinations section
│   ├── logo.png            ← Company logo
│   ├── Team.png            ← Team photo (used in About Us section)
│   └── (other images)      ← Country and city images
├── admin/                  ← Admin panel (private)
│   ├── login.html          ← Admin login page
│   └── dashboard.html      ← Admin dashboard to view inquiries
└── blog/                   ← Blog articles
  ├── visa-interview-tips.html
  ├── study-abroad-guide.html
  └── work-visa-sponsorship.html
```

---

## Website Sections (index.html)

The main page has the following sections from top to bottom:

1. **Navigation Bar** — Logo and menu links (Home, About, Services, Blog, Contact)
2. **Hero Section** — Large slideshow with a glassmorphism card showing the tagline, an "Explore Services" button, and trust badges
3. **Mission & Vision** — Two glass cards showing the company's mission and vision statements
4. **About Us** — Company description, team photo, and animated stats (15+ years, 5000+ cases, 50+ countries, 99.2% success rate)
5. **Core Values** — Six cards showing company values (Integrity, Excellence, Client-Centric, Innovation, Global Perspective, Reliability)
6. **Why Choose Us** — Six cards explaining the company's advantages
7. **Services** — Six service cards (Early Appointment, Visit/Tourist Visas, Student Visa, Hotel Booking, Travel Insurance, Dummy Air Ticket Reservation)
8. **Destinations** — Country flags organized in 3 tabs: Popular, Visit Visa, and Student Visa destinations
9. **Testimonials** — Three client review cards with star ratings
10. **FAQ** — Five frequently asked questions with expandable answers
11. **CTA Banner** — A call-to-action banner encouraging visitors to contact
12. **Contact** — Contact info (address, phone, email, hours) and a message form
13. **Blog** — Three latest blog article cards
14. **Footer** — Company info, Google Map, quick links, newsletter signup, and social media links

---

## Contact Form

When a visitor fills out the contact form, the following happens:

- The form collects: **Full Name** (required), **Phone** (required), **Email** (optional), **Service** (dropdown), **Occupation** (required), and **Message** (required)
- The data is stored in the browser's **localStorage** for admin access
- Input is sanitized for security
- A success message appears on screen after sending

---

## Admin Panel

### How to Access

1. Go to `admin/login.html` (there's also an "Admin" link in the website footer)
2. Enter the login credentials:
   - **Username:** `admin`
   - **Password:** `MsGlobal@2026`
3. You'll be taken to the dashboard

### How to Change the Password

Open the file `admin/login.html` and find these two lines (around line 133-134):

```javascript
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'MsGlobal@2026';
```

Change the values inside the quotes to whatever you want.

### Dashboard Features

- **Overview** — Shows total inquiries count, new/unread count, read/reviewed count, and today's count
- **Messages Table** — Shows all contact form submissions in a table with name, phone, email, service, date, and status
- **Search** — Type in the search box to find inquiries by name, phone, email, or service
- **Filter** — Filter by status: All, New, Read, or Replied
- **View Detail** — Click "View" on any row to see the full message, occupation, and all details
- **Status Tracking** — Messages start as "New", automatically become "Read" when you view them, and you can mark them as "Replied"
- **Delete** — Delete individual inquiries or clear all at once
- **Export CSV** — Download all inquiries as a CSV file (opens in Excel)
- **Logout** — Logs you out and returns to the login page

### Security

- The admin panel is protected by session-based authentication
- After 5 failed login attempts, the account is locked for 5 minutes
- Password show/hide toggle is available on the login page
- All user input is sanitized for security

---

## Firebase Setup
Firebase is not used in the current version. All data is stored in localStorage for privacy and simplicity.

---

## How to Update Content

### Change Contact Information

In `index.html`, search for the contact section. You'll find the address, phone numbers, email, and working hours. Just edit the text directly.

### Change Services

In `index.html`, find the "SERVICES" section. Each service is a `<div class="service-card">` block. Edit the icon, title, and description inside each block.

### Add/Remove Destinations

In `index.html`, find the "DESTINATIONS" section. Each country is a `<div class="dest-flag-card">` block with a flag image and country name. Add or remove blocks as needed.

### Change Hero Slideshow Images

Put your images in the `images/Hero/` folder. In `index.html`, find the hero section and update the `<div class="slide">` elements with your new image file names.

### Change Team Photo

Replace the file `images/Team.png` with your new photo (keep the same filename), or update the image path in the About Us section of `index.html`.

### Change Logo

Replace `images/logo.png` with your new logo file (keep the same filename).

---

## How to Host / Go Live

This is a static website, so you can host it almost anywhere:

### Option 1: Firebase Hosting (Recommended — already have Firebase)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` in terminal
3. Run `firebase init hosting` in the project folder
4. Set public directory to `.` (current folder)
5. Run `firebase deploy`

### Option 2: Netlify (Free & Easy)
1. Go to netlify.com and sign up
2. Drag and drop the entire project folder
3. Your site will be live in seconds

### Option 3: Traditional Hosting
1. Upload all files to your web hosting via FTP (FileZilla or cPanel File Manager)
2. Make sure `index.html` is in the root/public_html folder

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, animations, glassmorphism effects |
| JavaScript | Interactivity, form handling, animations |
| localStorage | Stores contact form data in browser |
| Google Fonts | Playfair Display & Inter fonts |
| Font Awesome 6.5 | Icons throughout the website |
| Google Maps Embed | Map in the footer |

---

## Browser Support

Works on all modern browsers:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

Also fully responsive — works on mobile phones, tablets, and desktops.

---

## Important Notes

- The website does NOT require any server or backend — everything runs in the browser
- All data is stored locally in the browser (localStorage)
- If you ever need to change the logo or images, update the files in the images folder

---

*Documentation created on March 7, 2026*
*Documentation finalized on March 8, 2026*
*Website by hawksworkplace*
