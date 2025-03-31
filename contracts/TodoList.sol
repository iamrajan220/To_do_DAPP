// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        uint timestamp;
        string role;        // "chef" or "kp" - for whom the task is intended
        string completedBy; // "chef" or "kp" - who actually completed it
    }

    mapping(uint => Task) public tasks;

    /**
     * We include "role" and "completedBy" in both events to see them
     * right in Ganache's logs when a task is created or toggled.
     */
    event TaskCreated(
        uint id,
        string content,
        bool completed,
        uint timestamp,
        string role,
        string completedBy
    );

    event TaskToggled(
        uint id,
        string content,
        bool completed,
        uint timestamp,
        string role,
        string completedBy
    );

    constructor() {
        // Default Chef Tasks
        createTask("Chef Task 1: Prepare ingredients", "chef");
        createTask("Chef Task 2: Cook main course", "chef");
        createTask("Chef Task 3: Garnish dishes", "chef");
        createTask("Chef Task 4: Manage food inventory", "chef");
        createTask("Chef Task 5: Prepare dessert", "chef");

        // Default Kitchen Porter (KP) Tasks
        createTask("KP Task 1: Wash dishes", "kp");
        createTask("KP Task 2: Clean kitchen surfaces", "kp");
        createTask("KP Task 3: Take out trash", "kp");
        createTask("KP Task 4: Mop the floors", "kp");
        createTask("KP Task 5: Organize dishware", "kp");
    }

    // Creates a new task. 
    function createTask(string memory _content, string memory _role) public {
        taskCount++;
        tasks[taskCount] = Task({
            id: taskCount,
            content: _content,
            completed: false,
            timestamp: block.timestamp,
            role: _role,
            completedBy: ""
        });

        // "completedBy" is empty at creation because it's not done yet
        emit TaskCreated(
            taskCount,
            _content,
            false,
            block.timestamp,
            _role,
            ""
        );
    }

    /**
     * Toggles the task's completed status and records who completed it.
     * If the task is being reverted to incomplete, set "completedBy" to an empty string.
     */
    function toggleCompleted(uint _taskId, string memory _completedBy) public {
        Task storage task = tasks[_taskId];
        task.completed = !task.completed;

        if (task.completed) {
            task.completedBy = _completedBy;
        } else {
            task.completedBy = "";
        }

        emit TaskToggled(
            task.id,
            task.content,
            task.completed,
            task.timestamp,
            task.role,
            task.completedBy
        );
    }
}
