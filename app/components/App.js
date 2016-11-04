import React, {Component} from 'react';
import TaskList from './main/task_list';

class App extends Component{

  constructor(props){
    super(props)
  }

  render(){

    return(
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-header">Task Logger BETA
              </h1>
            </div>
          </div>
          <TaskList/>
        </div>
    )

  }


}

export default App;