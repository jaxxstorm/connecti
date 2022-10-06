package version

import (
	"fmt"

	"github.com/jaxxstorm/connectme/pkg/version"
	"github.com/spf13/cobra"
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "version",
		Short: "Get the current version",
		Long:  `Get the current version of connectme`,
		RunE: func(cmd *cobra.Command, args []string) error {

			var v string
			v = version.Version
			if v == "" {
				v = "snapshot"
			}
			fmt.Println(v)
			return nil
		},
	}
	return command
}
