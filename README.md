# Accessibility Analyzer

A comprehensive web application that analyzes websites for accessibility issues using Google Lighthouse and provides AI-powered suggestions for improvements.

## 🌟 Features

- **Lighthouse Integration**: Real-time accessibility auditing using Google Lighthouse
- **AI-Powered Suggestions**: Get intelligent recommendations using Google Gemini API
- **Detailed Issue Breakdown**: Categorized issues by severity and type
- **Visual Analytics**: Beautiful charts showing accessibility metrics
- **Report History**: Save and review past accessibility reports
- **Premium UI**: Modern, glassmorphism design with smooth animations
- **WCAG Compliance**: Issues mapped to WCAG standards

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **Lighthouse** - Accessibility testing
- **Puppeteer** - Headless browser automation
- **Google Gemini API** - AI-powered suggestions
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Chart.js** & **react-chartjs-2** - Data visualization
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Modern CSS** - Custom design system with glassmorphism

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key (optional, fallback suggestions available)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/accessibility-analyzer
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Usage

1. **Enter a URL**: On the homepage, enter any website URL you want to analyze
2. **View Results**: See the accessibility score, detailed issues, and AI suggestions
3. **Explore Issues**: Click on individual issues to see code snippets and fix recommendations
4. **Review History**: Navigate to the History page to see all your past reports

## 📊 What Gets Analyzed

- **Color Contrast**: Text readability and contrast ratios
- **ARIA Attributes**: Proper use of ARIA roles and attributes
- **Keyboard Navigation**: Keyboard accessibility and focus management
- **Semantic HTML**: Proper HTML5 semantic structure
- **Form Labels**: Form input accessibility
- **Images**: Alt text and image accessibility
- **Screen Reader Compatibility**: Overall screen reader support

## 🎨 Features in Detail

### Accessibility Scoring
- Overall accessibility score (0-100)
- Performance, Best Practices, and SEO scores
- Color-coded severity levels (Critical, Serious, Moderate, Minor)

### Issue Categorization
- Issues grouped by type (Color Contrast, ARIA, Keyboard, etc.)
- WCAG level mapping (A, AA, AAA)
- Element-specific code snippets
- CSS selectors for quick debugging

### AI Suggestions
- Context-aware improvement recommendations
- WCAG guideline references
- Actionable implementation steps
- Fallback to rule-based suggestions when AI is unavailable

## 🔑 Environment Variables

### Server
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No (fallback available) |
| `CLIENT_URL` | Frontend URL for CORS | No (default: http://localhost:5173) |

### Client
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (default: http://localhost:5000/api) |

## 📝 API Endpoints

- `POST /api/analyze` - Analyze a URL for accessibility issues
- `GET /api/reports` - Get all saved reports (limit query param optional)
- `GET /api/reports/:id` - Get a specific report by ID
- `DELETE /api/reports/:id` - Delete a report
- `GET /health` - Health check endpoint

## 🎯 Project Structure

```
AccessibilityAnalyzer/
├── server/
│   ├── models/
│   │   └── Report.js
│   ├── routes/
│   │   └── analyze.routes.js
│   ├── services/
│   │   ├── lighthouse.service.js
│   │   └── ai.service.js
│   ├── index.js
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── IssueCard.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── .env
└── README.md
```

## 🌐 Deployment

### Backend Deployment (e.g., Render, Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas connection string is configured
3. Deploy from the `server` directory

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your production API URL

## 🔧 Development

### Running Tests
```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Building for Production
```bash
# Frontend
cd client
npm run build
```

## 🐛 Troubleshooting

### Lighthouse/Puppeteer Issues
- Ensure Chrome/Chromium is installed on your system
- On Linux, you may need to install additional dependencies
- For headless Chrome issues, check Puppeteer documentation

### MongoDB Connection Issues
- Verify MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for MongoDB port (27017)

### CORS Issues
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL
- Check that the frontend is making requests to the correct API URL

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- User authentication and private reports
- Scheduled automatic scans
- Email notifications for accessibility issues
- Team collaboration features
- Export reports as PDF
- Chrome extension for on-the-fly analysis
- Dark/Light mode toggle

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ for making the web accessible to everyone.
