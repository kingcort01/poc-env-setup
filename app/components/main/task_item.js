import React, { Component } from 'react';
import FormItem from './form_item';

class TaskItem extends Component{

    constructor(props){
        super(props);

        this.state = { editing : false };
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.cancelItem = this.cancelItem.bind(this)
    }

    editItem(e){
        if(this.state.editing){
            let taskValue = this.refs.taskValue.value;
            if(taskValue){
                this.props.updateTaskItem(taskValue, this.props.index);
                taskValue = "";
            }
            this.setState({ editing : false });
        }else{
            this.setState({ editing : true });
        }
    }

    deleteItem(e){
        this.props.deleteTaskItem(this.props.index)
    }

    cancelItem(e){
        this.setState({ editing : false})
    }

    renderNormal(){
        return(
            <div>
                <div className="taskItemText">{this.props.children}</div>
                <button onClick={this.editItem} className="btn btn-warning">Edit</button>
                <button onClick={this.deleteItem} className="btn btn-danger">Delete</button>
            </div>
        )
    }

    renderForm(){
        return(
            <div>
                <textarea ref="taskValue" defaultValue={this.props.children}></textarea>
                <button onClick={this.editItem} className="btn btn-success">Save</button>
                <button onClick={this.cancelItem} className="btn btn-default">Cancel</button>
            </div>
        )
    }

    render(){
        if(this.state.editing)
            return this.renderForm()
        else
            return this.renderNormal()
    }

}

export default TaskItem;