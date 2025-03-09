# End-to-End Testing Polaris App with Maestro



## 1. Android Configuration

### 1. Requirements
- Polaris App Installation
- Java
- Android Studio

Configuring the `ANDROID_HOME`
### 1.1 Windows



### 1.2 Linux & MacOS



## 2. IOS Configuration


## 2. Setting up Maestro

### 2.1 Installation

For MacOS & Linux Operating Systems that already have installed SDKMAN library for managing Java versions, you can install it using the followign command:

```bash
sdk install maestro
```

Maestro requires that a `JAVA_HOME` environment variable is setup.

### 
Make sure that `ANDROID_HOME` is set to the right path. Make sure to have the platform-tools path in the `PATH` environment variable.

### 2.1.1 Setting up Required Environment Variables in Linux & MacOS



### 2.1.2 Setting up Required Environment Variables in Windows



### 2.2 Running Maestro

For this step, the application needs to be running in emulator mode. Using your phone for android may be possible but was not tested yet (please edit the docs if you have found that it works too).

The application needs to be physically installed on the phone, therefore running the following will get the server started properly:

```bash
cd Polaris-FE
npm run android
```

Or if you are testing on an IOS emulator/device:

```bash
cd Polaris-FE
npm run ios
```

**<ins>Note</ins>**: The first time running this command will take a long time. Every subsequent times will be much faster.


Open a new terminal, and run the maestro test using the following command:

```
maestro test ./maestro/maestro.yaml
```

