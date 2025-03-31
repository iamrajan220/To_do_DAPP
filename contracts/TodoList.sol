// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        uint timestamp;
        string role; // "chef" or "kp"
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed,
        uint timestamp,
        string role
    );

    event TaskToggled(
        uint id,
        bool completed
    );

   constructor() {
        // Create two default tasks for Chef
        createTask("Chef Task 1: Prepare ingredients", "chef");
        createTask("Chef Task 2: Cook main course", "chef");
        // Create two default tasks for Kitchen Porter (KP)
        createTask("KP Task 1: Wash dishes", "kp");
        createTask("KP Task 2: Clean kitchen", "kp");
    }


    function createTask(string memory _content, string memory _role) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, block.timestamp, _role);
        emit TaskCreated(taskCount, _content, false, block.timestamp, _role);
    }

    function toggleCompleted(uint _taskId) public {
        Task storage task = tasks[_taskId];
        task.completed = !task.completed;
        emit TaskToggled(_taskId, task.completed);
    }
}
