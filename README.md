# Ionic Customer Success Demo - Identity Vault on Capacitor

This application shows the use of Ionic's Identity Vault within a hybrid mobile application that was built using Capacitor. We assume that you have access to Ioinic's Identity Vault product. If this is not the case, please contact our sales department.

## Building

**Note:** In order to build and run the demo you will need an Ionic Enterprise API key. You will also need to be using the Ionic Enterprise Edition of the Cordova CLI. Read [these instructions](https://ionicframework.com/docs/enterprise/setup#install-tooling) to make sure that is set up first. This project is intentionally distributed without a `.nmprc` file in order to make it easy for you to use your own demo key. If you do not have a demo key, please contact our sales department.

Once Ionic Enterprise Edition has been configured in this project, follow these steps:

- `npm i`
- `npm run build`
- `npx cap open ios` - to open Xcode in order to build and run on an iOS device
- `npx cap open android` - to open Android Studio in order to build and run on an Android device

This application connects to an API service that we have. A test user exists with the following credentials:

email: test@test.com
password: test
