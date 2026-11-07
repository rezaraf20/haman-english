/* boot.js: starts the app after all modules are loaded */
render();
if(session){ pullMerge(); }
handleHash();
