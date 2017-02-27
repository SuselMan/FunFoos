/**
 * Created by ilya on 26.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../entities/user';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

let Login = Marionette.View.extend({
    template: require('../../../templates/main/login.hbs'),
    className: 'form-control row login-form',
    tagName: 'div',
    model: new User({},{login:true}),


    ui: {
        saveBtn: ".js-login-btn",
        closeBtn: ".js-close-btn"
    },

    events: {
        'click @ui.saveBtn': 'save',
        'click @ui.closeBtn': 'close'
    },

    initialize: function (options) {

    },

    onRender: function() {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.model.save()
            .then(function (result) {
                channelGlobal.trigger("done:login", this.model);
            })
            .catch(function (e) {
                console.log('err', e);
            })
        console.log('save');

    },
    close: function(){
        channelGlobal.trigger("close:login", this.model);
        console.log('close');
    }



});


export default Login;