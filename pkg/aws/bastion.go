package aws

import (
	"fmt"

	awstailscale "github.com/lbrlabs/pulumi-aws-tailscalebastion/sdk/go/bastion"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/ec2"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func Bastion(args BastionArgs) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {

		// create an array of subnets to pass to the bastion
		var vpcId string
		var route string
		var subnets pulumi.StringArray
		for _, subnetId := range args.SubnetIds {
			subnet, err := ec2.LookupSubnet(ctx, &ec2.LookupSubnetArgs{
				Id: pulumi.StringRef(subnetId),
			})
			if err != nil {
				return fmt.Errorf("looking up subnet: %v", err)
			}

			if vpcId == "" {
				vpcId = subnet.VpcId
			}

			if vpcId != subnet.VpcId {
				return fmt.Errorf("all subnets must be in the same VPC")
			}

			if route == "" {
				route = subnet.CidrBlock
			}

			if route != subnet.CidrBlock {
				return fmt.Errorf("cidr blocks of different subnets must be identical")
			}

			subnets = append(subnets, pulumi.String(subnetId))
		}

		_, err := awstailscale.NewBastion(ctx, args.Name, &awstailscale.BastionArgs{
			VpcId:     pulumi.String(vpcId),
			SubnetIds: subnets,
			Route:     pulumi.String(route),
			Region:    pulumi.String(args.Region),
		})

		if err != nil {
			return fmt.Errorf("error creating bastion: %v", err)
		}

		// ctx.Export("connectMeType", pulumi.String("aws"))

		return nil
	}
}
