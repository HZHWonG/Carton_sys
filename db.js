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
const connection = mysql.createConnection(dbConfig);

// 连接到数据库
connection.connect(error => {
  if (error) {
    console.error('数据库连接失败: ' + error.stack);
    return;
  }
  console.log('数据库已成功连接，连接ID: ' + connection.threadId);
});

// 使用MySQL获取所有纸箱
function getCartons(filter) {
    let query = 'SELECT * FROM cartons';
    if (filter) {
        const { id, customer_name, length, width, height } = filter;
        query += ' WHERE';
        if (id) {
            query += ` id = '${id}' AND`;
        }
        if (customer_name) {
            query += ` customer_name = '${customer_name}' AND`;
        }
        if (length) {
            query += ` length = ${length} AND`;
        }
        if (width) {
            query += ` width = ${width} AND`;
        }
        if (height) {
            query += ` height = ${height} AND`;
        }
        query = query.slice(0, -4); // Remove the last 'AND'
    }
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// 使用MySQL添加一个新纸箱
function addCarton(carton) {
    return new Promise((resolve, reject) => {
        const {cartonData } = carton; // Extract the ID from the carton object
        const query = 'INSERT INTO cartons SET ?';
        connection.query(query, cartonData, (error, results) => {
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
