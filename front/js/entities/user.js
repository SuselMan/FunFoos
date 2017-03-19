'use strict';

import Backbone from 'backbone';

const User = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        "email": "",
        "password": "",
        "team": null
    },
    urlRoot: function(){
        if(this.options && this.options.login){
            return '/api/login'
        }else{
            return '/api/signup'
        }
    },
    initialize: function(attrs,options){
        console.log('model huyodel',options);
        this.options = options;
    },
    update:function(){
        return fetch('/api/user/'+this.id,{
            headers: { 'Content-Type': 'application/json' },
            method:'put',
            body:JSON.stringify(this.toJSON())
        });
    },
    validate:(attrs, options)=>{
        if(!attrs.email || !attrs.password){
            return 'Все поля должны быть заполнены!'
        }
    }
});

export default User;