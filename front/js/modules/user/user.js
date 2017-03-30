/**
 * Created by pavluhin on 27.03.2017.
 */

/**
 * Created by ilya on 08.03.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

const UserLayout = Marionette.View.extend({
    template: require('../../../templates/user/layout.hbs'),
    regions: {

    },

    initialize: function(options){
        this.options = options;
    },

    onRender:function(){

    }
});


export default UserLayout;