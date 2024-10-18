# RoomieRadar
![RoomieRadar Icon](./assets/Roomie-radar-white-background-1.png)

RoomieRadar is a mobile application designed to help students at the National University of Singapore (NUS) find compatible roommates based on shared preferences, habits, and lifestyle choices. The app enhances the roommate-finding experience by using a sophisticated matching algorithm and also fosters community connections through features like in-app messaging and community boards.

*This project was developed as part of the **Orbital Program**, NUS School of Computing's 1st-year summer self-directed, independent work course, aimed at helping students pick up software development skills on their own using online resources.*

## Key Features

- **User Authentication:** Secure email login and account registration using Firebase Authentication.
- **Profile Customization:** Users can upload profile pictures, set usernames, and write introductions.
- **Advanced Matchmaking:** Find roommates based on gender, sleep schedules, cleanliness, housing preferences, and more.
- **In-app Messaging:** Real-time chat feature to connect with potential roommates.
- **Community Board:** Engage with the NUS student community by posting or interacting with events and announcements.

## Setup and Installation

### 1. Easy Installation (Expo Go)

If you just want to quickly run the app:

1. **Download the Expo Go App**  
   - [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US)

2. **Scan the QR Code**  
   After downloading the Expo Go app, scan the QR code provided in the [Expo link here](https://expo.dev/preview/update?message=Milestone3.v1&updateRuntimeVersion=1.0.0&createdAt=2024-07-29T06%3A52%3A01.915Z&slug=exp&projectId=83f10503-a595-42e4-b630-43ba737e56af&group=36e0f1c0-b345-423b-8803-f107c3c588a3) with your device camera or within the Expo Go app.

3. **Enjoy the App!**

### 2. Developer Setup

If you want to set up the app for development or testing:

1. **Install Dependencies**
   - Ensure you have [Node.js](https://nodejs.org/) installed.
   - Install React Native CLI globally:  
     ```bash
     npm install -g react-native-cli
     ```
   - Install Expo CLI globally:  
     ```bash
     npm install -g expo-cli
     ```

2. **Clone the Repository**
   ```bash
   git clone https://github.com/JadeCheah/roomie-radar.git

3. **Navigate to Project Directory**
    ```bash
    cd roomie-radar

4. **Install Necessary Packages**
    ```bash
    npm install
    npm install firebase @react-native-firebase/app @react-native-firebase/auth

5. **Start the App**
    ```bash 
    npx expo start

6. **Run on Your Device**
    - Use the Expo Go app to scan the QR code shown in your terminal to load the app on your device.

## Project Report

For more details about the project, including:

- **Technology Stack**: Built with React Native, Expo, Firebase for authentication, and Firestore for database management.
- **Testing Methods**: Unit tests and manual testing for core features, including user authentication, profile management, and in-app messaging.
- **Challenges and Solutions**: Handling user state management, real-time updates, and optimizing performance for mobile platforms.

You can read the full [Project Report](./ProjectReport_RoomieRadar.pdf) for a deeper dive into the development process.

## Contact

For any issues or inquiries, please reach out to:

- **Telegram:** @y9u7e (Jade Cheah) or @supermariio0 (Mariia Popova)