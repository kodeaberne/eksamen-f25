# Nintendopusheren - Nintendo Game Store

A modern e-commerce platform for Nintendo games built with Astro, React, and Supabase.

## Features

### Product Management
- **Admin Dashboard**: Create and manage products through a comprehensive admin interface
- **Product Cards**: Beautiful product cards matching Nintendo's design aesthetic
- **Image Upload**: Automatic image upload and storage
- **Pre-order Support**: Special badges and handling for pre-order products
- **Sale Management**: Discount pricing and sale badges

### Product Card Design
The product cards feature a design inspired by Nintendo's packaging with:
- **Red Header/Footer**: Matches Nintendo's signature red color scheme
- **Game Cover Display**: Prominent game artwork with overlay elements
- **Pre-order Badge**: Yellow badge for pre-order items
- **Nintendo Switch Logo**: Platform branding
- **PEGI Rating**: Age rating display
- **Game Key Card Label**: Digital download indicator
- **Price Display**: Clear pricing with sale price support
- **Add to Cart Button**: Prominent call-to-action

### Technical Stack
- **Frontend**: Astro + React components
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage for images
- **Deployment**: Netlify

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   Create a `products` table in Supabase with the following columns:
   - `id` (uuid, primary key)
   - `title` (text, required)
   - `platform` (text, required)
   - `price` (numeric, required)
   - `prevprice` (numeric, optional)
   - `sale` (boolean, default false)
   - `preorder` (boolean, default false)
   - `releasedate` (date, optional)
   - `description` (text, required)
   - `imglink` (text, optional)
   - `created_at` (timestamp, default now())

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Component Structure

### ProductCard.jsx
The main product card component that displays individual products with:
- Responsive design
- Dynamic content from Supabase
- Interactive elements (add to cart)
- Proper accessibility

### ProductGrid.jsx
Grid layout component that:
- Fetches products from the API
- Handles loading and error states
- Responsive grid layout
- Client-side rendering

### API Endpoints
- `/api/products` - GET endpoint to fetch all products
- `/api/insert/insert` - POST endpoint to create new products
- `/api/upload/upload` - POST endpoint for image uploads

## Design System

The project uses a comprehensive design system with:
- **Colors**: Custom color palette matching Nintendo's branding
- **Typography**: Custom fonts (RasterForgeRegular, Gill Sans Italic)
- **Spacing**: Consistent spacing system
- **Components**: Reusable React components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.
