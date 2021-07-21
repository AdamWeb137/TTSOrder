function get_local(name){
    return localStorage.getItem(name);
}
function set_local(name, value){
    return localStorage.setItem(name,value);
}
function get_local_default(name,def){
    let curr = get_local(name);
    if(!curr){
        set_local(name,def);
        return def;
    }
    return curr;
}
function remove_local(name){
    localStorage.removeItem(name);
}
function remove_session(name){
    sessionStorage.removeItem(name);
}
function get_session(name){
    return sessionStorage.getItem(name);
}
function set_session(name,value){
    return sessionStorage.setItem(name,value);
}
function get_session_default(name,def){
    let curr = get_session(name);
    if(!curr){
        set_session(name,def);
        return def;
    }
    return curr;
}
function get_json_local(name){
    return JSON.parse(get_local(name));
}
function set_json_local(name,value){
    set_local(name,JSON.stringify(value));
}
function get_json_session(name){
    return JSON.parse(get_session(name));
}
function set_json_session(name,value){
    set_session(name,JSON.stringify(value));
}

function add_array_session(name,adding){
    let curr = get_json_session(name);
    if(curr == null) curr = [];
    set_json_session(name,curr.concat(adding));
}