import { Mongo } from 'meteor/mongo';

export const eopDailyData = new Mongo.Collection('EOPDaily');

if (Meteor.isServer) {
	Meteor.publish('eopdaily', function eopPublication() {
		return eopDailyData.find();
	});
}