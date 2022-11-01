package kubernetes

type BastionArgs struct {
	Name            string
	Tailnet         string
	ApiKey          string
	Routes          []string
	CreateNamespace bool
}
