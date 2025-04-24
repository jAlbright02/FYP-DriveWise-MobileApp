import 'dotenv/config'

export default {
    "expo": {
      "name": "V1_App",
      "slug": "V1_App",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/images/icon.png",
      "scheme": "myapp",
      "userInterfaceStyle": "automatic",
      "newArchEnabled": false,
      "ios": {
        "supportsTablet": true
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/images/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        },
        "usesCleartextTraffic": true,
        "package": "com.atu.br0kestudent.DriveWise",
        "permissions": [
            "INTERNET",
            "ACCESS_COARSE_LOCATION",
            "ACCESS_FINE_LOCATION"
        ]
      },
      "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/favicon.png"
      },
      "plugins": [
        "expo-router",
        [
          "expo-splash-screen",
          {
            "image": "./assets/images/splash-icon.png",
            "imageWidth": 200,
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
          }
        ],
        "expo-location"
      ],
      "experiments": {
        "typedRoutes": true
      },
      "extra": {
        "router": {
          "origin": false
        },
        "eas": {
          "projectId": "6a7be999-9c0a-4e55-8c40-fe48f4506376"
        },
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_BUCKET: process.env.AWS_BUCKET
      },
      "runtimeVersion": {
        "policy": "appVersion"
      },
      "updates": {
        "url": "https://u.expo.dev/6a7be999-9c0a-4e55-8c40-fe48f4506376"
      }
    }
  }
  