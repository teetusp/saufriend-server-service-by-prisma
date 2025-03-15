// จัดการเรื่องเส้นทางเพื่อกำหนด endpoint สำหรับ frontend ***
// ในการเรียกใช้ controller เพื่อการทำงาน CRUD กับฐานข้อมูล และการอัปโหลดไฟล์

// require package ที่ต้องใช้ในการกำหนดเส้นทาง (route)
const express = require('express');

// require controller เพื่อจะใช้งาน
const friendController = require('./../controllers/friend.controller.js');

// สร้าง router จาก express เพื่อจัดการเส้นทาง
const router = express.Router();

// กำหนดเส้นทาง และการเรียกใช้ controller
router.post('/', friendController.uploadFriend, friendController.createFriend); //เพิ่มข้อมูล
router.put('/:myfriendId', friendController.uploadFriend, friendController.editFriend); //แก้ไขข้อมูล
router.delete('/:myfriendId', friendController.deleteFriend); //ลบข้อมูล
router.get('/:myfriendId', friendController.getAllFriend); //แสดงข้อมูล
//แก้ไขข้อมูล
//ตรวจสอบชื่อผู้ใช้ รหัสผ่าน

// export router เพื่อนำไปใช้ที่ server.js
module.exports = router;