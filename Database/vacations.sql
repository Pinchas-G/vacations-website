-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: ינואר 21, 2024 בזמן 05:09 AM
-- גרסת שרת: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--
CREATE DATABASE IF NOT EXISTS `vacations` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacations`;

DELIMITER $$
--
-- נהלים
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spAddFollower` (`p_userId` INT, `p_vacationId` INT)   BEGIN
	INSERT INTO followers(userId, vacationId)
	VALUES (p_userId, p_vacationId);
	
	SELECT 
		followerId AS id,
		userId,
		vacationId
  FROM followers
	WHERE followerId = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAddVacation` (IN `p_destination` VARCHAR(50), IN `p_description` VARCHAR(500), IN `p_startDate` DATETIME, IN `p_endDate` DATETIME, IN `p_price` INT, IN `p_imageName` VARCHAR(50), IN `p_basePath` VARCHAR(50))   BEGIN
	INSERT INTO vacationsdetails(destination, description, startDate, endDate, price, imageName)
	VALUES (p_destination, p_description, p_startDate, p_endDate, p_price, p_imageName);
	
	SELECT 
		vacationId AS id,
		destination,
		description,
		startDate,
		endDate,
		price,
		CONCAT(p_basePath, imageName) AS imageUrl
	FROM vacationsdetails
	WHERE vacationId = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spDeleteFollower` (IN `p_followerId` INT)   BEGIN
	DELETE FROM followers
	WHERE followerId = p_followerId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spDeleteVacation` (IN `p_vacationId` INT)   BEGIN
	DELETE FROM vacationsdetails
	WHERE vacationId = p_vacationId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetFollowers` ()   BEGIN
	SELECT 
		followerId AS id,
		userId,
		vacationId
	FROM followers;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetFollowersPerDestination` ()   BEGIN
	SELECT 
		V.destination,
		COUNT(F.vacationId) AS followers
	FROM followers AS F
	LEFT JOIN vacationsdetails AS V
	ON F.vacationId = V.vacationId
	GROUP BY V.destination;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetVacation` (IN `p_basePath` VARCHAR(255), IN `p_vacationId` INT, IN `p_userId` INT)   BEGIN
    SELECT 
        V.vacationId AS id,
        V.destination,
        V.description,
        V.startDate,
        V.endDate,
        V.price,
        CONCAT(p_basePath, V.imageName) AS imageUrl,
        IF(F.followerId IS NOT NULL, F.followerId, 0) AS followerId,
        IF(F.followerId IS NOT NULL, 1, 0) AS isFollower,
        IF(FC.followersCount IS NOT NULL, FC.followersCount, 0) AS followersCount,
        VC.vacationsCount
    FROM vacationsdetails V
    LEFT JOIN followers F ON F.vacationId = V.vacationId AND F.userId = p_userId
    LEFT JOIN (
        SELECT vacationId, COUNT(*) AS followersCount
        FROM followers
        GROUP BY vacationId
    ) FC ON FC.vacationId = V.vacationId
    LEFT JOIN (
        SELECT COUNT(*) AS vacationsCount
        FROM vacationsdetails
    ) VC ON 1=1 
    WHERE
				V.vacationId = p_vacationId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetVacationImgName` (IN `p_id` INT)   BEGIN
	SELECT imageName 
	FROM vacationsdetails
	WHERE vacationId = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetVacations` (IN `p_basePath` VARCHAR(255), IN `p_offset` INT, IN `p_limit` INT, IN `p_userId` INT, IN `p_filterBy` INT)   BEGIN
    SELECT 
        V.vacationId AS id,
        V.destination,
        V.description,
        V.startDate,
        V.endDate,
        V.price,
        CONCAT(p_basePath, V.imageName) AS imageUrl,
        IF(F.followerId IS NOT NULL, F.followerId, 0) AS followerId,
        IF(F.followerId IS NOT NULL, 1, 0) AS isFollower,
        IF(FC.followersCount IS NOT NULL, FC.followersCount, 0) AS followersCount,
        VC.vacationsCount
    FROM vacationsdetails V
    LEFT JOIN followers F ON F.vacationId = V.vacationId AND F.userId = p_userId
    LEFT JOIN (
        SELECT COUNT(*) AS vacationsCount
        FROM vacationsdetails
        WHERE
            (p_filterBy = 2 AND p_userId = p_userId) OR
            (p_filterBy = 3 AND startDate > CURRENT_DATE) OR
            (p_filterBy = 4 AND startDate <= CURRENT_DATE AND endDate >= CURRENT_DATE) OR
            (p_filterBy NOT IN (2, 3, 4))  -- Default case
    ) VC ON 1=1 
    LEFT JOIN (
        SELECT vacationId, COUNT(*) AS followersCount
        FROM followers
        GROUP BY vacationId
    ) FC ON FC.vacationId = V.vacationId
    WHERE
        (p_filterBy = 2 AND F.userId = p_userId) OR
        (p_filterBy = 3 AND V.startDate > CURRENT_DATE) OR
        (p_filterBy = 4 AND V.startDate <= CURRENT_DATE AND V.endDate >= CURRENT_DATE) OR
        (p_filterBy NOT IN (2, 3, 4))  -- Default case
    ORDER BY V.startDate
    LIMIT p_offset, p_limit;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spIsEmailTaken` (IN `p_id` INT, IN `p_email` VARCHAR(320))   BEGIN
    SELECT IF(EXISTS(
        SELECT *
        FROM users
        WHERE email = p_email AND (userId != p_id OR ISNULL(p_id))
    ), 1, 0) AS isTaken;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spLogin` (`p_email` VARCHAR(255), `p_password` VARCHAR(300))   BEGIN
	SELECT
		 userId AS id,
		 firstName,
		 lastName,
		 email,
		 `password`,
		 roleId
	FROM users
	WHERE email = p_email AND `password` = p_password;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spRegister` (IN `p_firstName` VARCHAR(30), IN `p_lastName` VARCHAR(30), IN `p_email` VARCHAR(320), IN `p_password` VARCHAR(300), IN `p_role` INT)   BEGIN
	INSERT INTO users (firstName, lastName, email, `password`, roleId)
	VALUES (p_firstName, p_lastName, p_email, p_password, p_role);
	
	SELECT LAST_INSERT_ID() AS id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spUpdateUser` (IN `p_id` INT, IN `p_firstName` VARCHAR(30), IN `p_lastName` VARCHAR(30), IN `p_email` VARCHAR(320), IN `p_password` VARCHAR(300))   BEGIN
	UPDATE users
	SET
		firstName = p_firstName,
		lastName = p_lastName,
		email = p_email,
		`password` = p_password
	WHERE userId = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spUpdateVacation` (IN `p_vacationId` INT, IN `p_destination` VARCHAR(50), IN `p_description` VARCHAR(500), IN `p_startDate` DATETIME, IN `p_endDate` DATETIME, IN `p_price` INT, IN `p_imageName` VARCHAR(50))   BEGIN
	UPDATE vacationsdetails
	SET
		destination = p_destination,
		description = p_description,
		startDate = p_startDate,
		endDate = p_endDate,
		price = p_price,
		imageName = p_imageName
	WHERE vacationId = p_vacationId;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `followers`
--

CREATE TABLE `followers` (
  `followerId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `followers`
