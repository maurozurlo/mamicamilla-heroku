SET 
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET 
  time_zone = "+00:00";
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` varchar(255) NOT NULL, 
  `fname` varchar(255) NOT NULL, 
  `lname` varchar(255) NOT NULL, 
  `phone` varchar(255) NOT NULL, 
  `guests` int(255) NOT NULL, 
  `date` date NOT NULL, 
  `time` int(4) NOT NULL, 
  `email` varchar(255) NOT NULL, 
  `comments` text NOT NULL, 
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
  `isRecurring` tinyint(1) NOT NULL, 
  `isCancelled` tinyint(4) NOT NULL DEFAULT '0', 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` varchar(255) NOT NULL, 
  `user` varchar(255) NOT NULL, 
  `action` varchar(255) NOT NULL, 
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `objectId` varchar(255) DEFAULT NULL, 
  `objectTableName` varchar(255) DEFAULT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `logs` (
  `id`, `user`, `action`, `timestamp`, 
  `objectId`, `objectTableName`
) 
VALUES 
  (
    '04f9a3e0-dc8f-4696-b07a-20b84d959e39', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:53:30', NULL, NULL
  ), 
  (
    '0df59dad-69b2-40d5-b0e0-397e6a5d07d0', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:14:58', NULL, NULL
  ), 
  (
    '13f47e3b-5150-4f5f-8086-f06a4cca315e', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 14:20:25', NULL, NULL
  ), 
  (
    '1886d6cf-735d-4769-9b43-e5ecbcfc2fe0', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 14:21:17', NULL, NULL
  ), 
  (
    '28bace1d-ba8b-42c1-8623-a7948a906f1d', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:58:25', NULL, NULL
  ), 
  (
    '2b4c42f1-e668-46c2-8830-830a90f4cf44', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:51:14', NULL, NULL
  ), 
  (
    '3c383238-ead6-405b-810d-d94ce8235e7a', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:58:53', NULL, NULL
  ), 
  (
    '3d8d84c6-b269-4ecc-b6a7-2e95d1a06dda', 
    '1', 'admin added a category', '2021-02-20 13:51:28', 
    NULL, NULL
  ), 
  (
    '511ce02b-d07c-4a89-a047-deb70ec687a9', 
    '1', 'admin edited a dish/drink', 
    '2021-02-22 09:54:33', NULL, NULL
  ), 
  (
    '5fb32180-f648-4656-833b-42de4241346b', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:15:23', NULL, NULL
  ), 
  (
    '7dd26f6e-b823-44e6-9a3c-4a068facfc46', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:59:07', NULL, NULL
  ), 
  (
    'a0525683-90dd-4353-a6bf-a086257885d8', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:56:33', NULL, NULL
  ), 
  (
    'a40800fb-253c-412a-84b7-7e0548233f62', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 14:20:06', NULL, NULL
  ), 
  (
    'aeb1df5d-0003-4a48-870c-f2ab8c5fb01e', 
    '1', 'admin edited a dish/drink', 
    '2021-02-22 09:54:31', NULL, NULL
  ), 
  (
    'b05325f2-302c-43ef-9d49-615cdcef126e', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:55:08', NULL, NULL
  ), 
  (
    'b499c85e-a63d-4cdd-b140-911cb0e22903', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 14:20:47', NULL, NULL
  ), 
  (
    'c13ecf38-bf16-4342-bed2-552052903a32', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:50:10', NULL, NULL
  ), 
  (
    'c2119ca0-8fdf-4408-b374-c52d3a9eaf05', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:52:59', NULL, NULL
  ), 
  (
    'c4671c7e-d1e7-4b78-8600-5b800ba45c83', 
    '1', 'admin added a category', '2021-02-20 13:55:38', 
    NULL, NULL
  ), 
  (
    'd1baeed5-2198-4392-8d8d-55c0d96660b3', 
    '1', 'admin added a category', '2021-02-20 13:14:20', 
    NULL, NULL
  ), 
  (
    'da142957-462d-4ef1-a5a9-6ef8e07f1ca5', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 13:48:20', NULL, NULL
  ), 
  (
    'db283ab3-a107-4a3c-b9fc-03df1449eced', 
    '1', 'admin added a category', '2021-02-20 13:55:57', 
    NULL, NULL
  ), 
  (
    'e5307ffe-66f1-4da4-a9e2-ff1602a5d605', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 14:21:34', NULL, NULL
  ), 
  (
    'ed6a89e4-7f94-47a0-97ef-df35a86eae18', 
    '1', 'admin added a dish/drink', 
    '2021-02-20 14:21:01', NULL, NULL
  );
