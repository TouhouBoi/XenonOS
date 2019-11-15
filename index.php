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


// Support register_globals
if (ini_get('register_globals'))
{
	foreach (array_keys($_REQUEST) as $key)
	{
		if ($_REQUEST[$key] === $$key)
		{
			unset($$key);
		}
	}
}

// Support get_magic_quotes_gpc and magic_quotes_sybase
if ((function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) || ini_get('magic_quotes_sybase'))
{
	$_COOKIE = array_map_recursive('stripslashes', $_COOKIE, true);
	$_GET = array_map_recursive('stripslashes', $_GET, true);
	$_POST = array_map_recursive('stripslashes', $_POST, true);
	$_REQUEST = array_map_recursive('stripslashes', $_REQUEST, true);
}

// Support magic_quotes_runtime
if (ini_get('magic_quotes_runtime') && function_exists('set_magic_quotes_runtime'))
{
	@set_magic_quotes_runtime(0);
}

/**
 * Applies the callback to the elements of the given arrays recursive
 */
function array_map_recursive($callback, $array, $mapkeys = false)
{
	if ($callback !== null && is_callable($callback))
	{
		foreach ($array as $key => $value)
		{
			if ($mapkeys)
			{
				unset($array[$key]);

				$key = call_user_func($callback, $key);
			}
			if (is_array($value))
			{
				$array[$key] = array_map_recursive($callback, $value);
			}
			else
			{
				$array[$key] = call_user_func($callback, $value);
			}
		}
	}

	return $array;
}

/*
* This Define checks if the client has Accessed
* XenonOS from The Right Way (This File).
*/
define('XENONOS_INDEX', 1);

/*
* Includes are required before Doing anything else,
* only "settings.php" should be here.
*/
require_once('settings.php');

/*
*Chaning the current work directory to XENONOS_ROOT
*/
changeCWD();

/*
*Loading utf8 support for php, this library must be
*Loaded manually because kernel also needs utf8
*/
loadStringLibrary();

//Including kernel file, this file also "execs" some initialitation stuff
include_once(XENONOS_ROOT.'/'.SYSTEM_DIR.'/'.KERNEL_DIR.'/kernel'.EYE_CODE_EXTENSION);

/*
*Setting the php debug (error_reporting) depending the oneye config
*stored in system/conf/system.xml
*/
setPhpInitDebug();

/*
*Changing some php init parameters, the chagnes are not always
*the same, may change depending of oneye configuration.
*/
setPhpInitValues();

//Calling to some libraries functiosn needed by index.php
libraryLoading();

//Calling some service functions needed by index.php
serviceLoading();

/*
*Checking what kind of client is accesing to choose
*the right kernel
*/
$index = indexRequested();

if($index !== false)
{
	loadIndex($index);
}
else
{
	loadIndex('browser');
}

function loadIndex($index)
{
	//If some index has been loaded, return false because indexes can't be mixed
	if(defined('INDEX_TYPE'))
	{
		define('INDEX_BASE','./../');
		return false;
	}

	define('INDEX_BASE','./');
	//Include the file with the __FILE__ secure
	$myPath = dirname(realpath(__FILE__)).'/';
	$rPath = realpath($myPath.'/'.$index.'/index.php');

 	if(is_readable($rPath))
	{
 		require_once($rPath);

		return true;
 	}

	return false;
}

function indexRequested()
{
	if (isset($_REQUEST['index']) && !empty($_REQUEST['index']))
	{
		return basename($_REQUEST['index']);
	}

	return false;
}

/*
*Load the utf8 support loading eyeString and making a fake
*load because kernel needs it (utf8 support).
*/
function loadStringLibrary()
{
	include_once(XENONOS_ROOT.'/'.SYSTEM_DIR.'/'.LIB_DIR.'/eyeString/main'.EYE_CODE_EXTENSION);
	//setting library loaded
	define('LIB_EYESTRING_LOADED',1);
}

/*
*Set the oneye debuggin, at the moment only changes
*the error_reporting, but may change more things in the future.
*/
function setPhpInitDebug() {
	ini_set('display_errors', false);
	ini_set('html_errors', false);

	/*$error_reporting = 0;

	if (EYEOS_DEBUG_MODE === '2')
	{
		$error_reporting = E_ALL;
	}
	else if (EYEOS_DEBUG_MODE === '3')
	{
		if (defined('E_DEPRECATED') === false)
		{
			define('E_DEPRECATED', 0);
		}

		$error_reporting = E_ALL ^ E_DEPRECATED ^ E_NOTICE;
	}
	else if (EYEOS_DEBUG_MODE)
	{
		$error_reporting = E_ERROR;
	}*/

	$error_reporting = E_ERROR;

	error_reporting($error_reporting);

	set_error_handler('oneye_error_handler', $error_reporting);
}

function oneye_error_handler($errno, $errstr, $errfile = '', $errline = 0, $errcontext = array())
{
	if (error_reporting() === 0)
	{
		return;
	}

	if ($errno === E_ERROR)
	{
		$errno = 'Error';
	}
	else if ($errno === E_WARNING)
	{
		$errno = 'Warning';
	}
	else if ($errno === E_NOTICE)
	{
		if (strpos($errstr, 'Undefined index: ') === 0 || strpos($errstr, 'Undefined offset: ') === 0)
		{ // utf8
			return;
		}

		$errno = 'Notice';
	}
	else if ($errno === E_STRICT)
	{
		$errno = 'Strict';
	}
	else if ($errno === E_DEPRECATED)
	{
		$errno = 'Deprecated';
	}
	else if ($errno === E_USER_ERROR || $errno === E_USER_WARNING || $errno === E_USER_NOTICE || $errno === E_USER_DEPRECATED)
	{
		$errno = 'User';
	}

	print(strval($errno) . ': ' . $errstr . ' in ' . $errfile . ' on line ' . strval($errline) . "\n\n");
}

/*
*Load the basics libraries needed by the kernel/core
*/
function libraryLoading()
{
	//Loading the Error Codes
	errorCodes('loadCodes');
	//load pear library class
	eyePear('Load', array('PEAR'));
}

/*
*Load the basic services needed by the kernel/core
*/
function serviceLoading()
{
	//Loading the Security Service (sec) if oneye Security is turned on (by default is On)
	if(EYEOS_SECURITY == 1)
	{
		sec('start');
	}
	//Setting the Running Log check var to 0
	global $LOG_RUNNING;

	$LOG_RUNNING = 0;
}

/*
*Set some php init values depending of oneye configs
*/
function setPhpInitValues()
{
	//if allow_big_streams php will not have max_execution_time
	if(ALLOW_BIG_STREAMS == 1) {
		@set_time_limit(0);
	}
	//set the default charset
	ini_set('default_charset', DEFAULT_CHARSET);
}

/*
*Changes the current work directory to XENONOS_ROOT
*/
function changeCWD()
{
	//since index.php is always below eyeROOT, we can do this instead to be inclusable from third party code
	$basedir = dirname(__FILE__).'/';
	//change directory to XENONOS_ROOT
	chdir($basedir.REAL_XENONOS_ROOT);
	//Loaded before kernel for kernel utf8 compatibility
}
?>
