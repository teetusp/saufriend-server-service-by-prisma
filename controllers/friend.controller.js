// จัดการเรื่อง อัปโหลดไฟล์ โดย multer
// จัดการเรื่องการทํางาน CRUD กับฐานข้อมูล โดย prisma

// require package ที่ต้องใช้ในการอัปโหลดไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// require package ที่ต้องใช้ในการทํางานกับฐานข้อมูล
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน------------------------
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/myfriend');
    },
    filename: (req, file, cb) => {
        cb(null, 'myfriend_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadFriend = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb('Give proper files formate to upload');
    }
}).single('myfriendImage');

//สร้างฟังก์ชัน Create/Insert เพื่อเพิ่มข้อมูลลงตารางในฐานข้อมูล----------------
exports.createFriend = async (req, res) => {
    try {
        //เอาข้อมูลที่ส่งมาจาก client/user เพิ่มลงตารางในฐานข้อมูล
        const result = await prisma.myfriend_tb.create({ //.create คือ การเพิ่ม ss
            data: {
                myfriendFullname: req.body.myfriendFullname,
                myfriendPhone: req.body.myfriendPhone,
                myfriendAge: parseInt(req.body.myfriendAge),
                myfriendMajor: req.body.myfriendMajor,
                myfriendImage: req.file ? req.file.path.replace("images\\myfriend\\", "") : "",
                userId: parseInt(req.body.userId),
            }
        });

        //ส่งผลการทำงานกลับไปยัง client/user
        res.status(201).json({
            message: 'Insert data successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

// กรณีมีการอัปโหลดไฟล์ (โดยที่ผู้ใช้จะเลือกไฟล์หรือไม่เลือกไฟล์เพื่ออัปโหลดก็ได้)
// (แต่ถ้าไม่เลือกไฟล์ที่อัปโหลดจะบันทึกเป็นค่าว่าง)
exports.editFriend = async (req, res) => {
    try {
        let data = {
            ...req.body,
            myfriendAge: parseInt(req.body.myfriendAge),
            userId: parseInt(req.body.userId)
        }

        if (req.file) {
            //หากมีการแก้ไขรูป ให้ลบรูปเดิมทิ้ง
            //- ค้นหารูปเดิมที่มีอยู่
            const friendData = await prisma.myfriend_tb.findUnique({
                where: {
                    myfriendId: parseInt(req.params.myfriendId)
                }
            })
            //แก้ไขรูป
            data.myfriendImage = req.file.path.replace("images\\myfriend\\", "")
        } else {
            delete data.myfriendImage
        }

        const result = await prisma.myfriend_tb.update({
            data: data,
            where: {
                myfriendId: parseInt(req.params.myfriendId)
            }
        })
        res.status(200).json({
            message: 'Update data successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({ message: `ERROR: ${err}` });
    }
}

//ฟังก์ชันลบข้อมูล myfriend_tb
exports.deleteFriend = async (req, res) => {
    try {
        const result = await prisma.myfriend_tb.delete({
            where: {
                myfriendId: parseInt(req.params.myfriendId)
            }
        })
        res.status(200).json({
            message: 'Delele data successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}
exports.getAllFriend = async (req, res) => {
    try{
        const result = await prisma.myfriend_tb.findMany({
            where: {
                myfriendId: parseInt(req.params.myfriendId)
            }
        })
        if(result){
            res.status(200).json({
                message: 'Get have data successfully',
                data: result
            });            
        }else{
            res.status(404).json({ 
                message: 'Not have data' 
            });
        }
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}
