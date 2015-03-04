ALTER IGNORE TABLE  `#__iproperty_agents` ADD  `time_zone` TINYINT( 1 ) UNSIGNED NOT NULL DEFAULT '0';

CREATE TABLE IF NOT EXISTS `#__iproperty_availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `listing_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 for free, 1 for tentative, 2 for confirmed',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
