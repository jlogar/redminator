$(function() {
	var RedmineModel = Backbone.Model.extend({
		initialize:function(item){
			this.title = item.title;
		}
	});
	var RedmineList = Backbone.Collection.extend({
		model: RedmineModel,
		url: '/redmine/',
		initialize: function (models, options){
		},
		allTitles: function() {
			return this.map(function(x){
				return x.title;
			});
		}
	});
	var RedmineView = Backbone.View.extend({
		tagname:'li',
	});

	$('#refresh').button().click(function() {
					var list = new RedmineList();
					list.on('reset', function(collection){
						console.log(collection.allTitles().join("\n"));
					});
                    list.on('add', function(obj){
						console.log(obj.title);
					});
					list.fetch({add:false});
                    //list.add([{title:'test'}]);
					//$.ajax('/redmine')
					//.done(function(res) {
					//	var items = _.map(res.items, function(x){return new RedmineModel(x);});
					//	var list = new RedmineList(items);
					//	_.each(list.allTitles(), function(x){console.log(x);});
					//});
				});
});