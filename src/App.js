import React from 'react';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';
import axios from 'axios';

class App extends React.Component{

  constructor(){
    super()
    this.state = {
      tasks: [],
      newTaskData:{
        name:"",
        description:""
      },
      editTaskData:{
        taskId:"",
        name:"",
        description:""
      },
      newTaskModal: false,
      editTaskModal: false
    }
  }

  loadTask(){
    axios.post('http://localhost:8888/todolist-api/get_all_tasks.php').then((response) => {
      this.setState({
        tasks: response.data['tasks']
      })
    })
  }

  componentWillMount(){
    this.loadTask()
  }

  toggleNewTaskModal(){
    this.setState({
      newTaskModal: !this.state.newTaskModal
    })
  }

  toggleEditTaskModal(){
    this.setState({
      editTaskModal: !this.state.editTaskModal
    })
  }

  addTask(){
    axios.post('http://localhost:8888/todolist-api/create_task.php', this.state.newTaskData).then((response) => {
      let {tasks} = this.state;
      this.loadTask()

        this.setState({ tasks, newTaskModal: false, newTaskData:{
          name: "",
          description:""
          }
        })
    })
  }

  updateTask(){
    let { taskId, name, description } = this.state.editTaskData

    axios.post("http://localhost:8888/todolist-api/update_task.php", { 
      taskId,
      name, 
      description 
    }).then((response) => {
      this.loadTask()

        this.setState({ editTaskModal: false, editTaskData:{
          taskId:"",
          name: "",
          description:""
          }
        })
    })
  }

  editTask(taskId, name, description){
    this.setState({
      editTaskData: { taskId, name, description }, editTaskModal: ! this.state.editTaskModal
    })
  }

  deleteTask(taskId){
    axios.post("http://localhost:8888/todolist-api/delete_task.php", { 
      taskId 
    }).then((response) => {
      this.loadTask()
    })
  }

  render(){
    let tasks = this.state.tasks.map((task) => {
      return(
          <tr key={task.taskId}>
            <td>{task.taskId}</td>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.editTask.bind(this, task.taskId, task.name, task.description)}>Edit</Button>
              <Button color="danger" size="sm" onClick={this.deleteTask.bind(this,task.taskId)}>Delete</Button>
            </td>
          </tr>
      )
    })
    return (
      <div className="App container">
        <h1>To Do List app</h1>
        <Button className="my-3" color="primary" onClick={this.toggleNewTaskModal.bind(this)}>Add Task</Button>
        
        <Modal isOpen={this.state.newTaskModal} toggle={this.toggleNewTaskModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewTaskModal.bind(this)}>Add a new task</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input id="name" value={this.state.newTaskData.name} 
              onChange={(e) => {
                let { newTaskData } = this.state
                newTaskData.name = e.target.value
                this.setState({ newTaskData })
              }}></Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input id="description" value={this.state.newTaskData.description} 
              onChange={(e) => {
                let { newTaskData } = this.state
                newTaskData.description = e.target.value
                this.setState({ newTaskData })
              }}></Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addTask.bind(this)}>Add Task</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewTaskModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editTaskModal} toggle={this.toggleEditTaskModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditTaskModal.bind(this)}>Edit a new task</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input id="name" value={this.state.editTaskData.name} 
              onChange={(e) => {
                let { editTaskData } = this.state
                editTaskData.name = e.target.value
                this.setState({ editTaskData })
              }}></Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input id="description" value={this.state.editTaskData.description} 
              onChange={(e) => {
                let { editTaskData } = this.state
                editTaskData.description = e.target.value
                this.setState({ editTaskData })
              }}></Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateTask.bind(this)}>Update Task</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewTaskModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default App;
