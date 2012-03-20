$(function() {
    var RedmineIssue = Backbone.Model.extend({
        initialize:function(item){
            this.title = item.title;
        }
    });
    var RedmineList = Backbone.Collection.extend({
        model: RedmineIssue,
        url: '/redmine/',
        initialize: function (models, options){
        },
        allTitles: function() {
            return this.map(function(x){
                return x.title;
            });
        }
    });
    var RedmineIssueRow = Backbone.View.extend({
        tagname:'li',
        template: _.template($('#item-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var RedminatorView = Backbone.View.extend({
        el: '#controls',
        events: {
            "click #refresh": "refresh",
            "click #add": 'addServer'
        },
        servers: new Backbone.Collection,
        initialize: function() {
            this.list = new RedmineList;
            this.list.bind('reset', this.addAll, this);
            this.list.fetch({add:false});
            //this.render();
        },
        addAll: function() {
            $('#left-items').empty();
            this.list.each(this.addOne);
        },
        addOne:function (redmineIssue) {
            var view = new RedmineIssueRow({model: redmineIssue});
            $('#left-items').append(view.render().el);
        },
        refresh: function() {
            $('#left-items').empty();
            this.list.fetch();
        },
        addServer: function() {
            this.servers.add({url: $("#server-url").val()});
        }
        //render:function() {
        //    
        //}
    });
    
    var redminator = new RedminatorView;
});