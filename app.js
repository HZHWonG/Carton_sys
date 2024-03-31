const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析JSON请求体
app.use(express.json()); // 确保你有一个中间件来解析JSON请求体

// 获取所有cartons的API
app.get('/cartons', async (req, res) => {
    try {
        const filter = req.query;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const cartons = await db.getCartons(filter, page, pageSize);
        res.json(cartons);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// 添加新carton的API
app.post('/cartons', async (req, res) => {
    try {
        const carton = await db.addCarton(req.body);
        res.status(201).json(carton);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// 更新carton的API
app.put('/cartons/:id', async (req, res) => {
    try {
        const updated = await db.updateCarton(req.params.id, req.body);
        if (updated) {
            res.json({ message: 'Carton updated successfully' });
        } else {
            res.status(404).send('Carton not found');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// 删除carton的API
app.delete('/cartons/:id', async (req, res) => {
    try {
        const deleted = await db.deleteCarton(req.params.id);
        if (deleted) {
            res.json({ message: 'Carton deleted successfully' });
        } else {
            res.status(404).send('Carton not found');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
