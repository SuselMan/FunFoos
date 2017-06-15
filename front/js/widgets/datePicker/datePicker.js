/**
 * Created by pavluhin on 06.04.2017.
 */

import calendar from "calendar";
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

const vocabulary = {
    January: 'Январь',
    February: 'Февраль',
    March: 'Март',
    April: 'Апрель',
    May: 'Май',
    June: 'Июнь',
    July: 'Июль',
    August: 'Август',
    September: 'Сентябрь',
    October: 'Октябрь',
    November: 'Ноябрь',
    December: 'Декабрь'
};

const Day = Backbone.Model.extend({
    initialize: function(attrs,options){
        this.options = options;
    },

    defaults: {

    }
});

const Month = Backbone.Collection.extend({
    model: Player
});




const datePickerView = Marionette.View.extend({
    template: require('./datePicker.hbs'),
    className: 'datepicker-form',

    initialize: function(options){
        //here ge get from oprions workdays for current place, and special days
    },

    onRender: function () {

    }
});

export default datePickerView;