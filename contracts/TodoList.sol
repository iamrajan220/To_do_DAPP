pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        uint timestamp;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed,
        uint timestamp
    );

    event TaskToggled(
        uint id,
        bool completed
    );

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, block.timestamp);
        emit TaskCreated(taskCount, _content, false, block.timestamp);
    }

    function toggleCompleted(uint _taskId) public {
        Task storage task = tasks[_taskId];
        task.completed = !task.completed;
        emit TaskToggled(_taskId, task.completed);
    }
}
