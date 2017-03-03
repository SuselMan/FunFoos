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
            // отменяем действие по умолчанию
            event.preventDefault();
            var i = 0,
                files = event.dataTransfer.files,
                len = files.length;
            for (; i < len; i++) {
                console.log("Filename: " + files[i].name);
                console.log("Type: " + files[i].type);
                console.log("Size: " + files[i].size + " bytes");
            }
            var form = new FormData();
            form.append("imageFiles", files[0]);
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                console.log("Отправка завершена");
            };
            xhr.open("post", "/api/files", true);
            xhr.send(form);
        }, false);

    }
});

export default UploaderView;