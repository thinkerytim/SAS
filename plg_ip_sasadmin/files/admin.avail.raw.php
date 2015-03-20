<?php
/**
 * @version 3.3 2015-02-28
 * @package Joomla
 * @subpackage Intellectual Property
 * @copyright (C) 2009 - 2015 the Thinkery LLC. All rights reserved.
 * @license GNU/GPL see LICENSE.php
 */

defined( '_JEXEC' ) or die( 'Restricted access');
jimport('joomla.application.component.controller');

require_once(JPATH_COMPONENT_SITE.'/helpers/auth.php');

class IpropertyControllerAvail extends JControllerLegacy
{
    protected $text_prefix = 'COM_IPROPERTY';
    protected $date_cutoff = '6 MONTH'; // default future date cutoff
    
    public function getAllStatus()
    {
		JSession::checkToken('get') or die( 'Invalid Token');
		
		$jinput         = JFactory::getApplication()->input;
        $listing_id 	= $jinput->get('listing_id', false, 'INT');
		
		// get dates and statuses for the listing_id
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('*');
		$query->from($db->quoteName('#__iproperty_availability'));
		$query->where($db->quoteName('date')." >= now()"); // only grab dates in the future
		$query->where($db->quoteName('date')." <= DATE_ADD(now(), INTERVAL ".$this->date_cutoff.")"); // only grab dates before the date cutoff
		$query->where($db->quoteName('listing_id')." = ".$db->quote($listing_id));
		$db->setQuery($query);
		
		try
		{
			$result = $db->loadObjectList();
			echo new JResponseJson($result);
		}	 
		catch(Exception $e)
		{
			echo new JResponseJson($e);
		}
	}
    
	public function changeStatus()
    {
		JSession::checkToken('get') or die( 'Invalid Token');
		
		$jinput         = JFactory::getApplication()->input;
        $date 			= $jinput->get('date', false, 'STRING');
        $listing_id 	= $jinput->get('listing_id', false, 'INT');
        $status 		= $jinput->get('status', 1, 'INT');
        
		// check auth
		$ipauth			= new ipropertyHelperAuth();
        if (!$ipauth->canEditProp($object_id)){
			echo new JResponseJson('', 'Unauthorized user-- cannot modify this listing', true);
			die();
		} else if (!$date || !$listing_id || !$status) {
			echo new JResponseJson('', 'Missing date / object id / status', true);
			die();
		}
		
		// check if the date / listings ID is already filled
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('id');
		$query->from($db->quoteName('#__iproperty_availability'));
		$query->where($db->quoteName('date')." = ".$db->quote($date));
		$query->where($db->quoteName('listing_id')." = ".$db->quote($listing_id));

		$db->setQuery($query);
		if ($result = $db->loadResult()){	
			// we have a result-- update it
			$query = $db->getQuery(true);			 
			$query->update($db->quoteName('#__iproperty_availability'));
			$query->set($db->quoteName('status').' = '.$db->quote($status));
			$query->where('id = '.$result);
			$db->setQuery($query);
		
			try
			{
				$result = $db->execute();
				echo new JResponseJson($result);
			} 
			catch(Exception $e)
			{
				error_log($query->__toString());
				echo new JResponseJson($e);
			}			
		} else {
			// no result found-- add it
			$object = new stdClass();
			$object->date 			= $date;
			$object->listing_id		= $listing_id;
			$object->status			= $status;
			
			try
			{
				$result = JFactory::getDbo()->insertObject('#__iproperty_availability', $object);		 
				echo new JResponseJson($result);
			}
			catch(Exception $e)
			{
				echo new JResponseJson($e);
			}
		}
	}
}
?>
