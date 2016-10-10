define([
    "react",
    "jsx!scripts/header/Header",
    "jsx!scripts/footer/Footer",
   
],
function (React,Header,Footer) { // Support for IE 11
    function initialize(){

        var LandingPage = Header.Menu;
        
        
        React.render(
                <LandingPage/>, document.getElementById('container')
            );
    }
        // Support for IE 11
    return {
        "initialize": initialize,
    };
});
