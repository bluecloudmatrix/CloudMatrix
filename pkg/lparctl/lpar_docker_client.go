package lparctl

import (
	"fmt"

	dockerapi "github.com/docker/engine-api/client"
)

// lparDockerClient is a wrapped layer of docker client
// With this layer, we can port the engine api to the
// DockerInterface to avoid changing DockerInterface as much as possible

type lparDockerClient struct {
	client *dockerapi.Client
}

func (d *lparDockerClient) CreateContainer(opts dockertypes.ContainerCreateConfig) (*dockertypes.ContainerCreateResponse, error) {
	createResp, err := d.client.ContainerCreate(getDefaultContext(), opts.Config, opts.HostConfig, opts.NetworkingConfig, opts.Name)
	if err != nil {
		return nil, err
	}
	return &createResp, nil
}
