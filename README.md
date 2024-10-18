# Social Media Clone 

A modern Twitter-inspired social media platform built using **Next.js**, **Prisma**, and **Supabase**, following **S.O.L.I.D. principles** for clean and scalable code. This project implements key features such as user authentication, real-time tweet feeds, posting, replying, liking, retweeting, and following/unfollowing users, all within a modular, feature-based architecture.

## Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0 or higher)
- A PostgreSQL database (or [Supabase](https://supabase.com/) account)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/social-media.git
   ```

2. Navigate into the project directory:

   ```bash
   cd social-media
   ```

3. Install dependencies:

   ```bash
   npm install
   # or 
   yarn install
   ```

4. Set up enviroment variables:
   
   ```bash
   DATABASE_URL=your-database-url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

5. Run database migrations: 

   ```bash
   npx prisma migrate dev
   ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
# or 
pnpm dev
```

Open http://localhost:3000 to view the app in your browser. The page auto-updates as you make edits to the source files.

You can start editing the pages by modifying files inside the src/app/ directory, such as src/app/page.tsx (login page) and src/app/home/page.tsx (home page). The app will automatically reload with your changes.

###  Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production build.
- `npx prisma studio`: Opens Prisma Studio to manage your database.

### Fatures

- **User Authentication**: Powered by NextAuth.js
- **Tweeting**: Create, reply to, like, and retweet posts
- **Follow/Unfollow**: Build your own network by following or unfollowing other users
- **Real-time Updates**: Keep your feed fresh with real-time tweet updates
- **Responsive Design**: Optimized for desktop and mobile devices

### Project Structure

```bash
/src
├── /app                   # Next.js App Router files
│   ├── /page.tsx          # Login page
│   ├── /home              # Home page
│   │   └── /page.tsx      # Main user dashboard
├── /features              # Feature-based modules
│   ├── /auth              # Authentication logic
│   ├── /tweet             # Tweet logic (posting, replies, etc.)
│   └── /profile           # User profile logic
├── /services              # API calls and business logic
├── /hooks                 # Custom React hooks
└── /types                 # TypeScript types
```