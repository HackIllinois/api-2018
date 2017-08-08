Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.provision "shell", inline: <<-SHELL

    echo "Provisioning Start"
    export DEBIAN_FRONTEND=noninteractive
    apt-get -y -qq update && apt-get -qq dist-upgrade
    apt-get -y install python2.7
    apt-get -y install make
    apt-get -y install g++

    echo "Installing MySql"
    sudo -E apt-get -qq -y install mysql-server
    /etc/init.d/mysql stop
    mysqld --skip-grant-tables &
    mysql -u root -e "UPDATE user SET Password=PASSWORD('pass123') WHERE User='root'; FLUSH PRIVILEGES; exit;"
    /etc/init.d/mysql restart
    mysql -u root -p=pass123 -e "create database hackillinois"

    echo "Installing Flyway"
    wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3-linux-x64.tar.gz -nv \
    	&& tar -xzf flyway-commandline-4.0.3-linux-x64.tar.gz \
    	&& mv flyway-4.0.3 /opt/flyway-4.0.3 \
    	&& ln -s /opt/flyway-4.0.3/jre/bin/java /usr/local/bin/java \
    	&& ln -s /opt/flyway-4.0.3/flyway /usr/local/bin/flyway \
    	&& rm -rf /tmp/flyway-* \

    echo "Installing Redis"
    apt-get -qq install redis-server

    echo "Installing nodejs"
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - \
      && apt-get -qq install -y nodejs \
      && npm config set python python2.7 \
      && sudo npm install node-gyp -g -y\
      && npm install -g nodemon

    echo "API Setup"
      cd /vagrant/
      cp config/dev.config.template config/dev.config
      npm install
      npm run dev-migrations

    echo "cd /vagrant/" >> /home/ubuntu/.bashrc

  SHELL

  # Access guest api with postman, and guest db with workbench
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 3306, host: 3306
end
