angular.module('ngGulp.customer', ['ui.grid', 'ngDialog', 'ui.grid.resizeColumns']).config(['ngDialogProvider', '$routeProvider', function (ngDialogProvider, $routeProvider) {
    'use strict';
    ngDialogProvider.setDefaults({
        className: 'panel panel-info',
        plain: true,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
    //Customer
    $routeProvider.when('/customer', {
        controller: 'CustomerCtrl',
        templateUrl: 'customer/view/customer.html'
    });

    //Customer Edit
    $routeProvider.when('/customer/:customerId', {
        controller: 'CustomerEditCtrl',
        templateUrl: 'customer/view/customer-edit.html'
    });

}]);

angular
  .module('ngGulp.customer').service('CustomerService', ['$http',
      function($http) {
          'use strict';

          //REST service abstraction

          //RESTful webservice base URL
          var urlBase = '/services/customer';

          //Fetch all customers
          this.getCustomers = function() {
              return $http.get(urlBase);
          };

          //Fetch customer by ID
          this.getCustomer = function(id) {
              return $http.get(urlBase + '/' + id);
          };

          //Insert new customer
          this.insertCustomer = function(cust) {
              return $http.post(urlBase, cust);
          };

          //Update Customer
          this.updateCustomer = function(cust) {
              return $http.put(urlBase + '/' + cust.id, cust);
          };

          //Abstracts save for insert vs update
          this.save = function(cust) {
            var operation = cust.id ? this.updateCustomer : this.insertCustomer;
            return operation(cust);
          };

          //Delete customer record
          this.deleteCustomer = function(id) {
              return $http.delete(urlBase + '/' + id);
          };
      }
  ]);

angular
    .module('ngGulp.customer')
    .controller('CustomerEditCtrl', ['$scope', '$location', '$routeParams', 'CustomerService', 'ngDialog',
        function($scope, $location, $routeParams, CustomerService, ngDialog) {

            'use strict';
            init();

            //Initilize Edit view
            function init() {
                getCustomer($routeParams.customerId);
            }

            //Fetch customer by ID
            function getCustomer(id) {
                if (id === 'new') {
                    $scope.customer = {};
                } else {
                    CustomerService.getCustomer(id).success(function(cust) {
                        $scope.customer = cust;
                    }).error(function() {
                        $location.path('/customer');
                    });
                }

            }
            //Navigate back to customer view
            $scope.back = function() {
                $location.path('/customer');
            };

            //Save changes to backend
            $scope.updateCustomer = function() {
                var cust = $scope.customer;

                CustomerService.save(cust)
                    .success(function() {
                        $location.path('/customer');
                        $scope.status = 'Updated Customer! Refreshing customer list.';
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to update customer: ' + error.message;
                    });
            };

            //Delete selected record
            $scope.delete = function() {
                // var rowEntity = ctx.$parent.$parent.row.entity;
                var rowEntity = $scope.customer;
                var confirm = ngDialog.open({
                    template: 'customer/view/confirm.html',
                    className: 'ngdialog-theme-default',
                    plain: false,
                    scope: $scope
                });
                confirm.closePromise.then(function(data) {
                    // console.log('data:', data);
                    // console.log('rowEntity:', rowEntity);
                    if (data.value === 'Yes') {
                        $scope.deleteCustomer(rowEntity.id);
                    }
                });
            };

            //Delete confirmed record
            $scope.deleteCustomer = function(id) {
                CustomerService.deleteCustomer(id)
                    .success(function() {
                        $scope.status = 'Deleted Customer! Refreshing customer list.';
                        $location.path('/customer');
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to delete customer: ' + error.message;
                    });
            };
        }
    ]);

angular
    .module('ngGulp.customer')
    .controller('CustomerCtrl', ['$scope', '$location','CustomerService',
        function ($scope, $location, CustomerService) {
    'use strict';
    init();

    //Initilize customer view
    function init() {
      getCustomers();
        $scope.columns = [{
            field: 'id',
            width: '10%',
            maxWidth: 200
        }, {
            field: 'name'
        }, {
            field: 'age',
            width: '20%',
            maxWidth: 200
        }, {
            name: 'Action',
            cellTemplate: '<button class="btn btn-primary" ng-click="grid.appScope.edit(this)"><i class="fa fa-pencil"></i></button>',
            width: '20%',
            maxWidth: 200
        }];
        $scope.gridOpts = {
            enableSorting: true,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            onRegisterApi: function(gridApi) {
              $scope.gridApi = gridApi;
            },
            rowIdentity: function(row) {
              return row.id;
            },
            getRowIdentity: function(row) {
              return row.id;
            }
        };
    }

    //Edit selected record
    $scope.edit = function (ctx) {
      var rowEntity = ctx.$parent.$parent.row.entity;
      $location.path('/customer/' + rowEntity.id);
    };

    //Fetch customer data from backend
    function getCustomers() {
        CustomerService.getCustomers()
            .success(function (custs) {
                $scope.gridOpts.data = custs;
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

}]);

angular.module('myblog.todo', []);

angular
  .module('myblog.todo')
  .controller('TodoCtrl', ["$scope", "$window", function ($scope, $window) {
    'use strict';
    $scope.todos = JSON.parse($window.localStorage.getItem('todos') || '[]');
    $scope.$watch('todos', function (newTodos, oldTodos) {
      if (newTodos !== oldTodos) {
        $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      }
    }, true);

    $scope.add = function () {
      var todo = {label: $scope.label, isDone: false};
      $scope.todos.push(todo);
      $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      $scope.label = '';
    };

    $scope.check = function () {
      this.todo.isDone = !this.todo.isDone;
    };
  }]);

angular.module('myblog.home', []).config(['$routeProvider', '$locationProvider',
    function($routeProvider,$locationProvider) {
        'use strict';
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/home', {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.html'
            }).when('/about', {
                controller: 'HomeCtrl',
                templateUrl: 'home/about.html'
            }).when('/portfolio', {
                controller: 'HomeCtrl',
                templateUrl: 'home/portfolio.html'
            }).when('/contact', {
                controller: 'HomeCtrl',
                templateUrl: 'home/contact.html'
            }).when('/login', {
                controller: 'HomeCtrl',
                templateUrl: 'home/login.html'
            }).otherwise({ redirectTo: '/' });
    },

]);

angular.module('myblog.home').directive('navHeader', function() {
  'use strict';
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: true,
        templateUrl: 'home/nav-header.html',
        controller: ["$scope", "$element", "$location", function($scope, $element, $location) {
            $scope.isActive = function(viewLocation) {
                var active = false;
                if (viewLocation.length) {
                    if (viewLocation === $location.path()) {
                        active = true;
                    }
                } else {
                    for (var i = 0; i < viewLocation.length; i++) {
                        var l = viewLocation[i];
                        if (l === $location.path()) {
                            active = true;
                            break;
                        }
                    }
                }
                return active;

            };
        }]
    };
});

angular
  .module('myblog.home').controller('HomeCtrl', ['$scope',
      function($scope) {
          'use strict';
          $scope.greeting = 'Welcome to HariBlog.com &sathishBlog.com';
      }
  ]);


angular.module('myblog', [
  'ngRoute','ngResource',
  'myblog.home',
  'myblog.todo'
])
.config(['$routeProvider',
        function($routeProvider) {
            'use strict';
            //Default route
            $routeProvider.otherwise({
                redirectTo: '/home'
            });
        }
    ]);
(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/about.html',
    '<header class="intro-header home-header-size" style="background-image: url(\'assets/about-bg.jpg\')"><div class="container"><div class="row"><div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1"><div class="page-heading"><h1>About Me</h1><hr class="small"><span class="subheading">This is what I do.</span></div></div></div></div></header><div class="container"><div class="row"><div class="col-lg-2 col-md-2 col-sm-2 col-xs-12"><img src="assets/hari-contact.jpg" class="img-responsive img-center img-circle"></div><div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1"><p>Hey,hello there! My name is V.L.Hariharan from India. am a kind of person who love my work and life and yes! i make Killer design and write soild code<br>I have a passion of creating challenging, intuitive and beautiful products. My design and development process is very hands-on and visual. Creating is not just a job for me, it\'s a passion.</p></div></div></div><hr>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/contact.html',
    '<header class="intro-header home-header-size" style="background-image: url(\'assets/contact-bg.jpg\')"><div class="container"><div class="row"><div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1"><div class="page-heading"><h1>Contact Me</h1><hr class="small"><span class="subheading">Have questions? I have answers (maybe).</span></div></div></div></div></header><div class="container"><div class="row"><div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1"><p>Want to get in touch with me? Fill out the form below to send me a message and I will try to get back to you within 24 hours!</p><form name="sentMessage" id="contactForm" novalidate><div class="row control-group"><div class="form-group col-xs-12 floating-label-form-group controls"><label>Name</label><input class="form-control" placeholder="Name" id="name" required data-validation-required-message="Please enter your name."><p class="help-block text-danger"></p></div></div><div class="row control-group"><div class="form-group col-xs-12 floating-label-form-group controls"><label>Email Address</label><input type="email" class="form-control" placeholder="Email Address" id="email" required data-validation-required-message="Please enter your email address."><p class="help-block text-danger"></p></div></div><div class="row control-group"><div class="form-group col-xs-12 floating-label-form-group controls"><label>Phone Number</label><input type="tel" class="form-control" placeholder="Phone Number" id="phone" required data-validation-required-message="Please enter your phone number."><p class="help-block text-danger"></p></div></div><div class="row control-group"><div class="form-group col-xs-12 floating-label-form-group controls"><label>Message</label><textarea rows="5" class="form-control" placeholder="Message" id="message" required data-validation-required-message="Please enter a message."></textarea><p class="help-block text-danger"></p></div></div><br><div id="success"></div><div class="row"><div class="form-group col-xs-12"><button type="submit" class="btn btn-default">Send</button></div></div></form></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/home.html',
    '<header class="intro-header home-header-size" style="background-image: url(\'assets/home-bg.jpg\')"><div class="container"><div class="row"><div class="col-lg-8 col-lg-offset-2 col-md-12 col-md-offset-1"><div class="site-heading"><h1>HariBlog.in</h1><hr class="small"><span class="subheading">Enhanced Experience</span></div></div></div></div></header><div class="container"><div class="row"><div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1"><div class="post-preview"><a href="/portfolio"><h2 class="post-title">Man must explore, and this is exploration at its greatest</h2><h3 class="post-subtitle">Learn AngularJS</h3></a><p class="post-meta">Posted by <a href="#">Hari</a> on March 24, 2015</p></div><hr><ul class="pager"><li class="next"><a href="#">Older Posts &rarr;</a></li></ul></div></div></div><hr>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/login.html',
    '<header class="intro-header home-header-size" style="background-image: url(\'assets/contact-bg.jpg\')"><div class="container"><div class="row"><div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1"><div class="page-heading"><h1>Sign In / Sign Up</h1><hr class="small"><span class="subheading">Have Account?Register Now.</span></div></div></div></div></header><div class="container"><div class="row"><article class="col-xs-12 maincontent"><header class="page-header"><h1 class="page-title">Sign In</h1></header><div class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2"><div class="panel panel-default"><div class="panel-body"><h3 class="thin text-center">Sign in to your account</h3><p class="text-center text-muted">Not register yet? <a href="signup.html">Register Now</a> it will take hardly a minute.</p><hr><form><div class="top-margin"><label>Username/Email <span class="text-danger">*</span></label><input class="form-control"></div><div class="top-margin"><label>Password <span class="text-danger">*</span></label><input type="password" class="form-control"></div><hr><div class="row"><div class="col-lg-8"><b><a href="">Forgot password?</a></b></div><div class="col-lg-4 text-right"><button class="btn btn-default" type="submit">Sign in</button></div></div></form></div></div></div></article></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/nav-header.html',
    '<nav class="navbar navbar-default navbar-custom navbar-fixed-top"><div class="container-fluid"><div class="navbar-header page-scroll"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="/">HariBlog.in</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"><ul class="nav navbar-nav navbar-right"><li><a href="/">Home</a></li><li><a href="/about">About Me</a></li><li><a href="/portfolio">Portfolio</a></li><li><a href="/contact">Contact</a></li><li><a href="/login">SIGN IN / SIGN UP</a></li></ul></div></div></nav>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/portfolio.html',
    '<div class="back-section"><div class="container"><div class="row pad-top-one text-center"><div class="col-lg-4 col-md-4 col-sm-4"><span class="logo-cls">HariBlog.com</span></div><div class="col-lg-4 col-md-4 col-sm-4"></div><div class="col-lg-4 col-md-4 col-sm-4"><i class="fa fa-phone"></i> +919944633732<br><i class="fa fa-envelope-o"></i> hariharan.loganathan@gmail.com</div></div></div><div class="col-lg-12 col-md-12 col-sm-12 head-line">Sorry, Website <img src="assets/maintenance.png" class="img-circle img-custom"> Under Maintenance</div><div class="col-lg-12 col-md-12 col-sm-12 sub-line">Please check after some time, till the time you can enjoy a movie or cup of tea</div><div class="container"><div class="row pad-top-two text-center"><div class="col-lg-4 col-md-4 col-sm-4"></div><div class="col-lg-4 col-md-4 col-sm-4">2,padma Nagar,Bharathiar university post,Coimbatore,<br>Tamil Nadu.</div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('todo/todo.html',
    '<h3>Todo</h3><ul class="todo-list"><li class="todo-item" ng-repeat="todo in todos" ng-class="{\'todo-done\': todo.isDone}"><label><input type="checkbox" ng-click="check()" ng-model="todo.isDone">&nbsp;{{todo.label}}</label></li><li class="todo-item"><form ng-submit="add()"><input placeholder="New item..." ng-model="label"> <button type="submit" ng-disabled="posting || !label">Add</button></form></li></ul><dl><dt><a href="#/todo" class="btn btn-primary"><i class="fa fa-bars"></i> TODO</a></dt><dd>A Simple TODO application to demo the AngularJS</dd></dl>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('customer/view/confirm.html',
    '<div class="panel-heading"><h3 class="panel-title">Warning</h3></div><div class="panel-body">You are about to delete a record. Are you sure?<div class="pull-right"><button value="No" ng-click="closeThisDialog(\'No\')" class="btn btn-danger">No</button> <button value="Yes" ng-click="closeThisDialog(\'Yes\')" class="btn btn-success">Yes</button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('customer/view/customer-edit.html',
    '<h3>Customers</h3><div ng-if="status" class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Message:</strong>{{status}}</div><form><div class="form-group"><label for="Id">Id</label><input class="form-control" placeholder="ID" ng-model="customer.id" readonly></div><div class="form-group"><label for="name">Name</label><input class="form-control" id="name" placeholder="Name" ng-model="customer.name"></div><div class="form-group"><label for="age">Age</label><input class="form-control" id="age" placeholder="Age" ng-model="customer.age"></div><button class="btn btn-default" ng-click="back()"><i class="fa fa-undo"></i> Cancel</button> <button class="btn btn-primary" ng-click="updateCustomer()"><i class="fa fa-floppy-o"></i> Save</button> <button class="btn btn-danger" ng-if="customer.id" ng-click="delete()"><i class="fa fa-trash-o"></i> Delete</button></form>');
}]);
})();

(function(module) {
try {
  module = angular.module('myblog');
} catch (e) {
  module = angular.module('myblog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('customer/view/customer.html',
    '<h3>Customers</h3><a href="#/home" class="btn btn-primary"><i class="fa fa-home"></i> Home</a> <a href="#/customer/new" class="btn btn-success"><i class="fa fa-user-plus"></i> Add</a><div ng-if="status" class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Message:</strong>{{status}}</div><div id="grid1" ui-grid="gridOpts" class="grid myGrid" ui-grid-resize-columns></div>');
}]);
})();
