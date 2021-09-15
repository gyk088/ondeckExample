import React from 'react';
import Module from 'ExampleReact/module';
import Display from './Display';
import ButtonPanel from './ButtonPanel';
import calculate from '../logic/calculate';
import './App.css';


export default class App extends React.Component {
  state = {
    total: null,
    next: null,
    operation: null,
  }

  handleClick = (buttonName) => {
    const module = new Module();
    this.setState(calculate(this.state, buttonName));
    if (buttonName === '=' && this.state.total) {
      module.$$gemit('examplEvent', this.state.total);
      console.log(module.$$gstore);
      // module.$$emit('onSumm', this.state.total);
    }

    module.$$emit('notify', buttonName);
  }

  test = () => {
    const module = new Module();
    module.$$gstore.watchers.token.add('testWatcher', (data) => {
      console.log('REACT', data);
    });
  }

  render() {
    this.test();
    return (
      <div className="component-app">
        <Display value={this.state.next || this.state.total || '0'} />
        <ButtonPanel clickHandler={this.handleClick} />
      </div>
    );
  }
}
