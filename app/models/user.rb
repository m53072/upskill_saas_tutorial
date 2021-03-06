class User < ApplicationRecord
  
  extend Devise::Models

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
  belongs_to :plan
  has_one :profile
  # If pro user passes vaildations (email, password, etc), the call Stripe
  # and tell Stripe to set up a subscription
  # upon charging a customer's card
  #Stripe responds back with customer data
  # Store customer.id as customer token and save user.
  attr_accessor :stripe_card_token
  def save_with_subscription
    if valid?
      customer = Stripe::Customer.create(description: email, plan: plan_id, card: stripe_card_token)
      self.stripe_customer_token = customer.id
      save!
    end
  end
end
