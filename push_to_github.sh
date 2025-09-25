#!/bin/bash

# Navigate to project directory
cd "/Users/zubayer/Downloads/New folder"

# Add remote repository (ignore error if already exists)
git remote add origin https://github.com/patowari/Tapuze_frontend.git 2>/dev/null || echo "Remote already exists"

# Add all files
git add .

# Commit changes
git commit -m "Updated prototype: Enhanced AuthScreen and SignupScreen with mobile UI improvements

- Added manual login/signup with email and password
- Implemented password visibility toggles  
- Enhanced mobile responsive design with ScrollView
- Fixed UI spacing and touch targets for mobile
- Added proper form validation
- Maintained Google authentication options
- Improved overall user experience"

# Create and switch to new branch
git checkout -b Update_Prototype

# Push to remote repository
git push -u origin Update_Prototype

echo "Successfully created and pushed Update_Prototype branch!"
