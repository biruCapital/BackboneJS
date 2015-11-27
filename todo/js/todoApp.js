var ENTER_KEY  = 13;
var ESC_KEY    = 27;
var TodoFilter;
var appModel,
    appCollections,
    appView,
    listView,
    appRouter;
(function ($) {
	'use strict';

	/* Model Section   [ appModel ] */
	appModel = Backbone.Model.extend({
	    defaults: {
			title     : '',
			date_time : Date(),
	        done      : false
		},

		toggle : function(){
			this.save({ done: !this.get('done') });
		}
	});

	/* Collection Section  [ appCollections ] */
	appCollections = Backbone.Collection.extend({
	    model        : appModel,
	    localStorage : new Store("backbone-todo-list"),

		done: function () {
			return this.where({done: true});
		},
		remaining: function () {
			return this.where({done: false});
		},
	});

	/* View Section [ AppView ]*/
	appView = Backbone.View.extend({
		el            : '.myTodoApp',

		statsTemplate : _.template($('#stats-template').html()),

		events        : {
			'keypress #todo_text'    : 'onEnterPress',
			'click .toggle-all'      : 'selectAll',
			'click .clear-completed' : 'clearAll'
		},

		initialize    : function(options){
			this.allCheckbox = this.$('.toggle-all')[0];
			this.$textInput  = this.$("#todo_text");
			this.$todoList   = $('.todo-list');
			this.$footer     = $('.footer');
			appCollections.on('add', this.addOne, this);
			this.listenTo(appCollections, 'filter', this.filterAll);
			this.listenTo(appCollections, 'all', _.debounce(this.render, 0));
			appCollections.fetch();
		},

		render        : function(){

			var done      = appCollections.done().length;
			var remaining = appCollections.remaining().length;

			if (appCollections.length) {
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					done      : done,
					remaining : remaining
				}));
				this.$('.filters li a').removeClass('selected').filter('[href="#/' + (TodoFilter || '') + '"]').addClass('selected');
			} else this.$footer.hide();

			this.allCheckbox.checked = !remaining;
		},

		onEnterPress  : function(e){
			if (e.which === ENTER_KEY && this.$textInput.val().trim()) {
				appCollections.create(this.addItem());
				this.$textInput.val(''); 
			}
		},

		filterOne: function (appModel) {
			appModel.trigger('visible');
		},

		filterAll: function () {
			appCollections.each(this.filterOne, this);
		},

		selectAll     : function(){
			var done    =  this.allCheckbox.checked;
			appCollections.each(function (appModel) {
				appModel.save({
					done: done
				});
			});
		}, 

		clearAll      : function(){
			_.invoke(appCollections.done(), 'destroy');
			return false;
		},

		addItem       : function(){
			return {
				title     : this.$textInput.val().trim(),
				date_time : Date(),
				done      : false
			}
		},

		addOne        : function(appModel){
			var view = new listView({model: appModel});
			this.$todoList.append(view.render().el);
		},
	});
	
	/* View Section [ listView ] */
	listView = Backbone.View.extend({
		tagName       : "li",

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},
		
		events        : {
			'click .toggle'  : 'singleCheck',
			'click .destroy' : 'deleteItem',
			'dblclick label' : 'edit',
			'keypress label' : 'edit',
			'keypress .edit' : 'updateOnEnter',
			'keydown .edit'  : 'revertOnEscape',
			'blur .edit'     : 'close'
		},

		template      : _.template($('#item-template').html()),

		render        : function() {
			if (this.model.changed.id !== undefined) return;
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('done'));
			this.toggleVisible();
			this.$input = this.$('.edit');
			return this; 
		},

		toggleVisible : function(){
			this.$el.toggleClass('hidden', this.isHidden());
		},

		isHidden: function () {
			return this.model.get('done') ? TodoFilter === 'active' : TodoFilter === 'done';
		},

		updateOnEnter: function (e) {
			(e.which === ENTER_KEY) && this.close();
		},

		revertOnEscape: function (e) {
			if (e.which === ESC_KEY) {
				this.$el.removeClass('editing');
				this.$input.val(this.model.get('title'));
			}
		},

		edit          : function(){
			this.$el.addClass('editing');
			this.$input.focus();
		},

		close        : function(){
			var trimmedValue = this.$input.val().trim();

			if(!this.$el.hasClass('editing')) return;
			trimmedValue ? this.model.save({ title: trimmedValue }) : this.clear();
			this.$el.removeClass('editing');
		},

		singleCheck  : function(){
			this.model.toggle();
		},

		deleteItem   : function(){
			this.model.destroy();
		}
	});
	
	/* Router Section [ appRouter ] */
	appRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			TodoFilter = param || '';
			appCollections.trigger('filter');
		}
	});

	appModel        = new appModel();
	appCollections  = new appCollections();
	appView         = new appView();
	appRouter       = new appRouter();
	Backbone.history.start();
})(jQuery);