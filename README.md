# 🗳️ CivicFix AI - Civic Issue Resolver

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Sparkyyy45/CivicFix-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**CivicFix AI** is a modern, AI-powered platform designed to empower citizens to report, track, and resolve civic issues in their community. By leveraging geolocation, AI image analysis, and a transparent dashboard, we bridge the gap between citizens and local authorities.

![Dashboard Preview](public/dashboard-preview.png) <!-- Replace with actual screenshot if available -->

## ✨ Features

-   **📸 AI-Powered Reporting**: simply upload a photo of the issue (pothole, garbage, street light). Our AI automatically categorizes the issue, identifies the responsible department, and assigns an urgency level.
-   **📍 Smart Geolocation**: 
    -   **"Locate Me"**: Instantly find your exact GPS coordinates.
    -   **Location Search**: Search for any landmark or address in India.
    -   **Interactive Map**: Pinpoint the exact location on a map.
-   **🛡️ Safety Risk Assessment**: Real-time analysis of the reported issue's safety impact on the immediate surroundings.
-   **📊 Citizen Dashboard**: Track the status of your reported issues (Pending, In Progress, Resolved).
-   **🚫 Duplicate Detection**: Smartly warns users if a similar issue has already been reported nearby to prevent redundancy.
-   **👍 Community Upvoting**: Upvote existing issues to show community support and increase priority.

## 🛠️ Tech Stack

This project is built with a cutting-edge tech stack for performance, scalability, and developer experience.

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
-   **Geocoding**: [OpenStreetMap Nominatim API](https://nominatim.org/)
-   **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js 18+ installed
-   npm or yarn installed

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Sparkyyy45/CivicFix-AI.git
    cd CivicFix-AI
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Firebase and Cloudinary credentials:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for a better community.
