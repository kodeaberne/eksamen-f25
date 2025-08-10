# Nintendopusheren - Nintendo Game Store
[![Netlify Status](https://api.netlify.com/api/v1/badges/108a451c-f232-44f2-b1e6-389a2e5c6e6f/deploy-status)](https://app.netlify.com/projects/nintendopusher/deploys)

School project at KEA. Built with **Astro**, **React**, **Tailwind CSS**, and **Supabase**. This project demonstrates a full-stack web application with authentication, product management, image uploads, and responsive design.

## 🚀 Live Demo

The application is deployed on Netlify and can be accessed at: [https://nintendopusher.netlify.app](https://nintendopusher.netlify.app)

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse Nintendo games across all platforms
- **Product Search**: Find games by title with real-time filtering
- **Platform Filtering**: Filter by Nintendo console/platform
- **Sale & Pre-order Support**: Special handling for discounted and upcoming products
- **Responsive Design**: Mobile-first design that works on all devices

### 🔐 Authentication System
- **Secure Login**: Email/password authentication via Supabase Auth
- **Session Management**: HTTP-only cookies for secure token storage
- **Protected Routes**: Admin dashboard with authentication requirements
- **Automatic Logout**: Session validation and cleanup

### 🎮 Product Management
- **Admin Dashboard**: Comprehensive product creation and management interface
- **Image Upload**: Drag-and-drop image uploads with validation
- **Product CRUD**: Create, read, update, and delete products
- **Bulk Operations**: Efficient product management workflows

### 🎨 Design System
- **Nintendo-Inspired UI**: Authentic Nintendo design aesthetic
- **Custom Typography**: RasterForgeRegular and Gill Sans Italic fonts
- **Responsive Grid**: Tailwind CSS-powered responsive layouts
- **Interactive Elements**: Hover effects, transitions, and animations

## 🏗️ Architecture

### Frontend Stack
- **Astro**: Static site generation with dynamic API routes
- **React**: Interactive components for dynamic functionality
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **TypeScript**: Type-safe development with comprehensive type definitions

### Backend Services
- **Supabase**: PostgreSQL database with real-time capabilities
- **Supabase Auth**: User authentication and session management
- **Supabase Storage**: File upload and image management
- **API Routes**: Server-side endpoints for data operations

### Data Flow
```
User Interface → React Components → API Routes → Supabase → PostgreSQL
                ↓
            Tailwind CSS → Responsive Design → User Experience
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Package manager (comes with Node.js)
- **Supabase Account**: Free tier available at [supabase.com](https://supabase.com)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/eksamen-f25.git
cd eksamen-f25
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

### 4. Database Setup

#### Create the Products Table
Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    prevprice NUMERIC(10,2),
    sale BOOLEAN DEFAULT FALSE,
    preorder BOOLEAN DEFAULT FALSE,
    releasedate DATE,
    description TEXT NOT NULL,
    imglink TEXT,
    dateadded TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');
```

#### Create Storage Bucket
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `product-images`
3. Set it to public (for image display)
4. Configure CORS if needed for your domain

### 5. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## 🔧 Development

### Project Structure
```
eksamen-f25/
├── src/
│   ├── components/          # React components
│   │   ├── react/          # Interactive React components
│   │   └── *.astro         # Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes and API endpoints
│   │   ├── api/            # Backend API routes
│   │   └── *.astro         # Page components
│   ├── lib/                # Utility libraries
│   ├── assets/             # Static assets
│   └── styles/             # Global styles
├── public/                 # Public assets
├── astro.config.mjs        # Astro configuration
└── package.json            # Dependencies and scripts
```

### Key Components

#### ProductCard.jsx
The main product display component featuring:
- Nintendo-inspired design with red headers/footers
- Dynamic content from Supabase database
- Responsive image handling
- Interactive add-to-cart functionality
- Sale and pre-order badge support

#### ProductGrid.jsx
Grid layout component that:
- Fetches products via API endpoints
- Implements filtering and search
- Handles loading and error states
- Responsive grid layout with Tailwind CSS

#### Dashboard.astro
Admin interface providing:
- Product creation form with validation
- Image upload functionality
- Platform selection dropdown
- Authentication status display

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

#### Products
- `GET /api/fetch/products` - Retrieve products with filtering
- `POST /api/insert/insert` - Create new products

#### File Management
- `POST /api/upload/upload` - Image upload to Supabase Storage

### Styling System
The project uses Tailwind CSS with custom design tokens:
- **Custom Colors**: Nintendo-inspired color palette
- **Typography**: Custom fonts loaded via Astro's font system
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Component Consistency**: Reusable design patterns

## 🚀 Deployment

### Netlify Deployment (Recommended)

#### 1. Connect to Git Repository
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Netlify will automatically detect the Astro project

#### 2. Build Configuration
Netlify will automatically use these build settings:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x (or higher)

#### 3. Environment Variables
Set these in your Netlify dashboard under Site Settings → Environment Variables:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Deploy
- Push to your main branch for automatic deployment
- Or trigger manual deployment from the Netlify dashboard

### Alternative Deployment Options

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variables in Vercel dashboard

#### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist/` folder to your web server
3. Configure your server for SPA routing

### Post-Deployment Checklist

#### 1. Domain Configuration
- Configure custom domain in Netlify (if desired)
- Set up SSL certificate (automatic with Netlify)

#### 2. Supabase Configuration
- Update CORS settings in Supabase dashboard
- Add your production domain to allowed origins
- Verify storage bucket permissions

#### 3. Testing
- Test authentication flow
- Verify image uploads
- Check responsive design on various devices
- Test product creation and management

## 🔒 Security Considerations

### Authentication
- HTTP-only cookies prevent XSS attacks
- Secure token storage and validation
- Automatic session cleanup

### Data Validation
- Server-side input validation
- File type and size restrictions
- SQL injection prevention via Supabase

### Environment Variables
- Never commit `.env` files to version control
- Use secure environment variable management
- Rotate keys regularly

## 🧪 Testing

### Development Testing
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Manual Testing Checklist
- [ ] User authentication (login/logout)
- [ ] Product creation and management
- [ ] Image upload functionality
- [ ] Search and filtering
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Cross-browser compatibility

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
- Ensure Node.js version is 18+ 
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project status and API limits
- Ensure RLS policies are configured properly

#### Image Upload Failures
- Verify storage bucket exists and is public
- Check file size limits (5MB max)
- Ensure proper CORS configuration

#### Authentication Problems
- Clear browser cookies and local storage
- Verify Supabase Auth is enabled
- Check user account status in Supabase dashboard

## 📚 Additional Resources

### Documentation
- [Astro Documentation](https://docs.astro.build/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

### Community
- [Astro Discord](https://astro.build/chat)
- [Supabase Discord](https://discord.supabase.com/)
- [Tailwind CSS Discord](https://discord.gg/7NF8GNe)

## 📄 License

This project is for educational purposes. 


**Built with ❤️ using Astro, React, Tailwind CSS, and Supabase**
