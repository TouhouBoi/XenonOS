/*global Windows */
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

function eyeMp3_loadSound(myPid, path, title) {
	var e = document.getElementById(myPid + '_eyeMp3_Flash');
	e.SetVariable('jsValue', path);
	e.SetVariable('jsMethod', 'newfile');
	Windows.SetTitle(myPid + '_eyeMp3_Window', title);
}