package azure

import (
	"fmt"

	azure "github.com/lbrlabs/pulumi-tailscale-bastion/sdk/go/bastion/azure"
	"github.com/pulumi/pulumi-azure/sdk/v5/go/azure/network"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/gobeam/stringy"
)

func Bastion(args BastionArgs) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {


		virtualNetwork, err := network.LookupVirtualNetwork(ctx, &network.LookupVirtualNetworkArgs{
			Name:              args.VirtualNetworkName,
			ResourceGroupName: args.ResourceGroupName,
		})
		if err != nil {
			return fmt.Errorf("error looking up virtual network: %v", err)
		}

		subnet, err := network.LookupSubnet(ctx, &network.LookupSubnetArgs{
			VirtualNetworkName: virtualNetwork.Name,
			ResourceGroupName:  args.ResourceGroupName,
			Name:               args.SubnetName,
		})
		if err != nil {
			return fmt.Errorf("error looking up subnet: %v", err)
		}
	
		// Azure has very strict naming requirements for scale sets
		name := stringy.New(args.Name).CamelCase()

		bastion, err := azure.NewBastion(ctx, name, &azure.BastionArgs{
			Location:          pulumi.String(args.Location),
			Route:             pulumi.String(args.Route), // FIXME: can we get the route from the returned vnet?
			SubnetId:          pulumi.String(subnet.Id),
			ResourceGroupName: pulumi.String(args.ResourceGroupName),
		})

		// FIXME: we need to think about how we'd expose this to user
		ctx.Export("privateKey", bastion.PrivateKey)

		if err != nil {
			return fmt.Errorf("error creating bastion: %v", err)
		}

		ctx.Export("connectiType", pulumi.String("azure"))

		return nil
	}
}
