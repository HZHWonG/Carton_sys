const mysql = require('mysql');

// 创建数据库连接配置
const dbConfig = {
    host: 'localhost', // 注意：此处应仅为主机名，不包含端口号
    port: 3306, // 默认MySQL端口号
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'carton_management' // 数据库名
};

const pool = mysql.createPool(dbConfig);


// 创建数据库连接
let connection

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);

    // 连接到数据库
    connection.connect(function (err) {
        if (err) {
            console.error('数据库连接失败: ' + err.stack);
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        console.log('数据库已成功连接，连接ID: ' + connection.threadId);
        createTableIfNotExists();
    });

    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

function createTableIfNotExists() {
    const query = `SHOW TABLES LIKE 'cartons'`;
    connection.query(query, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            const createTableQuery = `
                CREATE TABLE cartons (
                    id VARCHAR(255) NOT NULL PRIMARY KEY,
                    customer_name VARCHAR(255) DEFAULT NULL,
                    length DECIMAL(10,2) DEFAULT NULL,
                    width DECIMAL(10,2) DEFAULT NULL,
                    height DECIMAL(10,2) DEFAULT NULL,
                    box_name VARCHAR(255) DEFAULT NULL,
                    material VARCHAR(255) DEFAULT NULL,
                    material_size VARCHAR(255) DEFAULT NULL,
                    remarks TEXT,
                    insert_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            `;
            connection.query(createTableQuery, (error, results) => {
                if (error) throw error;
                console.log('Table "cartons" created successfully');
            });
        }
    });
}

handleDisconnect();



pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});



// 使用MySQL获取所有纸箱
function getCartons(filter = {}, page = 1, pageSize = 10) {
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
    query += ` ORDER BY insert_time DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
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
    return cartonExists(carton.id)
        .then(exists => {
            return new Promise((resolve, reject) => {
                if (exists) {
                    resolve('已存在该编号的纸箱');
                    // return reject(new Error('Carton with this ID already exists.'));
                }
                const query = 'INSERT INTO cartons SET ?';
                connection.query(query, [carton], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve({ carton });
                });
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


function cartonExists(cartonId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM cartons WHERE id = ?';
        connection.query(query, [cartonId], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results[0].count > 0);
        });
    });
}

// 导出数据库连接及函数
module.exports = {
    connection,
    getCartons,
    addCarton,
    updateCarton,
    deleteCarton,
    dbConfig
};
