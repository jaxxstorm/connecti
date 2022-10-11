package aws

type BastionArgs struct {
	Name      string
	SubnetIds []string
	Region    string
	Tailnet   string
	ApiKey    string
}
