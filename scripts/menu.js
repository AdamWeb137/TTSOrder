const app = angular.module("menu",[]);
app.controller("menu",($scope)=>{
    $scope.reset = ()=>{
        remove_local("curr_categories");
        remove_local("food_categories");
        remove_local("cat_values");
        remove_session("meals");
    };
    $scope.ask_reset = ()=>{
        if(!window.confirm("Are you sure you'd like to reset?")) return;
        $scope.reset();
        $scope.load();
        $scope.$apply();
    };
    // $scope.reset();
    $scope.all_categories = JSON.parse(get_local_default("food_categories",JSON.stringify({
        "Main":["Burger","Cheeseburger"],
        "Side":["Fries"],
        "Drink":["Medium Dr Pepper"]
    })));
    $scope.categories = JSON.parse(get_local_default("curr_categories",JSON.stringify(["Main","Side","Drink"])));
    $scope.cat_values = JSON.parse(get_local_default("cat_values",JSON.stringify(["","",""])));
    $scope.save = () => {
        set_local("curr_categories",JSON.stringify($scope.categories));
        set_local("food_categories",JSON.stringify($scope.all_categories));
        set_json_local("cat_values",$scope.cat_values);
    };
    $scope.load = () => {
        $scope.all_categories = JSON.parse(get_local_default("food_categories",JSON.stringify({
            "Main":["Burger","Cheeseburger"],
            "Side":["Fries"],
            "Drink":["Medium Dr Pepper"]
        })));
        $scope.categories = JSON.parse(get_local_default("curr_categories",JSON.stringify(["Main","Side","Drink"])));
        $scope.cat_values = JSON.parse(get_local_default("cat_values",JSON.stringify(["","",""])));
    };
    $scope.remove_cat = (i)=>{
        if($scope.categories.length > 1){
            if(!window.confirm("Are you sure you want to delete this category?"))return;
            $scope.categories.splice(i,1);
            $scope.cat_values.splice(i,1);
            if(i > 0 && i == $scope.selected){
                $scope.selected--;
            }
            $scope.save();
            $scope.$apply();
        }
    };
    $scope.new_cat = ()=> {
        let input = document.querySelector("input[name='new_cat']");
        if(input.value.length == 0 || input.value in $scope.all_categories){
            alert("That category already exists");
            return;
        }
        $scope.categories.splice($scope.selected,0,input.value);
        $scope.cat_values.splice($scope.selected,0,"");
        $scope.all_categories[input.value] = [];
        $scope.save();
        $scope.$apply();
    };
    $scope.add_cat = ()=>{
        let input = document.querySelector("select[name='add_cat']");
        if($scope.categories.indexOf(input.value) > -1){
            alert("That category is already added!");
            return;
        }
        $scope.categories.splice($scope.selected,0,input.value);
        $scope.cat_values.splice($scope.selected,0,"");
        $scope.save();
        $scope.$apply();
    };
    $scope.selected = 0;
    $scope.select = (i)=>{
        $scope.selected = i;
        $scope.$apply();
    };
    $scope.new_it = ()=>{
        let input = document.querySelector("input[name='new_it']");
        if(input.value.length == 0 || $scope.all_categories[$scope.categories[$scope.selected]].indexOf(input.value) > -1){
            alert("That item already exists");
            return;
        }
        $scope.all_categories[$scope.categories[$scope.selected]].push(input.value);
        $scope.cat_values[$scope.selected] = input.value;
        $scope.save();
        $scope.$apply();
    };
    $scope.del_it = ()=>{
        let input = document.querySelector("select[name='add_cat']");
        let i = input.selectedIndex;
        $scope.all_categories[$scope.categories[$scope.selected]].splice(i,1);
        $scope.cat_values[$scope.selected] = "";
        $scope.save();
        $scope.apply();
    };
    $scope.render = (json, apply=false)=>{
        $scope.categories = [];
        for(let i = 0; i < json.length; i++){
            $scope.categories.push(json[i].type);
        }
        $scope.save();
        if(apply) $scope.$apply();
    };
    $scope.get_json = ()=>{
        console.log($scope.cat_values);
        let array = new Array($scope.categories.length);
        for(let i = 0; i < array.length; i++){
            array[i] = {
                name:$scope.cat_values[i],
                type:$scope.categories[i]
            };
        }
        return array;
    };
    $scope.add_meal = ()=>{
        let json = [$scope.get_json()];
        add_array_session("meals",json);
        window.location.href = "list.html";
    };
    $scope.goback = ()=>{
        window.location.href = "list.html";
    };
});