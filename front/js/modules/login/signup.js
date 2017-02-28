/**
 * Created by pavluhin on 28.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../entities/user';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

let Login = Marionette.View.extend({
    template: require('../../../templates/login/signup.hbs'),
    className: 'form-inline header-form',
    tagName: 'div',
    model: new User(),

    ui: {
        saveBtn: ".js-save"
    },

    events: {
        'click @ui.saveBtn': 'save',
    },

    onRender: function() {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.model.save()
            .then(function (result) {
                channelGlobal.trigger("done:signup", this.model);
            })
            .catch(function (e) {
                console.log('err', e);
            })
    }

});


export default Login;