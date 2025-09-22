const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    openExternal: (url) => shell.openExternal(url),
});
