/*global Base64, USERTHEME */
/*jslint browser: true, devel: true, newcap: true, sloppy: true, todo: true, windows: true */
/*
##     ## ######## ##    ##  #######  ##    ##  #######   ######
 ##   ##  ##       ###   ## ##     ## ###   ## ##     ## ##    ##
  ## ##   ##       ####  ## ##     ## ####  ## ##     ## ##
   ###    ######   ## ## ## ##     ## ## ## ## ##     ##  ######
  ## ##   ##       ##  #### ##     ## ##  #### ##     ##       ##
 ##   ##  ##       ##   ### ##     ## ##   ### ##     ## ##    ##
##     ## ######## ##    ##  #######  ##    ##  #######   ######


XenonOS is a fork of the oneye project.
XenonOS Copyright © 2019 Trinity (touhouboi@protonmail.com)

Original Copyright
------------------------------------------
https://oneye-project.org
Copyright © 2005 - 2010 eyeos Team (team@eyeos.org)
             since 2010 Lars Knickrehm (mail@lars-sh.de)

*/

function eyeFTP_logConsole(pid, text_b64, maxDisplayedLines, type, debug) {
	var consoleObj, existingText, i, lines, newText, now;
	maxDisplayedLines = parseInt(maxDisplayedLines, 10);
	maxDisplayedLines = (isNaN(maxDisplayedLines) || maxDisplayedLines < 1) ? 100 : maxDisplayedLines;
	consoleObj = document.getElementById(pid + "_eyeFTP_log_CTNR");
	if (!consoleObj) {
		return;
	}

	if (debug) {
		consoleObj.innerHTML += "<br>" + Base64.decode(text_b64);
	} else {
		now = new Date();
		newText = "<span class=\"eyeFTP_logStyle_" + type + "\">";
		newText += "<img src=\"index.php?theme=" + USERTHEME + "&extern=images/apps/eyeFTP/10x10/" + type + ".png\" style=\"vertical-align: middle;\" />&nbsp;";
		newText += "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "] ";
		newText += Base64.decode(text_b64) + "</span>";

		lines = consoleObj.innerHTML.split("<br>");
		if (lines.length >= maxDisplayedLines - 1) {
			existingText = "";
			for (i = (lines.length - maxDisplayedLines + 1); i < lines.length; i += 1) {
				existingText += lines[i] + "<br>";
			}
			consoleObj.innerHTML = existingText + newText;
		} else {
			consoleObj.innerHTML += (consoleObj.innerHTML.length > 0) ? "<br>" + newText : newText;
		}
	}
	consoleObj.scrollTop = consoleObj.scrollHeight;
}

function eyeFTP_clearConsole(pid) {
	var consoleObj = document.getElementById(pid + "_eyeFTP_log_CTNR");
	if (!consoleObj) {
		return;
	}
	consoleObj.innerHTML = "";
}