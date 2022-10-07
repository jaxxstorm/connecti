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
		RunE: func(cmd *cobra.Command, args []string) error {

			progressBar, err := tui.NewProgressBar(tui.ProgressBarArgs{})
			if err != nil {
				return fmt.Errorf("creating progress bar: %v", err)
			}

			pulumiOutputHandler := &tui.PulumiOutput{
				Type:            "destroy",
				CurrentProgress: 0,
				ProgressBar:     progressBar,
			}

			ctx := context.Background()
			program, err := aws.Program(name, ctx, aws.BastionArgs{
				Name: name,
			})

			if err != nil {
				return err
			}

			stdoutStreamer := optdestroy.ProgressStreams(pulumiOutputHandler)
			program.Destroy(ctx, stdoutStreamer)
			program.Workspace().RemoveStack(ctx, name)
			progressBar.Done()

			return nil
		},
	}

	command.Flags().StringVar(&name, "name", "", "The name of the bastion to tear down")
	command.MarkFlagRequired("name")

	return command
}
