// จัดการเรื่องเส้นทางเพื่อกำหนด endpoint สำหรับ frontend ***
// ในการเรียกใช้ controller เพื่อการทำงาน CRUD กับฐานข้อมูล และการอัปโหลดไฟล์

// require package ที่ต้องใช้ในการกำหนดเส้นทาง (route)
const express = require('express');

// require controller เพื่อจะใช้งาน
const userController = require('./../controllers/user.controller.js');

// สร้าง router จาก express เพื่อจัดการเส้นทาง
const router = express.Router();

// กำหนดเส้นทาง และการเรียกใช้ controller
//เพิ่มข้อมูล
router.post('/', userController.uploadUser, userController.createUser); 
//แก้ไขข้อมูล
//ตรวจสอบชื่อผู้ใช้ รหัสผ่าน

// export router เพื่อนำไปใช้ที่ server.js
module.exports = router;