--

INSERT INTO `followers` (`followerId`, `userId`, `vacationId`) VALUES
(295, 2, 9),
(345, 2, 4),
(346, 2, 10),
(348, 2, 7),
(349, 2, 11),
(350, 2, 6),
(411, 3, 2),
(412, 3, 10),
(413, 3, 6),
(414, 3, 3),
(416, 3, 60),
(417, 7, 59),
(418, 7, 4),
(419, 7, 70),
(420, 7, 11),
(421, 7, 8),
(422, 9, 4),
(423, 9, 59),
(424, 9, 60),
(425, 9, 67),
(426, 9, 10),
(427, 9, 63),
(428, 9, 2),
(429, 9, 69),
(430, 9, 12),
(431, 9, 8);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `roles`
--

INSERT INTO `roles` (`roleId`, `roleName`) VALUES
(1, 'User'),
(2, 'Admin');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `roleId`) VALUES
(1, 'Alex', 'Lavi', 'alex@gmail.com', '3e828fdfa3bda371bf80003947b6c7a673d0357867d400d395b158f347cbc2a1956d3e890933aee4c36b337d5e40f62bf0584038a79f260d2e80c65ce463827a', 2),
(2, 'Avi', 'Lavi', 'avi@gmail.com', '3e828fdfa3bda371bf80003947b6c7a673d0357867d400d395b158f347cbc2a1956d3e890933aee4c36b337d5e40f62bf0584038a79f260d2e80c65ce463827a', 1),
(3, 'Miri', 'Max', 'miri@gmail.com', '3e828fdfa3bda371bf80003947b6c7a673d0357867d400d395b158f347cbc2a1956d3e890933aee4c36b337d5e40f62bf0584038a79f260d2e80c65ce463827a', 1),
(7, 'Jack', 'Jay', 'jack@gmail.com', '3e828fdfa3bda371bf80003947b6c7a673d0357867d400d395b158f347cbc2a1956d3e890933aee4c36b337d5e40f62bf0584038a79f260d2e80c65ce463827a', 1),
(9, 'Lili', 'Kors', 'lili@gmail.com', '3e828fdfa3bda371bf80003947b6c7a673d0357867d400d395b158f347cbc2a1956d3e890933aee4c36b337d5e40f62bf0584038a79f260d2e80c65ce463827a', 1);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `vacationsdetails`
--

