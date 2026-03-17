const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI",{

 startFullscreen:()=>ipcRenderer.send("start-fullscreen"),
 exitFullscreen:()=>ipcRenderer.send("exit-fullscreen"),
 onFullscreenExited:(callback)=>ipcRenderer.on("fullscreen-exited", callback)

});
