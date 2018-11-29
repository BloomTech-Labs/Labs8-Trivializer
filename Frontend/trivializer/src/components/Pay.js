import React, {Component} from 'react';
import Checkout from './Checkout';
import "./Components.css";
import "./LandingPage.css";


class Pay extends Component {


  render() {
    return (
        
        
      <div className="pay-main">
       
              <h5 className="card-title">Trivializer Paid Tier $9.99</h5>
              <p className="card-text">
              Paid tier users may create up to 10 games with 10 rounds of 10 questions
              </p>
              <p>
                
              </p>
              <Checkout
            name={'Trivializer'}
            description={'Premium'}
            amount={9.99}
            
          />
            </div>
        
      
    );
  }
}

export default Pay;