CREATE TABLE `vacationsdetails` (
  `vacationId` int(11) NOT NULL,
  `destination` varchar(30) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `imageName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `vacationsdetails`
--

INSERT INTO `vacationsdetails` (`vacationId`, `destination`, `description`, `startDate`, `endDate`, `price`, `imageName`) VALUES
(1, 'Paris', 'France\'s magnetic City of Light is a perennial tourist destination, drawing visitors with its iconic attractions, like the Eiffel Tower and the Louvre, and its unmistakable je ne sais quoi. Quaint cafes, trendy shopping districts and Haussmann architecture give Paris its timeless beauty. But the city\'s best asset is that you\'re likely to discover something new with each trip or season (read: Paris is always a good idea). To best explore France\'s ever-changing capital, get lost wandering the char', '2024-06-11', '2024-12-18', 1700, '067f6133-b141-450e-8deb-c7c2da3fa97e.jpg'),
(2, 'Bora Bora', 'What this 12-square-mile French Polynesian island may lack in size it makes up for in sheer tropical beauty. Here, you\'ll find picturesque beaches, lush jungles and luxurious resorts set on surrounding islets. The island\'s extinct volcano, Mount Otemanu, makes for a great photo-op or challenging hike, and the friendly Bora Bora locals can help you catch a glimpse of the island\'s best sights during an off-road excursion. To relax, head to Matira Beach for crystal-clear water and postcard-worthy w', '2024-04-11', '2024-12-18', 2150, '994f290b-f344-470d-b15c-a6a7b024bc25.webp'),
(3, 'Glacier National Park', 'Snow-capped peaks, alpine meadows and azure lakes are just a few reasons why Glacier National Park is one of America\'s most striking parks. There are more than 700 miles of hiking trails in this Montana crown jewel, plus 13 designated areas for camping. In the winter, travelers can enjoy snowshoeing and skiing, while during the summer vacationers can go swimming in Lake McDonald and whitewater rafting on Flathead River, among other popular activities. For those who\'d rather admire their surround', '2024-01-24', '2024-03-19', 980, '1e11f53a-425d-4ea0-af1c-15a5ad18d215.webp'),
(4, 'Rome', 'When you visit Italy\'s capital city, prepare to cross a few must-see landmarks – including the Colosseum, the Trevi Fountain and the Pantheon – off of your bucket list. Travelers can also see some of Italy\'s greatest treasures, including St. Peter\'s Basilica and the Sistine Chapel, in Vatican City. Escape the tourist crowds by taking a twilight stroll along the cobblestone streets of Trastevere, or head to Mercato Centrale Roma to sample local delicacies like pistachio gelato. Before leaving, pe', '2024-01-24', '2024-03-11', 460, '825861e7-6ecc-4e90-ba5e-f7fc8907a3ca.jpg'),
(5, 'Swiss Alps', 'Snow-covered mountains, charming towns and flower-strewn meadows make the Swiss Alps a year-round fairy tale destination. Visit in the winter for world-class skiing (and après-ski fondue and drinks) in locales such as the exclusive St. Moritz and the picturesque Zermatt, home of the craggy Matterhorn. Opt for warmer months to hike through the verdant valleys of Swiss National Park or attend lively festivals in the foothill city of Montreux. Regardless of the time of year, no trip would be comple', '2024-01-24', '2024-04-20', 762, 'bc8b8553-7676-4019-8888-fad1dec0ec30.jpg'),
(6, 'Maui', 'Whether you\'re driving along the Road to Hana, enjoying a bird\'s-eye view of Maui\'s lush coastline from a helicopter, snorkeling with sea turtles or simply relaxing on white or black sand beaches, you\'ll find that this Hawaiian island is unlike any other tropical destination. Don\'t miss a chance to visit Haleakala National Park, which is home to one of the world\'s largest dormant volcanic craters and boasts surreal sunrises. You should also attend a traditional luau for a dose of local culture a', '2024-12-12', '2024-12-19', 1800, 'ed2adc3f-56f2-48ba-a757-9e390f629eb1.jpg'),
(7, 'London, England', 'London is a world unto itself. The eclectic neighborhoods, which are home to a blend of historical landmarks and modern-day attractions, can keep you occupied for days. If it\'s your first time in London, join a tour that takes you past top spots like the Tate Modern art institution, Buckingham Palace, the Tower of London, Borough Market and the British Museum, before sitting down to a classic afternoon tea or checking out a local pub for a Sunday roast. Once you\'ve seen the major sights, stroll ', '2024-12-12', '2024-12-19', 623, '4d8e4ef6-a023-4503-a0f0-ef110cfa39e0.jpg'),
(8, 'Maldives', 'It is not cheap or easy to reach, but this isolated Indian Ocean vacation spot located southwest of India is the personification of a dreamy tropical retreat. In this remote destination, which is made up of more than 1,000 islands, thatched-roof overwater bungalows sit above the bright aquamarine sea, providing easy water access and a romantic atmosphere. On this once-in-a-lifetime vacation, fill your days with beach trips, spa treatments and snorkeling or scuba diving excursions. If cabin fever', '2024-12-11', '2024-12-18', 3900, '08d41f22-62c3-42eb-b988-1a73af5455cb.jpg'),
(9, 'Turks & Caicos', 'Located north of the Dominican Republic, this collection of roughly 100 islands and cays is popular with honeymooners – and for good reason. With sparkling white sand, crystal-clear water and nearly 350 miles of colorful coral reef, the Turks and Caicos Islands are truly a sight to behold. While you\'d be remiss to visit this quintessential Caribbean wonder and not spend a day or two lounging on Grace Bay Beach on Providenciales, those seeking a more active getaway will have plenty of opportuniti', '2024-12-13', '2024-12-20', 600, '60c8f0fd-fe40-45f2-a7ea-b622e9e33c99.jpg'),
(10, 'Tokyo', 'Simply setting foot in Japan\'s frenetic capital city is an experience. Known for its bustling streets and flashing neon signs, Tokyo has an electric energy and ample top attractions to discover. Foodies won\'t be let down by Tokyo\'s fresh sushi and hearty ramen (not to mention more Michelin-starred restaurants than any other city in the world). Shopaholics will find plenty of must-have designer products in Ginza, while those seeking a respite in nature can visit Shinjuku Gyoen or Yoyogi Park. Mea', '2024-02-10', '2024-12-17', 981, 'df686487-d083-4604-b51d-9987962fee54.avif'),
(11, 'Phuket', 'Located in southern Thailand, the island of Phuket offers something for everyone, especially budget-minded travelers. Activities like spa treatments and boat tours come with low price tags, as do accommodations, making this a cheap tropical vacation option. For stunning scenery, check out the limestone cliffs of Phang Nga Bay and lounge on Phuket\'s gorgeous white sand beaches (Freedom Beach and Bang Tao Beach are two popular destinations). Other top attractions include Wat Chalong Temple and the', '2024-12-12', '2024-12-19', 1450, 'f52cda69-070d-4a8f-a8da-8fae61f27db1.jpg'),
(12, 'Costa Rica', 'From volcanic mountains and verdant rainforests to tumbling waterfalls and miles of stunning shoreline, Costa Rica is a Central American gem. Explore the beaches along the Nicoya Peninsula, hike along Arenal Volcano and spot exotic wildlife (think: river turtles, otters and howler monkeys) in remote Tortuguero National Park. If you\'re looking for an adrenaline rush, go swimming next to some of the country\'s waterfalls or zip lining through its rainforests. Then, head back to an eco-luxury all-in', '2024-12-12', '2024-12-20', 765, '6c2d2bbd-0d18-4f7a-930b-41860065b782.jpg'),
(59, 'Ålborg, Denmark', 'It rates as Denmark’s fourth-largest city, with around 120,000 residents, but out-of-the-way Ålborg might seem an unlikely international-travel hub. That\'s not stopping Scandinavian Airlines, which is betting on the compact, alluring city with newly launched flights from Newark Liberty International, which will run three times a week from April through October. The cobbled streets of Ålborg’s old town are lined with half-timbered houses and pastel exteriors;', '2024-01-22', '2024-01-31', 1454, '662f71d2-01b4-43e6-b7bc-ef0d7851a0a6.webp'),
(60, 'Nepal', 'A once-forbidden kingdom is now home to some truly palatial digs. Nepal’s Mustang district, which opened to outsiders in 1992, is a place to watch in 2024 thanks to this stunning, 29-suite hotel, which welcomed its first guests in August. Shinta Mani Mustang, the latest property from the Bensley Collection, delivers the luxurious wellness experiences and thoughtful design that devotees of the brand have come to expect.', '2024-01-22', '2024-01-31', 1234, '71bc08a0-99a8-44b3-a8df-52eb0bc33f17.webp'),
(61, 'Tallinn, Estonia', 'This country’s literacy and secondary education rates consistently rank near the top in Europe, especially among women, so it should come as no surprise that Tartu, the university city to the southeast of Tallinn, has been designated Europe’s Capital of Culture for 2024. Still, for first-timers to the Baltics, there’s no better place to get schooled than the country’s capital city', '2024-01-31', '2024-02-13', 2100, '51f6efbf-f4b7-42b9-839f-4b2006b57c66.webp'),
(62, 'Warsaw, Poland', 'The thriving contemporary art scene in Warsaw, which is home to art-circuit stalwarts like the Foksal Gallery Foundation and Raster Gallery, will get a big boost in 2024, when the Museum of Modern Art in Warsaw finally moves into its own headquarters. Founded in 2005, the museum has burnished the city’s art reputation for two decades, with its holdings of both foreign and Polish work, despite operating out of temporary spaces. ', '2024-01-31', '2024-02-29', 987, '5ad5f40d-0d31-47e2-bf73-ec5c46960b61.webp'),
(63, 'Mérida, Mexico', 'The capital of Yucatán, this city has long been popular with Mexican travelers drawn to its Maya ruins, cerulean-blue cenotes, restored haciendas, and incredible food. But it has a growing acclaim among international visitors — especially LGBTQ+ travelers, who often describe Yucatán as very gay friendly. Mérida’s historic beauty and laid-back cantina culture might explain why LGBTQ+ retirees have embraced the city in recent years', '2024-01-25', '2024-03-31', 659, '4c44e2a9-4e24-4cd9-b531-820a1f27332e.webp'),
(64, 'Bangkok', '“It’s a classic Asian megacity: frenetic, neon-lit, and overwhelming to the senses,” said Jack Tydeman, a Southeast Asia specialist at Audley Travel and member of T+L\'s A-List. But change is coming to Bangkok, in the form of many megaprojects, including Dusit Central Park, which is slated to open in 2024, with the 259-room Dusit Thani Bangkok Hotel and a multi-terraced roof park.', '2024-01-24', '2024-03-19', 3200, 'c7314fb3-ab9f-4c81-b829-39d0c6d63f5c.webp'),
(65, 'Cleveland', 'The year ahead has the Land set to shine, thanks to national and international events, world-class cultural expansions, and the rebirth of historic hotels. It all starts in April, when the NCAA Women’s Final Four comes to the state-of-the-art Rocket Mortgage FieldHouse and a total solar eclipse sweeps over the city on April 8, 2024.', '2024-04-21', '2024-07-21', 4500, 'b4b90e84-c49f-4d8a-b395-fd9665b64921.webp'),
(66, 'Las Vegas', 'Just when you think Sin City can’t get any bigger, louder, or glitzier, Las Vegas turns it up another notch. On the heels of blockbuster residencies from Adele, Katy Perry, and Lady Gaga, U2 kicked off their inaugural stint at the long-anticipated Sphere this fall. Filmmaker Darren Aronofsky’s immersive sci-fi production “Postcard from Earth” will also show off the new arena’s 16K LED display, beginning this fall and continuing through 2024.', '2024-07-21', '2024-08-27', 3400, 'de695303-87a2-4c87-bffe-3ac08d4f960b.webp'),
(67, 'Louisville, Kentucky', 'The Kentucky Derby will celebrate its 150th anniversary on May 4, 2024, as well as the debut of the redesigned Churchill Downs Paddock, which is coming off a multiyear, $200-million renovation. Those that can’t make race day can brush up on the event’s history and culture year-round at the Kentucky Derby Museum, which has interactive exhibits on subjects like Black horsemen’s contributions to racing. ', '2024-01-31', '2024-07-24', 5000, 'f33467d4-baae-4c4b-abbc-00739beda9bf.webp'),
(68, 'Coastal Alaska', 'Cruising is back in a big way, and Alaska\'s Inside Passage is leading the charge. In 2023, the state saw ships including Regent’s Seven Seas Explorer and Carnival’s Luminosa for the first time, while Royal Caribbean recently sent Brilliance of the Seas north for the first time in years. The new Klawock port, on Prince of Wales Island, is poised to welcome large ships in the 2024 season with food and retail outposts', '2024-07-22', '2024-09-26', 3456, 'ae2bf354-9bcb-45c1-a4bd-15dd49e32207.webp'),
(69, 'Coastal Norway', 'Long known for its cutting-edge design and architectural marvels like the Oslo Opera House, Norway has lately doubled down on building big. “Over the last few years, we’ve seen a surge in new attractions,” confirmed Katrine Mosfjeld, the chief marketing officer for Visit Norway. In seaside Oslo, the new luxury hotel Sommero is a study in adaptive reuse, inside a landmark building from 1930 originally designed by famed Norwegian architects Andreas Bjercke and Georg Eliassen.', '2024-02-13', '2024-05-25', 2300, 'ba35857c-c7eb-45c3-84ee-cb06d7443952.webp'),
(70, 'Faroe Islands', 'This remote, starkly beautiful archipelago in the North Atlantic just got way more accessible. Summer 2023 saw Atlantic Airways launch nonstop flights from New York Stewart International, 70 miles north of New York City, to Vágar Airport, in the islands. “This direct flight is not only about easier transport to our great ocean nation, but a means of creating a bridge between two worlds,” Jóhanna á Bergi, CEO of Atlantic Airways, told T+L.', '2024-02-07', '2024-03-12', 600, '9e74a132-f45c-4ce5-80a6-29a29cd8b848.webp');

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`followerId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- אינדקסים לטבלה `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- אינדקסים לטבלה `vacationsdetails`
--
ALTER TABLE `vacationsdetails`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `followerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=432;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vacationsdetails`
--
ALTER TABLE `vacationsdetails`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- הגבלות לטבלאות שהוצאו
--

--
-- הגבלות לטבלה `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `vacationId` FOREIGN KEY (`vacationId`) REFERENCES `vacationsdetails` (`vacationId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- הגבלות לטבלה `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
