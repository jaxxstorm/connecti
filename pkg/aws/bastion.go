package aws

import (
	"fmt"

	awstailscale "github.com/lbrlabs/pulumi-aws-tailscalebastion/sdk/go/bastion"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func Bastion(args BastionArgs) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {

		// create an array of subnets to pass to the bastion
		var subnets pulumi.StringArray
		for _, subnet := range args.SubnetIds {
			subnets = append(subnets, pulumi.String(subnet))
		}

		_, err := awstailscale.NewBastion(ctx, args.Name, &awstailscale.BastionArgs{
			VpcId: pulumi.String(args.VpcId),
			SubnetIds: subnets,
			Route: pulumi.String(args.Route),
			Region: pulumi.String(args.Region),
		})

		if err != nil {
			return fmt.Errorf("error creating bastion: %v", err)
		}
		return nil
	}
}