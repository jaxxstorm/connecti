package aws

import (
	"context"
	"fmt"

	"github.com/pulumi/pulumi/sdk/v3/go/auto"
)

func Program(name string, ctx context.Context, args BastionArgs) (auto.Stack, error) {
	projectName := "connectme"
	stackName := name

	s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, Bastion(args))
	if err != nil {
		return s, err
	}

	w := s.Workspace()

	err = w.InstallPlugin(ctx, "aws", "v5.16.0")
	if err != nil {
		return s, fmt.Errorf("error installing AWS resource plugin: %v", err)
	}
	// FIXME: we also need to install the bastion plugin binary here
	// See: https://github.com/pulumi/pulumi/issues/9782

	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: args.Region})

	return s, nil

}
