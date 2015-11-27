var contact;
var templates = ['contactTemplate'];
var tplArr = {};

function loadTemplate(){
	
	if( templates.length > 0 ){
		$.each(templates, function(index, view) {
			if( tplArr[view] != undefined ){

				//console.log(tplArr[view]);

				tplArr[view].prototype.template = $.get('templates/' + view + '.html', function(data) {
					return _.template(data);
		        });
		    } else {
		    	tplArr[view] = "";
		    	//tplArr = tplArr[view];
		    }
    	});
    	console.log(tplArr);	
	}

	return tplArr;
}


(function($){
	var views = {};
	/*var a = function(){
		console.log("Hello");
	};

	var b = function(){
		a = a();
	} 

	b();*/


	/*function person(first, last, age, eyecolor) {
	    this.firstName = first;
	    this.lastName  = last;
	    this.age       = age;
	    this.eyeColor  = eyecolor;
	}*/

	//var myFather = new person("John", "Doe", 50, "blue");
	//var myMother = new person("Sally", "Rally", 48, "green");
	
	var tpl = loadTemplate();
	//console.log(tpl);



	

	contact = [
		{ id : "001", name : "Bireshwar Goswami",      phone : "8013788399", mail : "bireshwar@capitalnumbers.com", address : "Chinsurah, Hooghly" },
		{ id : "002", name : "Saptarshi Banerjee",     phone : "9876546121", mail : "saptarshi@capitalnumbers.com", address : "Ballygaunj, Kolkata" },
		{ id : "003", name : "Arani Manna",            phone : "8015456349", mail : "arani@capitalnumbers.com",     address : "Tamluk, Medinipur" },
		{ id : "004", name : "Soumendu Hazra",         phone : "7856453676", mail : "soumendu.hazra@gmail.com",     address : "Chinsurah, Hooghly" },
		{ id : "005", name : "Anindya Roy",            phone : "9874560987", mail : "anindyaroy1991@gmail.com",     address : "Siliguri, Jalpaguri" },
		{ id : "006", name : "Bidhan Baral",           phone : "9038452319", mail : "bidhan64.gmail.com",           address : "Thaurpukur, Kolkata" },
		{ id : "007", name : "Anindita Bhattacharyya", phone : "8981657654", mail : "annie3988@gmail.com",          address : "Chinsurah, Hooghly" },
	];




	// Model 
	var Contact = Backbone.Model.extend({
		initialize : function(){
			//console.log("hii");
		},

		defaults : {
			photo : 'img/placeholder.png'
		}
	});

	// Collection
	var Directory = Backbone.Collection.extend({
		model : Contact
	});

	// View
	var ContactView =  Backbone.View.extend({
		tagName    : 'article',
		className  : 'contact-container',
		template   : $('#contactTemplate').html(),

		initialize : function(){
		},

		render     : function(){
			var tpl = _.template(this.template);
			this.$el.html(tpl(this.model.toJSON()));
			return this;
		}
	});

	// View
	var DirectoryView = Backbone.View.extend({
		el          : $('#contacts'),
		initialize  : function(){
			this.contacts = new Directory(contact);
			//console.log( this.t );


			this.render();
		},

		render      : function(){
			this.renderContact( this );
		},

		renderContact  : function ( object ){
			_.each( object.contacts.models, function( list, iterator, context ){
				//console.log( list );
				//console.log( iterator );
				//console.log( context );
				var contactView = new ContactView({ model: list });
				object.$el.append( contactView.render().el );
			});
		},	
	});

	new DirectoryView();
})(jQuery);