# ResumeAi 🤖

An AI-powered interview application that conducts automated interviews based on your resume. Upload your resume (PDF or DOCX), answer AI-generated questions tailored to your experience, and receive detailed feedback and scoring.

## ✨ Features

- **Resume Upload**: Support for PDF and DOCX files (up to 5MB)
- **AI-Generated Questions**: Questions are dynamically generated based on your resume content using Google Gemini AI
- **Interactive Interview**: Step-by-step interview process with progress tracking
- **Detailed Feedback**: Comprehensive reviews and scoring for each answer
- **Modern UI**: Built with Angular 20 and Tailwind CSS for a clean, responsive experience
- **File Storage**: Cloudinary integration for secure file storage
- **Rate Limiting**: Built-in protection against abuse

## 🏗️ Architecture

### Frontend (Angular 20)

- **Framework**: Angular 20 with standalone components
- **Styling**: Tailwind CSS for modern, responsive design
- **Routing**: Lazy-loaded routes for optimal performance
- **State Management**: Angular signals for reactive state management

### Backend (Node.js + Express)

- **Framework**: Express.js with ES modules
- **AI Integration**: Google Gemini AI for question generation and answer review
- **Database**: MongoDB with Mongoose ODM
- **File Processing**: PDF and DOCX text extraction
- **Storage**: Cloudinary for file storage
- **Security**: Helmet, CORS, and rate limiting

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Google Gemini AI API key
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd resume-ai
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/resume-ai
   GEMINI_API_KEY=your_gemini_api_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```

2. **Start the frontend development server**

   ```bash
   ng serve
   # or
   npm start
   ```

3. **Open your browser**

   Navigate to `http://localhost:4200/` to access the application.

## 📱 Usage

1. **Upload Resume**: Select and upload your resume (PDF or DOCX format)
2. **AI Processing**: The system extracts text and generates relevant interview questions
3. **Answer Questions**: Go through each question and provide detailed answers
4. **Get Results**: Receive comprehensive feedback and scoring for your performance

## 🔧 API Endpoints

### Upload Resume

```text
POST /api/upload
Content-Type: multipart/form-data
Body: resume file (PDF/DOCX)
```

### Submit Answer

```text
POST /api/interview/answer
Content-Type: application/json
Body: { sessionId: string, answer: string }
```

## 🛠️ Development

### Frontend Development

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Generate new component
ng generate component component-name
```

### Backend Development

```bash
cd backend

# Start with nodemon (auto-reload)
npm run dev

# Start production server
npm start
```

## 📦 Dependencies

### Frontend

- Angular 20
- Tailwind CSS
- RxJS
- TypeScript

### Backend

- Express.js
- MongoDB + Mongoose
- Google Gemini AI
- Cloudinary
- Multer (file uploads)
- Helmet (security)
- Morgan (logging)

## 🚀 Deployment

### Frontend Deployment

```bash
ng build --configuration production
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment

```bash
cd backend
npm start
# Deploy to your Node.js hosting provider
```

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

### Manthan Ankolekar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.
