/**
 * Created by pavluhin on 11.11.2017.
 */


"use strict";

import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';

let channelGlobal = Radio.channel('global');

export default Marionette.View.extend({
    template: require('../../../templates/subseason/divisionDetails.hbs'),
    tagName: 'div',
    className: 'details',
    ui: {
        addTeamBtn: '.js-addTeam'
    },
    events: {
        'click @ui.addTeamBtn': 'showTeamSelector'
    },

    initialize: function (options) {
        this.options = options;
        this.user = channelGlobal.request('get:user');
        this.teams = new Teams();
    },

    showTeamSelector: function (){
        console.log('user', this.user);
        this.teams.fetch({data: {owner: this.user.id}})
            .then(() => {
                channelGlobal.trigger('modal:show',{view:'teamSelector', collection: this.teams});
                channelGlobal.off('team:selected');
                channelGlobal.on('team:selected',team => this.addTeam(team));
            })
    },

    addTeam: function(team) {
        console.log('team', team);
        team.set('division', this.model.id);
        team.save();
    }
});