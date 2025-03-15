-- AddForeignKey
ALTER TABLE `myfriend_tb` ADD CONSTRAINT `myfriend_tb_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user_tb`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
