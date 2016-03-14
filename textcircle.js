this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

if (Meteor.isClient) {

  // updating the current_date variable every second
  Meteor.setInterval(function(){
     Session.set("current_date", new Date());
  }, 1000);

  Template.date_display.helpers({
    "current_date": function(){
       return Session.get("current_date");
    }
  });

  Template.editor.helpers({
    docid: function(){
      var doc = Documents.findOne();
      if(doc) {
        return doc._id;
      }
      else {
        return undefined;
      }
    },
    config: function(){
      return function(editor){
        editor.on("change", function(cm_editor, info){
          $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
          Meteor.call("addEditingUser");
        });
      }
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if(!Documents.findOne()) { //No docs yet
      Documents.insert({title:"my new document"});
    }
  });
}

Meteor.Meteor.methods({
  addEditingUser:function(){
    var doc, user;
    doc = Documents.findOne();
    if(!doc){return;}
    if(!this.userId){return;}
    //above does some error checking
    user = Meteor.user().profile;
    EditingUsers.insert({});

  }
});
