# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provision "shell", inline: <<-SHELL

    echo "Provisioning Start"
    apt-get -qq update

    echo "Installing MySql"
    export DEBIAN_FRONTEND=noninteractive
      && wget http://dev.mysql.com/get/mysql-apt-config_0.6.0-1_all.deb -nv \

      && sudo -E apt-get -qq -y install mysql-server \
      && mysql -u root -e "create database hackillinois" \

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
      && apt-get -qq install -y nodejs

    echo "API Setup"
      npm install -g nodemon
      cd /vagrant/
      cp config/dev.config.template config/dev.config
      npm install
      npm run dev-migrations

    echo "cd /vagrant/" >> /home/vagrant/.bashrc
    echo "npm run dev" >> /home/vagrant/.bashrc

  SHELL
end
