# End-to-End Testing Polaris App with Maestro
## 1. Global Requirements
- Java.
- Node.js version 22.14 or more.
## 1. Android Configuration

### 1. Requirements
- Polaris App Installation
- Java
- Android Studio

(more to come later)

## 2. IOS Configuration

- XCode 14 or higher
- Mac Operating System

### 2.1 Install Maestro
Using the `brew` package library, you can use the following command:
```bash
brew install maestro
```

### 2.2 Running Maestro on IOS Simulator
Open one terminal running the native build code:

```bash
cd Polaris-FE/
npm run ios 
```

Open a second terminal to run the maestro test:

```bash
cd Polaris-FE
maestro test maestro/93-enable-easy-campus-switching.yml
```




