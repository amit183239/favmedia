define([
    "react","jquery","bootstrap","router-bootstrap"
    "jsx!scripts/services/Services",
    "jsx!scripts/work/Work",
    "jsx!scripts/blog/Blog",
    "jsx!scripts/favorable/Favorable",
    "jsx!scripts/about/About",
    "jsx!scripts/team/Team",
    "jsx!scripts/contact/Contact",
    "jsx!scripts/footer/Footer",

   
],
function(React,JQuery,BootStrap,RouterBootStrap,Services,Work,Blog,Favorable,About,Team,Contact,Footer){
    var Nav=BootStrap.Nav;
    var NavItem=BootStrap.NavItem;
    var Navbar=BootStrap.Navbar;
    var CollapsibleNav=BootStrap.CollapsibleNav;
    var DropdownButton=BootStrap.DropdownButton;
    var MenuItem=BootStrap.MenuItem;

    var tabList = [
        { 'id': 1, 'name': 'Services', 'url': 'Services','imgsrc':'#' },
        { 'id': 2, 'name': 'Our Work', 'url': 'Work' ,'imgsrc':'#' },
        { 'id': 3, 'name': 'Blog', 'url': 'Blog' ,'imgsrc':'#' },
        { 'id': 4, 'name': 'Favorable', 'url': 'Favorable','imgsrc':'style/images/like.png'  },
        { 'id': 5, 'name': 'About', 'url': 'About','imgsrc':'#'  },
        { 'id': 6, 'name': 'Our Team', 'url': 'Team','imgsrc':'#'  },
        { 'id': 7, 'name': 'Contact', 'url': 'Contact' ,'imgsrc':'#' },
    ];

    var Tab = React.createClass({
        handleClick: function(e){
            e.preventDefault();
            this.props.handleClick();
        },
        
        render: function(){
            //alert(this.props.key);
            if (this.props.name=='Favorable')
                return (
                    <li className={this.props.isCurrent ? 'current' : null}>
                        <div className='logo'>
                            <a onClick={this.handleClick} href={this.props.url}>
                                <img src={this.props.imgsrc} >
                                    {this.props.name}
                                </img>
                                
                            </a>
                        </div>
                    </li>
                );
            else
                return (
                    
                        <li className={this.props.isCurrent ? 'current' : null}>
                            <div className='logo'>
                                <a onClick={this.handleClick} href={this.props.url}>
                                    
                                        {this.props.name}
                                    
                                    
                                </a>
                            </div>
                        </li>
                        
                        
                    
                );

        }
    });

    var Tabs = React.createClass({
       handleClick: function(tab){
            this.props.changeTab(tab);
        },
        
        render: function(){
            return (
                <div className="collapse navbar-collapse">
                    
                    <Navbar fluid brand='Favorable.in'>
                        <CollapsibleNav eventKey={1}> {/* This is the eventKey referenced */}    
                            
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

                                
                            
                        </CollapsibleNav>
                    </Navbar>
                    
                    
                </div>
            );
        }
    });


    var Content = React.createClass({
        childComponent: function (i) {
            
            if (i == 1) return <Services />;
            if (i == 2) return <Work  />;
            if (i == 3) return <Blog sharedState />;
            if (i == 4) return <Favorable />;
            if (i == 5) return <About />;
            if (i == 6) return <Team  />;
            if (i == 7) return <Contact  />;
            assert(false, "invalid child component: " + i);
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
                <div>
                    <Tabs
                        currentTab={this.state.currentTab}
                        tabList={this.state.tabList}
                        changeTab={this.changeTab} />
                    <Content currentTab={this.state.currentTab} />
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