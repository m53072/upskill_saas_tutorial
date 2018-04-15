/* global $ , Stripe*/
//Document ready
$(document).on('turbolinks:load', function() {
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
 //Set Stripe public key
 Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content') );
    
  //When user clicks for submit btn
  submitBtn.click(function(event) {
  //Prevent default submission behavior 
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
  //collect credit card fields
  var ccNum = $('#card_number').val(), 
    cvcNum = $('#card_code').val(),
    expMonth = $('#card_month').val(),
    expYear = $('#card_year').val();
  
  //Use Stripe JS Library to check for card errors
  var error = false;
  
  //Validate card number 
  if(!Stripe.card.validateCardNumber(ccNum)) {
    error = true;
    alert('The credit card number appears to be invalid');
  }
  
   //Validate cvc number 
  if(!Stripe.card.validateCVC(cvcNum)) {
    error = true;
    alert('The cvc number appears to be invalid');
  }
  
   //Validate exipration date 
  if(!Stripe.card.validateExpiry(expMonth, expYear)) {
    error = true;
    alert('The expiration date appears to be invalid');
  }
  
    
  
  if (error) {
    //If card errors, dont send to Stripe
    submitBtn.prop('diabled', false).val("Sign Up");
  } else {
    //Send card info to Stripe
    Stripe.createToken({
      number: ccNum, 
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
    
    
    
  }
  
  return false;    

  

    
  });
  
  //Stripe will return a card token
  function stripeResponseHandler(status, response) {
    //Get token from response  
    var token = response.id
  
    //Inject the card token in a hidden field
    theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
  
    //Submit form to our Rails app
    theForm.get(0).submit();
  }
});
