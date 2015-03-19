<?php
/**
 * @version 3.3 2015-02-28
 * @package Joomla
 * @subpackage Intellectual Property
 * @copyright (C) 2009 - 2015 the Thinkery LLC. All rights reserved.
 * @license GNU/GPL see LICENSE.php
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport( 'joomla.plugin.plugin');
jimport('joomla.application.component.model');
JHtml::addIncludePath(JPATH_SITE.'/components/com_iproperty/helpers');

class plgIpropertySasadmin extends JPlugin
{
	private $settings;
	private $propdata;
	private $images;
	private $agents;
	private $amenities;
	
    public function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);
        $this->settings = ipropertyAdmin::config();
        $this->loadLanguage();
    }

    public function onAfterRenderPropertyEdit($property, $settings)
    {		
		$document 	= JFactory::getDocument();
		$date 		= new JDate();
		$client		= new JApplicationWebClient();

		$document->addScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js');
        if ($client->mobile) $document->addScript(JURI::root(true).'/components/com_iproperty/assets/js/jquery.ui.touch-punch.min.js');
        $document->addStyleSheet('//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/'.$this->params->get('theme', 'base').'/jquery-ui.css');

		// set the listing id as a var for the javascript to access
		$script  = 'var listing_id = '.$property->id.';'."\n";
		$script .= 'var firstday = '.$this->params->get('start_day', 0).';'."\n";
		$script .= 'var dateformat = "'.$this->params->get('date_format', 'mm/dd/yy').'";'."\n";
		$script .= 'var months_to_show = "'.$this->params->get('months', 6).'";'."\n";
		$script .= 'var columns = "'.$this->params->get('columns', 3).'";'."\n";
		$script .= 'var rows = Math.round(months_to_show / columns);'."\n";
		$script .= 'var default_status = "'.$this->params->get('default_status', 0).'";'."\n";
		
		$document->addScriptDeclaration( $script );
		
		$css  = "td.sas-free a{ background-color: ".$this->params->get('freestyle', '#B6F5AB')." !important; background-image: none !important }";
		$css .= "td.sas-tentative a{ background-color: ".$this->params->get('tentstyle', '#ABF5E9')." !important; background-image: none !important }";
		$css .= "td.sas-booked a{ background-color: ".$this->params->get('tentstyle', '#F5ABC0')." !important; background-image: none !important }";
		$css .= ".ui-datepicker { max-width: 100% }";
				
		$document->addStyleDeclaration( $css );
		
		// now the javascript to do the request to the server
		$document->addScript(JURI::root(true).'/plugins/iproperty/sasadmin/sasadmin.js');
		
		// build the tab
		echo JHtmlBootstrap::addTab('ip-propview', 'sasadmin', JText::_($this->params->get('tabtitle', 'PLG_IP_SASADMIN_TABTITLE')));
        echo '<div id="ip-sasadmin-calendar"></div>';
		// close the tab	
        echo JHtmlBootstrap::endTab();
    }
}
