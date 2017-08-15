Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/hackillinois/api", create: "true", type: "rsync",
    rsync__exclude: [".git", "node_modules"]

  config.vm.provider :virtualbox do |vb|
    vb.name = "hackillinois-api"
  end

  config.vm.provision "shell", privileged: true, inline: <<-DEPENDENCIES
    onerror(){ echo "Command failed. Stopping execution..."; exit 1; }
    trap onerror ERR
    cd /tmp

    echo "Updating package lists (this may take a while)"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update

    echo "Installing system packages (this may take a while)"
    apt-get -y -q install python2.7 make g++ mysql-server-5.7 redis-server

    echo "Installing Node.js"
    curl -sL https://deb.nodesource.com/setup_6.x | bash - \
      && apt-get -y -q install nodejs \
      && npm config set python python2.7 \
      && npm install -g node-gyp nodemon
    
    echo "Installing Flyway"
    wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3-linux-x64.tar.gz -nv &>/dev/null \
    	&& tar -xzf flyway-commandline-4.0.3-linux-x64.tar.gz \
    	&& mv flyway-4.0.3 /opt/flyway-4.0.3 \
    	&& ln -s /opt/flyway-4.0.3/jre/bin/java /usr/local/bin/java \
    	&& ln -s /opt/flyway-4.0.3/flyway /usr/local/bin/flyway \
        && chmod +x /opt/flyway-4.0.3/flyway \
    	&& rm -rf /tmp/flyway-* \

    echo "Configuring MySQL"
    mysql_ssl_rsa_setup --uid=mysql &>/dev/null
    service mysql restart
    mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pass123'; FLUSH PRIVILEGES;"
    mysql -u root -p"pass123" -e "CREATE DATABASE hackillinois"

  DEPENDENCIES

  config.vm.provision "shell", inline: <<-SETUP
    onerror(){ echo "Command failed. Stopping execution..."; exit 1; }
    trap onerror ERR
    cd /hackillinois/api

    echo "Installing API"
    rm -rf /hackillinois/api/node_modules && npm install
    
    cp /hackillinois/api/config/dev.config.template /hackillinois/api/config/dev.config 
    npm run dev-migrations

    echo "Finishing Setup"
    echo "cd /hackillinois/api" >> /home/ubuntu/.bashrc

  SETUP

  config.vm.network "forwarded_port", guest: 8080, host: ENV['VAGRANT_APP_PORT'] || 8080
  config.vm.network "forwarded_port", guest: 3306, host: ENV['VAGRANT_DB_PORT'] || 3306
end
