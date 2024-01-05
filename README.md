# TEZI_Ready

This is a very simple project that automate some tasks I needed in order to make my workflow easier and it's an excuse to practice NodeJS using Electron framework.

Feel free to use this project as you like.

## Summary

The app allows you to drag & drop a file with extension ".tar" and provide an output directory. The app will check if the file has the correct extension and that there is a file called "image_list.json" in the given directory. Finally, it untars the file in the output directory and adds the name of the untar file to the image_list.json file. 

This project accelerates the workflow when developing TEZI images, which are embedded Linux images compiled for specific platforms, in our case, imx6ull from Toradex.

## Available Scripts

To setup the project, open the project directory with visual studio and run:

### `npm install`

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode with devTools and electron-reload.

### `npm run package-win`
### `npm run package-linux`
### `npm run package-mac`

Builds the electron app for production to the `release-builds` folder according to the platform chosen in the script.\
