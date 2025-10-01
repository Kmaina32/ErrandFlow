# ErrandFlow

Your personal errands, delivered on-demand.

ErrandFlow is a modern, AI-powered web application designed to connect users who need errands run with a network of trusted riders. Built with a mobile-first approach, it provides a seamless experience for posting tasks and getting fair, data-driven price recommendations.

## Features

- **AI-Powered Price Recommendation**: Leverages Google's Gemini AI to analyze errand details (task type, distance, location) and suggests a fair market price range in real-time.
- **Simple Errand Request Form**: An intuitive form allows users to quickly post new errand requests, specifying task type, pickup/drop-off locations, and additional notes.
- **Geolocation Integration**: Users can automatically use their current device location for pickup or drop-off points, making the form-filling process faster.
- **Visual Route Mapping**: After a price recommendation is generated, a static Google Map image is displayed, showing the visual route from pickup to drop-off.
- **Firestore Integration**: All submitted errand requests are saved to a `requests` collection in Firestore, creating a backend for riders to view available jobs.
- **Mobile-First & Responsive Design**: The user interface is optimized for mobile devices, ensuring a great experience on any screen size.
- **Modern Tech Stack**: Built with Next.js, React, TypeScript, Tailwind CSS, and ShadCN for a robust and beautiful UI.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A Firebase project

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - In your project settings, find your web app's configuration object.
    - Copy the `firebaseConfig` object and paste it into `src/lib/firebase-config.ts`, replacing the placeholder content.

4.  **Configure Google Maps API:**
    - Enable the "Maps Static API" in the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview).
    - Create a file named `.env.local` in the root of the project.
    - Add your API key to the `.env.local` file:
      ```
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-goes-here
      ```

5.  **Set up Firestore Security Rules:**
    - In your Firebase project, navigate to **Firestore Database > Rules**.
    - For development, you can use the following insecure rules. **Remember to secure these for production!**
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /requests/{requestId} {
            allow read, write: if true;
          }
        }
      }
      ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── actions.ts       # Server Actions for form submission and AI interaction.
│   │   ├── globals.css      # Global styles and Tailwind directives.
│   │   ├── layout.tsx       # Root app layout.
│   │   └── page.tsx         # The main homepage component.
│   │
│   ├── ai
│   │   ├── flows
│   │   │   └── errand-price-recommendation.ts # Genkit AI flow for price recommendations.
│   │   └── genkit.ts        # Genkit initialization and configuration.
│   │
│   ├── components
│   │   ├── errands
│   │   │   └── errand-request-form.tsx # The main form component for submitting errands.
│   │   ├── layout
│   │   │   └── header.tsx     # The application's header.
│   │   └── ui                 # Reusable UI components from ShadCN.
│   │
│   ├── hooks
│   │   ├── use-mobile.tsx     # Hook to detect if the user is on a mobile device.
│   │   └── use-toast.ts       # Hook for showing toast notifications.
│   │
│   └── lib
│       ├── firebase-config.ts # Firebase project configuration (NEEDS TO BE FILLED).
│       ├── firebase.ts        # Firebase app initialization.
│       └── utils.ts           # Utility functions (e.g., `cn` for Tailwind classes).
│
├── public                   # Static assets.
├── package.json             # Project dependencies and scripts.
└── README.md                # This file.
```
