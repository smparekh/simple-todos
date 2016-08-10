import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
//import { MeteorGriddle } from 'meteor/utilities:meteor-griddle';
import Griddle from 'griddle-react';

//import { Tasks } from '../api/tasks.js';

//import Task from './Task.jsx';

import { eopDailyData } from '../api/eop.js';

class App extends Component {
	render() {
		return (
			<Griddle results={this.props.eopDaily} columns={["julianDate", "predicted"]} />
		)
	}
}

App.propTypees = {
	eopDaily: PropTypes.array.isRequired,
};

export default createContainer(() => {
	Meteor.subscribe('eopdaily');

	return {
		eopDaily: eopDailyData.find().fetch(),
	};
}, App);