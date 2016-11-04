import React, { Component } from 'react';

class TitleBar extends Component{

    constructor(props){
        super(props);

        this.state = { date : this.props.createDate };

    }

    render(){

        return(
            <div>
                <h3 className="date-bar">
                {
                    this.state.date
                }
                </h3>
            </div>
        )

    }

}

export default TitleBar;