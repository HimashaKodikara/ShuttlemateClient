# ShuttleMate Mobile App

ShuttleMate is a mobile application designed to streamline shuttle booking, item purchases, payments, and more for users. This README provides an overview of the project structure, setup instructions, and usage guidelines.

## Features
- User authentication (Sign In/Sign Up)
- Search for coaches and courts
- Book matches
- Shop for items
- Item purchase and checkout
- Payment processing
- View trending items and videos

## Project Structure
```
app.json
babel.config.js
eas.json
google-services.json
index.js
package.json
app/
  (auth)/
  (ItemPurchase)/
  (Payment)/
  (tabs)/
  components/
  search/
  searchcoach/
assets/
constants/
server/
```

## Getting Started

### Prerequisites
- Node.js (v14 or above)
- npm or yarn
- Expo CLI (for React Native projects)

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd "Mobile App"
   ```
3. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
4. Start the development server:
   ```sh
   npx expo start
   ```

## Usage
- Use the Expo Go app or an emulator to run the application.
- Sign up or sign in to access features.
- Navigate through tabs to book courts, matches, shop, and more.

## Folder Overview
- `app/`: Main application code, including screens and layouts
- `components/`: Reusable UI components
- `assets/`: Images, icons, and lottie files
- `constants/`: Static resources (icons, images)
- `server/`: API configuration and environment files

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
