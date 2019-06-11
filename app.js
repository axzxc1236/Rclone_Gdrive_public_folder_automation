'use strict';

const fs = require("fs");
const { spawn } = require('child_process');
const { EOL } = require('os');

const filelist = "filelist.txt"
const original_config = "rclone.conf";
const modified_config = "rclone_modified.conf";
const rcloneCommand = "rclone"; //If you are using Windows and rclone.exe is not in path, you want to change that to something like "C:/rclone/rclone.exe"

function readTokenFromOriginalConfig() {
	let token = null;
	try {
		let configContent = fs.readFileSync(original_config, { encoding: "utf-8" }).split(/\r?\n/);
		for (let i = 0; i < configContent.length; i++) {
			if (configContent[i].startsWith("token = ")) {
				token = configContent[i].replace("token = ", "");
				console.log("token=  " + token);
			}
		}
	} catch (e) {
		console.log("encountered error trying to read token:  " + e);
	}
	return token;
}

var folderIDList = [];
var destinationList = [];
var errorParsingFileList = false;
function readFileList() {
	try {
		let fileListContent = fs.readFileSync(filelist, { encoding: "utf-8" }).split(/\r?\n/);
		for (let i = 0; i < fileListContent.length; i++) {
			if (fileListContent[i] != "") {
				let array = fileListContent[i].split("===");
				if (array.length != 2) {
					console.log("error parsing this line: " + fileListContent[i]);
					errorParsingFileList = true;
				} else {
					folderIDList.push(array[0]);
					destinationList.push(array[1]);
				}
			}
		}
	} catch (e) {
		console.log("encountered error trying to read filelist:  " + e);
		errorParsingFileList = true;
	}
}

function downloadFile(index) {
	console.log("Copying Folder " + folderIDList[index] + " to " + destinationList[index]);
	//copy a config file with different folder ID
	if (fs.existsSync(modified_config))
		fs.unlinkSync(modified_config)
	fs.copyFileSync(original_config, modified_config);
	fs.appendFileSync(modified_config,
		EOL + "[tmp]" + EOL +
		"type = drive" + EOL +
		"scope = drive" + EOL +
		"root_folder_id = " + folderIDList[index] + EOL +
		"token = " + token + EOL);
	//

	//spawn rclone process
	const rclone = spawn(rcloneCommand, ["--config", modified_config, "-P", "copy", "tmp:", destinationList[index]], { stdio: 'inherit' });

	rclone.on('close', (code) => {
		console.log("child process exited with code" + code);
		if (code != 0) {
			console.log("encountered an error, not continuing.");
		} else if (index == folderIDList.length) {
			console.log("I think we are done.");
		} else {
			downloadFile(index+1);
		}
	});
	//
}

var token = readTokenFromOriginalConfig();
if (token != null) {
	readFileList();
	if (!errorParsingFileList && folderIDList.length != 0) {
		console.log("Good to go.");
		downloadFile(0);
	}
}
