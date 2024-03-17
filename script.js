// script.js

// 获取纸箱列表
async function getCartons() {
    const response = await fetch('/cartons');
    const cartons = await response.json();
    const cartonsTable = document.getElementById('cartonsTable');
    cartonsTable.innerHTML = '';
    for (const carton of cartons) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${carton.id}</td>
            <td>${carton.customerName}</td>
            <td>${carton.length}</td>
            <td>${carton.width}</td>
            <td>${carton.height}</td>
            <td>${carton.boxName}</td>
            <td>${carton.material}</td>
            <td>${carton.materialSize}</td>
            <td>${carton.remarks}</td>
            <td><button onclick="deleteCarton(${carton.id})">删除</button></td>
        `;
        cartonsTable.appendChild(row);
    }
}

// 添加新纸箱
async function saveCarton(event) {
    event.preventDefault();
    const id = document.getElementById('id').value;
    const customerName = document.getElementById('customerName').value;
    const length = document.getElementById('length').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const boxName = document.getElementById('boxName').value;
    const material = document.getElementById('material').value;
    const materialSize = document.getElementById('materialSize').value;
    const remarks = document.getElementById('remarks').value;
    const carton = { id, customerName, length, width, height, boxName, material, materialSize, remarks };
    const response = await fetch('/cartons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carton)
    });
    const savedCarton = await response.json();
    getCartons();
}

// 删除纸箱
async function deleteCarton(id) {
    const response = await fetch(`/cartons/${id}`, {
        method: 'DELETE'
    });
    getCartons();
}

// 搜索纸箱
async function searchCartons() {
    const searchValue = document.getElementById('search').value;
    const response = await fetch(`/cartons?search=${searchValue}`);
    const cartons = await response.json();
    const cartonsTable = document.getElementById('cartonsTable');
    cartonsTable.innerHTML = '';
    for (const carton of cartons) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${carton.id}</td>
            <td>${carton.customerName}</td>
            <td>${carton.length}</td>
            <td>${carton.width}</td>
            <td>${carton.height}</td>
            <td>${carton.boxName}</td>
            <td>${carton.material}</td>
            <td>${carton.materialSize}</td>
            <td>${carton.remarks}</td>
            <td><button onclick="deleteCarton(${carton.id})">删除</button></td>
        `;
        cartonsTable.appendChild(row);
    }
}

// 在页面加载时获取纸箱列表
window.onload = getCartons;

// 监听表单提交事件
const cartonForm = document.getElementById('cartonForm');
cartonForm.addEventListener('submit', saveCarton);
