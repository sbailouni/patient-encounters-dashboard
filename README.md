## Frontend Intern Challenge: Patient Encounters Dashboard

A patient encounter dashboard built with Next.js 15 (App Router) for viewing, searching, and filtering patient encounters with a simple API backend. 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- CSS Modules or plain CSS (no external UI libraries required)
- Mock data from JSON file

## Features

1. Encounters List Page (/):
- Displays encounters from mock JSON data
- Shows: patient name, date, encounter type, status
- Search by patient name
- Filter by status (completed / pending / cancelled)

2. Encounter Detail Page (/encounter/[id]):
- Displays full encounter details
- Shows clinical notes
- Back navigation to list

## Assumptions and Decisions 

- All data is retrieved from a local JSON file. Thus there's no real database or authentication that needs to be implemented.
- Implemented server side filtering where filters are sent to the API and then the UI displays the filtered encounters. This makes it easier to scale when needing to use larger data. 
- Decided on a card layout instead of a table to display encounters since this format is easier to read for mobile and tablet users.
- Multi-select checkbox status filter so the user isn't limited to sorting by one status. 

## Trade-offs 

- Card view vs. table view:
    - Tables make viewing large datasets easier as they are more compact but they can be hard to display on phone screens so I opted for a card layout because it's easy to read on both phone and desktop but with larger datasets, may be hard to view cohesively. 
- Using a local JSON file for the data and API routes is easier and faster to implement but it isn't realistic as there's no database that can also allow for making changes to the encounter data.

## Future Improvements or Incorporations

- Implement a form to create, edit, or delete an encounter.
- Add more options for filtering such as filtering encounter types or date ranges. 
- Implement a dark mode toggle or a switch to change between dark mode and light mode. 
- Set up database integration and write unit tests to check for correct implementation of components and filtering.
