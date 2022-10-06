package aws

import (
	"context"
	"github.com/jaxxstorm/connectme/pkg/aws"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/spf13/cobra"
	"os"
)

var (
	name string
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "aws",
		Short: "Disconnect from AWS infrastructure",
		Long:  `Tear down a tailscale bastion in an AWS VPC via an autoscaling group`,
		RunE: func(cmd *cobra.Command, args []string) error {

			ctx := context.Background()
			program, err := aws.Program(name, ctx, aws.BastionArgs{
				Name: name,
			})

			if err != nil {
				return err
			}

			stdoutStreamer := optdestroy.ProgressStreams(os.Stdout)
			program.Destroy(ctx, stdoutStreamer)
			program.Workspace().RemoveStack(ctx, name)
			return nil
		},
	}

	command.Flags().StringVar(&name, "name", "", "The name of the bastion to tear down")
	command.MarkFlagRequired("name")

	return command
}
