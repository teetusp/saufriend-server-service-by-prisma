const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.route.js')
const friendRouter = require('./routes/friend.route.js')

require('dotenv').config();

const app = express(); //สร้าง Web Server

const PORT = process.env.PORT || 6666; //เรียกใช้ค่า PORT จาก .env

//ใช้ตัว middleware ในการจัดการ
//การเรียกใช้งานข้าม domain
app.use(cors());
//ข้อมูล JSON จาก client/user
app.use(express.json());
//เส้นทาง
app.use('/user',userRouter)
app.use('/friend',friendRouter)

//เขียนคำสั่งเพื่อเทส เพื่อให้ client/user เข้าถึง resource ใน server
app.get('/', (req, res) => {
    res.json({
        message: `Welcome to backend run server service`
    })
})

//คำสั่งที่ใช้เปิด server เพื่อให้ client/user เข้าถึง resource ใน server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} .....`);
})