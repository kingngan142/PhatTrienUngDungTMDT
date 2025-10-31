document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const noteInput = document.getElementById('noteInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterOptions = document.querySelectorAll('.filter-option');
    // Bổ sung: DOM element cho thông báo trống
    const emptyMessage = document.getElementById('emptyMessage');

    // ----------------------------------------------------
    // Hàm thêm công việc mới
    // ----------------------------------------------------
    const addTask = () => {
        const taskText = taskInput.value.trim();
        const deadlineDateValue = deadlineInput.value; 
        const noteText = noteInput.value.trim();

        // Kiểm tra ô nhập liệu để đảm bảo không để trống
        if (taskText === "") {
            alert("Vui lòng nhập tên công việc!");
            return;
        }

        // Định dạng ngày hiển thị
        const formattedDate = deadlineDateValue ? new Date(deadlineDateValue).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }) : '';

        // Tạo phần tử <li> mới cho công việc
        const listItem = document.createElement('li');
        listItem.setAttribute('data-completed', 'false');
        listItem.setAttribute('data-deadline', deadlineDateValue);

        // Sử dụng innerHTML để tạo nội dung cho li
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

        // Sau khi thêm, đảm bảo danh sách hiện tại được lọc đúng và cập nhật thông báo
        filterTasks(document.querySelector('.filter-option.active').dataset.filter);
        updateEmptyMessage();
    };

    // Gắn sự kiện cho nút "Thêm" và phím Enter  
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // ----------------------------------------------------
    // Hàm gắn sự kiện cho công việc 
    // ----------------------------------------------------
    const attachTaskListeners = (listItem) => {
        const checkboxBtn = listItem.querySelector('.checkbox-btn');
        const deleteBtn = listItem.querySelector('.delete-btn');

        // Đánh dấu công việc "đã hoàn thành"
        checkboxBtn.addEventListener('change', () => {
            listItem.classList.toggle('completed', checkboxBtn.checked);
            listItem.setAttribute('data-completed', checkboxBtn.checked);

            // Lọc lại danh sách sau khi trạng thái thay đổi
            filterTasks(document.querySelector('.filter-option.active').dataset.filter);
        });

        // Xóa công việc
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(listItem);
            updateEmptyMessage(); // Cập nhật thông báo sau khi xóa
        });
    }

    // ----------------------------------------------------
    // Kiểm tra công việc quá hạn
    // ----------------------------------------------------
    const isOverdue = (item) => {
        const deadlineValue = item.getAttribute('data-deadline');
        const isCompleted = item.getAttribute('data-completed') === 'true';

        // Nếu không có deadline hoặc đã hoàn thành thì không quá hạn
        if (!deadlineValue || isCompleted) {
            return false;
        }

        // Chuyển ngày hết hạn sang đối tượng Date (cộng thêm 1 ngày) 
        const deadline = new Date(deadlineValue);
        // Đảm bảo so sánh với ngày hiện tại vào lúc 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Quá hạn nếu ngày hiện tại > ngày hết hạn
        return today > deadline;
    };

    // ----------------------------------------------------
    // Thông báo trống
    // ----------------------------------------------------
    const updateEmptyMessage = () => {
        const visibleItems = taskList.querySelectorAll('li[style*="flex"]').length;
        if (taskList.children.length === 0) {
            emptyMessage.textContent = "Chưa có công việc nào được thêm.";
            emptyMessage.style.display = 'block';
        } else if (visibleItems === 0 && taskList.children.length > 0) {
             emptyMessage.textContent = "Không có công việc nào phù hợp với bộ lọc hiện tại.";
             emptyMessage.style.display = 'block';
        }
        else {
            emptyMessage.textContent = "";
            emptyMessage.style.display = 'none';
        }
    };


    // ----------------------------------------------------
    // Hàm lọc danh sách công việc
    // ----------------------------------------------------
    const filterTasks = (filterType) => {
        const items = taskList.querySelectorAll('li');

        items.forEach(item => {
            const isCompleted = item.getAttribute('data-completed') === 'true';
            const itemIsOverdue = isOverdue(item); 

            let shouldShow = false;

            if (filterType === 'all') {
                shouldShow = true;
            } else if (filterType === 'completed') {
                // Hiển thị nếu Đã hoàn thành
                shouldShow = isCompleted;
            } else if (filterType === 'uncompleted') {
                // Hiển thị nếu Chưa hoàn thành và Không quá hạn
                shouldShow = !isCompleted && !itemIsOverdue;
            } else if (filterType === 'overdue') {
                // Hiển thị nếu Quá hạn
                shouldShow = itemIsOverdue;
            }

            // Ẩn/hiện công việc
            item.style.display = shouldShow ? 'flex' : 'none';

            item.classList.toggle('overdue', itemIsOverdue);
        });

        // Cập nhật thông báo sau khi lọc
        updateEmptyMessage();
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
    updateEmptyMessage();
});
