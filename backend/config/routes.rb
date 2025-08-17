Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  
  namespace :api do
    namespace :v1 do
      get 'ryan/favorite_number', to: 'ryan#favorite_number'
      post 'ryan/favorite_number', to: 'ryan#update_favorite_number'
      get 'health', to: 'health#check'
    end
  end
end
