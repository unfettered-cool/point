# point
포인트통통 족보 웹사이트

# Tech Stack
* sinatra ( ruby ) + puma
* mariadb
* bulma css

# Schema

```SQL
CREATE TABLE `itempool` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`items` VARCHAR(300) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`answer` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`created` DATETIME NOT NULL DEFAULT curdate(),
	`modified` DATETIME NOT NULL DEFAULT curdate(),
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `unique_key` (`items`, `answer`) USING BTREE,
	INDEX `sort_idx` (`items`, `answer`) USING BTREE
)
COMMENT='문제 DB'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;```
