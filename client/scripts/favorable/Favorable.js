define([
    "react","jquery","bootstrap",
    "jsx!scripts/Common",  
    "jsx!scripts/contact/Contact",
],
function(React,JQuery,BootStrap,Common,Contact){
    var Input=BootStrap.Input;
    var ListGroup=BootStrap.ListGroup;
    var ListGroupItem=BootStrap.ListGroupItem;
    var Carousel=BootStrap.Carousel;
    var CarouselItem=BootStrap.CarouselItem;
    var Table=BootStrap.Table;
    var Jumbotron=BootStrap.Jumbotron;
    var Button=BootStrap.Button;

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }


    var Favorable = React.createClass({

        getInitialState: function() {
            return {
                email_id:'',
            };
        },


        emailChange: function() {
            this.setState({
                email_id: this.refs.email.getValue()
            });
        },

        emailvalidationState: function() {
            
            var email_in = this.state.email_id;
            //alert(":heere");
            if(validateEmail(email_in))
                { return 'success'; }
            else
                { return 'error'; }
            
        },

        submithandleButtonClick: function() {

            var option = {
                    
                    email_id:this.state.email_id,
                   
                }


            Common.saveEmail("ExportPDF", option, function (data) {
                alert("mail succesfully send");
            }.bind(this));

        },

        

        handleClick:function(){
            //alert("ASdas");
            this.props.changeTab1(7);
            
        },
      

        render: function() {
            
            return(
                <div className='content_favorable'>
                    

                    <div >
                        <Table>
                            <tr>
                            </tr>
                            <tr>
                                <td className='data-favorable'>
                                    <p className='p-favorable'>We can increase your profit line, by marketing your brand online. </p>
                                    <p className='p-favorable'>With our Favorable 360 degree succession of marketing service we provide</p>
                                    
                                        <ul>
                                            <li>Favorable SEO/SEM.</li>
                                            <li>Favorable PPC Marketing.</li>
                                            <li>Favorable Customer Communication.</li>
                                            <li>Favorable Outbound Email Campaign.</li>
                                            <li>Favorable Inbound lead Nurturing.</li>
                                            <li>Favorable SMO/SMM.</li>
                                            <li>Favorable Website Creation.</li>
                                        </ul>
                                    
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </Table>

                       
                    </div>
                    <div className='div-separator-container'>
                        <div className='div-separator'>
                        </div>
                        <div className='div-jumbotron'>

                            <Jumbotron>
                                <p className='p-jumbotron1'>Subscribe to the Favorable Media Blog.</p>

                                <p className='p-jumbotron2'>Stay up-to-date with the latest digital marketing trends.</p>
                                <p className='p-jumbotron-email'>
                                <Table>
                                    <tr>
                                        <td>

                                            <Input  type='email' 
                                                    placeholder='Enter email' 
                                                    ref='email'
                                                    value={this.state.email_id}
                                                    onChange={this.emailChange}
                                                    bsStyle={this.emailvalidationState()}
                                                    hasFeedback/>
                                        </td>
                                        <td>

                                            <Button bsStyle='primary' onClick={this.submithandleButtonClick}>Subscribe</Button>
                                            <Button bsStyle='success' onClick={this.handleClick}>CONTACT US</Button>
                                        </td>
                                    </tr>
                                </Table>
                                </p>
                            </Jumbotron>
                        </div>
                    </div>

                </div>
            );
        }
    });

    return Favorable;

});