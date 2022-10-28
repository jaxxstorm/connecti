package azure

import (
	"context"
	"fmt"

	"github.com/pulumi/pulumi/sdk/v3/go/auto"
)

func Program(name string, ctx context.Context, args BastionArgs) (auto.Stack, error) {
	projectName := "connecti"
	stackName := name

	s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, Bastion(args))
	if err != nil {
		return s, err
	}

	w := s.Workspace()

	// FIXME: retrieve latest plugin from GitHub releases
	err = w.InstallPlugin(ctx, "azure", "v5.23.0")
	if err != nil {
		return s, fmt.Errorf("error installing Azure resource plugin: %v", err)
	}

	err = w.InstallPluginFromServer(ctx, "tailscale-bastion", "v0.0.10", "github://api.github.com/lbrlabs")
	if err != nil {
		return s, fmt.Errorf("error installing tailscale plugin: %v", err)
	}

	s.SetConfig(ctx, "connecti:type", auto.ConfigValue{Value: "azure"})
	s.SetConfig(ctx, "azure:location", auto.ConfigValue{Value: args.Location})
	s.SetConfig(ctx, "tailscale:tailnet", auto.ConfigValue{Value: args.Tailnet})
	s.SetConfig(ctx, "tailscale:apiKey", auto.ConfigValue{Value: args.ApiKey, Secret: true})

	return s, nil

}
