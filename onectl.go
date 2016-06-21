package main

import (
	"fmt"

	"github.com/docker/engine-api/client"
	"github.com/docker/engine-api/types"
	"github.com/docker/engine-api/types/container"
	"github.com/docker/engine-api/types/network"
	//"github.com/maliceio/malice/config"
	"golang.org/x/net/context"
	//log "github.com/Sirupsen/logrus"
)

func main() {
	defaultHeaders := map[string]string{"User-Agent": "engine-api-cli-1.0"}
	cli, err := client.NewClient("unix:///var/run/docker.sock", "v1.20", nil, defaultHeaders)
	if err != nil {
		panic(err)
	}

	options := types.ContainerListOptions{All: true}
	containers, err := cli.ContainerList(context.Background(), options)
	if err != nil {
		panic(err)
	}

	for _, c := range containers {
		fmt.Println(c.ID)
	}

	// create a container

	image := "mymongodb"

	createContConf := &container.Config{
		Image: image,
		//Cmd:   cmd,
		//Env:   env,
	}
	hostConfig := &container.HostConfig{
		//Binds:        binds,
		//PortBindings: portBindings,
		Privileged: false,
	}
	networkingConfig := &network.NetworkingConfig{}

	name := "mongo_002"

	contResponse, err := cli.ContainerCreate(context.Background(), createContConf, hostConfig, networkingConfig, name)
	if err != nil {
		//log.WithFields(log.Fields{"env": config.Conf.Environment.Run}).Errorf("CreateContainer error = %s\n", err)
		fmt.Println(err)
	}

	//fmt.Println(contResponse.ID)
	opt := types.ContainerStartOptions{CheckpointID: ""}
	err = cli.ContainerStart(context.Background(), contResponse.ID, opt)
	if err != nil {
		fmt.Println(err)
	}

}
