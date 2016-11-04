import React, { Component } from 'react';
import FormItem from './form_item';
import TaskItem from './task_item';

class TaskDetails extends Component{

    constructor(props) {
        super(props);

        this.state = {
            taskArray : this.props.details
        };

        this.addTaskItem = this.addTaskItem.bind(this);
        this.updateTaskItem = this.updateTaskItem.bind(this);
        this.renderTaskItem = this.renderTaskItem.bind(this);
        this.deleteTaskItem = this.deleteTaskItem.bind(this);
    }

    addTaskItem(tastValue){
        let taskArray = this.state.taskArray;
        taskArray.push(tastValue);
        this.setState({ taskArray });
    }

    updateTaskItem(taskValue, i){
        let taskArray = this.state.taskArray;
        taskArray[i] = taskValue;
        this.setState({ taskArray });
    }

    deleteTaskItem(i){
        let taskArray = this.state.taskArray;
        taskArray.splice(i, 1);
        this.setState({ taskArray });
    }

    renderTaskItem(task, i){
        return (
            <TaskItem key={i} index={i} updateTaskItem={this.updateTaskItem} deleteTaskItem={this.deleteTaskItem}>
        {task}
    </TaskItem>
        );
    }

    render() {
        return (
            <div>
                <FormItem addTaskItem={this.addTaskItem}/>
                <div>
                    {
                        this.state.taskArray.map(this.renderTaskItem)
                    }
                </div>
            </div>
        );
    }

}

export default TaskDetails;