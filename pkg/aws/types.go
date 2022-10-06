package aws

type BastionArgs struct {
	Name      string
	VpcId     string
	SubnetIds []string
	Route     string
	Region    string
}
