App = {
  loading: false,
  todoList: null,
  account: null,

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        alert('User denied MetaMask access');
      }
    } else {
      alert('Please install MetaMask!');
    }
  },

  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    $('#account').text(App.account);
  },

  loadContract: async () => {
    const data = await fetch('TodoList.json').then(res => res.json());
    const networkId = await web3.eth.net.getId();
    const address = data.networks[networkId]?.address;
    if (!address) {
      alert('Contract not deployed on the detected network.');
      return;
    }
    App.todoList = new web3.eth.Contract(data.abi, address);
  },

  render: async () => {
    if (App.loading) return;
    App.setLoading(true);
    await App.renderTasks();
    App.setLoading(false);
  },

  renderTasks: async () => {
    // Clear current task lists
    $('#taskList, #completedTaskList').empty();
    const taskCount = await App.todoList.methods.taskCount().call();
    
    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.methods.tasks(i).call();
      const $taskItem = $('.taskTemplate li').clone().show();
      
      $taskItem.find('.content').text(task.content);
      $taskItem.find('input')
        .prop('name', task.id)
        .prop('checked', task.completed)
        .on('click', App.toggleCompleted);
      
      // Append the task to the appropriate list
      if (task.completed) {
        $('#completedTaskList').append($taskItem);
      } else {
        $('#taskList').append($taskItem);
      }
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $('#newTask').val().trim();
    if (content) {
      try {
        // Send transaction and wait for confirmation
        await App.todoList.methods.createTask(content)
          .send({ from: App.account });
        $('#newTask').val('');
        console.log('Task created successfully!');
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Please try again.');
      }
    }
    // Re-render tasks without reloading the page
    await App.render();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    try {
      // Send transaction to toggle task and wait for confirmation
      await App.todoList.methods.toggleCompleted(taskId)
        .send({ from: App.account });
      console.log('Task updated successfully!');
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Error updating task. Please try again.');
    }
    // Update the task list after transaction confirmation
    await App.render();
  },

  setLoading: (bool) => {
    App.loading = bool;
    $('#loader').toggle(bool);
    $('#content').toggle(!bool);
  }
};

$(() => $(window).on('load', App.load));
