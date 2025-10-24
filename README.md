# Necesse Build Creator

A Next.js application for creating and sharing Necesse game builds. Users can select weapons, trinkets, and armor from dropdown menus to create builds that are stored in MongoDB and shareable via unique URLs.

## Features

- **Create Builds**: Select from dropdown menus for weapons, trinkets, and armor
- **Persistent Storage**: Builds are stored in MongoDB
- **Shareable URLs**: Each build gets a unique URL that can be shared with others
- **Responsive Design**: Beautiful UI built with Tailwind CSS

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

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
    "trinket": "Health Ring",
    "armor": "Iron Armor"
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
