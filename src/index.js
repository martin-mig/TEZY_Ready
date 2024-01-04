const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

const tar = require('tar')
const fs = require('fs')

/******************* GLOBALS *******************/
let fileName;
let fileNameNoExt;
let dirTarFileName;;
let dirTarget;;
let mainWindow;
let helpWindow;
const templateMenu = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click() {
                    createHelpWindow();
                }
            }
        ]
    }
];

//only call this module for development
if (process.env.NODE_ENV === 'development'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

/******************* ELECTRON MAIN APP *******************/
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 450,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/main.html'),
        protocol: 'file',
        slashes: true
    }))

    //only call this module for development
    if (process.env.NODE_ENV === 'development'){
        mainWindow.webContents.openDevTools();
    }
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);


    mainWindow.on('closed', () => {
        app.quit();
    });
});
/******************* ELECTRON ADITIONAL WINDOWS *******************/
function createHelpWindow() {
    helpWindow = new BrowserWindow({
        width: 400,
        height: 200,
        title: 'About'
    });
 
    helpWindow.setMenu(null);

    helpWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/help.html'),
        protocol: 'file',
        slashes: true
    }));
}

/******************* FUNCTIONS *******************/
async function readFileInDir(dir){
    return new Promise ((resolve, reject) => {
        //try to read the file in "dir"
        const data = fs.readFileSync(path.join(dir, 'image_list.json'));
        
        //on success
        resolve(data);
        
        //on error
        reject(new Error("Error reading 'image_list.json'"));
    });
}

async function extractTAR(fileName, outputDir){
    return new Promise ((resolve, reject) => {
        //check if file extension is .tar
        let IsTar = (path.parse(dirTarFileName).ext === '.tar');
        console.log("extractTAR: "+ IsTar);
        if (!IsTar) {
            //on error
            reject(new Error("Error extracting file: " + fileName + " on dir: " + outputDir + ". File is not .tar"));
        }
        // extract tarFile to target dir
        var extractor = tar.extract({cwd: dirTarget})
        .on('error', reject)
        .on('end', resolve);

        fs.createReadStream(dirTarFileName)
        .on('error', reject)
        .pipe(extractor);
        
        //on succes
        resolve(true)
    });
    
}

async function updateImageList(data){
    return new Promise((resolve, reject) => {
        var myObject = JSON.parse(data);
        
        //discard list of images within images array and leave just this one
        myObject.images = [fileNameNoExt + '/image.json']
    
        // Writing to our JSON file with pretty format
        var myObjectModified = JSON.stringify(myObject, null, "\t");
        
        fs.writeFile(path.join(dirTarget, 'image_list.json'), myObjectModified, (err) => {
            // Error checking
            if (err) reject;
            else resolve;
        });

         //on succes
         resolve(true);
         
         //on error
         reject(new Error("Error writing 'image_list.json'"));
    });
}

/******************* ipcMain requests *******************/
ipcMain.on('droppedFilePath', async (event, filePath) => {
    console.log('MAIN - Dropped file path: ' + filePath);
    let message;
    //save the path and file name 
    dirTarFileName = filePath;
    fileName = path.parse(dirTarFileName).base;
    fileNameNoExt = path.parse(dirTarFileName).name;
    //check if file extension is .tar
    let IsTar = (path.parse(dirTarFileName).ext === '.tar')

    console.log("MAIN - File is .tar?: " + IsTar);
    
    // send back the result to the renderer
    mainWindow.webContents.send('isTar', IsTar);    
})

ipcMain.on('imageListDir', async (event, inputDir) => {
    console.log('MAIN - Input directory: ' + inputDir);
    dirTarget = inputDir;
    try{
        //check that the file "image_list" exists in given directory
        const fileData = await readFileInDir(dirTarget);
        //extract the TAR file in given directory
        await extractTAR(dirTarFileName, dirTarget);
        //update image_list with the TAR file just extracted
        await updateImageList(fileData)

        // if everything went ok, send back the result to the renderer
        mainWindow.webContents.send('success');
    }
    catch (err){
        console.log("ipcMain - error: " + err.message);
        // send back the result to the renderer
        mainWindow.webContents.send('showAlert', err.message);
    }
})