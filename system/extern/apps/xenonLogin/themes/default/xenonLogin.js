/*global $myPid, Base64, eyeParam, IEversion, md5, sendMsg, updateOpacity, updateOpacityOnce, USERTHEME, xAddEventListener, xEvent, xGetComputedStyle, xGetElementById, xLeft */
/*jslint browser: true, devel: true, newcap: true, sloppy: true, windows: true */
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

var movecount = 0;

function xenonLogin_Disable_On(pid) {
	xGetElementById(pid + '_xenonLogin_Textbox_1_Password').disabled = true;
	xGetElementById(pid + '_xenonLogin_Textbox_1_User').disabled = true;
	movecount = 0;
	setTimeout('xenonLogin_Move_R("' + pid + '_xenonLogin_1_Container", "' + pid + '");', 500);
}

function xenonLogin_badLogin(user, pass, checknum, pid) {
	xenonLogin_Disable_On(pid);
}

function xenonLogin_SendLogin(checknum, pid) {
	var password, sawasc;
	sawasc = '$sawasc';
	if (sawasc) {
		password = xGetElementById(pid + '_xenonLogin_Textbox_1_Password').value;
		password = md5(sawasc + md5(password + md5(password)));
	} else {
		password = Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_1_Password').value);
	}
	sendMsg(checknum, 'Login', eyeParam('xenonLogin_Textbox_1_User', xGetElementById(pid + '_xenonLogin_Textbox_1_User').value) + eyeParam('xenonLogin_Textbox_1_Password', password) + eyeParam('xenonLogin_Select_1_Language', xGetElementById(pid + '_xenonLogin_Select_1_Language').value));
}

function xenonLogin_1_KeyPressed(characterCode, checknum, pid) {
	if (characterCode === 13) {
		xenonLogin_SendLogin(checknum, pid);
		return false;
	}
	return true;
}

function xenonLogin_2_KeyPressed(characterCode, checknum, pid) {
	if (characterCode === 13) {
		sendMsg(checknum, 'Create', eyeParam('xenonLogin_Textbox_2_User', xGetElementById(pid + '_xenonLogin_Textbox_2_User').value) + eyeParam('xenonLogin_Textbox_2_Password_1', Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_2_Password_1').value)) + eyeParam('xenonLogin_Textbox_2_Password_2', Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_2_Password_2').value)) + eyeParam('xenonLogin_Select_2_Language', xGetElementById(pid + '_xenonLogin_Select_2_Language').value));
		return false;
	}
	return true;
}

function xenonLogin_successLogin(user, checknum, pid) {
	updateOpacity(pid + '_xenonLogin_1_Container', 100, 0, 150, 'sendMsg(' + checknum + ', "successLogin", "");');
}

function xenonLogin_2_Clean(pid) {
	xGetElementById(pid + '_xenonLogin_Imagebox_2_Create_Container').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Label_2_Create').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Label_2_Language').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Label_2_Password_1').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Label_2_Password_2').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Label_2_User').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Select_2_Language').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Textbox_2_Password_1').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Textbox_2_Password_2').style.display = 'none';
	xGetElementById(pid + '_xenonLogin_Textbox_2_User').style.display = 'none';
}

function xenonLogin_centerDialog(pid) {
	var dialog, diaWidth, diaHeight, dia2, x, y;
	dialog = xGetElementById(pid + '_xenonLogin_1_Container');
	diaWidth = dialog.style.width.slice(0, -2);
	diaHeight = parseInt(dialog.style.height.slice(0, -2), 10);

	dia2 = xGetElementById(pid + '_xenonLogin_2_Container');
	if (dia2 !== null && dia2.style.display === "block") {
		diaHeight += parseInt(xGetComputedStyle(dia2, 'height', true), 10);
	}

	x = (window.innerWidth - diaWidth) / 2;
	y = (window.innerHeight - diaHeight) / 2;

	dialog.style.left = x + "px";
	dialog.style.top = y + "px";
}

