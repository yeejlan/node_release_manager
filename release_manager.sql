#
# Structure for table "action_log"
#

DROP TABLE IF EXISTS `action_log`;
CREATE TABLE `action_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `action_name` varchar(30) NOT NULL,
  `return_message` text NOT NULL,
  `log_date` date NOT NULL,
  `log_ip` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54386 DEFAULT CHARSET=utf8;

#
# Structure for table "siteconfig"
#

DROP TABLE IF EXISTS `siteconfig`;
CREATE TABLE `siteconfig` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sitename` varchar(200) NOT NULL,
  `base_dir` varchar(250) NOT NULL,
  `get_current_branch_command` text NOT NULL,
  `update_command` text NOT NULL,
  `generate_command` varchar(20000) NOT NULL DEFAULT ' ',
  `test_release_command` text NOT NULL,
  `release_command` text NOT NULL,
  `cache_dir` varchar(200) NOT NULL,
  `cache_exclude_dir` text NOT NULL,
  `cache_urls` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'admin','c67ca4fe468a300c4af0027ba45dbc19','admin');
