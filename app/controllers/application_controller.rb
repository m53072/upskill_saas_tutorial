class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  # Whitelist the following form fields so we can process them if coming from 
  # a devise signup form

  before_action :configure_premitted_parameters, if: :devise_controller?
  protected
    def configure_premitted_parameters
        devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(:stripe_card_token, :email, :password, :password_confirmation) }
    end
end
