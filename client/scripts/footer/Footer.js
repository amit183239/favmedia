define([
    "react","jquery","bootstrap" ,
    "jsx!scripts/services/Services",
    "jsx!scripts/work/Work",
    "jsx!scripts/blog/Blog",
    "jsx!scripts/favorable/Favorable",
    "jsx!scripts/about/About",
    "jsx!scripts/team/Team",
    "jsx!scripts/contact/Contact",
],
function(React,JQuery,BootStrap,Services,Work,Blog,Favorable,About,Team,Contact){
    var Nav=BootStrap.Nav;
    var NavItem=BootStrap.NavItem;
    var Navbar=BootStrap.Navbar;
    var CollapsibleNav=BootStrap.CollapsibleNav;
    var DropdownButton=BootStrap.DropdownButton;
    var Button=BootStrap.Button;
    var Pager=BootStrap.Pager;
    var PageItem=BootStrap.PageItem;



   

    var Footer=React.createClass({
        handleClick:function(){
            var tab_id=0;
            for(var i=0;i<(this.props.tabList).length;i++)
            {
                if(this.props.tabList[i]['name']=='Contact')
                    tab_id=this.props.tabList[i]['id'];
            }
            this.props.toChangeTab(tab_id);
            
        },

        render: function(){
           return( 
            <div className="collapse navbar-collapse">
                <Pager>
                    <PageItem href='#'>MEET THE REST OF THE FAVORABLE FAMILY</PageItem>
                </Pager>
                <Button bsStyle='success' onClick={this.handleClick}>CONTACT US</Button>

            </div>
            )
        }
    });

    return Footer;

});