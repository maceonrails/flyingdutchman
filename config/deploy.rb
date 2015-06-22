# config/deploy/staging.rb
require 'mina/bundler'
require 'mina/rails'
require 'mina/git'

#                                                                        Config
# ==============================================================================
set :term_mode,       :system
set :rails_env,       'staging'

set :domain,          '104.215.153.222'
# set :port,            37894

set :deploy_to,       "/home/azureuser/Project/frontend"
set :app_path,        "#{deploy_to}/#{current_path}"

set :repository,      'https://github.com/evandavid/flyingdutchman.git'
set :brach,           'master'

set :user,            'azureuser'
# set :shared_paths,    ['public/static', 'tmp']
set :keep_releases,   5

#                                                                    Setup task
# ==============================================================================
task :setup do
  queue! %{
    mkdir -p "#{deploy_to}/shared/tmp/pids"
  }
end

#                                                                   Deploy task
# ==============================================================================
desc "deploys the current version to the server."
task :deploy => :environment do
  deploy do
    invoke 'git:clone'

    to :launch do
      # queue 'source ~/.nvm/nvm.sh'
      # queue 'export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript:/home/dos/.nvm/versions/node/v0.12.2/lib/node_modules'
      # queue '/home/azureuser/.nvm/versions/node/v0.12.4/bin/npm install grunt-cli -g'
      queue '/home/azureuser/.nvm/versions/node/v0.12.4/bin/npm install'
      queue '/home/azureuser/.nvm/versions/node/v0.12.4/bin/bower install'
      queue '/home/azureuser/.nvm/versions/node/v0.12.4/bin/grunt build'
      queue "/home/azureuser/.nvm/versions/node/v0.12.4/bin/http-server #{app_path}/dist -p 9000"
    end
  end
end

