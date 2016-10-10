define([
    "react","jquery","bootstrap",
    "jsx!scripts/services/Services",
    "jsx!scripts/work/Work",
    "jsx!scripts/blog/Blog",
    "jsx!scripts/favorable/Favorable",
    "jsx!scripts/about/About",
    "jsx!scripts/team/Team",
    "jsx!scripts/contact/Contact",
    "jsx!scripts/footer/Footer",

   
],
function(React,JQuery,BootStrap,Services,Work,Blog,Favorable,About,Team,Contact,Footer){
    var Nav=BootStrap.Nav;
    var NavItem=BootStrap.NavItem;
    var Navbar=BootStrap.Navbar;
    var CollapsibleNav=BootStrap.CollapsibleNav;
    var DropdownButton=BootStrap.DropdownButton;
    var MenuItem=BootStrap.MenuItem;

    var tabList = [
        { 'id': 4, 'name': 'Home', 'url': 'Favorable','imgsrc':'style/images/images/fav_media_color.png'  },
        { 'id': 1, 'name': 'Services', 'url': 'Services','imgsrc':'#' },
        
        
        { 'id': 5, 'name': 'About', 'url': 'About','imgsrc':'#'  },
       
        { 'id': 7, 'name': 'Contact', 'url': 'Contact' ,'imgsrc':'#' },

        // { 'id': 6, 'name': 'Our Team', 'url': 'Team','imgsrc':'#'  },
        // { 'id': 2, 'name': 'Our Work', 'url': 'Work' ,'imgsrc':'#' },
        // { 'id': 3, 'name': 'Blog', 'url': 'Blog' ,'imgsrc':'#' },
    ];

    var Tab = React.createClass({
        handleClick: function(e){
            e.preventDefault();
            this.props.handleClick();
        },
        
        render: function(){
            //alert(this.props.key);
            if (this.props.name=='Home')
                return (
                    <li className={this.props.isCurrent ? 'current' : null}>
                        
                            <a onClick={this.handleClick} href={this.props.url}>
                                
                                {this.props.name}
                            </a>
                        
                    </li>
                );
            else
                return (
                    
                        <li className={this.props.isCurrent ? 'current' : null}>
                            
                                <a onClick={this.handleClick} href={this.props.url}>
                                    
                                        {this.props.name}
                                    
                                    
                                </a>
                           
                        </li>
                        
                        
                    
                );

        }
    });

    var Tabs = React.createClass({

        

        handleClick: function(tab){
            this.props.changeTab(tab);
        },
        
        render: function(){
            var icon = (
                <span className="logo">
                  <a href="/">
                    <img src="style/images/images/fav_media_color.png" height="60" width="260" alt="text here" /></a>
                </span>
              );
            return (

                 <div className="container example5">
                  <nav className="navbar navbar-default" role="navigation">
                    <div >
                      <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar5">
                          <span className="sr-only">Toggle navigation</span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#"><img src="style/images/images/yellow.svg" alt="Favourable Media" /></a>
                      </div>
                      <div id="navbar5" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                          <NavItem >
                                {this.props.tabList.map(function(tab) {
                                    return (

                                        <Tab
                                            handleClick={this.handleClick.bind(this, tab)}
                                            key={tab.id}
                                            url={tab.url}
                                            name={tab.name}
                                            imgsrc={tab.imgsrc}
                                            isCurrent={(this.props.currentTab === tab.id)} />
                                    );
                                }.bind(this))}
                                </NavItem>
                        </ul>
                      </div>
                      
                    </div>
                    
                  </nav>

                </div>
                // <div className="example2 collapse navbar-collapse">
                //   <nav className="navbar navbar-default navbar-fixed-top">
                //     <div className="container-fluid">
                //       <div className="navbar-header">
                //         <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar2">
                //           <span className="sr-only">Toggle navigation</span>
                //           <span className="icon-bar"></span>
                //           <span className="icon-bar"></span>
                //           <span className="icon-bar"></span>
                //         </button>
                //         <a className="brand" href="#"><img height="60" width="260" src="style/images/images/fav_media_color.png" alt="Dispute Bills" />
                //         </a>
                //       </div>
                //       <div id="navbar2" className="navbar-collapse collapse">
                //         <ul className="nav navbar-nav navbar-right">
                //           <NavItem >
                //                 {this.props.tabList.map(function(tab) {
                //                     return (

                //                         <Tab
                //                             handleClick={this.handleClick.bind(this, tab)}
                //                             key={tab.id}
                //                             url={tab.url}
                //                             name={tab.name}
                //                             imgsrc={tab.imgsrc}
                //                             isCurrent={(this.props.currentTab === tab.id)} />
                //                     );
                //                 }.bind(this))}
                //                 </NavItem>
                //         </ul>
                //       </div>
                      
                //     </div>
                   
                //   </nav>
                // </div>


                
            );
        }
    });


    var Content = React.createClass({
        changeTab1 : function(tab){
            //alert(tab);
            this.props.toChangeTab(tab);
        },

        childComponent: function (i) {
            
            if (i == 1) return <Services changeTab1={this.changeTab1}/>;
            if (i == 2) return <Work  changeTab1={this.changeTab1} />;
            if (i == 3) return <Blog changeTab1={this.changeTab1} />;
            if (i == 4) return <Favorable changeTab1={this.changeTab1} />;
            if (i == 5) return <About changeTab1={this.changeTab1} />;
            if (i == 6) return <Team changeTab1={this.changeTab1} />;
            if (i == 7) return <Contact changeTab1={this.changeTab1} />;
            //assert(false, "invalid child component: " + i);
        },
        render : function(){
            return (
                <div className="content collapse navbar-collapse">
                    {this.childComponent(this.props.currentTab)}
                    <div className="clearfix"></div>
                </div>
            );
        }
        
    });


    var Menu = React.createClass({
        
        getInitialState: function() {
            return {
                tabList: tabList,
                currentTab: 4
            };
        },
        changeTab: function(tab) {
            this.setState({
                currentTab: tab.id 
            });
        },
        toChangeTab: function(tab) {
            this.setState({
                currentTab: tab
            });
        },

        render: function() {
            
            return(
                <div className="collapse navbar-collapse">
                    <Tabs
                        currentTab={this.state.currentTab}
                        tabList={this.state.tabList}
                        changeTab={this.changeTab} />
                    <Content 
                            currentTab={this.state.currentTab} 
                            toChangeTab={this.toChangeTab}/>
                    <Footer 
                        currentTab={this.state.currentTab} 
                        tabList={this.state.tabList}
                        toChangeTab={this.toChangeTab}/>
                    
                </div>
            );
        }
    });

    return {
        "Menu" : Menu,
    };

});