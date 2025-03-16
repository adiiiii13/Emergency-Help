# Emergency Response & Disaster Management System

A comprehensive web application built with React, TypeScript, and Supabase to help users during emergencies and disaster situations.

## 🚨 Features

- **Emergency Detection & Tracking**
  - Real-time compass-based emergency tracking
  - Visualization of nearby emergencies
  - Priority-based incident reporting

- **Emergency Communication**
  - Emergency calling system
  - Chat functionality
  - Saved emergency contacts management
  - Contact request system

- **First Aid & Safety Resources**
  - Quick first aid guides
  - Video tutorials
  - Life-saving tips
  - Comprehensive first aid manual

- **User Management**
  - Secure authentication
  - User profiles
  - Emergency contact management
  - Notification system

## 🛠️ Technology Stack

- **Frontend**
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - Lucide Icons

- **Backend**
  - Supabase for database and authentication
  - Real-time subscriptions
  - Secure data storage

- **Mobile Integration**
  - Capacitor for mobile deployment

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd Disaster
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
```

## 📱 Mobile Setup

1. **Install Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
```

2. **Add platforms**
```bash
npx cap add android
npx cap add ios
```

3. **Build and sync**
```bash
npm run build
npx cap sync
```

## 🗄️ Database Migrations

The project uses Supabase migrations for database schema management. Migrations are located in the `supabase/migrations` directory and include:
- User profiles
- Emergency contacts
- Chat messages
- Contact policies
- Search optimization

## 🔒 Security

- Secure authentication using Supabase
- Protected API routes
- Data encryption
- Privacy-focused contact policies

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.