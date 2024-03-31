// script.js

async function handleTable(response) {
    const cartons = await response.json();
    const cartonsTable = document.getElementById('cartonsTable');
    const tbody = cartonsTable.querySelector('tbody');
    tbody.innerHTML = '';
    for (const carton of cartons) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${carton.id}</td>
            <td>${carton.customer_name}</td>
            <td>${carton.length}</td>
            <td>${carton.width}</td>
            <td>${carton.height}</td>
            <td>${carton.box_name}</td>
            <td>${carton.material}</td>
            <td>${carton.material_size}</td>
            <td>${carton.remarks}</td>
            <td>
            <button onclick="deleteCarton('${carton.id}')">删除</button>
            <button onclick="editCarton('${carton.id}', '${carton.customer_name}', '${carton.length}', '${carton.width}', '${carton.height}', '${carton.box_name}', '${carton.material}', '${carton.material_size}', '${carton.remarks}')">编辑</button>
            </td>
            
        `;
        tbody.appendChild(row);
    }
}

// 获取纸箱列表
async function getCartons(page = 1, pageSize = 10) {
    const response = await fetch(`http://localhost:3000/cartons?page=${page}&pageSize=${pageSize}`);
    await handleTable(response);
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
    const carton = { id, customer_name: customerName, length, width, height, box_name: boxName, material, material_size: materialSize, remarks };
    const response = await fetch('http://localhost:3000/cartons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carton)
    }).catch(error => alert(error))
    const existed_tip = await response.json();
    if (typeof existed_tip === 'string') {
        alert(existed_tip);
    }else{
        alert('添加成功！')
    }
    getCartons();
}

// 删除纸箱
async function deleteCarton(id) {
    const response = await fetch(`http://localhost:3000/cartons/${id}`, {
        method: 'DELETE'
    });
    if(response.ok) { // 检查HTTP响应状态
        alert(id + '删除成功');
        getCartons(); // 成功后重新加载纸箱列表
    } else {
        alert('删除失败'); // 或者根据实际情况提供更具体的错误处理
    }
}


 async function editCarton(id, customerName, length, width, height, boxName, material, materialSize, remarks) {
    // 填充弹窗输入框
     document.getElementById('editId').value = id;
     document.getElementById('editCustomerName').value = customerName;
     document.getElementById('editLength').value = length;
     document.getElementById('editWidth').value = width;
     document.getElementById('editHeight').value = height;
     document.getElementById('editBoxName').value = boxName;
     document.getElementById('editMaterial').value = material;
     document.getElementById('editMaterialSize').value = materialSize;
     document.getElementById('editRemarks').value = remarks;
     document.getElementById('editModal').style.display = 'block';
}

function closeDialog() {
    document.getElementById('editModal').style.display = 'none';
}
// 搜索纸箱
async function searchCartons() {
    const searchId = document.getElementById('searchId').value;
    const searchCustomerName = document.getElementById('searchCustomerName').value;
    const searchLength = document.getElementById('searchLength').value;
    const searchWidth = document.getElementById('searchWidth').value;
    const searchHeight = document.getElementById('searchHeight').value;
    const searchParams = new URLSearchParams();
    if (searchId) {
        searchParams.append('id', searchId);
    }
    if (searchCustomerName) {
        searchParams.append('customerName', searchCustomerName);
    }
    if (searchLength) {
        searchParams.append('length', searchLength);
    }
    if (searchWidth) {
        searchParams.append('width', searchWidth);
    }
    if (searchHeight) {
        searchParams.append('height', searchHeight);
    }
    const response = await fetch(`http://localhost:3000/cartons?${searchParams.toString()}`);
    await handleTable(response);
}

let currentPage = 1;
const pageSize = 10;

window.prevPage = async function() {
    if (currentPage > 1) {
        currentPage--;
        await getCartons(currentPage, pageSize);
    }else {
        alert('已经是第一页了');
    }
}

window.nextPage  = async function() {
    const response = await fetch(`http://localhost:3000/cartons?page=${currentPage + 1}&pageSize=${pageSize}`);
    const cartons = await response.json();
    if (cartons.length < 1) {
        alert('已经是最后一页了');
    } else {
        currentPage++;
        await getCartons(currentPage, pageSize);
    }
}

// 在页面加载时获取纸箱列表
window.onload = getCartons;

// 监听表单提交事件
const cartonForm = document.getElementById('cartonForm');
cartonForm.addEventListener('submit', saveCarton);

// 监听搜索表单提交事件
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchCartons();
});


const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;
    const customerName = document.getElementById('editCustomerName').value;
    const length = document.getElementById('editLength').value;
    const width = document.getElementById('editWidth').value;
    const height = document.getElementById('editHeight').value;
    const boxName = document.getElementById('editBoxName').value;
    const material = document.getElementById('editMaterial').value;
    const materialSize = document.getElementById('editMaterialSize').value;
    const remarks = document.getElementById('editRemarks').value;
    const carton = { id, customer_name: customerName, length, width, height, box_name: boxName, material, material_size: materialSize, remarks };
    await fetch(`http://localhost:3000/cartons/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carton)
    });
    document.getElementById('editModal').style.display = 'none';
    getCartons();
});

