const app = angular.module("list",[]);
app.controller("list",($scope)=>{
    const test_meals = [
        [{
            name:"Burger",
            type:"Main"
        },{
            name:"Fries",
            type:"Side"
        },{
            name:"Medium Dr Pepper",
            type:"Drink"
        }]
    ];
    $scope.saved_meal_names = JSON.parse(get_local_default("saved_meal_names","[]"));
    $scope.saved_meals = JSON.parse(get_local_default("saved_meals","{}"));
    $scope.meals = JSON.parse(get_session_default("meals",JSON.stringify([])));
    $scope.clear = ()=>{
        if(!window.confirm("Are you sure you'd like to delete all meals?")) return;
        $scope.meals = [];
        $scope.save();
        $scope.$apply();
    };
    $scope.add = ()=>{
        set_session("meal_mode","add");
        window.location.href = "menu.html";
    };
    $scope.save = ()=>{
        set_json_session("meals",$scope.meals);
        set_json_local("saved_meal_names",$scope.saved_meal_names);
        set_json_local("saved_meals",$scope.saved_meals);
    };
    $scope.delete_meal = (i)=>{
        $scope.meals.splice(i,1);
        $scope.save();
        $scope.$apply();
    };
    $scope.get_lines = ()=>{
        let lines = ["I would like a"];
        for(let i = 0; i < $scope.meals.length; i++){
            let meal = $scope.meals[i];
            for(let j = 0; j < meal.length; j++){
                if(meal[j].name.length > 0){
                    lines.push(meal[j].name);
                    if(j < meal.length-1) lines.push("with a");
                }
            }
            if(lines[lines.length-1] == "with a") lines.pop();
            if(i < $scope.meals.length-1) lines.push("Next, I'd like a");
        }
        if(lines[lines.length-1] == "Next, I'd like a") lines.pop();
        lines.push("That's all.");
        return lines;
    };
    $scope.order = ()=>{
        set_json_session("lines",$scope.get_lines());
        window.location.href = "order.html";
    };

    $scope.save_meal = ()=>{

        let ninput = document.querySelector("input[name='save_num']");
        if(Number(ninput.value) % 1 != 0 || Number(ninput.value) > $scope.meals.length || Number(ninput.value) < 1){
            alert("Invalid Meal Number");
            return;
        }
        let input = document.querySelector("input[name='save_meal']");
        if(input.value.length == 0){
            alert("Must Input Meal Name to save Meal");
            return;
        }
        if($scope.saved_meal_names.indexOf(input.value) > -1){
            alert("Meal name already saved");
            return;
        }
        $scope.saved_meal_names.push(input.value);
        $scope.saved_meals[input.value] = $scope.meals[Number(ninput.value)-1];
        $scope.save();
        $scope.$apply();
    };

    $scope.load_meal = ()=>{
        let input = document.querySelector("select[name='load_meal']");
        if($scope.saved_meal_names.indexOf(input.value) == -1) return;
        $scope.meals.push($scope.saved_meals[input.value]);
        $scope.save();
        $scope.$apply();
    };
});