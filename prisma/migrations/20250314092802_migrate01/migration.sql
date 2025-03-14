-- CreateTable
CREATE TABLE `user_tb` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userFullname` VARCHAR(100) NOT NULL,
    `userEmail` VARCHAR(100) NOT NULL,
    `userName` VARCHAR(50) NOT NULL,
    `userPassword` VARCHAR(50) NOT NULL,
    `userImage` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myfriend_tb` (
    `myfriendId` INTEGER NOT NULL AUTO_INCREMENT,
    `myfriendFullname` VARCHAR(100) NOT NULL,
    `myfriendPhone` VARCHAR(100) NOT NULL,
    `myfriendAge` INTEGER NOT NULL,
    `myfriendMajor` ENUM('IoT', 'DTI', 'IT') NOT NULL,
    `myfriendImage` VARCHAR(100) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`myfriendId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
