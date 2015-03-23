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

class plgIpropertySaslisting extends JPlugin
{
	private $settings;
	private $propdata;
	private $images;
	private $agents;
	private $amenities;
	
    public function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);
        $this->loadLanguage();
    }
    
    public function onBeforeRenderForms($property, $settings)
    {
		if ($this->params->get('position', true)) return true;
        $this->doAvailability($property, $settings);
    }
	
	public function onAfterRenderForms($property, $settings)
    {
        if (!$this->params->get('position', true)) return true;
        $this->doAvailability($property, $settings);
    }    
    
    private function doAvailability($property, $settings)
    {		
		$document 	= JFactory::getDocument();
		$date 		= new JDate();
		$client		= new JApplicationWebClient();
		
		// if the sasadmin plugin is disabled, bail out
		if(!JPluginHelper::isEnabled('iproperty', 'sasadmin')) return;
		
		// get the sasadmin params
		$plugin 	= JPluginHelper::getPlugin('iproperty', 'sasadmin');
		$params 	= new JRegistry($plugin->params);
		
		// if this property is not in rental stypes, don't continue
		$stypes = $params->get('stypelist', 4);
        if (is_array($stypes)){
            if( !in_array($property->stype, $stypes) ) return;
        } else {
            if ( $property->stype !== $stypes ) return;
        }

		$document->addScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js');
        if ($client->mobile) $document->addScript(JURI::root(true).'/components/com_iproperty/assets/js/jquery.ui.touch-punch.min.js');
        $document->addStyleSheet('//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/'.$params->get('theme', 'base').'/jquery-ui.css');

		// set the listing id as a var for the javascript to access
		$script  = 'var listing_id = '.$property->id.';'."\n";
		$script .= 'var firstday = '.$params->get('start_day', 0).';'."\n";
		$script .= 'var dateformat = "'.$params->get('date_format', 'mm/dd/yy').'";'."\n";
		$script .= 'var months_to_show = "'.$params->get('months', 6).'";'."\n";
		$script .= 'var columns = "'.$params->get('columns', 3).'";'."\n";
		$script .= 'var rows = Math.round(months_to_show / columns);'."\n";
		$script .= 'var default_status = "'.$params->get('default_status', 3).'";'."\n";
		$script .= 'var saslanguage = {"free": "'.JText::_( 'PLG_IP_SASLISTING_FREE' ).'", "tent": "'.JText::_( 'PLG_IP_SASLISTING_TESTSTYLE' ).'", "book": "'.JText::_( 'PLG_IP_SASLISTING_BOOKED' ).'"};'."\n";
		
		$document->addScriptDeclaration( $script );
		
		// now the javascript to do the request to the server
		$document->addScript(JURI::root(true).'/plugins/iproperty/saslisting/saslisting.js');
		
		$css  = "td.sas-free a{ background-color: ".$params->get('freestyle', '#B6F5AB')." !important; background-image: none !important }";
		$css .= "td.sas-tentative a{ background-color: ".$params->get('tentstyle', '#ABF5E9')." !important; background-image: none !important }";
		$css .= "td.sas-booked a{ background-color: ".$params->get('bookstyle', '#F5ABC0')." !important; background-image: none !important }";
		$css .= ".ui-datepicker { max-width: 100% }";
		$css .= "#ip-legend { border-radius: 2px; border: 1px solid; padding: 5px; margin: 5px; border-color: darkgrey; }";
		$css .= ".ip-legend-free { width: 12px; height: 12px; border-radius: 2px; background-color: ".$params->get('freestyle', '#B6F5AB')."; }";
		$css .= ".ip-legend-tent { width: 12px; height: 12px; border-radius: 2px; background-color: ".$params->get('tentstyle', '#ABF5E9')."; }";
		$css .= ".ip-legend-book { width: 12px; height: 12px; border-radius: 2px; background-color: ".$params->get('bookstyle', '#F5ABC0')."; }";
				
		$document->addStyleDeclaration( $css );				
		// build the tab
		echo JHtmlBootstrap::addTab('ipDetails', 'saslisting', JText::_('PLG_IP_SASLISTING_TABTITLE'));
			// build the legend
			echo '<div id="ip-legend">'.JText::_( 'PLG_IP_SASLISTING_FREE' ).'<div class="ip-legend-free"></div> '.JText::_( 'PLG_IP_SASLISTING_TENTSTYLE' ).'<div class="ip-legend-tent"></div> '.JText::_( 'PLG_IP_SASLISTING_BOOKED' ).'<div class="ip-legend-book"></div></div>';
            echo '<div id="ip-saslisting-calendar"></div>';
        echo JHtmlBootstrap::endTab();
    }
}
