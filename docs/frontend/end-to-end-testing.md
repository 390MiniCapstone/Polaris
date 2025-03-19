# End-to-End Testing Polaris App with Maestro
## 1. Table of Contents
- [End-to-End Testing Polaris App with Maestro](#end-to-end-testing-polaris-app-with-maestro)
  - [1. Table of Contents](#1-table-of-contents)
  - [2. Global Requirements](#2-global-requirements)
  - [3. Android Configuration](#3-android-configuration)
    - [3.1 Requirements](#31-requirements)
  - [4. IOS Configuration](#4-ios-configuration)
    - [4.1 Install Maestro](#41-install-maestro)
    - [4.2 Running Maestro on IOS Simulator](#42-running-maestro-on-ios-simulator)

## 2. Global Requirements
- Java.
- Node.js version 22.14 or more.
## 3. Android Configuration

### 3.1 Requirements
- Polaris App Installation
- Android Studio

(more to come later)

## 4. IOS Configuration

- XCode 14 or higher
- Mac Operating System

### 4.1 Install Maestro
Using the `brew` package library, you can use the following command:
```bash
brew install maestro
```

### 4.2 Running Maestro on IOS Simulator
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




