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
        cb(null, 'images/user');
    },
    filename: (req, file, cb) => {
        cb(null, 'user_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadUser = multer({
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
}).single('userImage');

//สร้างฟังก์ชัน Create/Insert เพื่อเพิ่มข้อมูลลงตารางในฐานข้อมูล----------------
exports.createUser = async (req, res) => {
    try {
        //เอาข้อมูลที่ส่งมาจาก client/user เพิ่มลงตารางในฐานข้อมูล
        const result = await prisma.user_tb.create({ //.create คือ การเพิ่ม
            data: {
                userFullname: req.body.userFullname,
                userEmail: req.body.userEmail,
                userName: req.body.userName,
                userPassword: req.body.userPassword,
                userImage: req.file ? req.file.path.replace("images\\user\\", "") : ""
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

//สร้างฟังก์ชันเพื่อตรวจสอบการเข้าใช้งานโดยการตรวจสอบชื่อผู้ใช้ userName และรหัสผ่าน userPassword----------------
exports.checkLoginUser = async (req, res) => {
    try {
        const result = await prisma.user_tb.findFirst({
            where: {
                userName: req.body.userName,
                userPassword: req.body.userPassword
            }
        });

        if (result) {
            res.status(200).json({
                message: 'Login successfully',
                data: result
            });
        } else {
            res.status(404).json({
                message: 'Username or password is incorrect'
            });
        }
    } catch (err) {
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}
// exports.editUser = async (req, res) => {
//     try {
//         const result = await prisma.user_tb.update({
//             where: {
//                 userId: parseInt(req.params.userId)
//             },
//             data: {
//                 userFullname: req.body.userFullname,
//                 userEmail: req.body.userEmail,
//                 userName: req.body.userName,
//                 userPassword: req.body.userPassword,
//                 userImage: req.file ? req.file.path.replace("images\\user\\", "") : req.body.userImage
//             }
//         });
//         if (result) {
//             if (req.file) {
//                 fs.unlink(`images/user/${req.body.userImage}`, (err) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                 });
//             }
//             res.status(200).json({
//                 message: 'Update successfully',
//                 data: result
//             });
//         }
//     } catch (err) {
//         res.status(500).json({ message: `ERROR:  ${err}` });
//     }
// }
exports.editUser = async (req, res) => {
    try{
        let data = {
            ...req.body
        }

        if(req.file){
            //หากมีการแก้ไขรูป ให้ลบรูปเดิมทิ้ง
            //- ค้นหารูปเดิมที่มีอยู่
            const userData = await prisma.user_tb.findUnique({
                where: {
                    userId: parseInt(req.params.userId)
                }
            })

            //- ลบไฟล์เดิมที่มีอยู่ โดยตรวจสอบก่อนว่ามีรูปเดิมอยู่ก่อนไหม
            if(userData.userImage){
                const oldImage = path.join(__dirname, `./../images/user/${userData.userImage}`); // ตัวแปรเก็บ path ของรูปเดิม
                try {
                    fs.unlinkSync(oldImage); //ลบทิิ้ง
                } catch (err) {
                    console.log(err);
                }
            }

            //แก้ไขรูป
            data.userImage = req.file.path.replace("images\\user\\","")
        }else{
            delete data.userImage
        }    

        const result = await prisma.user_tb.update({
            data: data,
            where: {
                userId: parseInt(req.params.userId)
            }
        })
        res.status(200).json({
            message: 'Update data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR: ${err}` });
    }
}

 exports.delRun = async (req, res) => {
    try{
        const result = await run.destroy({
            where: {
                runId: req.params.runId
            }
        })
        res.status(200).json({
            message: 'Delele data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}
