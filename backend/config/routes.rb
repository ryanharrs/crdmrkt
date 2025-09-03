Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post 'auth/signup', to: 'auth#signup'
      post 'auth/login', to: 'auth#login'
      get 'auth/me', to: 'auth#me'
      
      # Card routes
      resources :cards do
        member do
          post :toggle_sale
        end
        collection do
          get :my_cards
          get :marketplace
          get :search
          post :upload_image
        end
      end
      
      # Payment routes
      namespace :payments do
        post :create_intent
        post :webhook
        post :confirm_payment
        post :create_connect_account
        delete :reset_connect_account
        get :connect_status
      end
      
      # Ryan's favorite number routes
      get 'ryan/favorite_number', to: 'ryan#favorite_number'
      post 'ryan/favorite_number', to: 'ryan#update_favorite_number'
      
      # Health check
      get 'health', to: 'health#check'
    end
  end
end
