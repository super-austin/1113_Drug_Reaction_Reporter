# Requirements

A web application that allows users to search for adverse reactions to medications using the FDA's Adverse Event Reporting System (FAERS) data.

## Overview

Drug Reaction Reporter is a React-based web application that provides an interface to search and view adverse drug reactions reported to the FDA. The application retrieves data from the FDA's open API and presents it in an easy-to-read format with pagination support.

## Features

- Search medications by brand name
- View comprehensive lists of reported adverse reactions
- See frequency counts for each reported reaction
- Paginated results to handle large datasets
- Responsive design for desktop and mobile devices

# Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- Backend: Node.js/Express.js, Typescript
- Data Source: FDA Adverse Event Reporting System (FAERS) via openFDA API

## Prerequisites

- Node.js (v18)
- npm

# Installation

## Clone the repository:

```bash
git clone https://github.com/super-austin/drug-reaction-reporter.git
cd drug-reaction-reporter
```

## Install dependencies:

```bash
npm install
```

## Running the Application

```bash
npm run app
```

The application will be available at `http://localhost:3000` and the server will run on `http://localhost:5000`

# API Endpoints

## GET /api/drug-reactions

Fetches adverse reactions for a specified drug.

## Parameters:

- drugName (required): Brand name of the drug
- limit (optional): Number of results per page
- search_after (optional): String for navigating to next page

## Example Response:

```json
{
  "results": [
    {
      "term": "Headache",
      "count": 3
    },
    {
      "term": "Nausea",
      "count": 1
    }
  ],
  "meta": {
    "disclaimer": "Do not rely on openFDA to make decisions regarding medical care. While we make every effort to ensure that data is accurate, you should assume all results are unvalidated. We may limit or otherwise restrict your access to the API in line with our Terms of Service.",
    "lastUpdated": "2024-10-30",
    "total": 383244
  },
  "pagination": {
    "nextPageUrl": "https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name%3A%22Tylenol%22&limit=5&sort=receivedate%3Aasc&search_after=0%3D1025222400000%3B1%3D3813179&skip=0"
  }
}
```

# Challenges

Implementing Pagination was a challenge for this project.

- `count` param was not helpful for retrieving all the relevant data and implementing paging for them

  - For instance `https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:%22Tylenol%22&count=patient.reaction.reactionmeddrapt.exact`
    only retrieve 100 reactions not all of them.
  - `limit` could not exceed 1000 results for count requests.
  - `skip` param could not be used together with `count` param
  - `Link` was not in the `Response Header` if `count` param was used

- `search`, `limit`, and `search_after` params were used instead for retrieving the raw data and from them get the reactions and the reports amount data and implemented pagination as well.
  - From `Link` in `Response Header`, extracted `search_after` string and implemented navigating to the next page.
  - Created a `pagesCache` state to cache the page URL informations that were navigated before for memoization and navigation to the previous page

# Notes

Should update the pagination feature more perfectly.

- The reports amount of the reactions are not the overall counted value, just the sum coming from the partial raw data.
- Implement the functionality to navigate to any page by inputting the page number with the `Next` and `Previous` buttons for going to only the neighbour pages.
