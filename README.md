# 포인트 통통 족보 기능

## Tech Stack
node.js / fastify / html5 / javascript / bulma css / mariadb 10.4

## Deploy
pm2 의 dotenv 등 연동고민하여 dev 일때는 console.log prod 일때는 fastify 의 log 로 동작
log path 등 2중화 작업 필요

## TODO
- [ ] admin login
- [ ] admin add/modify form 작업
- [ ] admin paginatation 처리

## Configuration
### Web Server (nginx)
```
server {
    listen       80;
    server_name  example.net;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }

    location = /50x.html {
        root   /usr/share/nginx/html;
    }

  }
```


### Database Table
```
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
```
