package aws

import (
	"fmt"
	"net"
	"os"

	"github.com/jaxxstorm/connectme/pkg/aws"
	randomname "github.com/jaxxstorm/connectme/pkg/name"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"golang.org/x/net/context"
)

var (
	vpcId       string
	region      string
	subnetIds   []string
	subnetRoute string
	name        string
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "aws",
		Short: "Connect to AWS infrastructure",
		Long:  `Create a tailscale bastion in an AWS VPC via an autoscaling group`,
		RunE: func(cmd *cobra.Command, args []string) error {

			// Grab all the configuration variables
			vpcId = viper.GetString("vpcId")
			region = viper.GetString("region")
			subnetIds = viper.GetStringSlice("subnetIds")
			subnetRoute = viper.GetString("route")

			name = viper.GetString("name")

			// validate the IP
			_, _, err := net.ParseCIDR(subnetRoute)
			if err != nil {
				return fmt.Errorf("invalid cidr: %v", err)
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
			})
			if err != nil {
				return err
			}

			stdoutStreamer := optup.ProgressStreams(os.Stdout)
			program.Up(ctx, stdoutStreamer)
			return nil

		},
	}

	command.Flags().StringVar(&vpcId, "vpc-id", "", "The AWS Vpc Id to use")
	command.Flags().StringVar(&region, "region", "", "The AWS Region to use")
	command.Flags().StringVar(&name, "name", "", "Unique name to use for your bastion")
	command.Flags().StringVar(&subnetRoute, "route", "", "The subnet route to connect to")
	command.Flags().StringSliceVar(&subnetIds, "subnet-ids", nil, "The subnet Ids to use in the Vpc")

	viper.BindPFlag("vpcId", command.Flags().Lookup("vpc-id"))
	viper.BindPFlag("route", command.Flags().Lookup("route"))
	viper.BindPFlag("region", command.Flags().Lookup("region"))
	viper.BindPFlag("subnetIds", command.Flags().Lookup("subnet-ids"))
	viper.BindPFlag("name", command.Flags().Lookup("name"))

	command.MarkFlagRequired("vpc-id")
	command.MarkFlagRequired("subnet-ids")
	command.MarkFlagRequired("route")
	command.MarkFlagRequired("region")

	return command
}
