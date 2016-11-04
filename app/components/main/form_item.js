import React, { Component } from 'react';

class FormItem extends Component{

    constructor(props){
        super(props);

        this.AddItem = this.AddItem.bind(this);
    }

    AddItem(){
        let taskValue = this.refs.taskValue.value;
        if(taskValue){
            this.props.addTaskItem(this.refs.taskValue.value);
            taskValue = "";
        }

    }

    render(){

        return(
            <div>
                <textarea ref="taskValue"></textarea>
                <button onClick={this.AddItem} className="btn btn-primary">Add</button>
            </div>
        )

    }

}

export default FormItem;