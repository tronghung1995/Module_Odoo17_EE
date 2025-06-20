/** @odoo-module **/

import { useService } from '@web/core/utils/hooks';
import { registry } from '@web/core/registry';
import { UserSelector } from "./userselector";
const { Component, useState, onWillStart, useRef } = owl;

export class TodoTask extends Component {
    setup() {
        this.state = useState({
            task: {name: "", color: "", is_done: false, description: ""},
            taskList: [],
            isEdit: false,
            activeId: false,

            pageSize: 10,
            totalRecords: 100,
            offset: 0,
        });

        this.domain = []
        this.orm = useService("orm")
        this.model = 'todo.task'
        this.searchInput = useRef("search-input")

        this.state.pageStartInput = 1
        this.state.pageEndInput = this.state.pageSize

        this.state.pageSize = 10;         // Hiển thị trên mỗi trang

        this.state.historyStack = []  // Stack để lưu lịch sử trang

        this.state.initialPageSize = 10 // luôn giữ cố định
        this.state.pageSize = this.state.initialPageSize

        this.sortField = null;
        this.sortAsc = true;

        onWillStart(async () => {
            await this.loadTasks();

        })
    }

    addTask(){
        this.resetForm()
        this.state.isEdit = false
        this.state.activeId = false
    }

    editTask(task){
        this.state.task = task
        this.state.isEdit = true
        this.state.activeId = task.id
    }

    async deleteTask(task){
        await this.orm.unlink(this.model,[task.id])
        await this.loadTasks();
    }

    async saveTask(){
        if (this.state.isEdit){
            await this.orm.write(this.model, [this.state.activeId], this.state.task)
        }else{
            await this.orm.create(this.model, [this.state.task])
            this.resetForm()
        }

        await this.loadTasks();
    }

    async searchTasks() {
        const text = this.searchInput.el.value;
        this.state.offset = 0;
        this.domain = text ? [["name", "ilike", text]] : [];
    
        this.state.historyStack = [];  // 🧹 Reset lịch sử khi search mới
    
        await this.loadTasks();
    }

    async updateColor(e, task){
        await this.orm.write(this.model, [task.id], {color: e.target.value})
        await this.loadTasks();
    }

    async updateState(e, task){
        await this.orm.write(this.model, [task.id], {is_done: e.target.checked})
        await this.loadTasks();
    }

    resetForm(){
        this.state.task = {name: "", color: "#000000", is_done: false, description: ""}
    }

    goPrevPage() {
        const currentStart = this.state.pageStartInput; // vị trí dòng bắt đầu hiện tại
        const initialPageSize = this.state.initialPageSize;
    
        // Tính offset mới
        let newOffset = currentStart - initialPageSize - 1;
        if (newOffset < 0) newOffset = 0;
    
        this.state.offset = newOffset;
        this.state.pageSize = initialPageSize;
        this.loadTasks();
    }
    
    goNextPage() {
        const nextOffset = this.state.offset + this.state.pageSize;
        if (nextOffset < this.state.totalRecords) {
            // 🧠 Lưu trạng thái hiện tại
            this.state.historyStack.push({
                offset: this.state.offset,
                pageSize: this.state.pageSize,
            });
    
            const remain = this.state.totalRecords - nextOffset;
            const newPageSize = remain < this.state.pageSize ? remain : this.state.pageSize;
    
            this.state.offset = nextOffset;
            this.state.pageSize = newPageSize;
    
            this.loadTasks();
        }
    }

    async loadTasks() {
        const offset = this.state.offset;
        const limit = this.state.pageSize;
        const domain = this.domain || [];
        
        const result = await this.orm.searchRead(this.model, domain, ["name", "color", "is_done", "description"], {
            offset,
            limit,
        });
    
        const total = await this.orm.searchCount(this.model, domain);
    
        this.state.taskList = result;
        this.state.totalRecords = total;
    
        this.state.pageStartInput = result.length ? offset + 1 : 0;
        this.state.pageEndInput = offset + result.length;

    }

    onPageRangeKeydown(event) {
        if (event.key === "Enter") {
            const start = parseInt(this.state.pageStartInput);
            const end = parseInt(this.state.pageEndInput);
            const total = this.state.totalRecords;
    
            if (
                !isNaN(start) &&
                !isNaN(end) &&
                start >= 1 &&
                end >= start
            ) {
                this.state.historyStack.push({
                    offset: this.state.offset,
                    pageSize: this.state.pageSize,
                });
            
                this.state.offset = start - 1;
                this.state.pageSize = end - start + 1;
                this.loadTasks();
            } else {
                alert("Khoảng không hợp lệ!");
            }
        }
    }

    onPageStartInputChange(event) {
        this.state.pageStartInput = parseInt(event.target.value);
    }
    
    onPageEndInputChange(event) {
        this.state.pageEndInput = parseInt(event.target.value);
    }

    async sortTasksBy(field) {
        // Nếu đang sort cùng một field
        if (this.sortField === field) {
            if (this.sortAsc === true) {
                this.sortAsc = false; // ASC → DESC
            } else {
                // DESC → Clear sort
                this.sortField = null;
                this.sortAsc = true;
            }
        } else {
            this.sortField = field;
            this.sortAsc = true; // Lần đầu luôn ASC
        }
    
        const order = this.sortField ? `${this.sortField} ${this.sortAsc ? 'asc' : 'desc'}` : false;
    
        const result = await this.orm.searchRead(
            this.model,
            this.domain,
            ["name", "color", "is_done", "description"],
            {
                offset: this.state.offset,
                limit: this.state.pageSize,
                ...(order ? { order } : {}), // Chỉ truyền order nếu cần
            }
        );
    
        this.state.taskList = result;
    }

}

TodoTask.template = 'module_javascript.TodoTask';
registry.category("actions").add("module_javascript.action_todo_task", TodoTask);


export class TodoTask1 extends TodoTask {
    static template = "module_javascript.TodoTask1";
    static components = { UserSelector };

    setup() {
        super.setup();

        this.userSelect = useRef("userSelect");

        this.selectedUserId = null;
        this.onChangeUser = (userId) => {
            console.log("Selected User ID:", userId);
            this.selectedUserId = userId;
        };
    }
    
    async onSearch() {
        const userId = this.selectedUserId;
        const domain = userId ? [["create_uid", "=", userId]] : [];
        const fields = ["name", "description", "is_done", "color", "create_uid"];
    
        this.state.taskList = await this.orm.searchRead("todo.task", domain, fields);
    
        // Optional: Reset sorting state nếu cần
        this.sortField = null;
        this.sortAsc = true;
    }

}

registry.category("actions").add("module_javascript.action_todo_task1", TodoTask1);