const app = angular.module("index",[]);
app.controller("index",($scope)=>{
    $scope.reset = ()=>{
        if(!window.confirm("This will delete all your saved meals, orders, categories, and items! Are you sure?")) return;
        remove_local("saved_meals");
        remove_local("saved_meal_names");
        remove_local("curr_categories");
        remove_local("food_categories");
        remove_local("saved_order_names");
        remove_local("saved_orders");
        remove_local("cat_values");
        remove_session("meals");
        remove_session("lines");
    }
});