$(function() {
    var RedmineIssue = Backbone.Model.extend({
        initialize:function(item){
            this.title = item.title;
        }
    });
    var RedmineList = Backbone.Collection.extend({
        model: RedmineIssue,
        url: '/redmine/',
        sync: Backbone.ajaxSync,
        initialize:function(params) {
            this.redmineUrl = params.redmineUrl;
            this.url = this.url + "?redmineUrl=" + encodeURIComponent(this.redmineUrl);
        }
    });
    var RedmineIssueRow = Backbone.View.extend({
        tagName:'li',
        template: _.template($('#item-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var RedmineServer = Backbone.Model.extend({
    });
    var ServerList = Backbone.Collection.extend({
        model: RedmineServer,
        localStorage: new Backbone.LocalStorage("redmineServers")
    });
    var ServerRow = Backbone.View.extend({
        className: 'grid-3',
        events: {
            'click .delete': 'destroy',
            'click .refresh': 'refresh'
        },
        template: _.template($('#server-template').html()),
        initialize: function() {
            this.issues = new RedmineList({redmineUrl: this.model.get('url')});
            this.issues.bind('reset', this.addAll, this);
            this.issues.fetch({add:false/*, data: {redmineUrl: this.model.get('url')}*/});
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        addAll: function() {
            $('.items', this.$el).empty();
            this.issues.each(this.addOne, this);
        },
        addOne:function (redmineIssue) {
            var view = new RedmineIssueRow({model: redmineIssue});
            $('.items', this.$el).append(view.render().el);
        },
        destroy: function() {
            console.log(this.model.get('name'));
            this.model.destroy();
            this.$el.remove();
        },
        refresh: function() {
            this.issues.fetch({add:false});
        }
    });

    var RedminatorView = Backbone.View.extend({
        el: '#controls',
        events: {
            'click #add': 'addServer'
        },
        servers: new ServerList,
        initialize: function() {
            this.servers.bind('reset', this.refreshServers, this);
            this.servers.fetch({add:false});
        },
        addServer: function() {
            var serverModel = new RedmineServer({url: $("#server-url").val(), name: $("#server-name").val()});
            this.servers.add(serverModel);
            serverModel.save();
            this.renderServer(serverModel);
        },
        renderServer: function(serverModel) {
            $('#servers').append((new ServerRow({model: serverModel})).render().el);
        },
        refreshServers: function() {
            this.servers.each(this.renderServer);
        }
    });
    
    var redminator = new RedminatorView;
});