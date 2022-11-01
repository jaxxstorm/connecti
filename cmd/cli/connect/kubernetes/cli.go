package kubernetes

import (
	"context"
	"fmt"

	"github.com/jaxxstorm/connecti/pkg/kubernetes"
	randomname "github.com/jaxxstorm/connecti/pkg/name"
	tui "github.com/jaxxstorm/connecti/pkg/terminal"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	name    string
	tailnet string
	apiKey  string
	routes  []string
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "kubernetes",
		Short: "Connect to Kubernetes infrastructure.",
		Long:  `Create a tailscale bastion in a Kubernetes cluster via a deployment.`,
		RunE: tui.WrapCobraCommand(func(cmd *cobra.Command, args []string, view tui.View) error {
			// Grab all the configuration variables
			tailnet = viper.GetString("tailnet")
			apiKey = viper.GetString("apiKey")
			name = viper.GetString("name")
			routes = viper.GetStringSlice("routes")

			view.Ready()

			// apparently you can't specify if a flag is required
			// and set in configuration, so manual validation is the only way
			// see: https://github.com/spf13/viper/issues/397
			if tailnet == "" {
				return fmt.Errorf("must specify a tailnet. See --help")
			}

			if apiKey == "" {
				return fmt.Errorf("must specify a tailscale api key. See --help")
			}

			if name == "" {
				name = randomname.Generate()
			}

			if len(routes) == 0 {
				return fmt.Errorf("must specify at least one route. See --help")
			}

			ctx := context.Background()
			program, err := kubernetes.Program(name, ctx, kubernetes.BastionArgs{
				Name:            name,
				Routes:          routes,
				Tailnet:         tailnet,
				ApiKey:          apiKey,
				CreateNamespace: true, // FIXME: should we allow usage of an existing namespace?
			})
			if err != nil {
				return err
			}

			view.SetPulumiProgramCancelFn(func() error {
				return program.Cancel(ctx)
			})

			outputHandler := view.NewPulumiOutputHandler("update")
			stdoutStreamer := optup.ProgressStreams(outputHandler)
			_, err = program.Refresh(ctx)
			if err != nil {
				return fmt.Errorf("error refreshing stack: %v", err)
			}
			_, err = program.Up(ctx, stdoutStreamer)
			if err != nil {
				view.SendPulumiProgressOutput(outputHandler.CurrentProgress, "Failed to create resources. Cleaning up.", "")
				// If the update errors, we should clean up the stack for the user.
				_, dErr := program.Destroy(ctx)
				if dErr != nil {
					return fmt.Errorf("failed update: %v\n\n\tfailed clean up: %v", err, dErr)
				}
				rmErr := program.Workspace().RemoveStack(ctx, name)
				if rmErr != nil {
					return fmt.Errorf("failed update: %v\n\n\tfailed stack removal: %v", err, rmErr)
				}

				return fmt.Errorf("failed update: %v", err)
			}

			return nil

		}),
	}

	command.Flags().StringVar(&name, "name", "", "Unique name to use for your bastion.")
	command.Flags().StringVar(&tailnet, "tailnet", "", "The name of the tailnet to connect to. See: https://login.tailscale.com/admin/settings/general")
	command.Flags().StringVar(&apiKey, "api-key", "", "The tailnet api key to use. See: https://login.tailscale.com/admin/settings/keys")
	command.Flags().StringSliceVar(&routes, "routes", nil, "The routes to advertise. This is likely the cluster Pod CIDR and Service CIDR.")

	viper.BindPFlag("name", command.Flags().Lookup("name"))
	viper.BindPFlag("tailnet", command.Flags().Lookup("tailnet"))
	viper.BindPFlag("apiKey", command.Flags().Lookup("api-key"))
	viper.BindPFlag("routes", command.Flags().Lookup("routes"))

	// Bind the env vars to the provider env vars
	viper.BindEnv("tailnet", "TAILSCALE_TAILNET")
	viper.BindEnv("apiKey", "TAILSCALE_API_KEY")

	command.MarkFlagRequired("routes")

	return command
}
