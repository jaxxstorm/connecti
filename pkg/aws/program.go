package aws

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

	// FIXME:
	err = w.InstallPlugin(ctx, "aws", "v5.19.0")
	if err != nil {
		return s, fmt.Errorf("error installing AWS resource plugin: %v", err)
	}

	err = w.InstallPluginFromServer(ctx, "tailscale-bastion", "v0.0.11", "github://api.github.com/lbrlabs")
	if err != nil {
		return s, fmt.Errorf("error installing tailscale plugin: %v", err)
	}

	s.SetConfig(ctx, "connecti:type", auto.ConfigValue{Value: "aws"})
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: args.Region})
	s.SetConfig(ctx, "tailscale:tailnet", auto.ConfigValue{Value: args.Tailnet})
	s.SetConfig(ctx, "tailscale:apiKey", auto.ConfigValue{Value: args.ApiKey, Secret: true})

	return s, nil

}
