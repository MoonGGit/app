#!/bin/bash

if [ $MYSQL_ROOT_PASSWORD ] && [ $MYSQL_MYAPP_PASSWORD ]
then
  _cnf='tmp.root.cnf'
  _user_myapp='myapp'
  _user_myapp_database='myapp'
  echo "[client]
    user=root
    password=$MYSQL_ROOT_PASSWORD" > $_cnf

  mysql_is_ready() {
    mysqladmin --defaults-extra-file=$_cnf ping > dev/null 2>&1
  }

  while !(mysql_is_ready)
  do
    sleep 5
    echo "Waiting for mysql ..."
  done

  sleep 60
  result=$(mysql --defaults-extra-file=$_cnf -D mysql -e "select user from user;")

  if ! [[ $result == *"$_user_myapp"* ]]; then
    mysql --defaults-extra-file=$_cnf -e "
    create user $_user_myapp@'%' identified by \"$MYSQL_MYAPP_PASSWORD\";
    grant all privileges on $_user_myapp_database.* to $_user_myapp@'%';
    flush privileges;
    create database $_user_myapp_database default character set utf8 collate utf8_general_ci;"
    echo "Create user : $_user_myapp"
  else
    echo "Already exists user : $_user_myapp"
  fi
  
  rm $_cnf

  echo "Complete Init : mysql"
fi

# echo -n 'enter str:'
# echo
# read a
# echo "a is : $a"

# echo 'good test' | sh test.sh