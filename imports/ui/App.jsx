import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Griddle from 'griddle-react';
import ChartistGraph from 'react-chartist';
import { eopDailyData } from '../api/eop.js';

class App extends Component {
    render() {
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            series: [
                [30.7,31.5,39.0,49.8,60.8,70.2,75.6,73.8,66.9,55.9,44.8,34.5]
            ]
        };
        const options = {
            high: 80,
            low: 0,
        };
        const responsiveOptions = [
            ['screen and (min-width: 641px) and (max-width: 1024px)', {
                showPoint: false,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        // Will return Jan, Feb, Mar etc. on medium screens
                        return value.slice(0, 3);
                    }
                }
            }],
            ['screen and (max-width: 640px)', {
                showLine: false,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        // Will return J, F, M etc. on small screens
                        return value[0];
                    }
                }
            }]
        ];
        const julianMetadata = [
            {
                "columnName": "_id",
                "order": 1,
                "locked": false,
                "visible": true,
                "displayName": "Julian Date"
            },
            {
                "columnName": "predicted",
                "order": 2,
                "locked": false,
                "visible": true,
                "customComponent": BooleanComponent
            }
        ];
        return (
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">Meteor Demo</a>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="#">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <Griddle results={this.props.eopDaily} tableClassName={'table table-bordered table-striped table-hover'} useGriddleStyles={false} showFilter={true} columnMetadata={ julianMetadata } useFixedHeader={true} bodyHeight={400} settingsToggleClassName='btn btn-default' showSettings={true} useCustomPagerComponent={true} customPagerComponent={CustomPager} resultsPerPage={12}/>
                </div>
                <div class="ct-chart ct-perfect-fourth">
                    <ChartistGraph data={data} options={options} responsiveOptions={responsiveOptions} type={'Line'} />
                </div>
                <p>FOOTER</p>
            </div>
        )
    }
}

App.propTypes = {
    eopDaily: PropTypes.array.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('eopdaily');

    return {
        eopDaily: eopDailyData.find().fetch(),
    };
}, App);


var BooleanComponent = React.createClass({
    render: function() {
        var predicted = this.props.data ? "true" : "false";
        return <p>{predicted}</p>;
    }
});

var CustomPager = React.createClass({
    getDefaultProps: function(){
        return{
            "maxPage": 0,
            "nextText": "",
            "previousText": "",
            "currentPage": 0,
        }
    },
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.getAttribute("data-value")));
    },
    render: function(){
        var previous = "";
        var next = "";

        if(this.props.currentPage > 0){
            previous = <span onClick={this.props.previous} className="btn btn-default btn-xs pull-left">{this.props.previousText}</span>
        }

        if(this.props.currentPage != (this.props.maxPage -1)){
            next = <span onClick={this.props.next} className="btn btn-primary btn-xs pull-right">{this.props.nextText}</span>
        }

        var options = [];

        var startIndex = Math.max(this.props.currentPage - 5, 0);
        var endIndex = Math.min(startIndex + 11, this.props.maxPage);

        if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
            startIndex = endIndex - 11;
        }

        for(var i = startIndex; i < endIndex ; i++){
            var selected = this.props.currentPage == i ? "btn btn-primary btn-xs active" : "btn btn-default btn-xs";
            options.push(<button className={selected} data-value={i} onClick={this.pageChange}>{i + 1}</button>);
        }

        return (
            <div className="row">
                <div className="col-xs-6 col-sm-4">{previous}</div>
                <div className="col-xs-6 col-sm-4 text-center">{options}</div>
                <div className="col-xs-6 col-sm-4">{next}</div>
            </div>
        )
    }
});