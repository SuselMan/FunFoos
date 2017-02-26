'use strict';

import Backbone from 'backbone';

const User = Backbone.Model.extend({
    urlRoot: function(){
        console.log('options',this.options);
        if(this.options.login){
            return '/api/login'
        }else{
            return '/api/signup'
        }
    },
    initialize: function(attrs,options){
        console.log('model huyodel',options);
        this.options = options;
    },
    defaults: {
        "email": "",
        "password": "",
        "team": ""
    },
    validate:(attrs, options)=>{
        if(!attrs.email || !attrs.password){
            return 'Все поля должны быть заполнены!'
        }
    }
});

export default User;