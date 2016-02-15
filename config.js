/* global System */
System.config({
		packages: {
			app: {
			  format: "register",
			  defaultExtension: "js"
			},
      "node_modules/ng2-file-upload":{
        defaultExtension: "js",
        format: "register",
        main: "ng2-file-upload.js"
      }
		}
	});
