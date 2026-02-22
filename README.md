# CardioTwin AI | Your Heart's Early Warning System

CardioTwin AI is a cutting-edge predictive health monitoring application that leverages 3D visualization and real-time biometric analysis to provide users with a "Digital Twin" of their cardiovascular health. Designed for accessibility and localized support, it empowers users to take proactive steps toward heart wellness.

## ✨ Key Features

-   **🫀 3D Digital Twin Visualization**: Interactive 3D human body render (built with React Three Fiber) that maps real-time health data to anatomical locations.
-   **📊 Real-time Biometric Tracking**: Continuous monitoring of vital signs:
    -   Heart Rate (BPM)
    -   Heart Rate Variability (HRV)
    -   Oxygen Saturation (SpO2)
    -   Skin Temperature
-   **🤖 AI Predictive Nudges**: Dynamic, personalized health advice based on biometric trends to help users prevent strain and optimize recovery.
-   **🌍 Localized Experience**: Full support for multiple languages, ensuring healthcare inclusivity:
    -   English
    -   Yorùbá
    -   Hausa
    -   Igbo
-   **🛡️ Privacy-First Flow**: Secure session management designed with data protection (NDPA) principles in mind.

## 🚀 Tech Stack

-   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **3D Rendering**: [Three.js](https://threejs.org/) / [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Data Visualization**: [Recharts](https://recharts.org/)

## 🛠️ Getting Started

### Prerequisites
-   Node.js (v18+)
-   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/ayreact/bit-cavista.git
    cd bit-cavista
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add the API base URL:
    ```env
    VITE_API_BASE_URL=https://bit-cavista.onrender.com
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

-   `src/components`: Reusable UI components, including the 3D `HealthAvatar` and dashboard layout.
-   `src/pages`: Main application views (Landing, Dashboard).
-   `src/services`: API integration and data fetching logic.
-   `src/i18n`: Multilingual context and translation files.
-   `src/assets`: Static assets and icons.

---
Built with ❤️ for a healthier future.
