const { ipcRenderer, remote } = require('electron');

//Calls startBitmarkNode located in main.js and refreshes the iFrame
function startBitmarkNodeLocal(){
	startBitmarkNode();
	refreshFrame();
};

//calls stopBitmarkNode located in main.js
function stopBitmarkNodeLocal(){
	stopBitmarkNode();
};

function restartBitmarkNodeLocal(){
	newNotification("Restarting container. This may take some time.");
	createContainerHelperLocal();
};

//Refreshes the whole window
function refreshWindow(){
	var window = remote.getCurrentWindow();
	window.reload();
};

//Create the preference window
function createPreferencesWindowLocal(){
	const {BrowserWindow} = require('electron').remote

	//define the window
	var prefWindow = new BrowserWindow({
		width: 1000,
		height: 600,
		title: "Preferences",
		icon: path.join(__dirname, 'assets/icons/app_icon.png'),
    	frame: false,
    	trasparent: true,
    	darkTheme: true
	});

	//load the preferences file
	prefWindow.loadURL(`file://${__dirname}/preferences.html`);

	// Emitted when the window is closed.
	prefWindow.on('closed', () => {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  prefWindow = null;
	});
};

//Reloads the iFrame
function refreshFrame() {
   document.getElementsByTagName('iframe')[0].src=document.getElementsByTagName('iframe')[0].src
};

//Changes the network to Bitmark if it current isn't on it
function setNetworkBitmark(){
	// Fetch the preferences JSON object
	const preferences = ipcRenderer.sendSync('getPreferences');
	var network = preferences.blockchain.network;

	//Checks the network
	if(network === "testing"){
		//Update preferences json
		preferences.blockchain.network = "bitmark";
		ipcRenderer.sendSync('setPreferences', {...preferences});

		console.log("Changing to bitmark");
		
		//Lets the user know what is happening
		newNotification("Changing the network to 'bitmark'. This may take some time.");
		
		//Recreate the container with the new settings
		createContainerHelperLocal();
	} else {
		//Let the user know the network is already bitmark
		console.log("Already on bitmark");
		newNotification("The network is already set to 'bitmark'.");
	}
};

//Changes the network to testing if it current isn't on it
function setNetworkTesting(){
	// Fetch the preferences JSON object
	const preferences = ipcRenderer.sendSync('getPreferences');
	var network = preferences.blockchain.network;

	//Checks the network
	if(network === "bitmark"){
		//Update preferences json
		preferences.blockchain.network = "testing";
		ipcRenderer.sendSync('setPreferences', {...preferences});

		console.log("Changing to testing");
		
		//Lets the user know what is happening
		newNotification("Changing the network to 'testing'. This may take some time.");
		
		//Recreate the container with the new settings
		createContainerHelperLocal();
	} else {
		//Let the user know the network is already testing
		console.log("Already on testing");
		newNotification("The network is already set to 'testing'.");
	}
};

//Get the network and directory and pass it to the main function to get the IP then create the container
function createContainerHelperLocal(){
	//Get the network and directory from preferences
	const preferences = ipcRenderer.sendSync('getPreferences');
	var net = preferences.blockchain.network;
	var dir = preferences.directory.folder;

	//Get if the computer is a windows computer
	var isWin = remote.getGlobal('process').platform === "win32";
	var wait = createContainerHelperIPOnly(net, dir, isWin);
};

//Function to handle buttons
(function () {
    const remote = require('electron').remote;
    const ipc = require('electron').ipcRenderer;
    
    function init() { 
   	  //Control the minimize button
      document.getElementById("min").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.minimize(); 
      });
      
      //Control the maximize button
      document.getElementById("max").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
          window.maximize();
        } else {
          window.unmaximize();
        }  
      });
      
      //Control the close button
      document.getElementById("close").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.close();
      }); 

      // Tell main process to show the menu when demo button is clicked
      document.getElementById('menu').addEventListener('click', function () {
        ipc.send('show-context-menu');
      });
    }; 
    
    //When the page is ready, run init
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        init(); 
      }
    };
})();