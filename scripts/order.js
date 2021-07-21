const app = angular.module("order", []);
let speech = new SpeechSynthesisUtterance();
let voices = [];
window.speechSynthesis.addEventListener("voiceschanged",() => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];
    let select = document.querySelector("select[name='voices']");
    voices.forEach((voice, i)=>{
        select.options[i] = new Option(voice.name, i);
    });
});
class SpeechHandler {
    static set_vol(speech, vol){
        speech.volume = vol;
    }
    static set_voice(speech, voice){

    }
    static set_default(speech){
        speech.lang = "en";
        speech.rate = 1;
        speech.volume = 1;
        speech.pitch = 1;
    }
    static link_inputs(speech){
        let select = document.querySelector("select[name='voices']");
        select.addEventListener("change",()=>{
            speech.voice = voices[select.value];
        });

        const set_range_event = (name)=>{
            let el = document.querySelector(`input[name="${name}"]`);
            el.addEventListener("input",()=>{
                speech[name] = Number(el.value);
            });
        };

        set_range_event("pitch");
        set_range_event("volume");
        set_range_event("rate");


    }
}
SpeechHandler.set_default(speech);

app.controller("order",($scope)=>{
    window.speechSynthesis.cancel();

    $scope.speech = speech;
    const def = ["hello i want a burger", "make that a meal", "medium fries and drink", "thank you"];
    $scope.order_lines = JSON.parse(get_session_default("lines",JSON.stringify(def)));
    $scope.response_lines = ["Yes","No","Thank you","That's all","number", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    $scope.lines = $scope.order_lines;
    $scope.line_type = "order";
    $scope.playing = false;
    $scope.autoplay = false;
    $scope.canceled = false;
    $scope.rewinded = false;

    window.addEventListener("load",()=>{
        SpeechHandler.link_inputs($scope.speech);
    });

    $scope.select = (i, apply=true, let_auto = true, user_input=false)=>{
        $scope.selected = i;
        $scope.speech.text = $scope.lines[i];
        if($scope.line_type == "order"){
            if($scope.selected > 0 && $scope.autoplay && let_auto) $scope.play();
        }else{
            if(user_input)$scope.play();
        }
        if (apply) $scope.$apply();
    };
    $scope.select(0,false);

    $scope.play = ()=>{
        let play_btn = document.querySelector("#play_btn");
        play_btn.src = "imgs/order/pause.png";
        $scope.playing = true;
        $scope.speech.text = $scope.lines[$scope.selected];
        if(window.speechSynthesis.speaking){
            window.speechSynthesis.resume();
        }
        else{
            window.speechSynthesis.speak($scope.speech);
        }
    };
    $scope.pause = ()=>{
        let play_btn = document.querySelector("#play_btn");
        play_btn.src = "imgs/order/play.png";
        window.speechSynthesis.pause();
        $scope.playing = false;
    };
    $scope.play_or_pause = ()=>{
        ($scope.playing) ? $scope.pause() : $scope.play();
    };
    $scope.stop = ()=>{
        window.speechSynthesis.cancel();
        $scope.playing = false;
        let play_btn = document.querySelector("#play_btn");
        play_btn.src = "imgs/order/play.png";
    };
    $scope.cancel = ()=>{
        $scope.canceled = true;
        $scope.stop();
    };
    $scope.select_ahead = (i)=>{
        if (i < 0 ) $scope.rewinded = true;
        $scope.stop();

        let news = $scope.selected+i;
        if(news < 0) news = $scope.lines.length-1;
        if(news >= $scope.lines.length) news = 0;

        let let_auto = (i < 0) ? false : true;
        $scope.select(news, true, let_auto);
    };
    $scope.speech.addEventListener("end",(e)=>{
        if(!$scope.canceled && !$scope.rewinded){
            $scope.stop();
            $scope.select_ahead(1);
        }
        $scope.canceled = false;
        $scope.rewinded = false;
    });

    $scope.new = ()=>{
        $scope.lines.splice($scope.selected+1,0,"filler");
        $scope.select($scope.selected+1,true,false);
        $scope.$apply();
    };

    $scope.delete = ()=>{
        if($scope.lines.length > 1){
            $scope.lines.splice($scope.selected,1);
            let new_sel = ($scope.selected > 0) ? $scope.selected - 1 : 0;
            $scope.select(new_sel, true, false);
            $scope.$apply();
        }
    };

    $scope.goback = ()=>{
        window.location.href="list.html";
    }

    $scope.change_lines = (type)=>{
        let lines = (type == "order") ? $scope.order_lines : $scope.response_lines;
        $scope.line_type = type;
        $scope.lines = lines;
        $scope.select(0);
    };

});