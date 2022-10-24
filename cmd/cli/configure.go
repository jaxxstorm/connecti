package cli

import (
	"fmt"

	"github.com/jaxxstorm/connecti/cmd/cli/connect"
	"github.com/jaxxstorm/connecti/cmd/cli/disconnect"
	"github.com/jaxxstorm/connecti/cmd/cli/list"
	"github.com/jaxxstorm/connecti/cmd/cli/version"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	debug   bool
	cfgFile string
)

func InitConfig() {
	if cfgFile != "" { // enable ability to specify config file via flag
		viper.SetConfigFile(cfgFile)
	} else {
		viper.SetConfigName(".connecti") // name of config file (without extension)
		viper.AddConfigPath("$HOME")     // adding home directory as first search path
		viper.AddConfigPath(".")
		viper.AutomaticEnv() // read in environment variables that match
	}

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err != nil {
		fmt.Println("Error reading config file: ", err)
	}
	if debug {
		fmt.Println("debug set")
	}
}

func ConfigureCLI() *cobra.Command {
	rootCommand := &cobra.Command{
		Use:  "connecti",
		Long: "Quickly connect to cloud infrastructure via Tailscale",
	}

	rootCommand.AddCommand(connect.Command())
	rootCommand.AddCommand(disconnect.Command())
	rootCommand.AddCommand(version.Command())
	rootCommand.AddCommand(list.Command())

	rootCommand.PersistentFlags().BoolVarP(&debug, "debug", "D", false, "enable debug logging")
	rootCommand.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.connecti.yaml)")
	viper.BindPFlag("debug", rootCommand.PersistentFlags().Lookup("debug"))

	return rootCommand
}
