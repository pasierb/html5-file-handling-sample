(function (global) {
    'use strict';

    function processFileList(files) {
        var that = this,
            i,
            file,
            reader;

        function onLoad(event) {
            onImageLoad.apply(that, [event]);
        }

        for (i = 0; i < files.length; i++){
            file = files[i];

            // Supported image formats: jpg, png
            if (file.type.match(this.supportedFileTypePattern)) {
                reader = new FileReader();

                reader.onload = onLoad;
                reader.readAsDataURL(file);
            } else {
                alert(['file type (', file.type, ') not supported!'].join(''));
            }
        }
    }

    function onImageLoad(event) {
        var span = document.createElement('span');

        span.innerHTML += ['<img class="thumbnail" title="Open image in new window" src="', event.target.result, '"/>'].join('');
        // insert loaded image at the beginning of list
        this.imagesContainer.insertBefore(span, this.imagesContainer.childNodes[0]);
    }

    function showImage(imageUrl) {
        window.open(imageUrl, null, 'toolbar=0, status=0');
    }


    global.fhs = {
        imagesContainer: null,
        fileInput: null,
        dropZone: null,
        supportedFileTypePattern: 'image.(png|jpg|jpeg)',
        bootstrap: function(callback) {
            var that = this;

            // allow user to do some basic config (html elements in particular)
            callback.apply(this);

            this.fileInput.addEventListener('change', function(event){
                processFileList.apply(that, [event.target.files]);
            }, false);

            this.dropZone.addEventListener('dragover', function(event){
                // need to "kill" event preventing default browser behaviour
                event.stopPropagation();
                event.preventDefault();
                return false;
            }, false);

            this.dropZone.addEventListener('drop', function(event){
                processFileList.apply(that, [event.dataTransfer.files]);

                // need to "kill" event preventing default browser behaviour
                event.stopPropagation();
                event.preventDefault();
                return false;
            }, false);

            // attach one click utilizing event bubling instead of attaching
            // separate event per image
            this.imagesContainer.addEventListener('click', function(event){
                var target = event.target;

                if(target.nodeName == 'IMG'){
                    showImage(target.src);
                }

                event.preventDefault();
                return false;
            }, false);
        }
    };
})(window);
