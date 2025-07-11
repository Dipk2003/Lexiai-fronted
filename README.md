# ⚖️ LexiAI - Legal Case Research Platform

A modern, AI-powered frontend application tailored for lawyers and legal professionals to research and manage legal cases with real-time data, analytics, and intuitive UI.

---

## 🚀 Features

- 🔍 **Advanced Case Search** – AI-powered search with smart relevance scoring  
- 📊 **Professional Dashboard** – Visual insights and recent activity tracking  
- 📁 **Case Management** – Save, organize, and revisit research sessions  
- 📱 **Multi-Device Support** – Responsive across desktop, tablet, and mobile  
- 🎨 **Modern UI** – Built with Material UI v7 for a clean legal workspace  
- 🔄 **Real-Time Data** – Live integration with backend APIs  
- 🔐 **User Management** – Secure login, profile, and user settings  
- 📥 **Export Support** – Download case data and research summaries  

---

## 🛠️ Tech Stack

| Category          | Tech                                       |
|------------------|--------------------------------------------|
| Frontend         | **React 19 + TypeScript**                  |
| UI Framework     | **Material-UI v7**                         |
| State Management | React Context + React Query                |
| Routing          | React Router v7                            |
| HTTP Client      | Axios                                      |
| Charting         | Recharts                                   |
| Date Utilities   | date-fns                                   |
| Build Tool       | Create React App                           |

---

## 📋 Prerequisites

- Node.js v16 or later  
- npm or yarn  
- A running backend API → [LexiAI Backend](#) *(replace with your actual repo link)*

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lexiai-frontend.git
cd lexiai-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Configure Environment

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_APP_NAME=LexiAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### 4. Start Development Server

```bash
npm start
```

App runs at: [http://localhost:3000](http://localhost:3000)

---

## 🧾 Available Scripts

| Script                  | Description                         |
|-------------------------|-------------------------------------|
| `npm start`             | Start development server            |
| `npm test`              | Run test suite                      |
| `npm run type-check`    | TypeScript type checking            |
| `npm run lint`          | Run ESLint                          |
| `npm run lint:fix`      | Auto-fix lint issues                |
| `npm run format`        | Format code with Prettier           |
| `npm run build`         | Production build                    |
| `npm run serve`         | Serve built app locally             |
| `npm run analyze`       | Analyze Webpack bundle              |

---

## 🗂️ Project Structure

```
src/
├── components/         # Reusable UI components
│   └── Layout.tsx
├── contexts/           # React Contexts
│   └── AuthContext.tsx
├── hooks/              # Custom Hooks
├── pages/              # Route-based pages
│   ├── Dashboard.tsx
│   ├── CaseResearch.tsx
│   ├── CaseDetails.tsx
│   └── Profile.tsx
├── services/           # API logic
│   └── api.ts
├── types/              # Type definitions
├── utils/              # Utility functions
├── App.tsx             # App entry
└── index.tsx           # Main render
```

---

## 🔐 Authentication

JWT-based authentication with demo credentials:

```text
Email:    demo@lawfirm.com  
Password: demo123
```

---

## 🎨 Theming

- **Primary Color**: #1976d2 (Professional Blue)  
- **Secondary Color**: #dc004e (Accent Red)  
- **Typography**: Roboto  
- **Responsive**: Desktop, Tablet & Mobile friendly  

---

## 📦 Deployment

### 🔧 Setup

- Update `.env.production` with the production API URL
- Ensure backend is deployed

### 🏗️ Build

```bash
npm run build:prod
```

### 🚀 Deployment Options

| Platform        | Notes                                   |
|-----------------|------------------------------------------|
| Netlify         | `netlify deploy --prod --dir=build`     |
| Vercel          | Auto-detect React build                 |
| Firebase Hosting| Static deploy with CLI                  |
| AWS S3 + CF     | Upload `build/` folder                  |
| Docker          | See below                               |

---

## 🐳 Docker Deployment

```dockerfile
# Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 Testing

Run tests:

```bash
npm test
```

With coverage:

```bash
npm test -- --coverage
```

---

## 🔧 Configuration

| Variable Name             | Purpose                         |
|--------------------------|----------------------------------|
| `REACT_APP_API_BASE_URL` | API Base URL                     |
| `REACT_APP_APP_NAME`     | App display name                 |
| `REACT_APP_VERSION`      | App version                      |
| `REACT_APP_ENVIRONMENT`  | Environment name                 |

---

## 🧠 Backend Integration

Your backend must support:

- `POST /auth/login` – Login  
- `GET /auth/me` – Current user  
- `GET /research/search` – Case search  
- `GET /research/cases/:id` – Case details  
- `GET /users/profile` – Profile  
- `PUT /users/settings` – Update user settings  
- `GET /analytics/dashboard` – Dashboard data  

---

## 🌐 Browser Support

| Browser      | Supported |
|--------------|-----------|
| Chrome       | ✅        |
| Firefox      | ✅        |
| Safari       | ✅        |
| Edge         | ✅        |
| Mobile (iOS/Android) | ✅ |

---

## 🤝 Contributing

```bash
# Fork the repo
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

Then open a Pull Request 🙌

---

## 📄 License

Licensed under the [MIT License](LICENSE)

---

## 🆘 Support

- Create an issue in this repo
- Contact the dev team
- Check the project docs

---

**Built with ❤️ for legal professionals**
**Built by Dipanshu kumar pandey**
