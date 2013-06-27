var app = (function($){

  StackMob.init({
      publicKey: "68987e51-fc28-4bb6-bc28-9de2f946344b",
      apiVersion: 0
  });

  var Todo = StackMob.Model.extend({
      schemaName: 'todo',
  });

  var Todos = StackMob.Collection.extend({
      model: Todo
  });

  var HomeView = Backbone.View.extend({

    initialize: function() {
       this.template = _.template($('#homeTemplate').html());
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    }
  });

  var SignUpView = Backbone.View.extend({
    events: {
      "click #signUpBtn": "signup",     
    },

    initialize: function() {
      this.template = _.template($('#signUpTemplate').html());
      this.router = this.options.router;
      this.collection = this.options.collection;
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    },

    signup:function (e) {
      // Render the page template
      var router = this.router,
        collection = this.collection;
      e.preventDefault();
      
      var user = new StackMob.User({ username: $("#signUpForm input.username").val(), 
                                    password:  $("#signUpForm input.password").val(), 
                                    email: $("#signUpForm input.email").val() 
                                  });

      user.create({
        success: function(data) {
          console.log(data.toJSON());
          console.log("user created");

          var user = new StackMob.User(data.toJSON());
          user.login(true,{
            success: function(data) {
              console.log("logged in");

              router.navigate('#list',{trigger: true, replace: false});
            },
            
            error: function(error) {
              console.log(error);
            }
          });

        },
        error: function(error) {
          console.log(error);
        }
      });

      return this;
    }
  });

  var LoginView = Backbone.View.extend({
    events: {
      "click #loginBtn": "login",     
    },

    initialize: function() {
      this.template = _.template($('#loginTemplate').html());
      this.router = this.options.router;
      this.collection = this.options.collection;
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    },

    login:function (e) {
      // Render the page template
      var router = this.router,
      collection = this.collection;
      e.preventDefault();
      
      console.log( $("#loginForm input.username").val());
      console.log( $("#loginForm input.password").val());
      var user = new StackMob.User({ username: $("#loginForm input.username").val(), password:  $("#loginForm input.password").val() });

      user.login(true,{
        success: function(data) {
          console.log(data);

          router.navigate('#list/true',{trigger: true, replace: false});
        },
        error: function(error) {
          console.log(error);
        }
      });

      return this;
    }
  });

  var ForgotView = Backbone.View.extend({
    events: {
      "click #forgotBtn": "passwordForgot"
    },

    initialize: function() {
       this.template = _.template($('#passwordForgotTemplate').html());
       this.router = this.options.router;
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    },

    passwordForgot:function (e) {
      // Render the page template
      var router = this.router;
      e.preventDefault();
      
      var user = new StackMob.User({ username: $("#passwordForgotForm input.username").val() });

      user.forgotPassword({
        success: function(data) {
          console.log(data);
          router.navigate('#passwordreset',{trigger: true, replace: false});
        },
        error: function(error) {
          console.log(error);
        }
      });

      return this;
    }
  });

  var PasswordResetView = Backbone.View.extend({
    events: {
      "click #resetBtn": "resetPassword",     
    },

    initialize: function() {
       this.template = _.template($('#passwordResetTemplate').html());
       this.router = this.options.router;
       this.temp = this.options.temp;
    },

    render:function (eventName) {
      // Render the page template
      console.log(this.temp)
      $(this.el).html(this.template({temp: this.temp}));
        
      return this;
    },
    
    resetPassword:function (e) {
      // Render the page template
      var router = this.router;
      e.preventDefault();
      
      var user = new StackMob.User({ username: $("#passwordResetForm input.username").val() });
       
      user.loginWithTempAndSetNewPassword($("#passwordResetForm input.temppassword").val(), $("#passwordResetForm input.newpassword").val(), true, {
        success: function(data) {
          console.log(data);
          router.navigate('#list/true',{trigger: true, replace: false});
        },
        error: function(error) {
          console.log(error);
        }
      });

      return this;
    }
  });



  var ListView = Backbone.View.extend({

    initialize: function() {
      this.collection.bind('change', this.render,this);
      homeTemplate = _.template($('#listMainTemplate').html());
      listTemplate = _.template($('#listTemplate').html());
    },

    render:function (eventName) {
      var collection = this.collection,
      listContainer = $('<ul data-role="listview" id="todoList"></ul>');
          
      // Render the page template
      $(this.el).html(homeTemplate());

      // Find the content area for this page
      var content = $(this.el).find(":jqmData(role='content')");
      content.empty();

      // loop over our collection and use a template to write out
      // each of the items to a jQuery Mobile listview contianer
      collection.each(function(model){
        listContainer.append(listTemplate(model.toJSON()));
      });

      // Append our todo list to the content area.
      content.append(listContainer);
        
      return this;
    }
  });

  var AddView = Backbone.View.extend({
    events: {
      "click #addBtn": "add",     
    },

    initialize: function() {
      this.router = this.options.router;
      this.collection = this.options.collection;
      this.template = _.template($('#add').html());
    },

    render: function() {
      $(this.el).html(this.template());
      return this;
    },
   
    add: function(e) {
      e.preventDefault();
      var       item = $('#addForm').serializeObject(),
          collection = this.collection
              router = this.router;
            
      // create a new instance of the todo model and populate it 
      // with your form data.
      var todo = new Todo(item);
          
      // call the create method to save your data at stackmob
      todo.create({
        success: function(model) {

          // add new item to your collection
          collection.add(model);

          // send a change event to our collection so the 
          // list of todos is refreshed on our homepage.
          collection.trigger('change');

          // return back to the home page 
          router.navigate('#list',{trigger: true, replace: false});
        }
      });

      return this;
    }
  });

  var UpdateView = Backbone.View.extend({
    events: {
      "click #updateBtn": "update",  
      "click #deleteBtn": "delete"   
    },

    initialize: function() {
      this.router = this.options.router;
      this.model = this.options.model;
      this.collection = this.collection;
      this.template = _.template($('#update').html());
    },

    render: function() {
           $(this.el).html(this.template(this.model.toJSON()));
           return this;
    },
   
    update: function(e) {
      e.preventDefault();
            
      var       item = $('#updateForm').serializeObject(),
          collection = this.collection
              router = this.router;

      console.log(this.model);
      this.model.save(item,{
        success: function(model) {
          // return back to the home page 
          router.navigate('#list',{trigger: true, replace: false});
        }
      });
    },
        
    delete: function(e) {
      e.preventDefault();
            
      var collection = this.collection,
              router = this.router;

      this.model.destroy({
        success: function(model, result, options) {
          router.navigate('#list',{trigger: true, replace: false})
        },
        error: function(model, result, options) {
          console.log(result);
        }
      })
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes:{
      "":"home",
      "signup":"signup",
      "login":"login",
      "logout":"logout",
      "forgot":"forgot",
      "passwordreset":"passwordreset",
      "passwordreset/:temp":"passwordreset",
      "list":"list",
      "list/:reload":"list",
      "add":"add",
      "update/:id":"update"
    },

    initialize:function (options) {
      // Handle back button throughout the application
      $('.back').on('click', function(event) {
        window.history.back();

        return false;
      });
      this.firstPage = true;
      this.collection = options.collection;
    },

    home:function () {
      this.changePage(new HomeView(),true);
    },

    signup:function () {
      this.changePage(new SignUpView({collection:this.collection, router:this}),false);
    },

    login:function () {
      this.changePage(new LoginView({collection:this.collection, router:this}),false);
    },

    logout:function () {
      var user = new StackMob.User();
      user.logout();
      this.collection.fetch({async : true});
      this.navigate('#',{trigger: true, replace: false});
    },

    forgot:function () {
      this.changePage(new ForgotView({collection:this.collection, router:this}),false);
    },

    passwordreset:function (temp) {
      this.changePage(new PasswordResetView({temp:temp, collection:this.collection, router:this}),false);
    },

    list:function (reload) {
      if(reload) {
        this.collection.fetch({async :false});
      }
      this.changePage(new ListView({collection:this.collection}),true);
    },

    add:function () {
      this.changePage(new AddView({collection:this.collection, router:this}),false);
    },

    update:function (e) {
        model = this.collection.get(e);
        this.changePage(new UpdateView({collection:this.collection, router:this, model: model}), false);
      },
    
    changePage:function (page,reverse) {
      $(page.el).attr('data-role', 'page');
      page.render();
      $('body').append($(page.el));

      var transition = $.mobile.defaultPageTransition;
      // We don't want to slide the first page
      if (this.firstPage) {
        transition = 'none';
        this.firstPage = false;
      }
          
      $.mobile.changePage($(page.el), {changeHash:false, transition: transition, reverse: reverse});
    }
  });

  var initialize = function(){
    var todos = new Todos();
    todos.fetch({async: false});

    var app_router = new AppRouter({collection: todos});
    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };

}(jQuery));


$(document).ready(function () {
    app.initialize();
});

$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
         o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
