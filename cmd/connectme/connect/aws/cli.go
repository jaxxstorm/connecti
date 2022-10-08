package aws

import (
	"context"
	"fmt"
	"net"

	"github.com/jaxxstorm/connectme/pkg/aws"
	randomname "github.com/jaxxstorm/connectme/pkg/name"
	tui "github.com/jaxxstorm/connectme/pkg/terminal"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	vpcId       string
	region      string
	subnetIds   []string
	subnetRoute string
	name        string
	tailnet     string
	apiKey      string
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "aws",
		Short: "Connect to AWS infrastructure",
		Long:  `Create a tailscale bastion in an AWS VPC via an autoscaling group`,
		RunE: tui.WrapCobraCommand(func(cmd *cobra.Command, args []string, view tui.View) error {
			// Grab all the configuration variables
			vpcId = viper.GetString("vpcId")
			region = viper.GetString("region")
			subnetIds = viper.GetStringSlice("subnetIds")
			subnetRoute = viper.GetString("route")
			tailnet = viper.GetString("tailnet")
			apiKey = viper.GetString("apiKey")
			name = viper.GetString("name")

			// apparently you can't specify if a flag is required
			// and set in configuration, so manual validation is the only way
			// see: https://github.com/spf13/viper/issues/397
			if tailnet == "" {
				return fmt.Errorf("must specify a tailnet. See --help")
			}

			if apiKey == "" {
				return fmt.Errorf("must specify a tailscale api key. See --help")
			}

			if region == "" {
				return fmt.Errorf("must specify an AWS region. See --help")
			}

			// validate the IP
			_, _, err := net.ParseCIDR(subnetRoute)
			if err != nil {
				return fmt.Errorf("invalid cidr: %v", err)
			}

			if err := aws.ValidateCredentials(); err != nil {
				return fmt.Errorf("error validating AWS credentials: %v", err)
			}

			if name == "" {
				name = randomname.Generate()
			}

			ctx := context.Background()
			program, err := aws.Program(name, ctx, aws.BastionArgs{
				Name:      name,
				VpcId:     vpcId,
				SubnetIds: subnetIds,
				Region:    region,
				Route:     subnetRoute,
				Tailnet:   tailnet,
				ApiKey:    apiKey,
			})
			if err != nil {
				return err
			}

			view.SetPulumiProgramCancelFn(func() error {
				return program.Cancel(ctx)
			})

			outputHandler := view.NewPulumiOutputHandler("update")
			stdoutStreamer := optup.ProgressStreams(outputHandler)
			_, err = program.Up(ctx, stdoutStreamer)
			if err != nil {
				return fmt.Errorf("failed update: %v", err)
			}

			return nil

		}),
	}

	command.Flags().StringVar(&vpcId, "vpc-id", "", "The AWS Vpc Id to use.")
	command.Flags().StringVar(&region, "region", "", "The AWS Region to use.")
	command.Flags().StringVar(&name, "name", "", "Unique name to use for your bastion.")
	command.Flags().StringVar(&subnetRoute, "route", "", "The subnet route to connect to. It should match your VPC Cidr.")
	command.Flags().StringVar(&tailnet, "tailnet", "", "The name of the tailnet to connect to. See: https://login.tailscale.com/admin/settings/general")
	command.Flags().StringVar(&apiKey, "api-key", "", "The tailnet api key to use. See: https://login.tailscale.com/admin/settings/keys")
	command.Flags().StringSliceVar(&subnetIds, "subnet-ids", nil, "The subnet Ids to use in the Vpc.")

	viper.BindPFlag("vpcId", command.Flags().Lookup("vpc-id"))
	viper.BindPFlag("route", command.Flags().Lookup("route"))
	viper.BindPFlag("region", command.Flags().Lookup("region"))
	viper.BindPFlag("subnetIds", command.Flags().Lookup("subnet-ids"))
	viper.BindPFlag("name", command.Flags().Lookup("name"))
	viper.BindPFlag("tailnet", command.Flags().Lookup("tailnet"))
	viper.BindPFlag("apiKey", command.Flags().Lookup("api-key"))

	// Bind the env vars to the provider env vars
	viper.BindEnv("region", "AWS_REGION")
	viper.BindEnv("tailnet", "TAILSCALE_TAILNET")
	viper.BindEnv("apiKey", "TAILSCALE_API_KEY")

	command.MarkFlagRequired("vpc-id")
	command.MarkFlagRequired("subnet-ids")
	command.MarkFlagRequired("route")

	return command
}
