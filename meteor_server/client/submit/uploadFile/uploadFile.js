Meteor.startup(function() {
  //TODO: Customize file upload settings using params from
  //https://github.com/tomitrescak/meteor-uploads

  Template.uploadForm.created = function() {
    Uploader.init(this);
    Uploader.finished = function(index, fileInfo, templateContext) {
      fileInfo.state = "new"
      console.log(fileInfo);
      JARSDB.insert(fileInfo);
    }
  }

  Template.uploadForm.rendered = function () {
    Uploader.render.call(this);
    Meteor.subscribe("jars", function() {
      Tracker.autorun(function () {
        JARSDB.find().observeChanges({
          changed: function(id, fields) {
            $("#uploadForm #progressBar").addClass("complete")
          }
        })
      })
    })
  }

  Template.uploadForm.events({
    'click #upload': function (e) {
      Uploader.startUpload.call(Template.instance(), e);
    },
    'click #selectFile': function (e) {
      e.preventDefault()
      console.log($("#uploadForm #selectFileHandler"));
      $("#uploadForm #selectFileHandler").trigger("click")
    }
  })

  Template.uploadForm.helpers({
    info: function() {
      var instance = Template.instance();

      // we may have not yet selected a file
      var info = instance.info.get()
      if (!info) {
        return;
      }

      var progress = instance.globalInfo.get();

      // we display different result when running or not
      return progress.running ?
        info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
        info.name + ' - ' + info.size + 'B';
    },
    progress: function() {
      return Template.instance().globalInfo.get().progress + '%';
    }
  })
})