CREATE TABLE IF NOT EXISTS `menuCategory` (
  `id` varchar(255) NOT NULL, 
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `listOrder` int(255) NOT NULL DEFAULT '-1', 
  `name` varchar(255) NOT NULL, 
  `description` varchar(255) NOT NULL, 
  `belongsTo` varchar(255) NOT NULL, 
  `isActive` tinyint(1) NOT NULL, 
  `icon` varchar(255) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `menuCategory` (
  `id`, `createdAt`, `listOrder`, `name`, 
  `description`, `belongsTo`, `isActive`, 
  `icon`
) 
VALUES 
  (
    '18504285-bc7d-4b59-9229-9b92888e39f0', 
    '2021-02-20 13:55:57', 5, 'POMODORO E MOZZARELLA', 
    '', '5a81ffe6-1403-40d2-ba42-66b0d225073a', 
    1, ''
  ), 
  (
    '5a81ffe6-1403-40d2-ba42-66b0d225073a', 
    '2021-02-20 13:55:38', 4, 'Pizzeria', 
    '', '', 1, ''
  ), 
  (
    '791a56b6-7df5-4aa8-98e4-5342eae0f1c3', 
    '2021-02-20 13:14:20', 2, 'Antipasti', 
    '', '', 1, ''
  ), 
  (
    'e41f5a6e-c990-4f02-a7ea-c932825b1c97', 
    '2021-02-20 13:51:28', 3, 'Pasta', 
    '', '', 1, ''
  );
CREATE TABLE IF NOT EXISTS `menuItem` (
  `id` varchar(255) NOT NULL, 
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `listOrder` int(255) NOT NULL DEFAULT '-1', 
  `belongsTo` varchar(255) NOT NULL, 
  `name` varchar(255) NOT NULL, 
  `description` varchar(255) NOT NULL, 
  `ecommerceUrl` varchar(255) DEFAULT NULL, 
  `modifiers` varchar(255) NOT NULL, 
  `isActive` tinyint(1) NOT NULL, 
  `variants` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `menuItem` (
  `id`, `createdAt`, `listOrder`, `belongsTo`, 
  `name`, `description`, `ecommerceUrl`, 
  `modifiers`, `isActive`, `variants`
) 
VALUES 
  (
    '44634756-8f99-479d-8fe5-3c34f1dc7d9f', 
    '2021-02-20 13:14:58', 99, '791a56b6-7df5-4aa8-98e4-5342eae0f1c3', 
    'GEMISCHTER SALAT', '', '', ',vegan', 
    0, '{\"price\":\"5.5\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '50c162bb-9fed-481d-9021-cdec95f38b57', 
    '2021-02-20 13:15:23', 99, '791a56b6-7df5-4aa8-98e4-5342eae0f1c3', 
    'MAMI CAMILLA CLASSICO', 'Parma Schinken, Büffel Mozzarella, Mariniert Gemüse, Mortadella, Provolone, Bruschette', 
    '', '', 1, '{\"price\":\"17\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'e8420cf6-6ce2-4172-a523-f74cdf31657e', 
    '2021-02-20 13:48:20', 99, '791a56b6-7df5-4aa8-98e4-5342eae0f1c3', 
    'MAMI CAMILLA GIARDINIERA', 'Mariniert Gemüse, Oliven, Bruschette mit Tomaten und Stracciatella, eingelegte Gemischte Gemüse.', 
    '', '', 1, '{\"price\":\"14\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '54573c6b-0658-4040-a574-6e50d06f5cca', 
    '2021-02-20 13:50:10', 99, '791a56b6-7df5-4aa8-98e4-5342eae0f1c3', 
    'CAPONATA', 'Auberginen, süßsauer Tomatensauce, Sellerie, Oliven undMandeln', 
    '', 'a1,g,m,l,veggie', 1, '{\"price\":\"8\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'b4695d17-f381-4096-97c7-bfd3c16fb44f', 
    '2021-02-20 13:51:14', 99, '791a56b6-7df5-4aa8-98e4-5342eae0f1c3', 
    'PARMIGIANA DI MELANZANE', 'Auberginenauauf mit Mozzarella, Tomatensoße und Rucola Salat', 
    '', '3,a1,g,veggie', 1, '{\"price\":\"12\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'a59032fb-c860-4be6-a195-6b07933da8da', 
    '2021-02-20 13:52:59', 99, 'e41f5a6e-c990-4f02-a7ea-c932825b1c97', 
    'TAGLIATELLE', 'mit saisonales Gemüse und Pecorino', 
    '', 'a,a1,g,', 1, '{\"price\":\"12\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'cf06dfd5-fc7f-4139-ab6b-159dd789c63a', 
    '2021-02-20 13:53:30', 99, 'e41f5a6e-c990-4f02-a7ea-c932825b1c97', 
    'KLASSISCHE LASAGNE', 'Hausgemacht Lasagna mit Ragu, Fiordilatte und Beciamel', 
    '', '', 1, '{\"price\":\"12\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '521cbea2-618a-43b9-8903-257395983e67', 
    '2021-02-20 13:55:08', 99, 'e41f5a6e-c990-4f02-a7ea-c932825b1c97', 
    'RAVIOLI DI RICOTTA E SPIANCI', 
    'Ravioli gefüllt mit Ricotta und Spinat in Tomatensauce und Grana Käse', 
    '', '', 1, '{\"price\":\"11\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '74dc2943-7a95-4519-8b15-489674b0336c', 
    '2021-02-20 13:56:33', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'MARGHERITA', 'Tomaten, Mozzarella (ordilatte), Basilikum', 
    '', '', 1, '{\"price\":\"8\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'f4b34bbc-aa4f-4aed-8086-8e439d87657a', 
    '2021-02-20 13:58:25', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'MARGHERITA DOPPIO FIORDILATTE', 
    'Margherita + extra fiordilatte', 
    '', '', 1, '{\"price\":\"9.5\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'dd77b07c-ae5a-4a1e-a346-bdb1941b146f', 
    '2021-02-20 13:58:53', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'MARGHERITA AL POMODORO GIALLO', 
    'Gelbe Tomaten, Fiordilatte Basilikum.', 
    '', '', 1, '{\"price\":\"10\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'fd092ce7-6c0b-4ba3-9a29-311511521b0a', 
    '2021-02-20 13:59:07', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'SALAMI', 'mit Tomatensauce, Salami (milder oder scharfer), Mozzarella, Basilikum, Olivenöl', 
    '', '', 1, '{\"price\":\"10\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '0df87cbe-6683-470a-86ed-6f5f25c67ccb', 
    '2021-02-20 14:20:06', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'VEGETARIANA', 'Gelbe Tomatensauce, Ofengemüse, Mozzarella, Basilikum und Olivenöl', 
    '', '', 1, '{\"price\":\"10\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'e5d99bbc-4959-45ed-a1cb-0b08c2b38e6a', 
    '2021-02-20 14:20:25', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'INBUFALITA', 'mit Tomatensauce, Basilikum, Büffelmozzarella, Olivenöl', 
    '', '', 1, '{\"price\":\"11\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '1bd41664-3c12-4fee-b214-c75187c416a4', 
    '2021-02-20 14:20:47', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'SALSICCIA & OLIVE', 'Tomatensauce, Mozzarella, Salsiccia aus Toskana und Oliven', 
    '', '', 1, '{\"price\":\"12\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    'ec4f47b4-8196-4fa9-a012-5cd95afe0203', 
    '2021-02-20 14:21:01', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'MARGHERITA & BURRATA', '', '', '', 
    1, '{\"price\":\"13\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '205d8d78-c6f7-4b49-b8d0-028d60e15eed', 
    '2021-02-20 14:21:17', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'SPIANATA & STRACCIATELLA', 'Tomatensauce, Mozzarella, Scharfe Salami , Stracciatella, Basilikum und Olivenöl', 
    '', '', 1, '{\"price\":\"13\",\"amount\":\"\",\"unit\":\"\"}'
  ), 
  (
    '5d500831-a9d1-44ff-b4bd-124ba57c53de', 
    '2021-02-20 14:21:34', 99, '18504285-bc7d-4b59-9229-9b92888e39f0', 
    'PARMA & RUCOLA', 'mit Tomatensauce, Mozzarella, Parma Schinken (18 Monate), Rucola, Grana, Basilikum', 
    '', '', 1, '{\"price\":\"14\",\"amount\":\"\",\"unit\":\"\"}'
  );
CREATE TABLE IF NOT EXISTS `menuModifier` (
  `id` varchar(255) NOT NULL, 
  `type` enum(
    'Allergen', 'Additive', 'Info', ''
  ) NOT NULL, 
  `shortName` varchar(255) NOT NULL, 
  `longName` varchar(255) NOT NULL, 
  `url` varchar(255) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, 
  `expires` int(11) UNSIGNED NOT NULL, 
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `sessions` (`session_id`, `expires`, `data`) 
VALUES 
  (
    'JHKzxfNwJinpM5Yqs9x_cflWMzflOvbO', 
    1614074683, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"admin\":\"admin\",\"userId\":\"1\",\"username\":\"admin\"}'
  ), 
  (
    'aOLTAVctdHdtb0Oes5Xymr-4HZMo7fki', 
    1614078323, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"admin\":\"admin\",\"userId\":\"1\",\"username\":\"admin\"}'
  ), 
  (
    'kV-qKseBcAasxSQem3TP6XIXKB_K4ASi', 
    1614080390, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"admin\":\"admin\",\"userId\":\"1\",\"username\":\"admin\"}'
  ), 
  (
    'Ewvko_x1qVYFlQWhcjpUsqKuOKxciP6g', 
    1614090831, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"admin\":\"admin\",\"userId\":\"1\",\"username\":\"admin\"}'
  );
CREATE TABLE IF NOT EXISTS `settings` (
  `id` varchar(255) NOT NULL, 
  `name` varchar(255) NOT NULL, 
  `value` json DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `settings` (`id`, `name`, `value`) 
VALUES 
  (
    '1', 'booking_settings', '\"{\\\"hours\\\":[[\\\"1700\\\",\\\"2300\\\"],[\\\"1700\\\",\\\"1800\\\"],[\\\"1700\\\",\\\"2300\\\"],[\\\"1700\\\",\\\"2300\\\"],[\\\"1700\\\",\\\"2300\\\"],[\\\"1200\\\",\\\"2300\\\"],[\\\"1200\\\",\\\"2350\\\"]],\\\"holidays\\\":\\\"16-2;14-4;18-2;20-2\\\",\\\"enabled\\\":\\\"1\\\"}\"'
  );
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL, 
  `username` varchar(255) NOT NULL, 
  `password` varchar(255) NOT NULL, 
  `fullName` varchar(255) DEFAULT NULL, 
  `title` varchar(255) DEFAULT NULL, 
  `createdAt` timestamp NULL DEFAULT NULL, 
  `lastActive` timestamp NULL DEFAULT NULL, 
  `isInactive` tinyint(4) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `users` (
  `id`, `username`, `password`, `fullName`, 
  `title`, `createdAt`, `lastActive`, 
  `isInactive`
) 
VALUES 
  (
    '1', 'admin', '$2b$12$pSesFBgZyP/3NIujYNxaHeGxl/UTd3CrTWG4I7B1P8ITGjrv9tjn6', 
    'El Miauro', 'Administrator', '2021-02-10 22:52:17', 
    '2021-02-22 13:53:18', 0
  );
