package main

import (
	"fmt"
	"os"

	"github.com/jaxxstorm/connecti/cmd/cli"
	"github.com/jaxxstorm/connecti/pkg/contract"

	"github.com/spf13/cobra"
)

var (
	debug   bool
	cfgFile string
)

func init() {
	cobra.OnInitialize(cli.InitConfig)
}

func main() {
	rootCommand := cli.ConfigureCLI()

	if err := rootCommand.Execute(); err != nil {
		contract.IgnoreIoError(fmt.Fprintf(os.Stderr, "%s", err))
		os.Exit(1)
	}
}
