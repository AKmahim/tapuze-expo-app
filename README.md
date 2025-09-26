# Non-Fun Frontend - Learning Management System

A comprehensive Learning Management System (LMS) built with React Native and Expo, designed to facilitate educational interactions between students and lecturers with AI-powered evaluation capabilities.

## 🚀 Features

### Authentication & User Management
- User authentication (login/signup)
- Role-based access control (Student/Lecturer)
- Profile management
- Secure session handling with AsyncStorage

### Student Features
- **Dashboard**: Overview of enrolled classrooms and assignments
- **Classroom Access**: Join and view classroom content
- **Assignment Submission**: Submit assignments with file upload support
- **Progress Tracking**: Monitor assignment status and grades

### Lecturer Features
- **Dashboard**: Manage classrooms and assignments
- **Classroom Management**: Create and manage classrooms
- **Assignment Creation**: Create assignments with customizable parameters
- **Submission Review**: View and evaluate student submissions
- **AI-Powered Evaluation**: Automated assignment evaluation using AI
- **Grade Management**: Assign grades and provide feedback

### Additional Features
- Document handling (PDF support)
- File sharing capabilities
- Interactive UI components with charts and visualizations
- Cross-platform compatibility (iOS, Android, Web)

## 🏗️ Project Structure

```
├── App.js                     # Main app entry point with navigation
├── index.js                   # Expo entry point
├── package.json              # Dependencies and scripts
├── metro.config.js           # Metro bundler configuration
├── app.json                  # Expo configuration
│
├── assets/                   # Static assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   ├── logo2.png
│   └── splash-icon.png
│
├── components/               # Reusable UI components
│   ├── AssignmentCard.js     # Assignment display component
│   ├── ClassroomCard.js      # Classroom display component
│   ├── GradeDonutChart.js    # Grade visualization
│   ├── InfoBanner.js         # Information banner
│   ├── ProblemAccordionItem.js # Expandable problem display
│   ├── Spinner.js            # Loading spinner
│   └── icons/                # Custom icon components
│       ├── PlusIcon.js
│       └── SparklesIcon.js
│
├── contexts/                 # React context providers
│   └── AuthContext.js        # Authentication state management
│
├── screens/                  # Application screens
│   ├── AuthScreen.js         # Login screen
│   ├── SignupScreen.js       # Registration screen
│   ├── StudentDashboard.js   # Student main dashboard
│   ├── LecturerDashboard.js  # Lecturer main dashboard
│   ├── ClassroomScreen.js    # General classroom view
│   ├── StudentClassroomScreen.js  # Student classroom view
│   ├── LecturerClassroomScreen.js # Lecturer classroom view
│   ├── CreateClassroom.js    # Classroom creation
│   ├── CreateAssignment.js   # Assignment creation
│   ├── SubmitAssignment.js   # Assignment submission
│   ├── SubmissionsScreen.js  # View all submissions
│   ├── SubmissionDetailScreen.js # Individual submission details
│   ├── EvaluationScreen.js   # Manual evaluation interface
│   ├── AIEvaluationScreen.js # AI evaluation interface
│   ├── DemoEvaluationScreen.js # Evaluation demo
│   ├── ProfileScreen.js      # User profile management
│   ├── StudentProfile.js     # Student-specific profile
│   └── LecturerProfile.js    # Lecturer-specific profile
│
└── services/                 # API and external services
    └── apiService.js         # API communication layer
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 54.0.0
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **File Handling**: Expo Document Picker, File System, Media Library
- **UI Components**: React Native Vector Icons, SVG support
- **Development**: Metro bundler, Babel

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI**: `npm install -g @expo/cli`
- **Git** for version control

### For Development
- **Android Studio** (for Android development)
- **Xcode** (for iOS development on macOS)
- **Expo Go** app on your mobile device for testing

## 🚀 Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd Non-fun-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or using yarn
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm start
   # or
   expo start
   ```

### Running the App

#### Development Mode
```bash
# Start the Expo development server
npm start

# Run on Android emulator/device
npm run android

# Run on iOS simulator/device (macOS only)
npm run ios

# Run in web browser
npm run web
```

#### Using Expo Go
1. Install Expo Go on your mobile device
2. Run `npm start` in your project directory
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 📱 App Usage

### For Students
1. **Sign up** or **log in** with your credentials
2. **Join classrooms** using classroom codes
3. **View assignments** and their requirements
4. **Submit assignments** by uploading required files
5. **Track progress** and view grades

### For Lecturers
1. **Sign up** or **log in** with lecturer credentials
2. **Create classrooms** and share codes with students
3. **Create assignments** with specific requirements
4. **Review submissions** from students
5. **Use AI evaluation** or manually grade assignments
6. **Provide feedback** and assign final grades

## 🔧 Configuration

### Environment Setup
- Ensure your `app.json` is configured for your deployment target
- Update API endpoints in `services/apiService.js` for your backend
- Configure authentication providers if using external services

### Customization
- Modify theme colors and styles in component files
- Update app icons and splash screens in the `assets/` directory
- Customize navigation structure in `App.js`

## 🤝 Contributing

We welcome contributions to improve the Non-Fun Frontend LMS! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and structure
- Add comments for complex logic
- Test your changes on multiple platforms
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section for existing solutions
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce, expected behavior, and screenshots if applicable

## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics and reporting
- Integration with external educational tools
- Enhanced AI evaluation capabilities
- Multi-language support
- Offline mode functionality

---

Built with ❤️ using React Native and Expo
