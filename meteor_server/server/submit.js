Meteor.startup(function(){
  JARSDB.find().observeChanges({
    added: function(id, fields) {
      exec(
        confJSON.Spark.Directory+'/bin/spark-submit ' +
        '--properties-file '+filesDirectory+'deployment.conf '+
        '--class DDAppTemplate '+'"'+filesDirectory+"jar/"+ fields["name"]+'"', {async: true, silent: true});

      JARSDB.update(id,{state: "complete"})
    }
  })
})
