document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const noteInput = document.getElementById('noteInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterOptions = document.querySelectorAll('.filter-option');

    // ----------------------------------------------------
    // Hàm thêm công việc mới
    // ----------------------------------------------------
    const addTask = () => {
        const taskText = taskInput.value.trim();
        const deadlineDate = deadlineInput.value; 
        const noteText = noteInput.value.trim(); 

        // Kiểm tra ô nhập liệu để đảm bảo không để trống
        if (taskText === "") {
            alert("Vui lòng nhập tên công việc!");
            return;
        }

        // Định dạng ngày hiển thị
        const formattedDate = deadlineDate ? new Date(deadlineDate).toLocaleDateString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        }) : '';

        // Tạo phần tử <li> mới cho công việc
        const listItem = document.createElement('li');
        listItem.setAttribute('data-completed', 'false'); // Thuộc tính lọc
        
        // Sử dụng innerHTML để tạo nội dung cho li
        // Ô tròn (checkbox) và Ghi chú (task-note)
        listItem.innerHTML = `
            <input type="checkbox" class="checkbox-btn">
            <div class="task-details">
                <div class="task-main-info">
                    <p class="task-text">${taskText}</p>
                    <span class="task-deadline">${formattedDate}</span>
                </div>
                ${noteText ? `<p class="task-note">${noteText}</p>` : ''}
            </div>
            <button class="delete-btn">🗑️</button>
        `;
        
        // Thêm listItem vào danh sách
        taskList.appendChild(listItem);

        // Đặt lại ô nhập liệu về trống
        taskInput.value = '';
        deadlineInput.value = '';
        noteInput.value = '';

        // Gán sự kiện cho các phần tử mới được tạo
        attachTaskListeners(listItem);
        
        // Sau khi thêm, đảm bảo danh sách hiện tại được lọc đúng
        filterTasks(document.querySelector('.filter-option.active').dataset.filter);
    };

    // Gắn sự kiện cho nút "Thêm" và phím Enter
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // ----------------------------------------------------
    // Hàm gắn sự kiện cho công việc (Dùng để Đánh dấu và Xóa)
    // ----------------------------------------------------
    const attachTaskListeners = (listItem) => {
        const checkboxBtn = listItem.querySelector('.checkbox-btn');
        const deleteBtn = listItem.querySelector('.delete-btn');

        // Đánh dấu công việc "đã hoàn thành" bằng Ô tròn (checkbox)
        checkboxBtn.addEventListener('change', () => {
            listItem.classList.toggle('completed', checkboxBtn.checked);
            listItem.setAttribute('data-completed', checkboxBtn.checked);
            
            // Lọc lại danh sách sau khi trạng thái thay đổi
            filterTasks(document.querySelector('.filter-option.active').dataset.filter);
        });

        // Xóa công việc
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(listItem);
        });
    }

    // ----------------------------------------------------
    // Yêu cầu: Hàm lọc danh sách công việc
    // ----------------------------------------------------
    const filterTasks = (filterType) => {
        const items = taskList.querySelectorAll('li');
        
        items.forEach(item => {
            const isCompleted = item.getAttribute('data-completed') === 'true';
            
            let shouldShow = false;

            if (filterType === 'all') {
                shouldShow = true;
            } else if (filterType === 'completed') {
                shouldShow = isCompleted;
            } else if (filterType === 'uncompleted') {
                shouldShow = !isCompleted;
            }

            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    // Gắn sự kiện cho các nút Lọc
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Cập nhật trạng thái active cho nút lọc
            filterOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Thực hiện lọc
            filterTasks(option.dataset.filter);
        });
    });
    
    // Khởi tạo: Lọc mặc định khi tải trang
    filterTasks('uncompleted'); 
});
