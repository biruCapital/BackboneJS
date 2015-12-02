(function($){
	window.App = {
		Models      : {},
		Collections : {},
		Views       : {}
	};

	window.template = function( id ){
		return _.template( $( '#' + id ).html() ); 
	};	

	window.tasks    = [
						{ title : "Create an Application", order : 4 },
						{ title : "Save an Application", order : 5 },
						{ title : "Update an Application", order : 6 },
						{ title : "Delete an Application", order : 4 }
					 ];

	App.Models.Task = Backbone.Model.extend({

	});

	App.Collections.Tasks = Backbone.Collection.extend({
		model : App.Models.Task
	});

	App.Views.Task = Backbone.View.extend({
		tagName : 'li',

		render  : function(){
			this.$el.html(this.model.get("title"));
			return this;
		}
	});

	App.Views.Tasks = Backbone.View.extend({
		tagName : 'ul',

		initialize : function(){
			$('#contact-list').html(this.render().el);
		},

		render : function(){
			this.collection.each( this.addItem, this );
			return this;
		},

		addItem : function( task ){
			var taskView = new App.Views.Task({ model : task });
			this.$el.append(taskView.render().el);
		}
	});

	var taskCollection = new App.Collections.Tasks(tasks);

	//var taskView = new App.Views.Task({ model : task });

	new App.Views.Tasks({ collection : taskCollection });

})(jQuery);