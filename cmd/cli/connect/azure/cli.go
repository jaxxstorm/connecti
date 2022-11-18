package azure

import (
	"context"
	"fmt"

	"github.com/jaxxstorm/connecti/pkg/azure"
	randomname "github.com/jaxxstorm/connecti/pkg/name"
	tui "github.com/jaxxstorm/connecti/pkg/terminal"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	location           string
	subnetName         string
	name               string
	tailnet            string
	apiKey             string
	resourceGroupName  string
	virtualNetworkName string
	routes             []string
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "azure",
		Short: "Connect to Azure infrastructure.",
		Long:  `Create a tailscale bastion in an Azure Virtual Network via a scale set.`,
		RunE: tui.WrapCobraCommand(func(cmd *cobra.Command, args []string, view tui.View) error {
			// Grab all the configuration variables
			location = viper.GetString("azure:location")
			subnetName = viper.GetString("subnetName")
			virtualNetworkName = viper.GetString("virtualNetworkName")
			resourceGroupName = viper.GetString("resourceGroupName")
			tailnet = viper.GetString("tailnet")
			apiKey = viper.GetString("apiKey")
			name = viper.GetString("name")

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

			if location == "" {
				return fmt.Errorf("must specify an Azure location. See --help")
			}

			if virtualNetworkName == "" {
				return fmt.Errorf("must specify a virtual network name. See --help")
			}

			if resourceGroupName == "" {
				return fmt.Errorf("you must specify a resource group where your network resides. See --help")
			}

			if name == "" {
				name = randomname.Generate()
			}

			ctx := context.Background()
			program, err := azure.Program(name, ctx, azure.BastionArgs{
				Name:               name,
				SubnetName:         subnetName,
				Location:           location,
				ResourceGroupName:  resourceGroupName,
				VirtualNetworkName: virtualNetworkName,
				Tailnet:            tailnet,
				ApiKey:             apiKey,
				Routes:              routes,
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

	command.Flags().StringVar(&location, "location", "", "The Azure Location to use.")
	command.Flags().StringVar(&name, "name", "", "Unique name to use for your bastion.")
	command.Flags().StringVar(&tailnet, "tailnet", "", "The name of the tailnet to connect to. See: https://login.tailscale.com/admin/settings/general")
	command.Flags().StringVar(&apiKey, "api-key", "", "The tailnet api key to use. See: https://login.tailscale.com/admin/settings/keys")
	command.Flags().StringVar(&subnetName, "subnet-name", "", "The subnet name to use in the virtual network.")
	command.Flags().StringSliceVar(&routes, "routes", nil, "The routes to advertise to tailscale.")
	command.Flags().StringVar(&virtualNetworkName, "virtual-network-name", "", "The virtual network to which your chosen subnet belongs.")
	command.Flags().StringVar(&resourceGroupName, "resource-group-name", "", "The name of the resource group your network belongs to.")

	viper.BindPFlag("azure:location", command.Flags().Lookup("location"))
	viper.BindPFlag("subnetName", command.Flags().Lookup("subnet-name"))
	viper.BindPFlag("name", command.Flags().Lookup("name"))
	viper.BindPFlag("tailnet", command.Flags().Lookup("tailnet"))
	viper.BindPFlag("apiKey", command.Flags().Lookup("api-key"))
	viper.BindPFlag("route", command.Flags().Lookup("route"))
	viper.BindPFlag("virtualNetworkName", command.Flags().Lookup("virtual-network-name"))
	viper.BindPFlag("resourceGroupName", command.Flags().Lookup("resource-group-name"))

	// Bind the env vars to the provider env vars
	viper.BindEnv("azure:location", "ARM_LOCATION")
	viper.BindEnv("tailnet", "TAILSCALE_TAILNET")
	viper.BindEnv("apiKey", "TAILSCALE_API_KEY")

	command.MarkFlagRequired("subnet-name")

	return command
}
