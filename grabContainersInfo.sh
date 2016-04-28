#!/bin/bash

echo "info from docker ps"
echo "generate containers.json"

docker ps > linuxshell.cfg

containersfile=linuxshell.cfg
number_of_containers=$(cat $containersfile | grep -v "^\s*#" | sed -e 's/  \+/|/g' | wc -l)
echo $number_of_containers
item=""

containersjson=containers.json
key0=""
key1=""
key2=""
key3=""
key4=""
key5=""
key6=""


readitem()
{
	linenumber=$1
	field=$2
	item=$(cat $containersfile | grep -v "^\s*#"  | tr '\t' ' ' | sed -e 's/  \+/|/g' | cut -d'|' -f$field | head -n$linenumber | tail -n1)
}

generateitem()
{
	jsonitem="{\"$key0\":\"$1\", \"$key1\":\"$2\", \"$key2\":\"$3\", \"$key3\":\"$4\", \"$key4\":\"$5\", \"$key5\":\"$6\", \"$key6\":\"$7\"}"
	
	echo $jsonitem
	if [$8 -lt $number_of_containers]
	then
		jsonitem=$jsonitem","
	fi
	echo $jsonitem > $containersjson
}

container=0
while [[ $container -lt $number_of_containers ]]
do
	container=$(($container+1))
	echo "container="$container
	readitem $container 1; container_id=$item
	readitem $container 2; container_image=$item
	readitem $container 3; container_cmd=$item
	readitem $container 4; createdate=$item
	readitem $container 5; container_stat=$item
	readitem $container 6; container_port=$item
	readitem $container 7; container_name=$item
	
	if [$container -eq 1]
	then
		key0=$container_id
		key1=$container_image
		key2=$container_cmd
		key3=$cteatedate
		key4=$container_stat
		key5=$container_port
		key6=$container_name
		echo "[" > $containersjson		
	fi

	echo $container_id
	echo $container_image
	echo $container_cmd
	echo $createdate
	echo $container_stat
	echo $container_port
	echo $container_name

	generateitem $container_id $container_image $container_cmd $createdate $container_stat $container_port $container_name $container
	
	if [$container -eq $number_of_containers]
	then
		echo "]" > $containerjson
	fi

done
