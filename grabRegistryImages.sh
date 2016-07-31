#!/bin/bash

echo "grab User's images from registry"


if [ $# -eq 0 ]; then
	echo "****************** grabRegistryImages.sh Usage *****************"
	echo "******** -u username --> grab username's images ****************"
	echo "****************************************************************"
fi

cd ./JSON

while [ $# -gt 0 ]
do
	case $1 in
		-u|-U)
			shift
			echo "username: $1"
			username=$1
			rm ${username}.json
			curl https://docker:123456@weare.pub/v2/_catalog > ${username}.json
			shift
		;;
	esac
done


