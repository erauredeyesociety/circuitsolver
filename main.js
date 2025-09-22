const { app, BrowserWindow, shell } = require("electron");

let mainWindow;

app.whenReady().then(() => {
    // Ignore SSL errors (For Debugging Only)
    app.commandLine.appendSwitch("ignore-certificate-errors", "true");

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: __dirname + "/preload.js",
            nodeIntegration: false, // Disable node integration for security
            contextIsolation: true, // Isolate context between renderer and main
        },
    });

    // Set custom User-Agent to bypass site restrictions
    mainWindow.webContents.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    );

    // Load the initial website (adjust if needed)
    mainWindow.loadURL("https://google.com");

    // Handle opening new windows when links are clicked
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        createNewWindow(url);
        return { action: "deny" }; // Prevent the default action of navigating in the current window
    });

    // Listen for URL changes (to prevent navigation in the main window)
    mainWindow.webContents.on('did-navigate', (event, newUrl) => {
        event.preventDefault(); // Prevent the main window from navigating to the new URL
        createNewWindow(newUrl); // Open the new URL in a new window
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});

// Function to create a new window when a link is clicked or URL changes
function createNewWindow(url) {
    let newWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: __dirname + "/preload.js",
            nodeIntegration: false, // Disable node integration for security
            contextIsolation: true, // Isolate context between renderer and main
        },
    });

    // Set custom User-Agent for the new window
    newWindow.webContents.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    );

    // Load the clicked or navigated URL in the new window
    newWindow.loadURL(url);
}