function xenonLogin_2_Launch(pid, checknum) {
	if (xGetElementById(pid + '_xenonLogin_2_Container').style.display === 'block') {
		if (IEversion) {
			xGetElementById(pid + '_xenonLogin_2_Container').style.display = 'none';
		} else {
			updateOpacity(pid + '_xenonLogin_2_Container', 100, 0, 500, 'xGetElementById("' + pid + '_xenonLogin_2_Container").style.display = "none"; xenonLogin_centerDialog(' + pid + ');');
		}
		xGetElementById(pid + '_xenonLogin_Textbox_1_User').focus();
	} else {
		if (!IEversion) {
			updateOpacityOnce(0, pid + '_xenonLogin_2_Container');
		}
		xGetElementById(pid + '_xenonLogin_2_Container').style.display = 'block';
		if (!IEversion) {
			updateOpacity(pid + '_xenonLogin_2_Container', 0, 100, 500, '');
		}
		xGetElementById(pid + '_xenonLogin_Textbox_2_User').focus();
		xenonLogin_centerDialog(pid);
	}

	var obj = xGetElementById(pid + '_xenonLogin_Imagebox_2_Create_Container');
	if (obj) {
		obj.onclick = function () { sendMsg(checknum, 'Create', eyeParam('xenonLogin_Textbox_2_User', xGetElementById(pid + '_xenonLogin_Textbox_2_User').value) + eyeParam('xenonLogin_Textbox_2_Password_1', Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_2_Password_1').value)) + eyeParam('xenonLogin_Textbox_2_Password_2', Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_2_Password_2').value)) + eyeParam('xenonLogin_Select_2_Language', xGetElementById(pid + '_xenonLogin_Select_2_Language').value)); };

		obj = xGetElementById(pid + '_xenonLogin_Label_2_Create');
		obj.onclick = function () { sendMsg(checknum, 'Create', eyeParam('xenonLogin_Textbox_2_User', xGetElementById(pid + '_xenonLogin_Textbox_2_User').value) + eyeParam('xenonLogin_Textbox_2_Password_1', Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_2_Password_1').value)) + eyeParam('xenonLogin_Textbox_2_Password_2', Base64.encode(xGetElementById(pid + '_xenonLogin_Textbox_2_Password_2').value)) + eyeParam('xenonLogin_Select_2_Language', xGetElementById(pid + '_xenonLogin_Select_2_Language').value)); };
	}

	obj = xGetElementById(pid + '_xenonLogin_Textbox_2_User');
	obj.onkeypress = function (e) {
		var event = new xEvent(e);
		xenonLogin_2_KeyPressed(event.keyCode, checknum, pid);
	};

	obj = xGetElementById(pid + '_xenonLogin_Textbox_2_Password_1');
	obj.onkeypress = function (e) {
		var event = new xEvent(e);
		xenonLogin_2_KeyPressed(event.keyCode, checknum, pid);
	};

	obj = xGetElementById(pid + '_xenonLogin_Textbox_2_Password_2');
	obj.onkeypress = function (e) {
		var event = new xEvent(e);
		xenonLogin_2_KeyPressed(event.keyCode, checknum, pid);
	};
}

function xenonLogin_Start(pid, checknum) {
	var obj_lbl_enter, obj_lbl_enter_cnt, obj_img_cnt, obj_sel_lang, obj_txt_pwd, obj_txt_user;

	xGetElementById($myPid + '_xenonLogin_window_Content').setAttribute("class", "xenonLoginWindow");

	obj_lbl_enter = xGetElementById(pid + '_xenonLogin_Label_1_Enter');
	obj_lbl_enter.onclick = function () { xenonLogin_SendLogin(checknum, pid); };
	obj_lbl_enter.style.zIndex = '10000';

	obj_lbl_enter_cnt = xGetElementById(pid + '_xenonLogin_Imagebox_1_Enter_Container');
	obj_lbl_enter_cnt.onclick = function () { xenonLogin_SendLogin(checknum, pid); };
	obj_lbl_enter_cnt.style.zIndex = '10000';

	obj_img_cnt = xGetElementById(pid + '_xenonLogin_Imagebox_1_New_Container');
	if (obj_img_cnt) {
		obj_img_cnt.onclick = function () { xenonLogin_2_Launch(pid, checknum); };
		obj_img_cnt.style.zIndex = '10000';

		obj_img_cnt = xGetElementById(pid + '_xenonLogin_Label_1_New_Container');
		obj_img_cnt.onclick = function () { xenonLogin_2_Launch(pid, checknum); };
		obj_img_cnt.style.zIndex = '10000';
	}

	obj_txt_pwd = xGetElementById(pid + '_xenonLogin_Textbox_1_Password');
	obj_txt_pwd.onkeypress = function (e) {
		xenonLogin_1_KeyPressed(new xEvent(e).keyCode, checknum, pid);
	};

	obj_txt_user = xGetElementById(pid + '_xenonLogin_Textbox_1_User');
	obj_txt_user.onkeypress = function (e) {
		xenonLogin_1_KeyPressed(new xEvent(e).keyCode, checknum, pid);
	};

	obj_sel_lang = xGetElementById(pid + '_xenonLogin_Select_1_Language');
	obj_sel_lang.onkeypress = function (e) {
		xenonLogin_1_KeyPressed(new xEvent(e).keyCode, checknum, pid);
	};
}

function xenonLogin_Move_L(widget, pid) {
	xLeft(widget, xLeft(widget) - 40);
	setTimeout('xenonLogin_Move_R("' + widget + '", "' + pid + '");', 50);
}

function xenonLogin_Disable_Off(pid) {
	xGetElementById(pid + '_xenonLogin_Textbox_1_Password').disabled = false;
	xGetElementById(pid + '_xenonLogin_Textbox_1_User').disabled = false;
}

function xenonLogin_Move_R(widget, pid) {
	if (movecount > 5) {
		xenonLogin_centerDialog(pid);
		xenonLogin_Disable_Off(pid);
	} else {
		if (!movecount) {
			xLeft(widget, xLeft(widget) + 20);
		} else {
			xLeft(widget, xLeft(widget) + 40);
		}
		movecount += 1;
		setTimeout('xenonLogin_Move_L("' + widget + '", "' + pid + '");', 50);
	}
}

xenonLogin_Start('$myPid', '$checknum');
xAddEventListener(window, "resize", function () {
	xGetElementById($myPid + '_xenonLogin_window').style.width = window.innerWidth + "px";
	xGetElementById($myPid + '_xenonLogin_window').style.height = window.innerHeight + "px";
	xenonLogin_centerDialog($myPid);
}, false);