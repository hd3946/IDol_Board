import React from 'react';
 
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: ''
        }; 
    }
    render(){
 
        return (
                <h1>Hello React Skeleton</h1>
        );
    }
}
 
export default App;