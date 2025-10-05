# CiteCrawler 🔍

**AI & Data Science Research Paper Search Engine**

Discover and explore cutting-edge research papers across 40+ domains of AI, Machine Learning, and Data Science with advanced semantic search capabilities.

![CiteCrawler](https://img.shields.io/badge/CiteCrawler-Research%20Search-blue?style=for-the-badge&logo=search)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Bun](https://img.shields.io/badge/Bun-1.2-orange?style=for-the-badge&logo=bun)

## ✨ Features

- 🔍 **Advanced Semantic Search** - Find papers using natural language queries
- ⚡ **Lightning Fast** - Optimized search engine for speed and accuracy
- 🎯 **Smart Filters** - Filter by conference, journal, author, institution, and impact factor
- 📄 **PDF Access** - Direct access to full-text PDFs and preprints
- 🌐 **40+ AI/ML Domains** - Comprehensive coverage across all major research areas
- 🔐 **GitHub Authentication** - Secure user accounts and personalized bookmarks
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Python 3.8+ (for backend)
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shreyas-prog108/citecrawler.git
   cd citecrawler
   ```
2. **Install dependencies**

   ```bash
   bun install
   ```
3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   # GitHub OAuth

   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
4. **Start the development server**

   ```bash
   bun run dev
   ```
5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Frontend Project Structure

```
citecrawler/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes (NextAuth, search, bookmarks)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── search/        # Search functionality
│   │   └── bookmarks/     # User bookmarks
│   ├── globals.css        # Global Tailwind styles
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── loading.tsx        # Loading UI components
├── components/            # Reusable React components
│   ├── ui/                # Base UI components (buttons, inputs)
│   ├── header.tsx         # Navigation header with auth
│   ├── hero.tsx           # Landing page hero section
│   ├── features.tsx       # Features showcase
│   ├── domain-grid.tsx    # AI/ML domains grid
│   ├── cta.tsx            # Call-to-action section
│   └── footer.tsx         # Site footer
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── utils.ts           # Helper functions
│   └── types.ts           # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── styles/                # Additional CSS files
└── public/                # Static assets (images, icons)
```

## 🛠️ Frontend Tech Stack

### Core Framework

- **Next.js 14** - React framework with App Router for file-based routing
- **TypeScript** - Type-safe JavaScript for better development experience
- **React 18** - Latest React with concurrent features and hooks

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful, customizable SVG icons
- **CSS Modules** - Component-scoped styling
- **Responsive Design** - Mobile-first approach

### Development Tools

- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

### Authentication & State

- **NextAuth.js** - Authentication framework for Next.js
- **GitHub OAuth** - Social login integration
- **React Context** - Global state management
- **Custom Hooks** - Reusable stateful logic

### Performance & Optimization

- **Next.js Image** - Optimized image loading
- **Dynamic Imports** - Code splitting and lazy loading
- **Static Generation** - Pre-rendered pages for better SEO
- **Server Components** - Reduced client-side JavaScript

## 🔧 Frontend Development

### Development Commands

```bash
# Start development server with hot reload
bun run dev

# Build for production
bun run build

# Start production server
bun start

# Run linting
bun run lint

# Run type checking
bun run type-check

# Format code
bun run format
```

### Development Workflow

1. **Component Development**

   - Create components in `/components` directory
   - Use TypeScript for type safety
   - Follow Tailwind CSS utility classes
   - Implement responsive design
2. **Page Development**

   - Use Next.js App Router in `/app` directory
   - Create API routes in `/app/api`
   - Implement server and client components
   - Add loading and error states
3. **Styling Guidelines**

   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Use CSS variables for theming
   - Implement dark/light mode support
4. **State Management**

   - Use React Context for global state
   - Create custom hooks for reusable logic
   - Implement local state with useState/useReducer
   - Use NextAuth for authentication state

### 📊 Frontend API Integration

### Authentication Endpoints

- `GET /api/auth/signin` - GitHub OAuth login
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user session

### Search & Data Endpoints

- `GET /api/search` - Search research papers with filters
- `GET /api/papers/{id}` - Get detailed paper information
- `POST /api/bookmarks` - Add paper to user bookmarks
- `GET /api/bookmarks` - Retrieve user's bookmarked papers
- `DELETE /api/bookmarks/{id}` - Remove bookmark

### API Integration Examples

```typescript
// Search papers
const searchPapers = async (query: string, filters?: SearchFilters) => {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, filters })
  });
  return response.json();
};

// Get user bookmarks
const getBookmarks = async () => {
  const response = await fetch('/api/bookmarks');
  return response.json();
};

// Add bookmark
const addBookmark = async (paperId: string) => {
  const response = await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paperId })
  });
  return response.json();
};
```

## 🌐 Frontend Deployment

### Vercel (Recommended for Next.js)

1. **Connect Repository**

   - Link your GitHub repository to Vercel
   - Vercel will auto-detect Next.js configuration
2. **Environment Variables**

   ```env
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```
3. **Automatic Deployment**

   - Deploys automatically on push to main branch
   - Preview deployments for pull requests
   - Edge functions for optimal performance

### Other Deployment Options

#### Netlify

```bash
# Build command
bun run build

# Publish directory
out/
```

#### Self-Hosted

```bash
# Build the application
bun run build

# Start production server
bun start

# Or use PM2 for process management
pm2 start bun --name "citecrawler" -- start
```

### Performance Optimization

- **Static Generation** - Pre-render pages at build time
- **Image Optimization** - Next.js Image component with WebP
- **Code Splitting** - Automatic route-based splitting
- **Edge Caching** - Vercel Edge Network for global CDN

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Pinecone](https://www.pinecone.io/) - Vector database
- [MongoDB](https://www.mongodb.com/) - DB provider
- [Github](https://github.com/Shreyas-prog108/citecrawler) - Repo and OAuth provider

## 📞 Support

- 📧 X: [https://x.com/Shreyas_Pandeyy](https://x.com/Shreyas_Pandeyy)
- 🐛 Issues: [GitHub Issues](https://github.com/Shreyas-prog108/citecrawler/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Shreyas-prog108/citecrawler/discussions)

---

**Made with ❤️ by [Shreyas-prog108](https://github.com/Shreyas-prog108)**
