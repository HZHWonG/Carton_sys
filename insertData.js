const mysql = require('mysql');
const faker = require('faker');

// 配置您的数据库连接
const connection = mysql.createConnection({
    host: 'localhost', // 注意：此处应仅为主机名，不包含端口号
    port: 3306, // 默认MySQL端口号
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'carton_management' // 数据库名
});

connection.connect(err => {
    if (err) {
        return console.error('连接数据库时发生错误: ' + err.message);
    }
    console.log('成功连接到数据库');
});

const insertData = () => {
    for (let i = 0; i < 100; i++) {
        // 使用faker生成随机数据
        const id = generateCustomId();
        const customerName = faker.name.findName(); // 随机客户名
        const length = faker.datatype.number({ min: 1, max: 100 }); // 随机数值
        const width = faker.datatype.number({ min: 1, max: 100 });
        const height = faker.datatype.number({ min: 1, max: 100 });
        const boxName = faker.commerce.productName(); // 随机盒子名
        const material = faker.commerce.productMaterial(); // 随机材料
        const materialSize = faker.random.word(); // 随机单词作为材料尺寸
        const remarks = faker.lorem.sentence(); // 随机句子作为备注

        const sql = 'INSERT INTO cartons (id,customer_name, length, width, height, box_name, material, material_size, remarks) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)';

        // 执行插入
        connection.query(sql, [id,customerName, length, width, height, boxName, material, materialSize, remarks], (error, results) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('插入成功，ID:', results.insertId);
        });
    }

    connection.end(); // 所有插入操作完成后关闭连接
};


function generateCustomId() {
    // 生成一个从A到Z的随机大写字母
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    // 生成一个两位数的随机数字，可以是从00到99
    const randomNumbers = ('0' + Math.floor(Math.random() * 100)).slice(-2);
    // 组合大写字母和数字作为ID
    return randomLetter + randomNumbers;
}

insertData();
