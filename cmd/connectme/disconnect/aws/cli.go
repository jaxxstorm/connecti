package aws

import (
	"context"
	"fmt"

	"github.com/jaxxstorm/connectme/pkg/aws"
	tui "github.com/jaxxstorm/connectme/pkg/terminal"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/spf13/cobra"
)

var (
	name string
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "aws",
		Short: "Disconnect from AWS infrastructure",
		Long:  `Tear down a tailscale bastion in an AWS VPC via an autoscaling group`,
		RunE: tui.WrapCobraCommand(func(cmd *cobra.Command, args []string, view tui.View) error {
			ctx := context.Background()
			program, err := aws.Program(name, ctx, aws.BastionArgs{
				Name: name,
			})
			if err != nil {
				return err
			}

			view.SetPulumiProgramCancelFn(func() error {
				return program.Cancel(ctx)
			})

			pulumiOutputHandler := view.NewPulumiOutputHandler("destroy")
			stdoutStreamer := optdestroy.ProgressStreams(pulumiOutputHandler)
			_, err = program.Destroy(ctx, stdoutStreamer)
			if err != nil {
				return fmt.Errorf("failed destroy: %v", err)
			}

			err = program.Workspace().RemoveStack(ctx, name)
			if err != nil {
				return fmt.Errorf("failed to remove stack: %v", err)
			}

			return nil
		}),
	}

	command.Flags().StringVar(&name, "name", "", "The name of the bastion to tear down")
	command.MarkFlagRequired("name")

	return command
}
