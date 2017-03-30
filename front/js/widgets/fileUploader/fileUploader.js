/**
 * Created by ilya on 03.03.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');


//TODO: refactor

const UploaderView = Marionette.View.extend({
    template: require('./fileUploader.hbs'),
    className: 'upload-form',
    onRender: function () {

        this.el.addEventListener("dragover", function (event) {
            this.el.classList.add('drop');
            event.preventDefault();
        }.bind(this), false);

        this.el.addEventListener("dragleave", function (event) {
            this.el.classList.remove('drop');
            event.preventDefault();
        }.bind(this), false);

        this.el.addEventListener("drop", function (event) {
            event.preventDefault();
            let files = event.dataTransfer.files;
            let form = new FormData();
            form.append("imageFiles", files[0]);
            fetch('/api/files', {
                method: 'POST',
                body: form
            }).then(function (res) {
                return res.json()
            }.bind(this)).then(function (imageUrl) {
                this.trigger('load:complete',imageUrl)
            }.bind(this));
            this.el.classList.remove('drop');
        }.bind(this), false);
    }
});

export default UploaderView;