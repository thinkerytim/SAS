<?php  
defined('_JEXEC') or die('Restricted access');

/**
 * @version 3.3 2015-02-28
 * @package Joomla
 * @subpackage Intellectual Property
 * @copyright (C) 2009 - 2015 the Thinkery LLC. All rights reserved.
 * @license GNU/GPL see LICENSE.php
 */

class plgIpropertySasadminInstallerScript
{
	function postflight($type, $parent) 
	{		
		// move new edit views and forms
		$files 	= array(
			'admin.avail.raw.php' => '/administrator/components/com_iproperty/controllers/avail.raw.php',
			'avail.raw.php' => '/components/com_iproperty/controllers/avail.raw.php'
		);
		
		foreach ($files as $key => $file){	
			$oldname = JPATH_SITE.'/plugins/iproperty/sasadmin/files/'.$key;
			$newname = JPATH_SITE.$file;

			rename ( $oldname, $newname );
		}
	}
}
