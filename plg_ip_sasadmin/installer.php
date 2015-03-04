<?php  
defined('_JEXEC') or die('Restricted access');

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
