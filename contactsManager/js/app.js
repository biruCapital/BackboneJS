(function($){
	window.App = {
		Models      : {},
		Collections : {},
		Views       : {},
		Routers     : {}
	};

	window.templates = {};

	window.templateNames = [ 'listTemplate' , 'editTemplate' ];

	window.loadTemplate  = function(){
		
		$.each( templateNames, function( ind, templateName ){
			$.ajax({
				url      : 'templates/' + templateName + '.html',
				method   : "GET",
				async    : false,
				dataType : 'html',
				success  : function(data){
					templates[templateName] = data;
				}
			});
		});
		return templates;
	}

	window.getTemplate = function ( templateName ){
		return templates[templateName];
	}

	/*
	|--------------------------------------------------------------------------
	| Router
	|--------------------------------------------------------------------------
	*/
	App.Router = Backbone.Router.extend({
	routes: {
		'': 'index'
		},

		index: function() {
			console.log( 'INDEX' );
		}
	});


	/*
	|--------------------------------------------------------------------------
	| Collection
	|--------------------------------------------------------------------------
	*/

	App.Collections.Contacts = Backbone.Collection.extend({
		model: App.Models.Contact
	});


	/*
	|--------------------------------------------------------------------------
	| Model
	|--------------------------------------------------------------------------
	*/

	App.Models.Contact = Backbone.Model.extend({
		defaults: {
			first_name    : "",
			last_name     : "",
			email_address : "",
			mobile_number : ""
		}
	});


	/*
	|--------------------------------------------------------------------------
	| Global App View
	|--------------------------------------------------------------------------
	*/
	App.Views.App = Backbone.View.extend({
		initialize: function() {
			var addContactView = new App.Views.AddContact({ collection: App.contacts });
			var allContactsView = new App.Views.Contacts({ collection: App.contacts });
			$('#allContacts').append(allContactsView.render().el);
		},
	});

	/*
	|--------------------------------------------------------------------------
	| Add Contact View
	|--------------------------------------------------------------------------
	*/
	App.Views.AddContact = Backbone.View.extend({
		el          : '#addContact',

		initialize  : function(){
			this.first_name    = this.$('#first_name');
			this.last_name     = this.$('#last_name');
			this.email_address = this.$('#email_address');
			this.mobile_number = this.$('#mobile_number');
		},

		events     : {
			'submit' : 'addContact'
		},

		addContact : function(e){
			e.preventDefault();
			//console.log("Hello");

			this.collection.create({
				first_name    : this.first_name.val(),
				last_name     : this.last_name.val(),
				email_address : this.email_address.val(),
				mobile_number : this.mobile_number.val()
			});

			this.resetForm();
			//return false;
		},

		resetForm: function() {
			this.first_name.val('');
			this.last_name.val('');
			this.mobile_number.val('');
			this.email_address.val('');
		}
	});

	/*
	|--------------------------------------------------------------------------
	| All Contacts View
	|--------------------------------------------------------------------------
	*/
	App.Views.Contacts   = Backbone.View.extend({
		tagName    : 'tbody',
		initialize : function(){
			this.collection.on('add',this.addItem,this);



		},

		render     : function(){
			this.collection.each( this.addItem, this );
			return this;
		},

		addItem    : function(){
			var contactView = new App.Views.Contact({ model: contact });
			this.$el.append(contactView.render().el);
		}

	});


	/*
	|--------------------------------------------------------------------------
	| Single Contact View
	|--------------------------------------------------------------------------
	*/
	App.Views.Contact = Backbone.View.extend({
		tagName    : 'tr',
		template   : getTemplate('listTemplate'),
		initialize : function(){


		},

		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		},



	});

	loadTemplate();
	new App.Router;
	Backbone.history.start();

	
	App.contacts = new App.Collections.Contacts;
	console.log(App.contacts);
	App.contacts.fetch().then(function() {
		new App.Views.App({ collection: App.contacts });
	});

})(jQuery);

