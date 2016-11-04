import React, {Component} from 'react';
import TitleBar from './title_bar';
import TaskDetails from './task_details';

class TaskList extends Component{

    constructor(props){
        super(props)

        this.state = {
            listArray : [
                {
                    date : 'Aug 29, 2016',
                    details : [
                        'Task 1',
                        'Task 2',
                        'Task 3'
                    ]
                },
                {
                    date : 'Sept 15, 2016',
                    details : [
                        'Task 4',
                        'Task 5',
                        'Task 6',
                        'Task 7'
                    ]
                },
            ]
        };

        this.addTaskList = this.addTaskList.bind(this);
        this.removeTaskList = this.removeTaskList.bind(this);
        this.renderTask = this.renderTask.bind(this);

    }

    addTaskList(){
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        let date = new Date();
        let today = `${monthNames[date.getMonth()+1]} ${date.getDate()}, ${date.getFullYear()}`;
        let listArray = this.state.listArray;
        listArray.push({
            date : today,
            details : []
        });
        this.setState({ listArray })
    }

    removeTaskList(index){
        //todo : Need to investigate why its not deleting properly
        let listArray = this.state.listArray;
        listArray.splice(index, 1);
        this.setState({ listArray })
    }

    renderTask(task, i){
        return(
            <div key={i} className="col-md-4 task-details">
                <button onClick={this.removeTaskList.bind(null, i)}>Remove Task Detail</button>
                <TitleBar createDate={task.date}/>
                <TaskDetails details={task.details}/>
            </div>
        );
    }

    render(){
        return(
            <div className="row">
                <div className="col-md-12">
                    <button onClick={this.addTaskList}>Add New Task Details</button>
                </div>
                {
                    this.state.listArray.map(this.renderTask)
                }
            </div>
        )
    }

}

export default TaskList;