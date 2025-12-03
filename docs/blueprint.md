# **App Name**: Avşarlı Digital Showroom

## Core Features:

- Homepage Showcase: Display a visually appealing hero section and featured listings on the homepage to attract potential buyers.
- Advanced Filtering: Enable users to filter car listings by Brand, Model, Year, and Price for efficient browsing.
- Real-time Scraping: Automatically scrape listing data from https://avsarliotomotiv.sahibinden.com/ using Puppeteer or Cheerio.
- Firestore Sync: Utilize a Firebase Cloud Function to synchronize scraped data with the Firestore 'cars' collection, adding new listings, updating existing ones, and deactivating removed listings.
- AI-Enhanced Data Consistency: The cloud function uses AI to evaluate whether a change on the target site indicates a true change, using it as a tool to avoid false positives due to website updates or temporary issues, and decide when or whether to update the listings.
- Scheduled Automation: Schedule the Cloud Function to run twice daily for continuous data synchronization.
- Contact Integration: Integrate a WhatsApp button and Google Maps on the site for easy communication and location finding.
- Firestore Database: Store car details like title, price, year, km, imageUrls, listingUrl, and sahibindenId in the Firestore 'cars' collection.

## Style Guidelines:

- Primary color: Deep, trustworthy navy blue (#1A237E).
- Background color: Soft, muted gray (#ECEFF1).
- Accent color: Analogous indigo (#3F51B5) for highlighting key elements.
- Headline font: 'Space Grotesk' (sans-serif) for headlines; Body font: 'Inter' (sans-serif) for body text. Note: currently only Google Fonts are supported.
- Use car-related icons with a modern, minimalist design.
- Clean, grid-based layout for showcasing listings and providing a seamless user experience.
- Subtle transitions and animations for a modern and engaging user experience.