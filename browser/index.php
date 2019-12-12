<?php
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

define('INDEX_TYPE', 'browser');

// Start Output Buffering
ob_start();

if (!defined('XENONOS_INDEX'))
{
	include_once('../index.php');
}

if (isset($_SERVER['PATH_INFO']))
{
	$myInfo = $_SERVER['PATH_INFO'];

	if (substr($myInfo, 0, 1) === '/')
	{
		$myInfo = substr($myInfo, 1, strlen($myInfo));
	}
}
else
{
	$myInfo = "";
}

//Check if index.php is being used to load images/files from extern directory
if (isset($_GET['extern']))
{
		$myExtern = $_GET['extern'];
		//get the type for the header content-type
		if (isset($_GET['type']))
		{
			$type = $_GET['type'];
		}
		else
		{
			$type = "";
		}

		eyeSessions('checkAndSstartSession');
		extern('getFile', array($myExtern, $type), 1);
}
elseif (isset($_GET['api']))
{
	require_once(XENONOS_ROOT.'/xml-rpc/server.xecode');
	
	xmlrpc_parseRequest();
}
else
{
	// Loading eyeWidgets definitions
	eyeWidgets('loadWidgets');

	// Starting a simple session
	eyeSessions('startSession');

	// If widget table does not exist, create it
	eyeWidgets('checkTable');

	// if a shorturl is present
	if (!empty($myInfo))
	{
		// check if the shorturl exists, and get the msg and checknum associated to it
		if (is_array($_SESSION['shortUrls'][$myInfo]))
		{
			$msg = $_SESSION['shortUrls'][$myInfo]['msg'];
			$checknum = $_SESSION['shortUrls'][$myInfo]['checknum'];
			$_GET['msg'] = $msg;
			$_REQUEST['msg'] = $msg;
			$_GET['checknum'] = $checknum;
			$_REQUEST['checknum'] = $checknum;
		}
	}

	if (isset($_REQUEST['username']) === true && isset($_REQUEST['password']) === true)
	{
		if (!proc('findPidByName', array('xenonDesk')))
		{
			$_SESSION['username'] = $_REQUEST['username'];
			$_SESSION['password'] = $_REQUEST['password'];
			
			if (isset($_REQUEST['language']) === true)
			{
				$_SESSION['language'] = $_REQUEST['language'];
			}
			else
			{
				$_SESSION['language'] = '[auto]';
			}
		}

		$protocol = substr($_SERVER['SERVER_PROTOCOL'], 0, strpos($_SERVER['SERVER_PROTOCOL'], '/'));
		
		$location = strtolower($protocol).'://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];

		header('Location: '.$location);

		exit;
	}

	// Checking if checknum and message are set
	if (isset($_GET['checknum']) && !empty($_GET['checknum']))
	{
		if (isset($_REQUEST['params']) && !empty($_REQUEST['params']))
		{
			$params = $_REQUEST['params'];
		}
		else
		{
			$params = null;
		}

		if (isset($_GET['msg']))
		{
			$msg = $_GET['msg'];
		}
		else
		{
			$msg = null;
		}

		$array_msg = array($_GET['checknum'], $msg, $params);

		print(mmap('routemsg', $array_msg));

		$_SESSION['ping'] = time();
	}
	else
	{
		// Server Ping Task
		if (isset($_GET['msg']) && $_GET['msg'] == 'ping')
		{
			header("Content-type: text/xml");

			print("<eyeMessage><action><task>pong</task></action></eyeMessage>");

			$_SESSION['ping'] = time();

			exit;
		}

		include_once(XENONOS_ROOT.'/'.SYSTEM_DIR.'/'.KERNEL_DIR.'/init'.XE_CODE_EXTENSION);
	}
}
?>
