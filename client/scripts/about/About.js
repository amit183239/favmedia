define([
    "react","jquery","bootstrap",
],
function(React,JQuery,BootStrap){
    var ListGroup=BootStrap.ListGroup;
    var ListGroupItem=BootStrap.ListGroupItem;
    var Carousel=BootStrap.Carousel;
    var CarouselItem=BootStrap.CarouselItem;
    var Table=BootStrap.Table;

    var About = React.createClass({
      

        render: function() {
            
            return(
                <div className='content-about'>
                    <div>
                       <Carousel>
                            <CarouselItem>
                              <img width={900} height={500} alt='900x500' src='style/images/favorable_content.jpg'/>
                              <div className='carousel-caption'>
                                <h3>First slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                              </div>
                            </CarouselItem>
                        </Carousel>
                    </div>
                            

                    <div >
                        <Table>
                            <tr>
                            </tr>
                            <tr>
                                <td className='data'>
                                    <p>Now a day’s most of the business uses social media but only few are able to take advantage of it.</p>
                                    <p>And this means you’re losing a lot of “favorable” circumstances to intensify your business.</p>
                                    <p>If done correctly, Social media can be <strong>Favorable</strong> for your success.</p>
                                    <p><strong>Favorable Media</strong> strategies which platform to use and hunt ways for maximum impact and exposure</p>
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </Table>

                        <div className='div-separator-container'>
                            <div className='div-separator'>
                            </div>
                       

                            <div>
                                <Table>
                                    <tr>
                                    </tr>
                                    <tr>
                                        <td className='image-left' rowSpan='2' ><img width={500} height={300} src='style/images/aboutus.jpg'/></td>
                                        <td className='data-right' rowSpan='2' >
                                            <ListGroup>
                                                <ListGroupItem header='Favorable Media...'>
                                                    is the Marketing partner that has Observance, Appearance, Perseverance,
                                                    Confluence and that can Influence the right Audience. Our Favorable^5 
                                                    Service uses social data to endorse & unfold online branded content
                                                    that generates business for Favorable Customers.

                                                </ListGroupItem>
                                            </ListGroup>
                                        </td>
                                    </tr>
                                    <tr>
                                    </tr>
                                </Table>
                            </div>
                        </div>
                    </div>


                </div>
            );
        }
    });

    return About;

});