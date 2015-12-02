window.App = {
	Models      : {},
	Collections : {},
	Views       : {}
},
window.templates     = {};
window.templateNames = [ 'contactTemplate' , 'addTemplate' ];

window.contacts  = [];

function loadTemplate(){
	$.each( templateNames, function( ind, templateName ){
		$.ajax({
			url      : 'templates/' + templateName + '.html',
			method   : "GET",
			async    : false,
			dataType : 'html',
			success  : function(data){
				templates[templateName] = data;
			},

			error: function( result ) {
				
			}
		});
	});
	return templates;
}

function getTemplate( templateName ){
	return templates[templateName];
}

(function($){

	loadTemplate();

	// Contact Model 
	App.Models.Contact = Backbone.Model.extend({
		initialize : function(){
			//console.log(this);

		},

		validate   : function(attributes){
			console.log("Hello");
			return false;
		},

		defaults : {
			photo : 'img/placeholder.png'
		}
	});

	// Directory Collection
	App.Collections.Directory = Backbone.Collection.extend({
		model : App.Models.Contact,

		initialize : function(){
			//this.bind('remove', this.onModelRemoved, this);
		},
		
		onModelRemoved : function( model, collection, options ){
			console.log("Hello");
		}
	});

	// Contact View
	App.Views.ContactView =  Backbone.View.extend({
		tagName    : 'article',
		className  : 'contact-container',
		template   : getTemplate('contactTemplate'),
		events     : {
			'click #edit'   : 'editForm',
			'click #delete' : 'deleteEmployee'
		},

		initialize : function(){
			
		},

		render     : function(){
			var tpl = _.template( this.template );
			this.$el.html(tpl(this.model.toJSON()));
			return this;
		},

		deleteEmployee : function(){
			if( confirm('Are you sure to delete!') ){
				if( dir.indexOf(this.model) != -1 ) {
					dir.remove(dir.at(dir.indexOf(this.model)));
					console.log(this.$el.remove());
				}
			}
		}
	});

	// Directory View
	App.Views.DirectoryView = Backbone.View.extend({
		el          : $('#contacts'),
		initialize  : function(){
			this.contacts = dir;
			this.collection.on('add',this.addContact,this);
			//this.collection.bind('remove', this.removeContact, this);


			this.render();
		},

		render      : function(){
			this.collection.each( this.addContact, this );
			return this;
		},

		addContact  : function(contactModel){
			var contactView = new App.Views.ContactView({model: contactModel});
			this.$el.append(contactView.render().el);
		},

		removeContact : function( model, collection, options ){
			var template = _.template(getTemplate('contactTemplate'));

			//console.log($(template(model.toJSON())));

			//$(template(model.toJSON())).remove();
		}
	});

	// Contact Form View
	App.Views.contactFormView = Backbone.View.extend({
		el         : $('#contactForm'),
		events     : {
			'click #submitForm' : 'createEmployee'
		},

		initialize : function(){
			this.$name      = this.$('#name');
			this.$address   = this.$('#address');
			this.$phone     = this.$('#phone');
			this.$mail     = this.$('#mail');
		},

		createEmployee : function(){
			var length = this.collection.length + 1;
			var str    = ( length > 9 ) ? '0' : '00';

			if( this.$name.val() && this.$phone.val() && this.$mail.val() && this.$address.val() ){
				dir.add(new App.Models.Contact({
					id      : str + length.toString(), 
					name    : this.$name.val(),      
					phone   : this.$phone.val(), 
					mail    : this.$mail.val(), 
					address : this.$address.val()
				}));

				this.resetContactForm();
			}
		},

		resetContactForm : function(){
			this.$name.val('');
			this.$address.val('');
			this.$phone.val('');
			this.$mail.val('');
		}
	});
	
	var contactModel = new App.Models.Contact();
	var dir = new App.Collections.Directory(contacts);
	new App.Views.contactFormView({ collection : dir });
	new App.Views.DirectoryView({ collection : dir });

})(jQuery);