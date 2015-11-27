/*var arr = [
			  "ContactView"
		    , "EmployeeListItemView"
			, "EmployeeSummaryView"
			, "EmployeeView"
			, "HomeView"
			, "ShellView"
			, "test"
		];
var deferreds = [];

var directory = {
    views         : {},
    models        : {},

    loadTemplates : function( arr ){
    	$.each( arr, function( ind, obj ){
    		console.log(directory[obj]);
			deferreds.push( $.get( "tpl/" + obj + ".html", function( data ) {
				//deferreds.push
				//console.log( data );
				//$('body').append(data);
			}, 'html'));
			
		});
		console.log(deferreds);
    }
};

directory.loadTemplates( arr );*/

//define router class 
var GalleryRouter = Backbone.Router.extend ({ 
	routes: { 
		''    : 'home', 
		'view': 'viewImage' 
	}, 

	home: function () { 
		alert('you are viewing home page'); 
	}, 

	viewImage: function () { 
		alert('you are viewing an image'); 
	} 
});

var appRouter = new GalleryRouter();
Backbone.history.start(); 

