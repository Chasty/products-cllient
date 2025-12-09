# Product Reviews App

A modern Next.js application for managing and displaying product reviews. Users can browse products, view existing reviews, and submit new reviews with ratings.

## Features

- 📦 Display list of products fetched from backend
- ⭐ View product reviews with star ratings
- ✍️ Submit new reviews for selected products
- ✅ Form validation with error messages
- 🔄 Loading states during data fetching and submission
- 🎨 Modern, responsive UI with dark mode support
- 🧪 Unit tests for React components

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
app/
├── components/
│   ├── ProductForm.tsx          # Review submission form
│   ├── ProductsList.tsx         # Product and review display
│   └── __tests__/               # Unit tests
├── productContext.tsx           # React Context for state management
├── page.tsx                     # Main page component
└── globals.css                  # Global styles
```

## API Endpoints

The app expects the following backend endpoints:

- `GET http://localhost:3000/products` - Fetch all products with reviews
- `POST http://localhost:3000/:productId/review` - Submit a new review

## Usage

1. **View Products**: Products are automatically loaded and displayed on the page
2. **Submit Review**: 
   - Select a product from the dropdown
   - Enter your name
   - Choose a rating (1-5 stars)
   - Write your review comment
   - Click "Submit Review"

## Features in Detail

### Form Validation
- Product selection is required
- Reviewer name must be at least 2 characters
- Rating must be between 1 and 5
- Comment must be at least 10 characters

### UI/UX
- Responsive grid layout for products
- Visual star ratings
- Loading spinners during async operations
- Error and success message displays
- Dark mode support
- Smooth transitions and hover effects

## License

MIT
