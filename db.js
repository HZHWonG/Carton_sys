const mysql = require('mysql');

// 创建数据库连接配置
const dbConfig = {
    host: 'localhost', // 注意：此处应仅为主机名，不包含端口号
    port: 3306, // 默认MySQL端口号
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'carton_management' // 数据库名
};


// 创建数据库连接
let connection

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);

    // 连接到数据库
    connection.connect(function (err) {
        if (err) {
            console.error('数据库连接失败: ' + error.stack);
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        console.log('数据库已成功连接，连接ID: ' + connection.threadId);
    });

    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

const pool = mysql.createPool({
    host: 'localhost', // 注意：此处应仅为主机名，不包含端口号
    port: 3306, // 默认MySQL端口号
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'carton_management' // 数据库名
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});



// 使用MySQL获取所有纸箱
function getCartons(filter = {}) {
    let query = 'SELECT * FROM cartons';
    const conditions = [];
    if (filter.id) {
        conditions.push(`id = '${filter.id}'`);
    }
    if (filter.customerName) {
        conditions.push(`customer_name = '${filter.customerName}'`);
    }
    if (filter.length) {
        conditions.push(`length = ${filter.length}`);
    }
    if (filter.width) {
        conditions.push(`width = ${filter.width}`);
    }
    if (filter.height) {
        conditions.push(`height = ${filter.height}`);
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// 使用MySQL添加一个新纸箱
function addCarton(carton) {
    return new Promise((resolve, reject) => {
        // const { cartonData } = carton; // Extract the ID from the carton object
        const query = 'INSERT INTO cartons SET ?';
        connection.query(query, [carton], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ carton });
        });
    });
}

// 使用MySQL更新纸箱信息
function updateCarton(id, updates) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE cartons SET ? WHERE id = ?';
        connection.query(query, [updates, id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.affectedRows > 0);
        });
    });
}

// 使用MySQL删除纸箱
function deleteCarton(id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM cartons WHERE id = ?';
        connection.query(query, id, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.affectedRows > 0);
        });
    });
}

// 导出数据库连接及函数
module.exports = {
    connection,
    getCartons,
    addCarton,
    updateCarton,
    deleteCarton
};
