'use strict';

import Backbone from 'backbone';

const User = Backbone.Model.extend({
    urlRoot: '/api/signup',
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