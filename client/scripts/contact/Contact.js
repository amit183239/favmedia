define([
    "react","jquery","bootstrap",   
    "jsx!scripts/Common",
],
function(React,JQuery,BootStrap,Common){
    var Input=BootStrap.Input;
    var ButtonInput=BootStrap.ButtonInput;
    var ListGroup=BootStrap.ListGroup;
    var ListGroupItem=BootStrap.ListGroupItem;
    var Carousel=BootStrap.Carousel;
    var CarouselItem=BootStrap.CarouselItem;
    var Table=BootStrap.Table;
    var validate=true;
    var mobile_pat=/^([0-9]){10}$/;

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    var Contact = React.createClass({


        getInitialState: function() {
            return {
                first_name:'',
                last_name:'',
                email_id:'',
                phone_no:'',
                comapany_name:'',
                city_name:'',
                message:'',
                select_option:'0',
            };
        },
        firstNameChange: function() {
            this.setState({
                first_name: this.refs.input1.getValue()
            });
        },
        firstNamevalidationState: function() {
            var length1 = this.state.first_name.length;
            //alert(length1);
            if (length1 > 3) 
                { return 'success'; }
            else  
                { return 'error'; }
        },
        lastNameChange: function() {
            this.setState({
                last_name: this.refs.input2.getValue()
            });
        },
        lastNamevalidationState: function() {
            var length1 = this.state.last_name.length;
            //alert(length1);
            if (length1 > 3) 
                { return 'success'; }
            else  
                { return 'error'; }
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


        companyChange: function() {
            this.setState({
                comapany_name: this.refs.company.getValue()
            });
        },
        companyvalidationState: function() {
            var length1 = this.state.comapany_name.length;
            //alert(length1);
            if (length1 > 3) 
                { return 'success'; }
            else  
                { return 'error'; }
        },

        phoneChange: function() {
            this.setState({
                phone_no: this.refs.phone.getValue()
            });
        },
        phonevalidationState: function() {
            var phone_in = this.state.phone_no;

            if(phone_in.match(mobile_pat)==null || phone_in=='')
                { return 'error'; }
            else  
                { return 'success'; }
        },

        cityChange: function() {
            this.setState({
                city_name: this.refs.city.getValue()
            });
        },
        cityvalidationState: function() {
            var length1 = this.state.city_name.length;
            //alert(length1);
            if (length1 > 3) 
                { return 'success'; }
            else  
                { return 'error'; }
        },

        selectChange: function() {
            this.setState({
                select_option: this.refs.select.getValue()
            });
        },
        selectvalidationState: function() {
            var length1 = this.state.select_option;

            if(length1==0)            
                { return 'error'; }
            else
                { return 'success'; }
            
        },


        messageChange: function() {
            this.setState({
                message: this.refs.message.getValue()
            });
        },
        messagevalidationState: function() {
            var length1 = this.state.message.length;
            //alert(length1);
            if (length1 > 5) 
                { return 'success'; }
            else  
                { return 'error'; }
        },


        resethandleButtonClick: function() {
            this.setState({
                first_name:'',
                last_name:'',
                email_id:'',
                phone_no:'',
                comapany_name:'',
                city_name:'',
                message:'',
                select_option:'0',
            });
        },

        submithandleButtonClick: function() {

            var option = {
                    first_name:this.state.first_name,
                    last_name:this.state.last_name,
                    email_id:this.state.email_id,
                    phone_no:this.phone_no,
                    comapany_name:this.state.comapany_name,
                    city_name:this.state.city_name,
                    message:this.state.message,
                    select_option:this.state.select_option,
                }


            Common.exportApi("ExportPDF", option, function (data) {
                alert("mail succesfully send");
            }.bind(this));

        },


        render: function() {
            
            return(
                <div className='content_contact'>
                    <div>
                       <Carousel>
                            <CarouselItem>
                              <img width={900} height={500} alt='900x500' align='center' src='style/images/contact_banner.jpg'/>
                              <div className='carousel-caption'>
                                <h3>First slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                              </div>
                            </CarouselItem>
                        </Carousel>
                    </div>

                    <Table responsive>
                        <tbody>
                            <tr>
                                <td><h2>Comapany Headquarters</h2></td>
                                <td><h2>Client or Agency Partner?</h2></td>
                            </tr>
                        
                        
                            <tr>
                                <td>Dummy</td>
                                <td>
                                    
                                        <Table responsive className='borderless'>
                                            <thead>
                                                <tr>
                                                    <th colSpan='2'><h4>Fill out the form to start being Favorable.</h4></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><Input  type='text' 
                                                                label='First Name'
                                                                placeholder='First Name'
                                                                ref='input1'
                                                                value={this.state.first_name}
                                                                onChange={this.firstNameChange}
                                                                bsStyle={this.firstNamevalidationState()}
                                                                hasFeedback />
                                                    </td>
                                                    <td><Input  type='text' 
                                                                label='Last Name'
                                                                placeholder='Last Name'
                                                                ref='input2'
                                                                value={this.state.last_name}
                                                                onChange={this.lastNameChange}
                                                                bsStyle={this.lastNamevalidationState()}
                                                                hasFeedback />
                                                    </td>
                                                </tr>
                                           
                                                <tr>
                                                    <td colSpan='2'><Input  type='email' 
                                                                            label='Email Address'
                                                                            placeholder='Enter email' 
                                                                            ref='email'
                                                                            value={this.state.email_id}
                                                                            onChange={this.emailChange}
                                                                            bsStyle={this.emailvalidationState()}
                                                                            hasFeedback/>
                                                    </td>
                                                </tr>
                                            
                                                <tr>
                                                    <td colSpan='2'><Input  type='text'
                                                                            label='Company Name' 
                                                                            placeholder='Company Name'
                                                                            ref='company'
                                                                            value={this.state.comapany_name}
                                                                            onChange={this.companyChange}
                                                                            bsStyle={this.companyvalidationState()}
                                                                            hasFeedback />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><Input  type='text'  
                                                                label='Phone No.' 
                                                                placeholder='Phone No.'
                                                                ref='phone'
                                                                value={this.state.phone_no}
                                                                onChange={this.phoneChange}
                                                                bsStyle={this.phonevalidationState()}
                                                                hasFeedback />
                                                    </td>
                                                    <td><Input  type='text' 
                                                                label='City' 
                                                                placeholder='City' 
                                                                ref='city'
                                                                value={this.state.city_name}
                                                                onChange={this.cityChange}
                                                                bsStyle={this.cityvalidationState()}
                                                                hasFeedback />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan='2'><Input  type='textarea' 
                                                                            label='Message' 
                                                                            placeholder='Enter Message' 
                                                                            ref='message'
                                                                            value={this.state.message}
                                                                            onChange={this.messageChange}
                                                                            bsStyle={this.messagevalidationState()}
                                                                            hasFeedback /></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan='2'>
                                                        <Input  type='select' 
                                                                label='What do you want to talk about?' 
                                                                placeholder='select'
                                                                ref='select'
                                                                value={this.state.select}
                                                                onChange={this.selectChange}
                                                                bsStyle={this.selectvalidationState()}
                                                                hasFeedback >
                                                            <option value='0'>select here</option>
                                                            <option value='1'>Become a client/discuss an RFP</option>
                                                            <option value='2'>Become a media partner/service provider</option>
                                                            <option value='3'>Press inquiry</option>
                                                            <option value='4'>Something </option>
                                                        </Input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><ButtonInput type='reset' value='Reset' onClick={this.resethandleButtonClick} /></td>
                                                    <td><ButtonInput type='submit' value='Submit' onClick={this.submithandleButtonClick} /></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    
                                </td>
                            </tr>
                        </tbody>

                    </Table>
                </div>
            );
        }
    });

    return Contact;

});