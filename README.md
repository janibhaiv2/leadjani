# Lead Form CSV Processor

A web application for processing and formatting CSV data from Meta/Facebook Lead Forms.

## Features

- Upload CSV files from Meta/Facebook Lead Forms
- Edit column headers and preview data
- Format phone numbers automatically based on country codes
- Export processed CSV data
- Dark theme UI

## Technologies Used

- Next.js
- JavaScript
- PapaParse for CSV processing
- Custom phone number formatting with support for 70+ countries

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Phone Number Formatting

The application includes advanced phone number formatting capabilities:
- Automatic detection of country codes
- Formatting according to country-specific patterns
- Support for 70+ countries worldwide
- Handles various input formats (with/without country code, with/without leading zeros)

## Deployment

This project can be deployed on:
- GitHub Pages
- Vercel
- Netlify
- Any static hosting service

## License

MIT
