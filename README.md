# TutorSchool - AI-Powered Tutor Matching Platform

> Find Your Perfect Tutor—Home or Online

## 🎯 About TutorSchool

TutorSchool is a modern AI-powered tutor matching platform that connects students with qualified tutors for both in-person home tutoring and online education. Built with Next.js 15 and designed with a focus on user experience, the platform offers a comprehensive solution for educational needs.

### ✨ Key Features

- **🤖 AI-Powered Matching**: Intelligent tutor-student matching algorithms
- **🏠 Home Tutoring**: In-person tutoring at student's location
- **💻 Online Education**: Flexible online video classes
- **📚 Multi-Subject Support**: Mathematics, Science, English, Hindi, and more
- **👥 Multiple User Types**: Separate flows for tutors, students, and educational institutions
- **📱 Responsive Design**: Works seamlessly across all devices
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS

### 🎭 User Personas

- **Students & Parents**: Find and book qualified tutors for various subjects
- **Tutors**: Create profiles, offer services, and manage students
- **Educational Institutions**: Partner with the platform for expanded reach
- **Employers**: Access tutoring services for employee development

## 🛠️ Tech Stack

This application is built with modern web technologies:

### Frontend Framework
- **Next.js 15**: React framework with App Router for SSR and SSG
- **React 18+**: Component-based UI library
- **TypeScript**: Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library

### State Management & Data
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Performant form handling with validation
- **Zod**: TypeScript-first schema validation

### Development Tools
- **ESLint**: Code linting and formatting
- **Next Themes**: Dark/light theme support
- **Class Variance Authority**: Component variant management

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.17 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd totorbuddy
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   
   # Or using bun
   bun install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   
   # Or using bun
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## 📂 Project Structure

```
totorbuddy/
├── app/                    # Next.js App Router directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Home page
│   └── not-found.tsx     # 404 page
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── providers/    # Context providers
│   │   ├── Hero.tsx      # Landing page sections
│   │   ├── Navbar.tsx    # Navigation component
│   │   └── ...           # Other feature components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── assets/           # Static assets (images, etc.)
├── public/               # Public static files
├── tailwind.config.ts    # Tailwind CSS configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Component Architecture

The application follows a modular component architecture:

### Landing Page Sections
- **Hero**: Main banner with call-to-action buttons
- **TrustedBy**: Partner logos and credibility indicators
- **Process**: Step-by-step how-it-works flow
- **Services**: Service categories and offerings
- **Testimonials**: User reviews and success stories
- **ForTutors**: Information and signup for tutors

### UI Components
Built with shadcn/ui for consistency and accessibility:
- Forms (Input, Button, Select, Checkbox, etc.)
- Layout (Card, Dialog, Sheet, etc.)
- Navigation (Navbar, Breadcrumb, etc.)
- Feedback (Toast, Alert, Progress, etc.)

## 🌟 Features in Development

The platform includes several advanced features:

- **Multi-step Onboarding**: Separate flows for tutors and learners
- **Dashboard Interface**: User-specific dashboards for managing activities
- **AI-Powered Recommendations**: Smart tutor-student matching
- **Real-time Communication**: In-app messaging and notifications
- **Payment Integration**: Secure payment processing
- **Review System**: Ratings and feedback mechanism

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Use absolute imports with `@/` alias
- Implement responsive design with Tailwind CSS

### Component Patterns
```tsx
// Preferred component structure
const ComponentName = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Styling Convention
- Use Tailwind utility classes
- Leverage shadcn/ui components for consistency
- Implement responsive design with mobile-first approach

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy with automatic builds on push

### Deploy to Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation for common solutions

---

**TutorSchool** - Empowering education through technology 🚀
