const App = {
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
    $('#chefTasks, #chefTasksCompleted, #kpTasks, #kpTasksCompleted').empty();
    const taskCount = await App.todoList.methods.taskCount().call();

    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.methods.tasks(i).call();
      const $taskItem = $('.taskTemplate li').clone().show();

      // Task content
      $taskItem.find('.content').text(task.content);

      // If task is completed, add a style
      if (task.completed) {
        $taskItem.find('.content').addClass('completed-task');
      }

      // Show who completed it if it is completed
      if (task.completed && task.completedBy) {
        $taskItem.append(`<small class=\"ms-2\">(Completed by: ${task.completedBy})</small>`);
      }

      // Checkbox toggles completion
      $taskItem.find('input')
        .prop('name', task.id)
        .prop('checked', task.completed)
        .on('click', App.toggleCompleted);

      // Append to correct list (chef or kp), incomplete or complete
      if (task.role === 'kp') {
        if (task.completed) {
          $('#kpTasksCompleted').append($taskItem);
        } else {
          $('#kpTasks').append($taskItem);
        }
      } else { // 'chef'
        if (task.completed) {
          $('#chefTasksCompleted').append($taskItem);
        } else {
          $('#chefTasks').append($taskItem);
        }
      }
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $('#newTask').val().trim();
    // Retrieve role from localStorage (set during login)
    const role = localStorage.getItem('userRole');

    if (content && role) {
      try {
        // Create the task with the user's role (chef or kp)
        await App.todoList.methods.createTask(content, role).send({ from: App.account });
        $('#newTask').val(''); // Clear input
        console.log('Task created successfully!');
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Please try again.');
      }
    } else {
      alert('Task content or user role missing');
    }
    await App.render();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    const userRole = localStorage.getItem('userRole'); // "chef" or "kp"
    try {
      // 'toggleCompleted(uint, string)' in contract
      await App.todoList.methods.toggleCompleted(taskId, userRole).send({ from: App.account });
      console.log('Task updated successfully!');
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Error updating task. Please try again.');
    }
    await App.render();
  },
  
  setLoading: (bool) => {
    App.loading = bool;
    $('#loader').toggle(bool);
    $('#content').toggle(!bool);
  }
};

$(window).on('load', App.load);
