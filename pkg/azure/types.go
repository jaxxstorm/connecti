package azure

type BastionArgs struct {
	Name               string
	SubnetName         string
	Location           string
	ResourceGroupName  string
	VirtualNetworkName string
	Tailnet            string
	ApiKey             string
	Routes             []string
}
