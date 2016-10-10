define([
    "react","jquery","bootstrap",
],
function(React,JQuery,BootStrap){
    var ListGroup=BootStrap.ListGroup;
    var ListGroupItem=BootStrap.ListGroupItem;
    var Carousel=BootStrap.Carousel;
    var CarouselItem=BootStrap.CarouselItem;
    var Table=BootStrap.Table;

    var Services = React.createClass({
        render: function() {
            
            return(
                <div className='content_service'>
                    <Carousel>
                        <CarouselItem>
                          <img width={900} height={500} alt='900x500' src='style/images/favorable_content.jpg'/>
                          <div className='carousel-caption'>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <img width={900} height={500} alt='900x500' src='style/images/favorable_content.jpg'/>
                          <div className='carousel-caption'>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <img width={900} height={500} alt='900x500' src='style/images/favorable_content.jpg'/>
                          <div className='carousel-caption'>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                          </div>
                        </CarouselItem>
                    </Carousel>
                   


                    <div >
                    <Table>
                      <tr>
                      </tr>
                      <tr>
                        <td className='image-left' rowSpan='2' ><img  alt='900x500' src='style/images/observance.png'/></td>
                        <td className='data-right' rowSpan='2' >
                          <ListGroup>
                            <ListGroupItem header='Observance'>
                              Success in social media requires more listening and less talking.
                              “Observe” your target audience online and join the discussion to 
                              learn what’s valuable to them.
                            </ListGroupItem>
                          </ListGroup>
                        </td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                        
                        <td className='data-left' rowSpan='2' >
                          <ListGroup>
                            <ListGroupItem header='Appearance'>
                              “Appearance” overtakes quality. It’s better to have 1000 connections who read, 
                              share and talk about your content with their connections than 10,000 connections
                               who disappear after connecting with you the first time. 
                            </ListGroupItem>
                          </ListGroup>
                        </td>
                        <td className='image-right' rowSpan='2' ><img  alt='900x500' src='style/images/appearance.png'/></td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                        <td className='image-left' rowSpan='2' ><img  alt='900x500' src='style/images/perseverance.gif'/></td>
                        <td className='data-right' rowSpan='2' >
                          <ListGroup>
                            <ListGroupItem header='Perseverance'>
                                Social media marketing doesn’t happens overnight,it requires “Perseverance” as it’s
                                far more likely that we need to commit long period of time to achieve results.
                            </ListGroupItem>
                          </ListGroup>
                        </td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                        
                        <td className='data-left' rowSpan='2' >
                          <ListGroup>
                            <ListGroupItem header='Confluence'>
                              A highly focused social media intended to build a strong brand has a better chance
                              for success and to “confluence” the community. 
                            </ListGroupItem>
                          </ListGroup>
                        </td>
                        <td className='image-right' rowSpan='2' ><img  alt='900x500' src='style/images/confluence.png'/></td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                        <td className='image-left' rowSpan='2' ><img  alt='900x500' src='style/images/influence.png'/></td>
                        <td className='data-right' rowSpan='2' >
                          <ListGroup>
                            <ListGroupItem header='Influence'>
                              Publish amazing quality contents to build your online audiences of quality connections
                              & Influence them to share it with their own audience
                            </ListGroupItem>
                          </ListGroup>
                        </td>
                      </tr>
                    </Table>
                    
                  </div>
                   <div className='div-separator-container'>
                      <div className='div-separator'>
                      </div>

                      <Table>
                          <tr>
                          </tr>
                          <tr>
                             <td className='data-favorable' rowSpan='2' >
                                  <p className='p-favorable'>We employ Favorable AIDA model to meet your needs </p>                                   
                                  <ul>
                                      <li><strong>Attention</strong>- Attracts the attention of the customer. </li>
                                      <li><strong>Interest</strong>- Develop Interest of the customer. </li>
                                      <li><strong>Desire</strong>- Convince Customer that they want and desire the product and services & that it will satisfy their need.</li>
                                      <li><strong>Action</strong>- Leads customer towards taking action.</li>
                                      
                                  </ul>
                              </td>
                          </tr>
                          <tr>
                          </tr>
                      </Table>
                  </div>


                </div>
            );
        }
    });

    return Services;

});