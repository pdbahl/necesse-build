# Necesse Build Creator

A Next.js application for creating and sharing Necesse game builds. Users can select weapons, trinkets, and armor from dropdown menus to create builds that are stored in MongoDB and shareable via unique URLs.

## Features

- **Create Builds**: Select from dropdown menus for weapons, trinkets, and armor
- **Persistent Storage**: Builds are stored in MongoDB
- **Shareable URLs**: Each build gets a unique URL that can be shared with others
- **Responsive Design**: Beautiful UI built with Tailwind CSS
 - Title and Description: optional title and description/tips can be added to builds and are persisted and shown in lists and the build view.
 - Per-trinket Enchantments: each selected trinket can optionally include one enchantment (from a predefined list) chosen in the create form and persisted with the build.
 - Armor Enchantments: armor can have up to three enchantments (duplicates allowed). The UI presents three dropdowns for armor enchantments and the API validates and persists them.
 - Image-backed dropdowns: weapon, trinket and armor pickers show small icons in the custom dropdowns. Item lists are displayed alphabetically for easier discovery.
 - Missing-image placeholder: when an item's icon isn't available the UI shows a small SVG placeholder instead of passing an empty src to the image component.
 - Random Builds panel: the home page shows a rotating/random selection of saved builds for discovery.
 - Backwards compatibility & normalization: the API accepts legacy build shapes (trinket arrays as simple strings and armor as a plain string) and normalizes them to the new richer shape when rendering or saving.

## Prerequisites

- Node.js 18.x or later
- MongoDB instance (local or remote)
- MongoDB connection URI

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Ensure you have a MongoDB instance running. The application will automatically create a database and collection if they don't exist.

- **Database name**: `necesse` (default, configurable via env var)
- **Collection name**: `builds` (automatically created)

For EC2 deployment, you can use:
- A MongoDB instance running on the same EC2 instance
- A separate MongoDB server
- MongoDB Atlas (cloud-hosted)

### 3. Environment Variables

Copy the example environment file and fill in your MongoDB connection details:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your values:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=necesse
```

For remote MongoDB instances, use the appropriate connection string:
```env
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017
```

### 4. Customize Game Data (Optional)

The game items are defined in `lib/gameData.ts`. You can customize the available weapons, trinkets, and armor sets by editing this file.

### New data & behavior notes

- `lib/gameData.ts` now contains an `enchantments` list of options and improved TypeScript types that model `TrinketSelection` and `ArmorSelection` (armor supports an `enchantments?: Enchantment[]` array).
- The client UI and API were updated to support these richer shapes while remaining compatible with older saved documents.

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Create Build — new request shape examples

Create builds may now include richer trinket and armor shapes. Examples:

- Simple legacy-like payload (still accepted):

```json
{
   "weapon": "Iron Sword",
   "trinket": ["Life Pendant", "Zephyr Charm"],
   "armor": "Iron Armor"
}
```

- New richer payload (preferred):

```json
{
   "weapon": "Iron Sword",
   "trinket": [
      { "name": "Life Pendant", "enchantment": "+Max Health" },
      { "name": "Zephyr Charm" }
   ],
   "armor": { "name": "Iron Armor", "enchantments": ["+Armor", "+Max Health"] },
   "title": "My Tank Build",
   "description": "Use these trinkets to survive long fights"
}
```

Server-side validation is applied (valid names and enchantments are enforced; armor enchantments are capped at 3). The server also normalizes legacy shapes when returning build documents.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── builds/
│   │       ├── route.ts          # POST endpoint to create builds
│   │       └── [id]/
│   │           └── route.ts      # GET endpoint to fetch builds
│   ├── build/
│   │   └── [id]/
│   │       └── page.tsx          # Build view page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with build creator form
├── lib/
│   ├── mongodb.ts                # MongoDB client and utilities
│   └── gameData.ts               # Game items data (weapons, trinkets, armor)
└── README.md
```

## Usage

1. **Create a Build**:
   - Visit the home page
   - Select a weapon, trinket, and armor from the dropdown menus
   - Click "Create Build"

2. **Share a Build**:
   - After creating a build, you'll be redirected to the build page
   - Click "Copy Share Link" to copy the URL
   - Share the URL with others

3. **View a Build**:
   - Visit any build URL (e.g., `http://localhost:3000/build/abc-123`)
   - The build details will be displayed

## API Endpoints

### Create Build
- **URL**: `/api/builds`
- **Method**: `POST`
- **Body**:
 ```json
 {
    "weapon": "Iron Sword",
    "trinket": [ { "name": "Life Pendant", "enchantment": "+Max Health" } ],
    "armor": { "name": "Iron Armor", "enchantments": ["+Armor"] },
    "title": "Optional title",
    "description": "Optional notes/tips"
 }
 ```
- **Response**:
  ```json
  {
    "id": "abc-123",
    "weapon": "Iron Sword",
    "trinket": "Health Ring",
    "armor": "Iron Armor",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
  ```

### Get Build
- **URL**: `/api/builds/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "id": "abc-123",
    "weapon": "Iron Sword",
    "trinket": "Health Ring",
    "armor": "Iron Armor",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
  ```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **MongoDB**: NoSQL database for storing builds
- **UUID**: Generate unique build IDs

## Notes for developers

- The app uses the Next.js App Router. Pages that run on the client use `"use client"` and the project uses TypeScript.
- The API routes perform input normalization and validation to accept both legacy and new payload shapes. If you change item lists in `lib/gameData.ts`, make sure to also update the mapping image files under `public/images/`.
- There is a small `MissingImage` component at `app/components/MissingImage.tsx` used to render a neutral placeholder when a mapped image is missing.

If you'd like I can also add a short CHANGELOG.md listing the feature additions and the dates they were added.

## Deployment on EC2

### Prerequisites
- EC2 instance with Node.js installed
- MongoDB instance accessible from EC2
- Security groups configured to allow HTTP/HTTPS traffic

### Steps

1. **SSH into your EC2 instance**:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

2. **Clone or copy your application to EC2**:
   ```bash
   git clone your-repo-url
   # or use scp to copy files
   ```

3. **Install dependencies**:
   ```bash
   cd necesse-build-creator
   npm install
   ```

4. **Create `.env.local` file** with your MongoDB connection:
   ```bash
   nano .env.local
   ```
   Add:
   ```env
   MONGODB_URI=mongodb://your-mongodb-host:27017
   MONGODB_DB=necesse
   ```

5. **Build the application**:
   ```bash
   npm run build
   ```

6. **Run the application**:
   ```bash
   # For testing
   npm start

   # For production, use PM2 or similar process manager
   npm install -g pm2
   pm2 start npm --name "necesse-builds" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure reverse proxy (optional)**:
   Use nginx or Apache to proxy requests to the Next.js app running on port 3000.

## License

ISC
