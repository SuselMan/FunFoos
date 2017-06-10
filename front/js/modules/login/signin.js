/**
 * Created by pavluhin on 28.02.2017.
 */
/**
 * Created by ilya on 26.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../../entities/user';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import App from '../../../app'

let channelGlobal = Radio.channel('global');

let Login = Marionette.View.extend({
    template: require('../../../templates/login/signin.hbs'),
    className: 'form-control row login-form',
    tagName: 'div',


    ui: {
        saveBtn: ".js-login-btn",
        closeBtn: ".js-close-btn"
    },

    events: {
        'click @ui.saveBtn': 'save',
        'click @ui.closeBtn': 'close'
    },

    initialize: function(){
        console.log(App);
    },

    onRender: function() {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.model.signin()
            .then(function (result) {
                channelGlobal.trigger("done:signin", this.model);
            }.bind(this))
            .catch(function (e) {

            })

    },
    fetch: function () {
        this.model.updateSignin()
            .then(function (result) {
                channelGlobal.trigger("done:signin", this.model);
            }.bind(this))
            .catch(function (e) {

            })
    },
    close: function(){
        channelGlobal.trigger("close:signin", this.model);

    }



});


export default Login;